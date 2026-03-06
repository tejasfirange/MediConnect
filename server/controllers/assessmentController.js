const {
  normalizeLanguage: normalizeEngineLanguage,
  getAvailableCategories,
  getStartQuestion,
  evaluateAssessment,
} = require('../services/triageEngine');
const {
  normalizeLanguage: normalizeSummaryLanguage,
  generateAssessmentSummary,
} = require('../services/summaryService');
const { savePatientReport } = require('../services/reportService');

function getCategories(_req, res) {
  try {
    const requestedLanguage =
      _req.query.language ||
      _req.headers['x-language'] ||
      _req.headers['accept-language'] ||
      'en';
    const language = normalizeEngineLanguage(requestedLanguage);
    const categories = getAvailableCategories(language);
    return res.status(200).json({ categories });
  } catch (error) {
    const status = Number(error.statusCode || 500);
    return res.status(status).json({ message: error.message, code: error.code || 'UNKNOWN_ERROR' });
  }
}

function getInitialQuestion(req, res) {
  try {
    const { category } = req.query;
    if (!category) {
      return res.status(400).json({ message: 'category query param is required' });
    }

    const requestedLanguage =
      req.query.language ||
      req.headers['x-language'] ||
      req.headers['accept-language'] ||
      'en';
    const language = normalizeEngineLanguage(requestedLanguage);

    const data = getStartQuestion(category, language);
    return res.status(200).json(data);
  } catch (error) {
    const status = Number(error.statusCode || 500);
    return res.status(status).json({ message: error.message, code: error.code || 'UNKNOWN_ERROR' });
  }
}

async function submitAssessment(req, res) {
  try {
    const { category, answers, language } = req.body;
    if (!category) {
      return res.status(400).json({ message: 'category is required' });
    }
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: 'answers must be an array' });
    }

    const requestedLanguage =
      language ||
      req.headers['x-language'] ||
      req.headers['accept-language'] ||
      'en';
    const normalizedLanguage = normalizeEngineLanguage(requestedLanguage);

    const result = evaluateAssessment(category, answers, normalizedLanguage);

    const summaryLanguage = normalizeSummaryLanguage(requestedLanguage);
    const summary = await generateAssessmentSummary({
      result,
      category,
      language: summaryLanguage,
    });
    const responsePayload = {
      ...result,
      summary: summary.text,
      summaryLanguage: summary.language,
      summarySource: summary.source,
    };

    if (result.completed && req.user?.email && req.body.persist === true) {
      try {
        const savedReport = await savePatientReport(req.user.email, responsePayload);
        responsePayload.reportId = savedReport.pr_id;
        responsePayload.reportSaved = true;
      } catch (reportError) {
        responsePayload.reportSaved = false;
        responsePayload.reportSaveError = reportError.message;
      }
    }

    return res.status(200).json(responsePayload);
  } catch (error) {
    const status = Number(error.statusCode || 500);
    return res.status(status).json({ message: error.message, code: error.code || 'UNKNOWN_ERROR' });
  }
}

module.exports = {
  getCategories,
  getInitialQuestion,
  submitAssessment,
};
