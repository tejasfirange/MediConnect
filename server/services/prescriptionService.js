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
You are a Medical Decision Support System. 
Generate ONLY a Markdown table and ONE short clinical note.

STRICT FORMATTING:
1. THE TABLE: Columns [Medicine Name, Dosage, Duration]. 
2. THE NOTE: Exactly one paragraph below the table titled "### Physician Note".
3. NO Clinical Advice section, NO observations, NO headers other than the ones specified.
4. NO AI DISCLAIMERS.
`,
    user: `
### Patient Data
**Symptoms Summary:** ${summary}
**Risk:** ${riskLevel}

Generate the Rx table and Advice now.
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
