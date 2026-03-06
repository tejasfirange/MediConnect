import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Clock, 
  User, 
  ChevronRight,
  ShieldAlert,
  Save,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function DoctorDashboard() {
  const { isDark } = useTheme();
  const { token, user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [editPrescription, setEditPrescription] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const [queueRes, profileRes] = await Promise.all([
        api.get('/consultations/queue'),
        api.get('/doctor/me').catch(() => ({ data: { doctor: null } }))
      ]);
      setQueue(queueRes.data);
      setProfile(profileRes.data.doctor);
    } catch (err) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status, prescription) => {
    try {
      await api.put(`/consultations/${id}`, {
        status,
        doctorPrescription: prescription
      });

      toast.success(`Consultation ${status} successfully`);
      setSelectedConsult(null);
      fetchQueue();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleSelectConsult = async (item) => {
    // If we're already reviewing someone, release them first (optional, or just let claim handle it)
    if (selectedConsult && selectedConsult.id !== item.id) {
      await handleRelease();
    }

    try {
      const res = await api.post(`/consultations/${item.id}/claim`);
      setSelectedConsult(item);
      setEditPrescription(item.llm_prescription);
      // Update the local queue item status to match backend if needed
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not claim this consultation');
      fetchQueue(); // Refresh queue to show updated status
    }
  };

  const handleRelease = async () => {
    if (!selectedConsult) return;
    try {
      await api.post(`/consultations/${selectedConsult.id}/release`);
      setSelectedConsult(null);
      fetchQueue();
    } catch (err) {
      console.error("Release failed:", err);
      setSelectedConsult(null);
      fetchQueue();
    }
  };

  useEffect(() => {
    const handleUnload = () => {
      if (selectedConsult) {
        // navigator.sendBeacon is better for unloads, but let's keep it simple or use a sync request if possible
        // most browsers block async fetches on unload.
        api.post(`/consultations/${selectedConsult.id}/release`);
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [selectedConsult]);

  const riskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className={`dashboard-page min-h-screen flex flex-col ${isDark ? 'dashboard-page--dark bg-slate-950' : 'dashboard-page--light bg-slate-50'}`}>
      <div className="dashboard-orb dashboard-orb--blue"></div>
      <div className="dashboard-orb dashboard-orb--violet"></div>
      <Navbar />
      
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 flex-1">
        <header className="dashboard-hero mb-12">
           <div className="flex items-center gap-4 mb-3">
             <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
               <Activity size={26} className="text-white" />
             </div>
             <div>
               <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                 Doctor's Dashboard
               </h1>
               <p className={`text-sm font-medium tracking-wide ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                 Welcome back, Dr. {profile?.name?.split(' ')[0] || user?.email?.split('@')[0]}
               </p>
             </div>
           </div>

          {!loading && !profile?.registration_no && (
            <div className={`mt-6 p-5 rounded-3xl border flex items-center justify-between gap-6 transition-all animate-in fade-in slide-in-from-top-4 duration-700 ${isDark ? 'bg-blue-500/10 border-blue-500/20 shadow-lg shadow-blue-900/10' : 'bg-blue-50 border-blue-200 shadow-xl shadow-blue-500/5'}`}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <p className={`text-base font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Clinical Credentials Required</p>
                  <p className={`text-xs opacity-90 leading-relaxed max-w-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                    Your account needs a verified registration number and clinical qualifications before you can approve prescriptions.
                  </p>
                </div>
              </div>
              <Link to="/profile" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 shadow-md">
                Verify Now
              </Link>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Queue List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className={`flex items-center gap-2 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Clock size={20} className="text-blue-500" />
              Pending Patient Queue ({queue.length})
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : queue.length === 0 ? (
              <div className={`rounded-3xl border p-12 text-center flex flex-col items-center justify-center animate-in zoom-in duration-500 ${isDark ? 'border-slate-700/50 bg-slate-900/60 glass-panel shadow-2xl shadow-black/40' : 'border-slate-200 bg-white'}`}>
                <div className={`h-16 w-16 mb-6 rounded-3xl flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'bg-emerald-50 text-emerald-600'}`}>
                  <CheckCircle size={32} />
                </div>
                <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Queue Clear</h3>
                <p className={`text-sm max-w-[200px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  All assessments have been processed. Great work!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectConsult(item)}
                    className={`dashboard-action w-full text-left rounded-2xl border p-4 transition-all outline-none ${
                      selectedConsult?.id === item.id 
                        ? (isDark ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10' : 'border-blue-300 bg-blue-50 shadow-md') 
                        : (isDark ? 'border-slate-800 bg-slate-900/50 glass-panel' : 'border-slate-200 bg-white shadow-sm')
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 flex items-center justify-center rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                          <User size={20} className="text-blue-500" />
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.patient_name}</p>
                          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{new Date(item.created_at).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${riskColor(item.risk_level)}`}>
                        {item.risk_level}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Prescription */}
          <div className="lg:col-span-2">
            {selectedConsult ? (
              <div className={`prescription-card glass-panel rounded-3xl border p-6 md:p-8 space-y-6 ${isDark ? 'border-slate-800' : 'border-slate-200 shadow-xl'}`}>
                <div className="flex items-center justify-between border-b pb-4 mb-4 border-slate-700/30">
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedConsult.patient_name}'s Assessment</h3>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedConsult.patient_email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleRelease}
                      className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isDark 
                        ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white' 
                        : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                      }`}
                    >
                      Cancel Review
                    </button>
                    <button 
                      onClick={handleRelease}
                      className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}
                      aria-label="Close"
                    >
                      <XCircle size={24} />
                    </button>
                  </div>
                </div>

                {/* Assessment Summary */}
                <div className="space-y-4">
                  <h4 className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <ShieldAlert size={18} className="text-orange-500" />
                    AI Triage Summary
                  </h4>
                  <div className={`markdown-wrapper rounded-xl p-4 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedConsult.report.summary}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Response Details */}
                 <div>
                    <h4 className={`font-semibold text-sm mb-3 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Symptom Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {selectedConsult.report.responseDetails?.slice(0, 6).map((r, i) => (
                         <div key={i} className={`p-2 rounded-lg border text-xs ${isDark ? 'border-slate-800 bg-slate-950/50' : 'bg-white'}`}>
                           <p className={`font-semibold line-clamp-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{r.questionText}</p>
                           <p className="text-blue-500">{r.selectedOptionText}</p>
                         </div>
                       ))}
                    </div>
                 </div>

                {/* Prescription Area */}
                <div className="space-y-4 border-t pt-6 border-slate-700">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold text-sm flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                      <Edit3 size={18} className="text-blue-500" />
                      Prescription & Recommendation
                    </h4>
                    <div className="flex items-center gap-4">
                      <button 
                         onClick={() => setShowPreview(!showPreview)}
                         className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                           showPreview 
                           ? 'bg-blue-500 text-white' 
                           : (isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')
                         }`}
                         title={showPreview ? "Back to Edit" : "Preview Markdown"}
                      >
                         {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                         {showPreview ? "Editing Mode" : "Preview Mode"}
                      </button>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Generated by LLM</span>
                    </div>
                  </div>
                  
                  {showPreview ? (
                    <div className={`w-full rounded-2xl border p-6 min-h-[250px] markdown-wrapper ${
                      isDark ? 'bg-slate-900/50 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {editPrescription}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <textarea
                      value={editPrescription}
                      onChange={(e) => setEditPrescription(e.target.value)}
                      rows={10}
                      className={`w-full rounded-2xl border p-4 text-sm outline-none ring-blue-500/30 focus:ring-4 transition ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                      placeholder="Enter prescription details..."
                    />
                  )}

                  <div className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={() => handleAction(selectedConsult.id, 'approved', editPrescription)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 transition"
                    >
                      <CheckCircle size={18} />
                      Approve Prescription
                    </button>
                    <button
                      onClick={() => handleAction(selectedConsult.id, 'edited', editPrescription)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
                    >
                      <Save size={18} />
                      Save & Approve
                    </button>
                    <button
                      onClick={handleRelease}
                      className="flex-1 rounded-xl border border-slate-700/50 px-6 py-3.5 text-sm font-semibold text-slate-500 hover:bg-slate-800 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAction(selectedConsult.id, 'rejected', '')}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-600/10 border border-red-600/30 px-6 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-600/20 transition"
                    >
                      <Trash2 size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`h-[500px] flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed p-12 text-center transition-all animate-in fade-in duration-1000 ${
                isDark ? 'border-slate-700/40 bg-slate-900/40' : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className={`relative mb-8`}>
                  <div className={`absolute -inset-4 rounded-full blur-2xl animate-pulse ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`} />
                  <div className={`relative h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl ${isDark ? 'bg-slate-800 text-blue-400 border border-slate-700' : 'bg-white text-slate-300'}`}>
                    <Activity size={32} />
                  </div>
                </div>
                <h3 className={`text-2xl font-black tracking-tight mb-3 italic ${isDark ? 'text-white' : 'text-slate-900'}`}>Command Center</h3>
                <p className={`max-w-md text-sm font-medium leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                   Your digital consultation suite is ready. Select a patient from the queue to review their AI-triaged reports and finalize their medical path.
                </p>
                <div className={`mt-8 flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
                  isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-500/5 text-blue-600 border border-blue-500/10'
                }`}>
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                  Awaiting Input
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DoctorDashboard;
