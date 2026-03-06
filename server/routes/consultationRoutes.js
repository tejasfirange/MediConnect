const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware to check doctor role
function isDoctor(req, res, next) {
  if (req.user && req.user.role === 'doctor') {
    next();
  } else {
    res.status(403).json({ message: 'Doctor role required' });
  }
}

// Patient routes
router.post('/consult', authMiddleware, consultationController.createConsultation);
router.get('/my-consultations', authMiddleware, consultationController.getPatientConsultations);

// Doctor routes
router.get('/queue', authMiddleware, isDoctor, consultationController.getDoctorQueue);
router.get('/completed', authMiddleware, isDoctor, consultationController.getCompletedConsultations);
router.put('/:id', authMiddleware, isDoctor, consultationController.updateConsultation);

module.exports = router;
