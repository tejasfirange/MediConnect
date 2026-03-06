const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const assessmentRoutes = require('./routes/assessmentRoutes');
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const consultationRoutes = require('./routes/consultationRoutes');
const { runMigration } = require('./services/migrationService');

// Run DB migrations at startup
runMigration();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/assessment', assessmentRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor", doctorRoutes);
app.use('/api/consultations', consultationRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'MediConnect backend is running'
  });
});

app.get("/reset-password/:token", (req, res) => {

    const token = req.params.token;

    res.send(`
        <h2>Reset Password</h2>
        <form method="POST" action="/api/auth/reset-password">
            <input type="hidden" name="token" value="${token}" />
            <input type="password" name="newPassword" placeholder="New Password" required />
            <button type="submit">Reset Password</button>
        </form>
    `);

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});