import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  ChevronRight,
  FileText,
  AlertCircle,
  Download
} from 'lucide-react';
import PrescriptionTemplate from '../../components/PrescriptionTemplate';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './Dashboard.css';

function MyConsultations() {
  const { isDark } = useTheme();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsult, setSelectedConsult] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultations/my-consultations');
      setConsultations(response.data);
    } catch (err) {
      console.error('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
      case 'edited':
        return <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full text-[10px] font-bold uppercase"><CheckCircle2 size={12}/> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-full text-[10px] font-bold uppercase"><XCircle size={12}/> Rejected</span>;
      default:
        return <span className="flex items-center gap-1 text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full text-[10px] font-bold uppercase"><Clock size={12}/> Pending Review</span>;
    }
  };
  
  const cleanPrescription = (text) => {
    if (!text) return '';
    return text
      .replace(/^#*.*AI-Generated Draft.*$/gim, '')
      .replace(/^#*.*For doctor review and approval only.*$/gim, '')
      .trim();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className={`dashboard-page min-h-screen flex flex-col overflow-x-hidden ${isDark ? 'dashboard-page--dark bg-slate-950 text-slate-100' : 'dashboard-page--light bg-slate-50 text-slate-900'}`}>
      <div className="dashboard-orb dashboard-orb--blue"></div>
      <div className="dashboard-orb dashboard-orb--sky"></div>
      <Navbar />
      
      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8 flex-1">
        <header className="dashboard-hero mb-6 md:mb-8">
          <h1 className="dashboard-hero__greeting text-2xl md:text-3xl font-bold">My Consultations</h1>
          <p className={`dashboard-hero__sub text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Track the status of your sent assessments and view prescriptions.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : consultations.length === 0 ? (
          <div className={`rounded-3xl border border-dashed p-20 text-center ${isDark ? 'border-slate-800' : 'border-slate-300'}`}>
            <FileText size={48} className="mx-auto mb-4 text-slate-400 opacity-20" />
            <h3 className="text-xl font-semibold">No consultations found</h3>
            <p className="mt-2 text-slate-500">You haven't sent any assessments to a doctor yet.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {consultations.map((c) => {
              const isExpanded = selectedConsult?.id === c.id;
              return (
                <div 
                  key={c.id}
                  className={`prescription-card rounded-3xl border transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? (isDark ? 'border-blue-500/50 bg-slate-900 shadow-2xl shadow-blue-500/10' : 'border-blue-300 bg-white shadow-xl') 
                      : (isDark ? 'border-slate-800 bg-slate-900/50 glass-panel' : 'border-slate-200 bg-white shadow-sm ring-1 ring-slate-100')
                  }`}
                >
                  {/* Card Header (Toggle Area) */}
                  <button
                    onClick={() => setSelectedConsult(isExpanded ? null : c)}
                    className="w-full text-left p-4 md:p-8 outline-none"
                  >
                    <div className="flex flex-row justify-between items-center gap-2 mb-4">
                      <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <div className="consultation-id-badge text-[10px] md:text-sm shrink-0">#{c.id}</div>
                        <div className="text-[10px] md:text-xs font-medium text-slate-500 truncate">
                          {new Date(c.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="scale-75 md:scale-100 origin-right shrink-0">
                        {getStatusBadge(c.status)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base md:text-xl font-bold mb-1 truncate">Consultation Request</h4>
                        <p className="text-[11px] md:text-sm text-slate-400 truncate">
                          Risk Level: <span className="capitalize text-blue-500 font-semibold">{c.risk_level}</span>
                          {c.doctor_name && <span className="hidden sm:inline ml-3">| Dr. {c.doctor_name}</span>}
                        </p>
                        {c.doctor_name && <p className="text-[10px] text-slate-500 sm:hidden mt-0.5 font-medium truncate">Assigned to Dr. {c.doctor_name}</p>}
                      </div>
                      <div className={`transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-90' : ''}`}>
                         <ChevronRight size={18} className="text-slate-400" />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[3000px] opacity-100 border-t border-slate-700/20' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                       {/* Prescription Logic */}
                       {c.status === 'rejected' ? (
                        <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex gap-4 items-center text-red-500">
                          <AlertCircle size={24} />
                          <p className="text-sm font-medium">This request was rejected by the doctor. Please seek immediate local care if symptoms persist.</p>
                        </div>
                      ) : (c.status === 'approved' || c.status === 'edited') && c.doctor_prescription ? (
                        <div className="space-y-6">
                           <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="doctor-info-bar flex-1">
                                 <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30">
                                    <FileText size={24} />
                                 </div>
                                 <div>
                                   <h4 className="font-bold">Doctor's Clinical Prescription</h4>
                                   <p className="text-xs text-slate-500 font-medium">Validated & Signed by Dr. {c.doctor_name}</p>
                                 </div>
                              </div>
                               <button 
                                 onClick={handleDownloadPDF}
                                 className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                               >
                                 <Download size={16} /> Download PDF
                               </button>
                           </div>
                           <div className={`markdown-wrapper rounded-2xl p-6 md:p-8 ${isDark ? 'text-slate-300 bg-slate-800/50' : 'text-slate-700 bg-slate-50'}`}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {cleanPrescription(c.doctor_prescription)}
                              </ReactMarkdown>
                           </div>
                        </div>
                      ) : (
                        <div className="bg-blue-500/10 border border-blue-500/20 p-10 rounded-3xl text-center space-y-4">
                           <Clock size={40} className="mx-auto text-blue-500 animate-pulse" />
                           <h4 className="text-lg font-bold">Review in Progress</h4>
                           <p className="text-sm text-slate-400 max-w-sm mx-auto">Our medical team is currently reviewing your assessment summary. We will provide a response shortly.</p>
                        </div>
                      )}

                      {/* Triage Data */}
                      <div className="pt-6 border-t border-slate-700/20">
                        <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500/60 mb-4">Patient Triage Data</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className={`p-4 rounded-xl flex justify-between items-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Initial Risk:</span>
                              <span className="font-bold flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${c.risk_level === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                <span className="capitalize">{c.risk_level}</span>
                              </span>
                           </div>
                           <div className={`p-4 rounded-xl flex justify-between items-center ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                              <span className="text-xs text-slate-500 font-medium">Submission ID:</span>
                              <span className="font-mono text-xs">MCS-00{c.id}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
      {selectedConsult && <PrescriptionTemplate consultation={selectedConsult} />}
    </div>
  );
}

export default MyConsultations;
