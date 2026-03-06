import React, { useState, useEffect, useRef } from "react";
import { Wind, Play, Square, Trophy, Info, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import lungBg from "../../assets/lungsbg.jpeg";

export default function LungTest() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  const startTest = () => {
    setIsActive(true);
    setResult(null);
    setSeconds(0);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopTest = () => {
    clearInterval(timerRef.current);
    setIsActive(false);
    
    if (seconds < 20) setResult("Average");
    else if (seconds < 40) setResult("Good");
    else if (seconds < 60) setResult("Strong");
    else setResult("Elite");
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <div 
      className="min-h-screen bg-slate-50 flex items-center justify-start p-4 bg-cover bg-center transition-all duration-700" 
      style={{ backgroundImage: `url(${lungBg})` }}
    >
      {/* ADJUSTMENT: 
          Changed 'md:ml-20' to 'md:ml-40' to move the block slightly more to the right.
          Added 'shadow-[0_20px_50px_rgba(0,0,0,0.15)]' for deeper contrast against the BG.
      */}
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-sm rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-slate-100 p-8 flex flex-col items-center ml-0 md:ml-40 animate-in slide-in-from-left-10 duration-700">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className={`p-4 rounded-2xl transition-all duration-500 ${isActive ? 'bg-cyan-100 text-cyan-600 scale-105 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
            <Wind size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">Lung Capacity</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1 text-center">Respiratory Stamina</p>
          <button 
            onClick={() => navigate('/tests')}
            className="absolute top-8 left-8 text-slate-300 hover:text-cyan-600 transition-colors"
            title="Back to Tools"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        {/* Circular Timer */}
        <div className="relative flex items-center justify-center mb-8">
          <svg className="w-44 h-44 transform -rotate-90">
            <circle
              cx="88" cy="88" r="70"
              stroke="currentColor" strokeWidth="10"
              fill="transparent" className="text-slate-50"
            />
            <circle
              cx="88" cy="88" r="70"
              stroke="currentColor" strokeWidth="10"
              fill="transparent"
              strokeDasharray="440"
              style={{ 
                strokeDashoffset: 440 - (440 * Math.min(seconds, 60)) / 60, 
                transition: 'stroke-dashoffset 1s linear' 
              }}
              className="text-cyan-500 stroke-round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-slate-800 leading-none">{seconds}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Seconds</span>
          </div>
        </div>

        {/* Status / Result Area */}
        <div className="w-full mb-6 min-h-[40px] flex items-center justify-center">
          {isActive ? (
            <p className="text-cyan-600 font-black text-sm animate-bounce tracking-widest uppercase">Don't Breathe...</p>
          ) : result ? (
            <div className="bg-emerald-50 px-6 py-3 rounded-2xl flex items-center gap-3 border border-emerald-100 animate-in zoom-in">
              <Trophy className="text-emerald-600" size={20} />
              <p className="text-base font-black text-emerald-900">{result} Lungs</p>
            </div>
          ) : (
            <p className="text-slate-400 text-xs text-center px-6 leading-relaxed">
              Hold your breath after a deep inhale, <br/>then press <b>Start Test</b>.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full">
          {!isActive ? (
            <button
              onClick={startTest}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-100 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            >
              <Play size={18} fill="currentColor" /> START TEST
            </button>
          ) : (
            <button
              onClick={stopTest}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-100 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            >
              <Square size={18} fill="currentColor" /> STOP NOW
            </button>
          )}
        </div>

        <div className="mt-6 flex items-center gap-1.5 text-slate-300">
          <Info size={12} />
          <p className="text-[9px] font-bold uppercase tracking-widest tracking-tighter">Diagnostic calibration complete</p>
        </div>
      </div>
    </div>
  );
}