const express = require('express');
const {
  getCategories,
  getInitialQuestion,
  submitAssessment,
} = require('../controllers/assessmentController');
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/start', getInitialQuestion);
router.post('/evaluate', optionalAuthMiddleware, submitAssessment);

module.exports = router;
