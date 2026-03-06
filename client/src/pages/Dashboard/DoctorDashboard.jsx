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
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Dashboard.css';

function DoctorDashboard() {
  const { isDark } = useTheme();
  const { token, user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [editPrescription, setEditPrescription] = useState('');

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultations/queue');
      setQueue(response.data);
    } catch (err) {
      toast.error('Failed to fetch doctor queue');
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

  const riskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className={`dashboard-page min-h-screen pb-24 ${isDark ? 'dashboard-page--dark' : 'dashboard-page--light'}`}>
      <div className="dashboard-orb dashboard-orb--blue"></div>
      <div className="dashboard-orb dashboard-orb--violet"></div>
      <Navbar />
      
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <header className="dashboard-hero mb-8">
          <h1 className="dashboard-hero__greeting text-3xl font-bold">Doctor's Dashboard</h1>
          <p className={`dashboard-hero__sub ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage patient assessments and provide clinical prescriptions.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Queue List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Clock size={20} className="text-blue-500" />
              Patient Queue ({queue.length})
            </h2>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : queue.length === 0 ? (
              <div className={`rounded-2xl border p-10 text-center ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <CheckCircle size={40} className="mx-auto mb-3 text-slate-400" />
                <p className="text-sm">Queue is empty!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {queue.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedConsult(item);
                      setEditPrescription(item.llm_prescription);
                    }}
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
                          <p className="font-semibold text-sm">{item.patient_name}</p>
                          <p className="text-xs text-slate-500">{new Date(item.created_at).toLocaleTimeString()}</p>
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
                    <h3 className="text-xl font-bold">{selectedConsult.patient_name}'s Assessment</h3>
                    <p className="text-sm text-slate-500">{selectedConsult.patient_email}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedConsult(null)}
                    className="p-2 rounded-full hover:bg-slate-800"
                  >
                    <XCircle size={24} className="text-slate-500" />
                  </button>
                </div>

                {/* Assessment Summary */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
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
                   <h4 className="font-semibold text-sm mb-3">Symptom Details</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedConsult.report.responseDetails?.slice(0, 6).map((r, i) => (
                        <div key={i} className={`p-2 rounded-lg border text-xs ${isDark ? 'border-slate-800 bg-slate-950/50' : 'bg-white'}`}>
                          <p className="font-semibold line-clamp-1">{r.questionText}</p>
                          <p className="text-blue-500">{r.selectedOptionText}</p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Prescription Area */}
                <div className="space-y-4 border-t pt-6 border-slate-700">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Edit3 size={18} className="text-blue-500" />
                      Prescription & Recommendation
                    </h4>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Generated by LLM</span>
                  </div>
                  
                  <textarea
                    value={editPrescription}
                    onChange={(e) => setEditPrescription(e.target.value)}
                    rows={10}
                    className={`w-full rounded-2xl border p-4 text-sm outline-none ring-blue-500/30 focus:ring-4 transition ${
                      isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                    placeholder="Enter prescription details..."
                  />

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
              <div className={`h-full flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 text-center ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
                <div className={`h-16 w-16 mb-4 rounded-full flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-100'}`}>
                  <Activity size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold">No Consultation Selected</h3>
                <p className={`mt-2 max-w-xs text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Select a patient from the queue to view their assessment and draft a prescription.
                </p>
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
