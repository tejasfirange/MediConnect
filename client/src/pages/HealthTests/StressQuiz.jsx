import React, { useState } from "react";
import { Brain, ArrowRight, RefreshCcw, ShieldAlert, Zap, Info, Thermometer, Activity, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import stressBg from "../../assets/stressbg.jpeg";

export default function StressQuiz() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { text: "How often have you felt unable to control important things in your life?", points: [0, 1, 2, 3] },
    { text: "How often have you felt nervous or 'stressed'?", points: [0, 1, 2, 3] },
    { text: "How often have you felt confident about your ability to handle problems?", points: [3, 2, 1, 0] },
    { text: "How often have you felt that things were going your way?", points: [3, 2, 1, 0] },
    { text: "How often have you felt difficulties were piling up too high to overcome?", points: [0, 1, 2, 3] },
  ];

  const options = ["Never", "Rarely", "Often", "Always"];

  const handleAnswer = (point) => {
    const nextScore = totalScore + point;
    if (currentStep < questions.length - 1) {
      setTotalScore(nextScore);
      setCurrentStep(currentStep + 1);
    } else {
      setTotalScore(nextScore);
      setShowResult(true);
    }
  };

  const getStressData = () => {
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;
    if (percentage < 35) return { 
      label: "Balanced", color: "text-emerald-500", bar: "bg-emerald-500", 
      impact: "Vagus Nerve Activity: Optimal", 
      desc: "Your parasympathetic nervous system is successfully buffering daily pressures." 
    };
    if (percentage < 70) return { 
      label: "Elevated", color: "text-amber-500", bar: "bg-amber-500", 
      impact: "Cortisol Levels: Fluctuating", 
      desc: "You are in a state of 'Adaptive Stress'. Long-term exposure may lead to fatigue." 
    };
    return { 
      label: "Critical", color: "text-rose-500", bar: "bg-rose-500", 
      impact: "Adrenal Response: High Alert", 
      desc: "Your body is likely in a 'Fight or Flight' loop. Immediate recovery is required." 
    };
  };

  const data = getStressData();

  return (
    <div 
      className="min-h-screen flex items-center justify-center lg:justify-start p-4 font-sans bg-cover bg-center bg-no-repeat transition-all duration-700" 
      style={{ backgroundImage: `url(${stressBg})` }}
    >
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-[400px] h-[600px] rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 flex flex-col relative ml-0 lg:ml-32 animate-in slide-in-from-left-10 duration-700">
        
        {/* Progress Header */}
        {!showResult && (
          <div className="h-1.5 w-full bg-slate-100 flex">
            {questions.map((_, i) => (
              <div 
                key={i} 
                className={`h-full flex-1 transition-colors duration-500 ${i <= currentStep ? 'bg-indigo-600' : 'bg-transparent'}`} 
              />
            ))}
          </div>
        )}

        {/* Header Section */}
        <div className="p-8 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-xl shadow-indigo-100">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">StressCheck</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Neuro-Diagnostic</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/tests')}
              className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"
              title="Back to Tools"
            >
              <ArrowLeft size={20} />
            </button>
            {showResult && (
              <button onClick={() => {setCurrentStep(0); setTotalScore(0); setShowResult(false);}} className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                <RefreshCcw size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Diagnostic Area */}
        <div className="p-8 pt-2 flex-grow flex flex-col justify-center">
          {!showResult ? (
            <div className="animate-in fade-in duration-500">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">Phase {currentStep + 1} of 5</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-8 leading-tight tracking-tight min-h-[4rem]">
                {questions[currentStep].text}
              </h2>
              <div className="space-y-3">
                {options.map((opt, idx) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(questions[currentStep].points[idx])}
                    className="w-full py-4 px-6 rounded-2xl border-2 border-slate-50 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 font-bold text-sm text-left transition-all active:scale-[0.97] group flex justify-between items-center"
                  >
                    {opt}
                    <ArrowRight size={16} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="relative w-36 h-36 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-[12px] border-slate-100" />
                <div 
                  className={`absolute inset-0 rounded-full border-[12px] ${data.bar} transition-all duration-1000 ease-out`}
                  style={{ clipPath: `inset(${(100 - (totalScore/15)*100)}% 0 0 0)` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Thermometer size={40} className={data.color} />
                </div>
              </div>

              <h2 className={`text-4xl font-black uppercase tracking-tighter ${data.color}`}>{data.label}</h2>
              
              <div className="mt-8 space-y-4 text-left">
                <div className="bg-slate-50 rounded-[1.5rem] p-5 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Biological Observation</p>
                  <p className="text-base font-bold text-slate-800 leading-snug">{data.impact}</p>
                </div>
                
                <p className="text-xs text-slate-500 font-medium px-4 leading-relaxed italic text-center">
                  "{data.desc}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-900 p-5 flex items-center justify-center gap-3 mt-auto">
            <Zap size={14} className="text-amber-400" fill="currentColor" />
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">HPA-Axis Metric Calibrated</span>
        </div>
      </div>
    </div>
  );
}