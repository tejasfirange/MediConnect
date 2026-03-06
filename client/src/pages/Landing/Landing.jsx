import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Activity, ShieldAlert, ClipboardList, CalendarClock, ArrowRight, 
  ShieldCheck, UserCheck, AlertTriangle, Building2, Send, X, CheckCircle2 
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './Landing.css';

const Landing = () => {
  const { t } = useTranslation('landing');
  const { user, isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [waitlistModalOpen, setWaitlistModalOpen] = React.useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = React.useState(false);
  const [waitlistEmail, setWaitlistEmail] = React.useState('');
  const isDoctor = user?.role === 'doctor';

  const pageClass = `landing-page min-h-screen flex flex-col relative overflow-hidden ${isDark ? 'theme-dark bg-slate-950 text-slate-100' : 'bg-[#f8faff] text-slate-900'}`;

  return (
    <div id="home" className={pageClass}>
      {isDark && (
        <>
          <div className="dashboard-orb dashboard-orb--blue" aria-hidden="true" />
          <div className="dashboard-orb dashboard-orb--sky" aria-hidden="true" />
          <div className="dashboard-orb dashboard-orb--violet" aria-hidden="true" />
        </>
      )}
      <Navbar />

      <main className="relative z-10 isolate flex-1">
        {/* ─── Hero Section ─── */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-20 pt-10 md:px-12 md:pt-16 lg:pt-20 relative">
          {/* Subtle Grid Pattern for background detail */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
          
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1 lg:pr-10">
              <div className="space-y-8">
                <p
                  className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] ${
                    isDark
                      ? 'border-blue-500/30 bg-blue-500/10 text-blue-400'
                      : 'border-blue-200 bg-blue-50 text-blue-600'
                  }`}
                >
                  {t('badge')}
                </p>
                <h1 className={`text-4xl font-extrabold leading-[1.12] tracking-tight md:text-5xl lg:text-6xl ${isDark ? 'text-slate-100' : 'text-slate-900 font-black'}`}>
                  {t('heroTitle')}
                </h1>
                <p className={`max-w-xl text-lg leading-relaxed md:text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t('heroText')}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    to={isAuthenticated ? (isDoctor ? '/dashboard' : '/assessment') : '/login'}
                    className="rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-blue-500/35 active:translate-y-0"
                  >
                    {isAuthenticated && isDoctor ? 'Go to Dashboard' : t('startAssessment')}
                  </Link>
                  <a
                    href="#how-it-works"
                    className={`rounded-xl border px-8 py-4 text-base font-bold transition duration-300 hover:-translate-y-1 active:translate-y-0 ${
                      isDark
                        ? 'border-slate-700 bg-slate-900/50 text-slate-100 hover:border-slate-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/10'
                    }`}
                  >
                    {t('watchDemo')}
                  </a>
                </div>

                <div className="flex flex-wrap gap-10 pt-6 border-t md:pt-8" style={{ borderColor: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.7)' }}>
                  <div>
                    <p className="text-3xl font-black tracking-tighter text-blue-600">98%</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('stat1')}
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tighter text-blue-600">3x</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('stat2')}
                    </p>
                  </div>
                  <div>
                    <p className="text-3xl font-black tracking-tighter text-blue-600">24/7</p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t('stat3')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Content */}
            <div className="relative order-1 lg:order-2">
              <div className="relative mx-auto max-w-[540px] lg:max-w-none">
                {/* Main Illustration Wrapper */}
                <div className="relative z-10 w-full rounded-[2.5rem] bg-blue-600/5 p-3 ring-1 ring-blue-500/10 md:p-5">
                  <img
                    src="/hero.png"
                    alt="MediConnect Healthcare Hero"
                    className="w-full rounded-[2rem] shadow-2xl transition duration-500 hover:scale-[1.01]"
                  />

                  {/* Floating Risk Card */}
                  <div className="absolute -bottom-6 -left-6 hidden w-72 sm:block lg:-bottom-10 lg:-left-12">
                    <div
                      className={`hero-card rounded-[2rem] border p-6 shadow-2xl ${
                        isDark
                          ? 'border-slate-700 bg-slate-900/90 shadow-black/60 backdrop-blur-xl'
                          : 'border-blue-50/50 bg-white/90 shadow-blue-200/50 backdrop-blur-xl'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2 className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {t('liveRiskTitle')}
                        </h2>
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                      </div>

                      <div className="mt-5 space-y-4">
                        <div className={`rounded-xl border-l-[3px] border-l-blue-500 p-3.5 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                          <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t('symptom')}</p>
                          <p className={`mt-0.5 text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{t('symptomValue')}</p>
                        </div>

                        <div className={`rounded-xl border p-3.5 ${isDark ? 'border-orange-500/20 bg-orange-500/5' : 'border-orange-100 bg-orange-50/40'}`}>
                          <div className="flex items-center justify-between">
                            <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>{t('riskLevel')}</p>
                            <span className="text-[10px] font-black tracking-widest uppercase text-orange-600">{t('riskHigh')}</span>
                          </div>
                          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-orange-500/20">
                            <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-orange-400 to-orange-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative background blur */}
                <div className="absolute -z-10 -right-10 -top-10 h-64 w-64 rounded-full bg-blue-400/20 blur-[100px]" />
                <div className="absolute -z-10 -left-10 -bottom-10 h-64 w-64 rounded-full bg-violet-400/20 blur-[100px]" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section id="features" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12 md:py-32">
          <div className="flex flex-col items-center text-center mb-20">
            <p className={`mb-4 text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-blue-500' : 'text-blue-600'}`}>
              Superior Capabilities
            </p>
            <h3 className={`text-3xl font-black tracking-tight sm:text-5xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {t('featuresTitle')}
            </h3>
            <div className="mt-6 h-1.5 w-16 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50" />
            <p className={`mt-6 max-w-2xl text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              MediConnect leverages advanced diagnostics and seamless integrations to provide a professional-grade health management experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { 
                icon: Activity, 
                title: t('feature1Title'), 
                text: t('feature1Text'), 
                color: 'blue',
                textColor: isDark ? 'text-blue-400' : 'text-blue-600',
                glowColor: 'bg-blue-500'
              },
              { 
                icon: ShieldAlert, 
                title: t('feature2Title'), 
                text: t('feature2Text'), 
                color: 'violet',
                textColor: isDark ? 'text-violet-400' : 'text-violet-600',
                glowColor: 'bg-violet-500'
              },
              { 
                icon: Sparkles, 
                title: t('feature3Title'), 
                text: t('feature3Text'), 
                color: 'emerald',
                textColor: isDark ? 'text-emerald-400' : 'text-emerald-600',
                glowColor: 'bg-emerald-500'
              }
            ].map((feature, idx) => (
              <article 
                key={idx}
                className={`group relative rounded-[3rem] border p-10 transition-all duration-500 hover:-translate-y-2 ${
                  isDark 
                    ? 'border-slate-800 bg-slate-900/40 backdrop-blur-xl hover:bg-slate-900/60 hover:border-slate-700/50 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]' 
                    : 'border-blue-50 bg-white hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)]'
                }`}
              >
                {/* Accent Glow */}
                <div className={`absolute -right-4 -top-4 -z-10 h-32 w-32 rounded-full blur-3xl transition-opacity duration-500 opacity-0 group-hover:opacity-20 ${feature.glowColor}`} />

                <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 
                  ${isDark ? 'bg-slate-800 shadow-inner ring-1 ring-slate-700' : 'bg-slate-50 shadow-sm'}`}>
                  <feature.icon size={36} className={feature.textColor} />
                </div>
                
                <h4 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {feature.title}
                </h4>
                
                <p className={`mt-5 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {feature.text}
                </p>

                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-500 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  Learn More <ArrowRight size={14} />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ─── How it Works ─── */}
        <section id="how-it-works" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12">
          <div className="flex flex-col items-center text-center mb-20">
            <h3 className={`text-3xl font-black tracking-tight sm:text-5xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {t('howTitle')}
            </h3>
            <div className="mt-6 h-1.5 w-16 rounded-full bg-blue-600 shadow-lg shadow-blue-500/50" />
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 relative">
            {/* Connecting line (Desktop) */}
            <div className="absolute top-1/2 left-[10%] right-[10%] hidden h-[2px] bg-gradient-to-r from-blue-500/5 via-blue-500/20 to-blue-500/5 md:block transform -translate-y-20 -z-10" />

            {[1, 2, 3].map((num) => (
              <div key={num} className="group flex flex-col items-center text-center">
                <div className={`relative mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] text-4xl font-black transition-all duration-500 group-hover:scale-110 group-hover:rotate-12
                  ${isDark 
                    ? 'bg-slate-900 text-blue-500 shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)] ring-1 ring-slate-800' 
                    : 'bg-white text-blue-600 shadow-xl border border-blue-50'}`}>
                  0{num}
                  {/* Outer spinning ring effect on hover */}
                  <div className="absolute inset-0 rounded-[2.5rem] border-2 border-dashed border-blue-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-[spin_10s_linear_infinite]" />
                </div>
                
                <h4 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {t(`step${num}`)}
                </h4>
                <p className={`mt-4 text-base leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t(`step${num}Text`)}
                </p>
                
                {num < 3 && (
                  <ArrowRight size={24} className="mt-8 text-blue-500/20 transition-all duration-300 group-hover:translate-x-2 group-hover:text-blue-500 md:hidden" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── Clinical Review & Medical Validation ─── */}
        <section id="validation" className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 md:px-12">
          <div className="flex flex-col items-center text-center mb-16">
            <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
              <ShieldCheck size={36} />
            </div>
            <h3 className={`text-3xl font-black tracking-tight sm:text-5xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              Clinical Review & Medical Validation
            </h3>
            <div className="mt-6 h-1.5 w-16 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            <p className={`mt-8 max-w-3xl text-lg leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Our Mediconnect symptom-based triage system has been reviewed by licensed medical professionals to ensure that the questions used for preliminary health awareness are safe and appropriate for public use.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
            {/* Doctor 1 */}
            <div className={`group relative overflow-hidden rounded-[3rem] border transition-all duration-500 hover:-translate-y-1 ${
              isDark ? 'border-slate-800 bg-slate-900/40 backdrop-blur-xl' : 'border-slate-200 bg-white'
            }`}>
              <div className="p-8 md:p-10">
                <div className="flex items-start gap-6">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Dr. Vijay M. Chougule</h4>
                    <p className="text-sm font-semibold text-blue-500">B.A.M.S., E.T.M.S. • Reg No: 163809E</p>
                  </div>
                </div>
                <div className={`mt-8 rounded-2xl p-6 ${isDark ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
                  <p className={`text-sm leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "Reviewed the Mediconnect questionnaire and confirmed that the questions are appropriate for preliminary symptom screening and general health awareness."
                  </p>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Review Date: 06 March 2026</p>
                </div>
                {/* Approval Image 1 */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50">
                  <img src="/Approval1.jpeg" alt="Medical Approval - Dr. Vijay M. Chougule" className="w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className={`group relative overflow-hidden rounded-[3rem] border transition-all duration-500 hover:-translate-y-1 ${
              isDark ? 'border-slate-800 bg-slate-900/40 backdrop-blur-xl' : 'border-slate-200 bg-white'
            }`}>
              <div className="p-8 md:p-10">
                <div className="flex items-start gap-6">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Dr. Sunildatt G. Sangewar</h4>
                    <p className="text-sm font-semibold text-blue-500">M.D.</p>
                  </div>
                </div>
                <div className={`mt-8 rounded-2xl p-6 ${isDark ? 'bg-slate-800/40' : 'bg-slate-50'}`}>
                  <p className={`text-sm leading-relaxed italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    "Verified that the questions are suitable for initial triage guidance and public health awareness, with clear disclaimers that it does not replace professional medical care."
                  </p>
                  <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Review Date: 06 March 2026</p>
                </div>
                {/* Approval Image 2 */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50">
                  <img src="/Approval2.jpeg" alt="Medical Approval - Dr. Sunildatt G. Sangewar" className="w-full transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer Block */}
          <div className={`mt-12 overflow-hidden rounded-[2.5rem] border ${
            isDark ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-200 bg-amber-50'
          }`}>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
              <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl ${isDark ? 'bg-amber-500/10 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
                <AlertTriangle size={40} />
              </div>
              <div className="space-y-4">
                <h4 className={`text-2xl font-black tracking-tight ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>Regulatory & Clinical Protocol</h4>
                <p className={`text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Mediconnect operates as a <strong>Digital Health Intermediary</strong>. All symptom-based triage results are subject to <strong>Clinical Validation</strong>. 
                  Final diagnoses and prescriptions are issued exclusively by registered medical professionals through our secure consultation bridge.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  {[
                    'Registered Practitioner Review', 
                    'Licenced Prescription Issuance', 
                    'Emergency Care Escalation'
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-600 shadow-sm'
                    }`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── For Clinics ─── */}
        <section id="for-clinics" className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-12 md:px-12">
          <div
            className={`overflow-hidden rounded-[2.5rem] p-8 md:p-12 lg:p-16 relative border transition-shadow duration-500 ${
              isDark 
                ? 'bg-slate-900 border-slate-800 shadow-2xl' 
                : 'bg-white border-slate-100 shadow-xl shadow-blue-500/5'
            }`}
          >
            {/* Contextual Accents */}
            <div className={`absolute -right-24 -top-24 h-64 w-64 rounded-full blur-[100px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-600/5'}`} />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Building2 size={28} />
              </div>
              <h3 className={`text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {t('clinicsTitle')}
              </h3>
              <p className={`mt-6 max-w-2xl text-base leading-relaxed md:text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {t('clinicsText')}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setWaitlistModalOpen(true)}
                  className={`group rounded-2xl px-10 py-4 text-base font-bold shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    isDark
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  }`}
                >
                  {t('requestSetup')}
                  <ArrowRight size={18} className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Waitlist Modal ─── */}
        {waitlistModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <div 
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" 
              onClick={() => {
                setWaitlistModalOpen(false);
                setWaitlistSuccess(false);
              }}
            />
            <div className={`relative w-full max-w-md overflow-hidden rounded-[2rem] border p-8 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}>
              {!waitlistSuccess ? (
                <>
                  <button 
                    onClick={() => setWaitlistModalOpen(false)}
                    className="absolute right-6 top-6 text-slate-500 hover:text-slate-300 transition"
                  >
                    <X size={20} />
                  </button>
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500`}>
                    <Building2 size={32} />
                  </div>
                  <h4 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Clinic Early Access</h4>
                  <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Join 12+ clinics currently streamlining their intake with MediConnect.
                  </p>
                  
                  <div className="mt-8 space-y-4">
                    <div>
                      <label className={`block text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'} mb-2`}>Work Email</label>
                      <input 
                        type="email" 
                        value={waitlistEmail}
                        onChange={(e) => setWaitlistEmail(e.target.value)}
                        placeholder="clinic@hospital.com"
                        className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 ${
                          isDark 
                            ? 'bg-slate-800 border-slate-700 text-white focus:ring-blue-500/20' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500/10'
                        }`}
                      />
                    </div>
                    <button 
                      onClick={() => setWaitlistSuccess(true)}
                      disabled={!waitlistEmail}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                    >
                      <Send size={16} />
                      Join the Waitlist
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center flex flex-col items-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className={`text-2xl font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>You're on the list!</h4>
                  <p className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    We've received your request for <strong>{waitlistEmail}</strong>.<br/>Our clinical team will reach out soon for setup.
                  </p>
                  <button 
                    onClick={() => {
                      setWaitlistModalOpen(false);
                      setWaitlistSuccess(false);
                      setWaitlistEmail('');
                    }}
                    className={`mt-10 rounded-xl px-8 py-3 text-sm font-bold transition-all ${
                      isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Landing;
