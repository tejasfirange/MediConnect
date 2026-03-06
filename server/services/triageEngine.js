const fs = require('fs');
const path = require('path');
const { evaluateRisk } = require('../utils/riskEvaluator');

const TRIAGE_DIR = path.join(__dirname, '..', 'triage-data');
const LANGUAGE_FILE_MAP = {
  en: 'allENCategories.json',
  mr: 'allMRCategories.json',
};
const DEFAULT_LANGUAGE = 'en';

class TriageEngineError extends Error {
  constructor(message, code = 'TRIAGE_INPUT_ERROR', statusCode = 400) {
    super(message);
    this.name = 'TriageEngineError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

const cacheByLanguage = new Map();

function inputError(message, statusCode = 400) {
  return new TriageEngineError(message, 'TRIAGE_INPUT_ERROR', statusCode);
}

function configError(message) {
  return new TriageEngineError(message, 'TRIAGE_CONFIG_ERROR', 500);
}

function normalizeLanguage(rawLanguage) {
  const value = String(rawLanguage || DEFAULT_LANGUAGE).trim().toLowerCase();
  if (value.startsWith('mr')) return 'mr';
  if (value.startsWith('en')) return 'en';
  return DEFAULT_LANGUAGE;
}

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8').trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw configError(`Invalid JSON in '${path.basename(filePath)}': ${error.message}`);
  }
}

function normalizeCategories(payload) {
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (payload?.category && payload?.questions) return [payload];
  return [];
}

function ensureNonEmptyString(value, fieldName, context) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw configError(`${context}: '${fieldName}' must be a non-empty string`);
  }
  return value.trim();
}

function normalizeAndValidateFlow(rawFlow, sourceLabel) {
  const category = ensureNonEmptyString(rawFlow?.category, 'category', sourceLabel);
  const startQuestion = ensureNonEmptyString(rawFlow?.startQuestion, 'startQuestion', sourceLabel);

  if (!rawFlow?.questions || typeof rawFlow.questions !== 'object' || Array.isArray(rawFlow.questions)) {
    throw configError(`${sourceLabel}: 'questions' must be an object`);
  }

  const questionEntries = Object.entries(rawFlow.questions);
  if (questionEntries.length === 0) {
    throw configError(`${sourceLabel}: category '${category}' has no questions`);
  }

  const questionIds = new Set(questionEntries.map(([id]) => id));
  if (!questionIds.has(startQuestion)) {
    throw configError(`${sourceLabel}: startQuestion '${startQuestion}' not found in questions`);
  }

  const questions = {};

  for (const [questionId, rawQuestion] of questionEntries) {
    const questionText = ensureNonEmptyString(rawQuestion?.text, 'text', `${sourceLabel} question '${questionId}'`);
    if (!Array.isArray(rawQuestion?.options) || rawQuestion.options.length === 0) {
      throw configError(`${sourceLabel} question '${questionId}': 'options' must be a non-empty array`);
    }

    const options = rawQuestion.options.map((rawOption, optionIndex) => {
      const optionText = ensureNonEmptyString(
        rawOption?.text,
        'text',
        `${sourceLabel} question '${questionId}' option ${optionIndex}`
      );

      const score = Number(rawOption?.score ?? 0);
      if (!Number.isFinite(score)) {
        throw configError(
          `${sourceLabel} question '${questionId}' option ${optionIndex}: 'score' must be a valid number`
        );
      }

      const next = rawOption?.next == null ? 'end' : String(rawOption.next).trim();
      if (next === '') {
        throw configError(
          `${sourceLabel} question '${questionId}' option ${optionIndex}: 'next' cannot be empty`
        );
      }

      return {
        text: optionText,
        score,
        next,
        redFlag: Boolean(rawOption?.redFlag),
      };
    });

    questions[questionId] = {
      text: questionText,
      options,
    };
  }

  for (const [questionId, question] of Object.entries(questions)) {
    for (let i = 0; i < question.options.length; i += 1) {
      const option = question.options[i];
      if (option.next !== 'end' && !questionIds.has(option.next)) {
        throw configError(
          `${sourceLabel} question '${questionId}' option ${i}: next question '${option.next}' not found`
        );
      }
    }
  }

  return { category, startQuestion, questions };
}

function buildSignature(fileRecords) {
  return fileRecords
    .map((f) => `${f.name}:${f.size}:${f.mtimeMs}`)
    .sort()
    .join('|');
}

function getLanguageFile(language) {
  const normalizedLanguage = normalizeLanguage(language);
  const fileName = LANGUAGE_FILE_MAP[normalizedLanguage] || LANGUAGE_FILE_MAP[DEFAULT_LANGUAGE];
  const fullPath = path.join(TRIAGE_DIR, fileName);
  if (!fs.existsSync(fullPath)) {
    throw configError(`Triage dataset file '${fileName}' not found for language '${normalizedLanguage}'`);
  }
  return { normalizedLanguage, fileName, fullPath };
}

function loadData(language) {
  const { normalizedLanguage, fileName, fullPath } = getLanguageFile(language);
  const stat = fs.statSync(fullPath);
  const fileRecords = [
    {
      name: fileName,
      fullPath,
      size: stat.size,
      mtimeMs: stat.mtimeMs,
    },
  ];

  const signature = buildSignature(fileRecords);
  const existingCache = cacheByLanguage.get(normalizedLanguage);
  if (existingCache && existingCache.signature === signature) {
    return existingCache;
  }

  const categoryMap = new Map();

  for (const file of fileRecords) {
    const payload = readJsonFile(file.fullPath);
    const categories = normalizeCategories(payload);

    for (let i = 0; i < categories.length; i += 1) {
      const sourceLabel = `${file.name} categories[${i}]`;
      const flow = normalizeAndValidateFlow(categories[i], sourceLabel);
      const key = flow.category.toLowerCase();

      if (categoryMap.has(key)) {
        const existingSource = categoryMap.get(key).__source || 'unknown';
        throw configError(
          `Duplicate category '${flow.category}' found in '${sourceLabel}' and '${existingSource}'`
        );
      }

      categoryMap.set(key, {
        ...flow,
        __source: sourceLabel,
      });
    }
  }

  const categories = Array.from(categoryMap.entries())
    .map(([key, flow]) => ({ key, label: flow.category }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const nextCache = {
    signature,
    categoryMap,
    categories,
  };
  cacheByLanguage.set(normalizedLanguage, nextCache);
  return nextCache;
}

function getCategoryFlow(category, language) {
  const normalizedCategory = String(category || '').trim().toLowerCase();
  if (!normalizedCategory) {
    throw inputError('category is required');
  }

  const { categoryMap } = loadData(language);
  const flow = categoryMap.get(normalizedCategory);
  if (!flow) {
    throw inputError(`Category '${category}' not found in triage data`, 404);
  }
  return flow;
}

function getQuestionById(flow, questionId) {
  const question = flow.questions?.[questionId];
  if (!question) {
    throw configError(`Question '${questionId}' not found for category '${flow.category}'`);
  }
  return question;
}

function getAvailableCategories(language) {
  const { categories } = loadData(language);
  return categories;
}

function getStartQuestion(category, language) {
  const flow = getCategoryFlow(category, language);
  return {
    category: flow.category,
    questionId: flow.startQuestion,
    question: getQuestionById(flow, flow.startQuestion),
  };
}

function evaluateAssessment(category, answers, language) {
  if (!Array.isArray(answers)) {
    throw inputError('answers must be an array');
  }

  const flow = getCategoryFlow(category, language);
  let currentQuestionId = flow.startQuestion;
  let totalScore = 0;
  let redFlagTriggered = false;
  let answeredCount = 0;
  let minPossibleScore = 0;
  let maxPossibleScore = 0;
  const responseDetails = [];

  for (let i = 0; i < answers.length; i += 1) {
    const answer = answers[i];
    if (currentQuestionId === 'end') break;

    const expectedQuestionId = String(answer?.questionId || '').trim();
    if (expectedQuestionId !== currentQuestionId) {
      throw inputError(
        `Invalid answer order at index ${i}. Expected '${currentQuestionId}', received '${expectedQuestionId}'`
      );
    }

    const question = getQuestionById(flow, currentQuestionId);
    const optionIndex = Number(answer?.optionIndex);
    if (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= question.options.length) {
      throw inputError(`Invalid optionIndex '${answer?.optionIndex}' for question '${currentQuestionId}'`);
    }

    const selectedOption = question.options[optionIndex];
    const optionScores = question.options.map((option) => Number(option.score || 0));
    const questionMinScore = Math.min(...optionScores);
    const questionMaxScore = Math.max(...optionScores);

    totalScore += selectedOption.score;
    minPossibleScore += questionMinScore;
    maxPossibleScore += questionMaxScore;
    redFlagTriggered = redFlagTriggered || selectedOption.redFlag;
    responseDetails.push({
      questionId: currentQuestionId,
      questionText: question.text,
      selectedOptionIndex: optionIndex,
      selectedOptionText: selectedOption.text,
      score: selectedOption.score,
      questionMinScore,
      questionMaxScore,
      redFlag: Boolean(selectedOption.redFlag),
      nextQuestionId: selectedOption.next,
    });
    currentQuestionId = selectedOption.next;
    answeredCount += 1;

    if (redFlagTriggered) {
      currentQuestionId = 'end';
      break;
    }
  }

  if (currentQuestionId !== 'end' && !redFlagTriggered) {
    return {
      completed: false,
      category: flow.category,
      totalScore,
      minPossibleScore,
      maxPossibleScore,
      answeredCount,
      responseDetails,
      nextQuestionId: currentQuestionId,
      nextQuestion: getQuestionById(flow, currentQuestionId),
    };
  }

  const { riskLevel, recommendation, scoreRatio } = evaluateRisk(totalScore, redFlagTriggered, {
    minPossibleScore,
    maxPossibleScore,
  });
  return {
    completed: true,
    category: flow.category,
    totalScore,
    minPossibleScore,
    maxPossibleScore,
    redFlagTriggered,
    riskLevel,
    recommendation,
    scoreRatio,
    answeredCount,
    responseDetails,
  };
}

module.exports = {
  TriageEngineError,
  normalizeLanguage,
  getAvailableCategories,
  getStartQuestion,
  evaluateAssessment,
};
