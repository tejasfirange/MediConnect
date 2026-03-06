require('dotenv').config();
const { generateAssessmentSummary } = require('./services/summaryService');

const mockResult = {
  completed: true,
  riskLevel: 'Critical',
  totalScore: 7,
  answeredCount: 3,
  redFlagTriggered: true,
  recommendation: 'Immediate medical attention recommended.',
  responseDetails: [
    { questionText: 'What eye issue do you have?', selectedOptionText: 'Eye strain', score: 2, redFlag: false },
    { questionText: 'How long do you use screens daily?', selectedOptionText: '2-4 hours', score: 1, redFlag: false },
    { questionText: 'Do you have blurred vision?', selectedOptionText: 'Yes', score: 4, redFlag: true },
  ],
};

(async () => {
    console.log('Testing generateAssessmentSummary...');
    try {
        const summary = await generateAssessmentSummary({
            result: mockResult,
            category: 'Eye',
            language: 'en'
        });
        console.log('--- Summary Result ---');
        console.log('Source:', summary.source);
        console.log('Text:', summary.text);
    } catch (err) {
        console.error('Test failed:', err);
    }
})();
