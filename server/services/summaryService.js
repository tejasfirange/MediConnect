const { OpenAI } = require('openai');

const DEFAULT_MODEL = (process.env.CEREBRAS_MODEL || 'llama3.1-70b').trim();
const OPENAI_MODEL = (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();
const SUPPORTED_LANGUAGES = new Set(['en', 'mr']);

let cerebrasClientPromise = null;
let openaiClient = null;

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

function getOpenAIClient() {
  if (openaiClient) return openaiClient;
  if (!process.env.OPENAI_API_KEY) return null;

  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return openaiClient;
}

function buildPrompt({ language, result, category }) {
  const outputLanguage = language === 'mr' ? 'Marathi' : 'English';

  const responses = (result.responseDetails || [])
    .map((entry, index) => {
      const redFlag = entry.redFlag ? ' (RED FLAG)' : '';
      return `${index + 1}. Question: ${entry.questionText}\nAnswer: ${entry.selectedOptionText}\nScore: ${entry.score}${redFlag}`;
    })
    .join('\n\n');

  return {
    system: `
You are a medical triage assistant generating patient-facing summaries in Markdown format.
Use headers, bullet points, and bold text for clarity.

Rules:
- DO NOT diagnose diseases.
- DO NOT prescribe medications.
- DO NOT claim certainty.
- Use calm, supportive language.
- Explain risk level logically based on symptoms and scoring.
- Help the user understand what their responses mean.
- ALWAYS use Markdown formatting.
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

Instructions for Markdown:
1. ### Assessment Overview
   Explain what the system detected overall.
2. ### Risk Interpretation
   Explain why it is ${result.riskLevel}. Mention factors like red flags or duration.
3. ### Key Contributing Symptoms
   Use a bulleted list to summarize weights.
4. ### Next Steps
   Clear guidance.
5. ### When to seek immediate care
   Warning signs.

Constraints:
- 220 to 320 words.
- Friendly, professional tone.
`
  };
}

async function generateAssessmentSummary({ result, category, language }) {
  const normalizedLanguage = normalizeLanguage(language);

  if (!result?.completed) {
    return { language: normalizedLanguage, text: null, source: 'none' };
  }

  // 1. Try Cerebras
  if (process.env.CEREBRAS_API_KEY) {
    try {
      const cerebras = await getCerebrasClient();
      const prompt = buildPrompt({ language: normalizedLanguage, result, category });

      console.log(`[Cerebras] Generating summary for ${category} using ${DEFAULT_MODEL}...`);
      const completion = await cerebras.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user }
        ],
        max_completion_tokens: 800,
        temperature: 0.25,
      });

      const text = completion?.choices?.[0]?.message?.content?.trim();
      if (text) {
        console.log(`[Cerebras] Success (${text.length} chars)`);
        return { language: normalizedLanguage, text, source: 'cerebras' };
      }
    } catch (err) {
      console.warn(`[Cerebras] Failed: ${err.message}`);
    }
  }

  // 2. Try OpenAI
  const openai = getOpenAIClient();
  if (openai) {
    try {
      const prompt = buildPrompt({ language: normalizedLanguage, result, category });
      console.log(`[OpenAI] Generating summary using ${OPENAI_MODEL}...`);
      
      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user }
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      const text = completion?.choices?.[0]?.message?.content?.trim();
      if (text) {
        console.log(`[OpenAI] Success (${text.length} chars)`);
        return { language: normalizedLanguage, text, source: 'openai' };
      }
    } catch (err) {
      console.error(`[OpenAI] Failed: ${err.message}`);
    }
  }

  // 3. Fallback
  console.log('[Summary] Using fallback template.');
  return {
    language: normalizedLanguage,
    text: getFallbackSummary(result, normalizedLanguage),
    source: 'fallback',
  };
}

module.exports = {
  normalizeLanguage,
  generateAssessmentSummary,
};
