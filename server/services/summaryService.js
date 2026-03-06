const DEFAULT_MODEL = (process.env.CEREBRAS_MODEL || 'llama-3.3-70b').trim();
const SUPPORTED_LANGUAGES = new Set(['en', 'mr']);

let cerebrasClientPromise = null;

function normalizeLanguage(rawLanguage) {
  const value = String(rawLanguage || 'en').trim().toLowerCase();
  if (value.startsWith('mr')) return 'mr';
  if (value.startsWith('en')) return 'en';
  return 'en';
}

function getFallbackSummary(result, language) {
  const responseLines = (result.responseDetails || [])
    .slice(0, 10)
    .map((entry, index) => `${index + 1}. ${entry.questionText}: ${entry.selectedOptionText}`)
    .join('\n');

  const fallbackMap = {
    en: [
      'Summary:',
      `Based on your responses, the current risk level is ${result.riskLevel}.`,
      `Your total score is ${result.totalScore}, and ${result.answeredCount || 0} questions were answered.`,
      result.redFlagTriggered
        ? 'A red-flag response was detected, which increases urgency and suggests immediate medical review.'
        : 'No red-flag response was detected, so urgency is based on overall symptom pattern and score.',
      `Recommended next step: ${result.recommendation}`,
      '',
      responseLines ? `Key Responses:\n${responseLines}` : 'Key Responses: Not available.',
    ]
      .filter(Boolean)
      .join('\n'),
    mr: [
      'सारांश:',
      `तुमच्या उत्तरांनुसार सध्याची जोखीम पातळी ${result.riskLevel} आहे.`,
      `तुमचे एकूण गुण ${result.totalScore} आहेत आणि ${result.answeredCount || 0} प्रश्नांची उत्तरे दिली गेली आहेत.`,
      result.redFlagTriggered
        ? 'रेड-फ्लॅग उत्तर आढळले आहे, त्यामुळे तातडी वाढते आणि त्वरित वैद्यकीय सल्ला आवश्यक ठरतो.'
        : 'रेड-फ्लॅग उत्तर आढळले नाही, त्यामुळे तातडीचे मूल्यांकन एकूण लक्षणे आणि गुणांवर आधारित आहे.',
      `पुढील शिफारस: ${result.recommendation}`,
      '',
      responseLines ? `महत्त्वाची उत्तरे:\n${responseLines}` : 'महत्त्वाची उत्तरे: उपलब्ध नाहीत.',
    ]
      .filter(Boolean)
      .join('\n'),
  };

  return fallbackMap[language] || fallbackMap.en;
}

async function getCerebrasClient() {
  if (cerebrasClientPromise) return cerebrasClientPromise;

  cerebrasClientPromise = (async () => {
    const mod = await import('@cerebras/cerebras_cloud_sdk');
    const Cerebras = mod.default;

    return new Cerebras({
      apiKey: process.env.CEREBRAS_API_KEY,
    });
  })();

  return cerebrasClientPromise;
}


function buildPrompt({ language, result, category }) {
  const outputLanguage = language === 'mr' ? 'Marathi' : 'English';

  const responses = (result.responseDetails || [])
    .map((entry, index) => {
      const redFlag = entry.redFlag ? ' (RED FLAG)' : '';
      return `${index + 1}. Question: ${entry.questionText}
Answer: ${entry.selectedOptionText}
Score: ${entry.score}${redFlag}`;
    })
    .join('\n\n');

  return {
    system: `
You are a medical triage assistant generating patient-facing summaries.

Your task is to explain a symptom assessment result clearly and responsibly.

Rules:
- DO NOT diagnose diseases.
- DO NOT prescribe medications.
- DO NOT claim certainty.
- Use calm, supportive language.
- Explain risk level logically based on symptoms and scoring.
- Help the user understand what their responses mean.

Your output must be informative, medically responsible, and easy for a non-medical user to understand.
`,

    user: `
Generate a comprehensive triage summary.

Language: ${outputLanguage}

Assessment Category: ${category}

Assessment Result Data:
Risk Level: ${result.riskLevel}
Total Score: ${result.totalScore}
Red Flag Triggered: ${result.redFlagTriggered ? 'Yes' : 'No'}
Questions Answered: ${result.answeredCount || 0}

System Recommendation:
${result.recommendation}

User Responses:
${responses || 'No responses available'}

Instructions:

Write a detailed explanation with the following sections.

1. Assessment Overview
Explain what the system detected overall.

2. Risk Interpretation
Explain why the system classified the case as ${result.riskLevel}.
Mention important contributing factors such as symptom duration, severity, or red flags.

3. Key Symptoms Contributing to Risk
Summarize the most important answers that influenced the assessment.

4. Recommended Next Steps
Explain what the user should do next in simple language.

5. Warning Signs
Explain situations where the user should seek urgent medical care.

Constraints:
- 220 to 320 words
- Friendly tone
- Avoid medical jargon
- Plain text only
`
  };
}


async function generateAssessmentSummary({ result, category, language }) {
  const normalizedLanguage = normalizeLanguage(language);

  if (!result?.completed) {
    return {
      language: normalizedLanguage,
      text: null,
      source: 'none',
    };
  }

  if (!SUPPORTED_LANGUAGES.has(normalizedLanguage)) {
    return {
      language: 'en',
      text: getFallbackSummary(result, 'en'),
      source: 'fallback',
    };
  }

  if (!process.env.CEREBRAS_API_KEY) {
    return {
      language: normalizedLanguage,
      text: getFallbackSummary(result, normalizedLanguage),
      source: 'fallback',
    };
  }

  try {
    const cerebras = await getCerebrasClient();
    const prompt = buildPrompt({ language: normalizedLanguage, result, category });

    console.log(`[Cerebras] Generating summary for category: ${category} (${normalizedLanguage})...`);

    const completion = await cerebras.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: prompt.user }
      ],
      max_completion_tokens: 700,
      temperature: 0.25,
      top_p: 1,
    });

    const text = completion?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      console.warn('[Cerebras] Warning: Empty completion content. Falling back.');
      return {
        language: normalizedLanguage,
        text: getFallbackSummary(result, normalizedLanguage),
        source: 'fallback',
      };
    }

    console.log(`[Cerebras] Summary generated successfully (${text.length} chars).`);
    return {
      language: normalizedLanguage,
      text,
      source: 'cerebras',
    };
  } catch (_error) {
    console.error('[Cerebras] Error generating summary:', _error.name, _error.message);
    if (_error.response) {
      console.error('[Cerebras] API Response:', _error.response.status, _error.response.data);
    }
    return {
      language: normalizedLanguage,
      text: getFallbackSummary(result, normalizedLanguage),
      source: 'fallback',
    };
  }
}

module.exports = {
  normalizeLanguage,
  generateAssessmentSummary,
};
