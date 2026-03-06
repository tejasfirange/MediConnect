const RECOMMENDATIONS = {
  en: {
    critical: 'Immediate medical attention recommended.',
    high: 'Consult a doctor as soon as possible.',
    moderate: 'Monitor symptoms and seek medical advice if worsening.',
    low: 'Home care is likely sufficient unless symptoms change.',
  },
  mr: {
    critical: 'त्वरित वैद्यकीय मदतीची शिफारस केली जाते.',
    high: 'शक्य तितक्या लवकर डॉक्टरांचा सल्ला घ्या.',
    moderate: 'लक्षणांवर लक्ष ठेवा आणि बिघडल्यास वैद्यकीय सल्ला घ्या.',
    low: 'लक्षणे बदलल्याशिवाय घरगुती काळजी पुरेशी आहे.',
  },
};

const RISK_LEVELS = {
  en: {
    critical: 'critical',
    high: 'high',
    moderate: 'moderate',
    low: 'low',
  },
  mr: {
    critical: 'गंभीर',
    high: 'उच्च',
    moderate: 'मध्यम',
    low: 'कमी',
  },
};

function evaluateRisk(totalScore, redFlagTriggered, meta = {}) {
  const language = meta.language === 'mr' ? 'mr' : 'en';

  if (redFlagTriggered) {
    return {
      riskLevel: RISK_LEVELS[language].critical,
      riskLevelCode: 'critical',
      recommendation: RECOMMENDATIONS[language].critical,
      scoreRatio: 1,
    };
  }

  const minPossible = Number(meta.minPossibleScore ?? 0);
  const maxPossible = Number(meta.maxPossibleScore ?? totalScore);
  const denominator = Math.max(1, maxPossible - minPossible);
  const scoreRatio = (totalScore - minPossible) / denominator;

  let levelKey = 'low';
  if (scoreRatio >= 0.67) {
    levelKey = 'high';
  } else if (scoreRatio >= 0.34) {
    levelKey = 'moderate';
  }

  return {
    riskLevel: RISK_LEVELS[language][levelKey],
    riskLevelCode: levelKey,
    recommendation: RECOMMENDATIONS[language][levelKey],
    scoreRatio,
  };
}

module.exports = { evaluateRisk };
