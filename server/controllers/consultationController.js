const pool = require('../config/db');
const { generatePrescription } = require('../services/prescriptionService');

async function createConsultation(req, res) {
  try {
    const { reportId } = req.body;
    const patientEmail = req.user.email;

    if (!reportId) {
      return res.status(400).json({ message: 'reportId is required' });
    }

    // 1. Fetch risk level and other info
    const reportQuery = `SELECT * FROM patient_reports WHERE pr_id = $1 AND email = $2`;
    const reportResult = await pool.query(reportQuery, [reportId, patientEmail]);

    if (reportResult.rowCount === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const reportData = reportResult.rows[0];
    const riskLevel = reportData.report.riskLevel;

    // 2. Generate initial LLM prescription
    const llmPrescription = await generatePrescription(reportData);

    // 3. Create consultation record
    const consultationQuery = `
      INSERT INTO consultations (patient_email, report_id, risk_level, llm_prescription, status)
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *
    `;
    const consultation = await pool.query(consultationQuery, [
      patientEmail,
      reportId,
      riskLevel,
      llmPrescription,
    ]);

    res.status(201).json(consultation.rows[0]);
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ message: 'Server error creating consultation' });
  }
}

async function getDoctorQueue(req, res) {
  try {
    // In a real app, maybe doctors only see high-risk ones
    // Or we filter by matching specialities
    const query = `
      SELECT c.*, pd.name as patient_name, pr.report
      FROM consultations c
      JOIN patient_details pd ON c.patient_email = pd.email
      JOIN patient_reports pr ON c.report_id = pr.pr_id
      WHERE c.status = 'pending'
      ORDER BY 
        CASE 
          WHEN c.risk_level = 'critical' THEN 1
          WHEN c.risk_level = 'high' THEN 2
          WHEN c.risk_level = 'moderate' THEN 3
          ELSE 4
        END,
        c.created_at ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching doctor queue:', error);
    res.status(500).json({ message: 'Server error fetching queue' });
  }
}

async function getCompletedConsultations(req, res) {
  try {
    const query = `
      SELECT c.*, pd.name as patient_name, pr.report
      FROM consultations c
      JOIN patient_details pd ON c.patient_email = pd.email
      JOIN patient_reports pr ON c.report_id = pr.pr_id
      WHERE c.status != 'pending'
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching completed consultations:', error);
    res.status(500).json({ message: 'Server error fetching completed' });
  }
}

async function updateConsultation(req, res) {
  try {
    const { id } = req.params;
    const { status, doctorPrescription } = req.body;
    const doctorEmail = req.user.email;

    if (!['approved', 'rejected', 'edited'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const query = `
      UPDATE consultations
      SET status = $1, doctor_prescription = $2, doctor_email = $3
      WHERE id = $4
      RETURNING *
    `;
    const result = await pool.query(query, [status, doctorPrescription, doctorEmail, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ message: 'Server error updating consultation' });
  }
}

async function getPatientConsultations(req, res) {
  try {
    const patientEmail = req.user.email;
    const query = `
      SELECT c.*, 
             dr.name as doctor_name, dr.registration_no, dr.qualification, dr.contact_no as doctor_phone,
             pd.name as patient_name, pd.gender, pd.dob as patient_dob, pd.contact_no as patient_phone,
             pr.report as report_data
      FROM consultations c
      LEFT JOIN doctor_details dr ON c.doctor_email = dr.email
      LEFT JOIN patient_details pd ON c.patient_email = pd.email
      LEFT JOIN patient_reports pr ON c.report_id = pr.pr_id
      WHERE c.patient_email = $1
      ORDER BY c.created_at DESC
    `;
    const result = await pool.query(query, [patientEmail]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching patient consultations:', error);
    res.status(500).json({ message: 'Server error fetching consultations' });
  }
}

module.exports = {
  createConsultation,
  getDoctorQueue,
  getCompletedConsultations,
  updateConsultation,
  getPatientConsultations,
};
