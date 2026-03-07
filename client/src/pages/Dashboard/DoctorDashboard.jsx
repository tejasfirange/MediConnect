import React, { useEffect, useState } from 'react';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Clock, 
  ShieldAlert,
  Save,
  Trash2,
  Eye,
  EyeOff,
  LayoutDashboard,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

function DoctorDashboard() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      default: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    }
  }

  const criticalCount = queue.filter(q => q.risk_level?.toLowerCase() === 'critical').length;
  const highRiskCount = queue.filter(q => q.risk_level?.toLowerCase() === 'high').length;

  return (
    <div className={`dashboard-page min-h-screen flex flex-col ${isDark ? 'dashboard-page--dark bg-slate-950 text-slate-100' : 'dashboard-page--light bg-slate-50 text-slate-900'}`}>
      <div className="dashboard-orb dashboard-orb--blue"></div>
      <div className="dashboard-orb dashboard-orb--violet"></div>
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* ─── Main Content Area ─── */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <header className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                   <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10 text-blue-500">
                     <LayoutDashboard size={14} />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Medical Command Center</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                  Doctor Dashboard
                </h1>
                <p className={`text-base font-bold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                   Welcome back, Dr. <span className="text-blue-500">{profile?.name || 'Tejas'}</span> 👋
                </p>
              </div>

            </div>

            {/* Verification Banner */}
            {!loading && !profile?.registration_no && (
              <div className={`mt-8 p-6 rounded-[2rem] border-2 border-dashed flex flex-col md:flex-row items-center justify-between gap-6 transition-all animate-in zoom-in duration-700 ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600">
                    <ShieldAlert size={28} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-black ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Action Required: Clinical Credentials</h4>
                    <p className={`text-sm font-bold opacity-80 leading-relaxed max-w-xl ${isDark ? 'text-amber-300/70' : 'text-amber-600'}`}>
                      To enable full prescription issuance and digital signing, please complete your doctor profile verification with a valid registration number.
                    </p>
                  </div>
                </div>
                <Link to="/profile" className="w-full md:w-auto text-center px-8 py-4 rounded-2xl bg-amber-600 text-white text-sm font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-xl shadow-amber-600/20">
                  Verify Now
                </Link>
              </div>
            )}
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
            {/* ─── Queue Section (Left) ─── */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                   <Users size={24} className="text-blue-500" />
                   Review Queue
                </h2>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/20`}>
                  {queue.length} ADMITTED
                </span>
              </div>
              
              <div className={`rounded-[2.5rem] border overflow-hidden p-3 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="h-10 w-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">Retrieving Queue...</p>
                  </div>
                ) : queue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                    <div className="h-16 w-16 mb-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Queue is Empty</h3>
                    <p className="text-xs text-slate-500 max-w-[180px]">No new assessments need review today. Relax!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {queue.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectConsult(item)}
                        className={`group w-full flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 ${
                          selectedConsult?.id === item.id 
                            ? (isDark ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-blue-600 text-white shadow-xl shadow-blue-600/20') 
                            : (isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50')
                        }`}
                      >
                        <div className={`h-10 w-10 shrink-0 flex items-center justify-center rounded-xl font-bold transition-colors ${
                          selectedConsult?.id === item.id ? 'bg-white/20 text-white' : (isDark ? 'bg-slate-800 text-blue-500' : 'bg-blue-50 text-blue-600')
                        }`}>
                          {item.patient_name?.charAt(0)}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold truncate">{item.patient_name}</p>
                          <p className={`text-[10px] font-bold opacity-60 ${selectedConsult?.id === item.id ? 'text-white' : 'text-slate-500'}`}>
                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                           selectedConsult?.id === item.id 
                             ? 'bg-white/10 border-white/20 text-white' 
                             : riskColor(item.risk_level)
                        }`}>
                          {item.risk_level}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ─── Review Area (Right) ─── */}
            <div className="lg:col-span-4 h-full">
              {selectedConsult ? (
                <div className={`prescription-card rounded-[2.5rem] border h-fit p-6 md:p-10 transition-all duration-500 ${
                  isDark ? 'bg-slate-900/80 border-slate-800 glass-panel shadow-2xl' : 'bg-white shadow-xl border-slate-100'
                }`}>
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6 border-b border-slate-800/10 pb-8 mb-8">
                    <div className="flex items-center gap-5">
                      <div className="h-20 w-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-blue-500/40">
                        {selectedConsult.patient_name?.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="text-2xl font-black tracking-tight">{selectedConsult.patient_name}</h3>
                           <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${riskColor(selectedConsult.risk_level)}`}>
                             {selectedConsult.risk_level} Risk
                           </span>
                        </div>
                        <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedConsult.patient_email}</p>
                        <p className="text-[10px] font-black uppercase text-blue-500 mt-2 tracking-widest">Case ID: {String(selectedConsult.id).toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <button 
                        onClick={handleRelease}
                        className={`p-3 rounded-2xl transition-all duration-200 ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        title="Release Case"
                      >
                        <XCircle size={22} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Diagnostic Summary */}
                    <div className="space-y-6">
                       <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                             <TrendingUp size={16} className="text-emerald-500" />
                             Clinical Triage
                          </h4>
                          <div className={`rounded-3xl p-6 border ${isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-100'}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm prose-invert max-w-none">
                              {selectedConsult.report.summary}
                            </ReactMarkdown>
                          </div>
                       </div>

                       <div>
                          <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Patient Reported Vitals</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {selectedConsult.report.responseDetails?.slice(0, 4).map((r, i) => (
                              <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white'}`}>
                                <p className="text-[10px] font-black uppercase text-slate-500 mb-1 truncate">{r.questionText}</p>
                                <p className="text-sm font-bold text-blue-500">{r.selectedOptionText}</p>
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>

                    {/* Editor Section */}
                    <div className="space-y-6">
                       <div>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                               <Edit3 size={16} className="text-blue-500" />
                               Clinical Recommendation
                            </h4>
                            <div className="flex items-center gap-2">
                               <button 
                                onClick={() => setShowPreview(!showPreview)}
                                className={`p-2 rounded-lg transition-all ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}
                               >
                                 {showPreview ? <Eye size={16} /> : <EyeOff size={16} />}
                               </button>
                            </div>
                          </div>

                          <div className="relative group">
                            {showPreview ? (
                              <div className={`w-full min-h-[300px] rounded-3xl border p-6 prose prose-sm prose-invert max-w-none ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-100'}`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {editPrescription}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <textarea
                                value={editPrescription}
                                onChange={(e) => setEditPrescription(e.target.value)}
                                rows={12}
                                className={`w-full rounded-3xl border p-6 text-sm font-medium outline-none transition-all duration-300 resize-none ${
                                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10' : 'bg-slate-50 border-slate-100 text-slate-900 focus:bg-white focus:ring-4 focus:ring-blue-500/5'
                                }`}
                                placeholder="Type prescription details or adjust AI suggestions..."
                              />
                            )}
                          </div>
                       </div>

                       <div className="flex flex-col gap-3">
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => handleAction(selectedConsult.id, 'approved', editPrescription)}
                              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <CheckCircle size={18} />
                              Quick Approve
                            </button>
                            <button
                              onClick={() => handleAction(selectedConsult.id, 'edited', editPrescription)}
                              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Save size={18} />
                              Save & Review
                            </button>
                          </div>
                          <button
                            onClick={() => handleAction(selectedConsult.id, 'rejected', '')}
                            className={`flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black uppercase tracking-widest transition-all ${
                              isDark ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
                            }`}
                          >
                            <Trash2 size={16} />
                            Reject Case
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ─── Empty State / Command Center ─── */
                <div className={`h-[500px] flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed p-8 text-center transition-all animate-in fade-in duration-1000 ${
                  isDark ? 'border-slate-800/60 bg-slate-900/20 relative overflow-hidden' : 'border-slate-200 bg-white shadow-sm'
                }`}>
                  {isDark && <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />}
                  
                  <div className="relative mb-8">
                    <div className={`absolute -inset-10 rounded-full blur-[60px] animate-pulse ${isDark ? 'bg-blue-600/20' : 'bg-blue-100'}`} />
                    <div className={`relative h-24 w-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 duration-500 ${isDark ? 'bg-slate-900 text-blue-500 border border-slate-800' : 'bg-white text-blue-600 shadow-blue-500/10'}`}>
                      <Activity size={42} />
                    </div>
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white border-4 border-slate-950 shadow-lg">
                       <CheckCircle size={16} />
                    </div>
                  </div>
                  
                  <h3 className="text-4xl font-black tracking-tight mb-4">Command Center</h3>
                  <p className={`max-w-md text-base font-bold leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Your clinical dashboard is primed. Select a patient from the queue to start a high-fidelity diagnostic review or view medical reports.
                  </p>
                  
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border border-blue-500/20 text-blue-500 bg-blue-500/5">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                    System Active: Secure Bridge Live
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default DoctorDashboard;
