function evaluateRisk(totalScore, redFlagTriggered, meta = {}) {
  if (redFlagTriggered) {
    return {
      riskLevel: 'critical',
      recommendation: 'Immediate medical attention recommended.',
      scoreRatio: 1,
    };
  }

  const minPossible = Number(meta.minPossibleScore ?? 0);
  const maxPossible = Number(meta.maxPossibleScore ?? totalScore);
  const denominator = Math.max(1, maxPossible - minPossible);
  const scoreRatio = (totalScore - minPossible) / denominator;

  if (scoreRatio >= 0.67) {
    return {
      riskLevel: 'high',
      recommendation: 'Consult a doctor as soon as possible.',
      scoreRatio,
    };
  }

  if (scoreRatio >= 0.34) {
    return {
      riskLevel: 'moderate',
      recommendation: 'Monitor symptoms and seek medical advice if worsening.',
      scoreRatio,
    };
  }

  return {
    riskLevel: 'low',
    recommendation: 'Home care is likely sufficient unless symptoms change.',
    scoreRatio,
  };
}

module.exports = { evaluateRisk };
