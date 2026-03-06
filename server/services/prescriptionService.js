const { OpenAI } = require('openai');

const DEFAULT_MODEL = (process.env.CEREBRAS_MODEL || 'llama3.1-70b').trim();
const OPENAI_MODEL = (process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();

let cerebrasClientPromise = null;
let openaiClient = null;

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

function buildPrescriptionPrompt(reportData) {
  const report = reportData.report;
  const riskLevel = report.riskLevel;
  const summary = report.summary;
  
  return {
    system: `
You are a medical assistant helping a doctor generate a draft prescription and recommendation based on a patient's triage assessment.
Your goal is to provide a professional, structured draft that the doctor will review, edit, and approve.

Rules:
- Identify key symptoms from the summary.
- Suggest potential over-the-counter medications or lifestyle changes if appropriate for the risk level.
- For high risk, suggest immediate tests or specialist consultations.
- Keep it concise and professional.
- Use Markdown formatting.
- Do NOT include any AI disclaimers or "Draft" labels in your response text, as the doctor will approve this directly.
`,
    user: `
Patient Assessment Summary:
${summary}

Risk Level: ${riskLevel}

Generate a draft prescription and clinical notes for the doctor.
Include:
1. Observed Symptoms (Brief)
2. Suggested Medications/Actions (Dosage if applicable)
3. Recommended Tests (if any)
4. Advice for Patient
`
  };
}

async function generatePrescription(reportData) {
  const prompt = buildPrescriptionPrompt(reportData);

  // 1. Try Cerebras
  if (process.env.CEREBRAS_API_KEY) {
    try {
      const cerebras = await getCerebrasClient();
      console.log(`[Cerebras] Generating prescription using ${DEFAULT_MODEL}...`);
      const completion = await cerebras.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user }
        ],
        temperature: 0.3,
      });

      const text = completion?.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      console.warn(`[Cerebras] Failed: ${err.message}`);
    }
  }

  // 2. Try OpenAI
  const openai = getOpenAIClient();
  if (openai) {
    try {
      console.log(`[OpenAI] Generating prescription using ${OPENAI_MODEL}...`);
      const completion = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: prompt.system },
          { role: 'user', content: prompt.user }
        ],
        temperature: 0.3,
      });

      const text = completion?.choices?.[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      console.error(`[OpenAI] Failed: ${err.message}`);
    }
  }

  return "Unable to generate draft prescription. Please review assessment details manually.";
}

module.exports = {
  generatePrescription,
};
