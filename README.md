# 🏥 MediConnect: AI-Powered Smart Triage & Clinic Management

MediConnect is a next-generation healthcare platform designed to bridge the gap between patients and clinicians through AI-driven diagnostics, seamless consultation management, and a premium, localized user experience.

---

## 🚀 Key Features

### 🧠 Intelligent Patient Triage
*   **Adaptive Assessment**: A dynamic questioning engine that adjusts based on patient input to identify potential risks.
*   **AI Risk Prioritization**: Automated scoring system that flags urgent cases for immediate doctor attention.
*   **Symptom Mapping**: Categorized analysis of medical symptoms with localized support in **English** and **Marathi**.

### 🛠️ Interactive Health Suite (Patient)
*   **Health Tools Dashboard**: A dedicated suite of preventative diagnostic tools:
    *   **BMI Calculator**: Vitals tracking with body mass index analysis.
    *   **Lung Strength Test**: Interactive respiratory stamina evaluation.
    *   **NeuroSync (Reaction Time)**: Neural response and reflex testing.
    *   **Hydration Tracker**: Weight-based daily water intake calculator with wave-animation UI.
    *   **CogniRecall (Memory Strength)**: Synaptic pattern recognition testing.
    *   **StressQuiz**: Neuro-endocrine diagnostic for mental well-being.
*   **Localized Medical History**: Comprehensive patient report history with full bilingual support.

### 👨‍⚕️ Advanced Doctor Ecosystem
*   **Smart Consultation Queue**: Real-time management of pending assessments.
*   **Conflict Prevention**: A "Claim" system that prevents multiple doctors from reviewing the same patient simultaneously.
*   **Prescription Interface**: Integrated LLM-suggested prescriptions that doctors can review, edit, and approve.
*   **Patient Case Review**: Deep-dive into patient history and biometric triggers before final advice.

### 🎨 Premium User Experience
*   **Dual Mode Architecture**: Seamless transition between **Midnight (Dark)** and **Clinical (Light)** themes.
*   **Glassmodal Design**: Modern UI utilizing glassmorphism, floating background orbs, and physics-based animations.
*   **Sticky Content Flow**: Optimized layout with sticky footers and responsive navigation.
*   **Secure Auth Flow**: Robust JWT-based authentication with integrated "Forgot Password" email reset capabilities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT, NodeMailer |
| **Database** | MySQL / PostgreSQL (JSONB Support) |
| **Localization** | i18next (Multilingual Framework) |
| **State/Theme** | React Context API, Custom Hooks |

---

## ⚙️ Setup & Installation

### 1. Prerequisite
*   Node.js 18+
*   npm 9+
*   SQL Database (configured in `.env`)

### 2. Initialization
Install all dependencies for both client and server from the root directory:
```bash
npm run setup
```

### 3. Environment Configuration
Copy the example environment file and fill in your credentials (Mail, DB, JWT Secret):
```bash
cp server/.env.example server/.env
```

### 4. Running the Platform
Launch both systems in parallel for development:
```bash
npm run dev
```

---

## 📜 Development Scripts
*   `npm run setup` - Install server and client dependencies.
*   `npm run dev` - Run Express + Vite in parallel.
*   `npm run dev:server` - Run only the backend logic.
*   `npm run dev:client` - Run only the frontend UI.
*   `npm run build` - Generate production-ready frontend bundle.

---

**MediConnect** — *Bridging diagnostics and care with intelligence.*
