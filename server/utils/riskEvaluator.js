const RECOMMENDATIONS = {
  en: {
    critical: '❌ Immediate Attention Needed! Seek emergency hospital care immediately.',
    high: '⚠️ Consult a doctor as soon as possible for professional evaluation.',
    moderate: 'Monitor symptoms closely. We recommend consulting a doctor if symptoms persist or worsen.',
    low: 'Home care is likely sufficient. Recommended: Rest, hydration, and safe OTC remedies like Paracetamol (for pain/fever) or Antacids (for stomach issues) as needed.',
  },
  mr: {
    critical: '❌ त्वरित वैद्यकीय लक्ष आवश्यक आहे! ताबडतोब आपत्कालीन हॉस्पिटलमध्ये जा.',
    high: '⚠️ व्यावसायिक मूल्यमापनासाठी शक्य तितक्या लवकर डॉक्टरांचा सल्ला घ्या.',
    moderate: 'लक्षणांवर बारीक लक्ष ठेवा. लक्षणे कायम राहिल्यास किंवा बिघडल्यास डॉक्टरांचा सल्ला घेण्याची आम्ही शिफारस करतो.',
    low: 'घरगुती काळजी पुरेशी असावी. शिफारस केलेले: विश्रांती, हायड्रेशन आणि आवश्यकतेनुसार पॅरासिटामॉल किंवा अँटासिड्स सारखे सुरक्षित घरगुती उपाय.',
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
