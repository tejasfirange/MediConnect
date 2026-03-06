const DEFAULT_MODEL = process.env.CEREBRAS_MODEL || 'llama-3.3-70b';
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
  const responseLines = (result.responseDetails || [])
    .map((entry, index) => {
      const redFlagText = entry.redFlag ? ' [red flag]' : '';
      return `${index + 1}. Q: ${entry.questionText} | A: ${entry.selectedOptionText} | score: ${entry.score}${redFlagText}`;
    })
    .join('\n');

  return [
    'Create a detailed but patient-friendly triage summary for a patient-facing app.',
    `Language: ${outputLanguage}`,
    `Category: ${category}`,
    `Risk level: ${result.riskLevel}`,
    `Total score: ${result.totalScore}`,
    `Red flag triggered: ${result.redFlagTriggered ? 'yes' : 'no'}`,
    `Answered questions: ${result.answeredCount || 0}`,
    `Base recommendation: ${result.recommendation}`,
    'User responses:',
    responseLines || 'No responses available.',
    'Constraints:',
    '- Target 180 to 260 words.',
    '- Do not provide definitive diagnosis.',
    '- Include one clear next-step action and one caution statement.',
    '- Keep tone calm and clear.',
    '- Include 3 sections in plain text with headings:',
    '  1) Summary',
    '  2) Why This Risk Level',
    '  3) Key Responses',
    '- In Key Responses, mention 5-10 important answers from user responses.',
    '- Return plain text only.',
  ].join('\n');
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
    const completion = await cerebras.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: buildPrompt({ language: normalizedLanguage, result, category }) }],
      max_completion_tokens: 520,
      temperature: 0.2,
      top_p: 1,
      stream: false,
    });

    const text = completion?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return {
        language: normalizedLanguage,
        text: getFallbackSummary(result, normalizedLanguage),
        source: 'fallback',
      };
    }

    return {
      language: normalizedLanguage,
      text,
      source: 'cerebras',
    };
  } catch (_error) {
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
