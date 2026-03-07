import React, { useState, useRef, useEffect } from "react";
import { Zap, Timer, AlertCircle, Trophy, RotateCcw, Brain, Info, Play, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import reactionBg from "../../assets/reactionbg.png";

export default function ReactionTest() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("idle"); 
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(null);
  const [error, setError] = useState(false);
  const timeoutRef = useRef(null);

  const startTest = () => {
    setGameState("waiting");
    setError(false);
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 3000) + 2000;
    timeoutRef.current = setTimeout(() => {
      setGameState("active");
      setStartTime(Date.now());
    }, delay);
  };

  const handleAreaClick = () => {
    if (gameState === "waiting") {
      clearTimeout(timeoutRef.current);
      setError(true);
      setGameState("idle");
    } else if (gameState === "active") {
      const diff = Date.now() - startTime;
      setReactionTime(diff);
      setGameState("result");
    }
  };

  const getRank = (ms) => {
    if (ms < 200) return { label: "Superhuman", color: "text-purple-500" };
    if (ms < 280) return { label: "Fast", color: "text-emerald-500" };
    if (ms < 400) return { label: "Average", color: "text-blue-500" };
    return { label: "Slow", color: "text-slate-400" };
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center lg:justify-end p-4 bg-cover bg-center bg-no-repeat transition-all duration-700" 
      style={{ backgroundImage: `url(${reactionBg})` }}
    >
      <div className="bg-white h-[600px] w-full max-w-[380px] rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 flex flex-col relative mr-0 lg:mr-32 animate-in slide-in-from-right-10 duration-700">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="bg-amber-400 p-3 rounded-2xl text-white shadow-lg shadow-amber-100">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">NeuroSync</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reflex Lab</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/tests')}
              className="p-2 text-slate-300 hover:text-blue-500 transition-colors"
              title="Back to Tools"
            >
              <ArrowLeft size={20} />
            </button>
            <button onClick={() => {setGameState("idle"); setError(false);}} className="p-2 text-slate-300 hover:text-blue-500 transition-colors">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Interaction Pad */}
        <div className="px-8 mt-8">
          <div 
            onClick={handleAreaClick}
            className={`w-full h-52 rounded-[2.5rem] border-4 transition-all duration-300 flex flex-col items-center justify-center text-center p-8 
            ${gameState === 'idle' ? 'bg-slate-50 border-slate-100 text-slate-400 shadow-inner' : 
              gameState === 'waiting' ? 'bg-rose-50 border-rose-100 text-rose-500 cursor-wait' : 
              gameState === 'active' ? 'bg-emerald-500 border-emerald-400 text-white animate-pulse cursor-pointer' : 
              'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-200'}`}
          >
            {gameState === "idle" && <Brain size={48} className="opacity-20" />}
            {gameState === "waiting" && <Timer size={48} className="animate-spin opacity-30" />}
            {gameState === "active" && <h2 className="text-6xl font-black italic animate-bounce tracking-tighter text-white">NOW!</h2>}
            {gameState === "result" && (
              <div className="animate-in zoom-in duration-300">
                <h2 className="text-7xl font-black leading-none tracking-tighter text-white">{reactionTime}</h2>
                <p className="text-xs font-black uppercase tracking-[0.4em] mt-2 opacity-80 text-white">ms</p>
              </div>
            )}
          </div>
        </div>

        {/* Benchmarks & Instructions */}
        <div className="p-8 flex-grow flex flex-col justify-center">
          {gameState === "result" ? (
            <div className="bg-slate-50 rounded-[1.5rem] p-5 flex items-center justify-between border border-slate-100 animate-in fade-in">
              <div className="flex items-center gap-4">
                <Trophy size={24} className="text-amber-400" />
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Neural Rank</span>
              </div>
              <span className={`text-base font-black uppercase tracking-widest ${getRank(reactionTime).color}`}>
                {getRank(reactionTime).label}
              </span>
            </div>
          ) : (
            <div className="bg-blue-50/50 rounded-[1.5rem] p-5 border border-blue-100/50">
              <h3 className="text-xs font-black uppercase text-blue-600 mb-3 flex items-center gap-2 leading-none">
                <Info size={14} /> Diagnostic Protocol
              </h3>
              <ul className="text-xs text-slate-500 font-medium space-y-2 list-disc pl-5 leading-snug">
                <li>Wait for box to turn <b>Emerald Green</b></li>
                <li>Tap as <b>fast</b> as possible on screen</li>
                <li>Avoid pre-emptive taps (False Starts)</li>
              </ul>
            </div>
          )}

          <button
            onClick={startTest}
            className={`w-full mt-8 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3
              ${gameState === 'idle' || gameState === 'result' ? 'bg-slate-900 text-white shadow-2xl shadow-slate-300' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            disabled={gameState === "waiting" || gameState === "active"}
          >
            {gameState === "result" ? "Recalibrate" : "Initiate Test"}
            <Play size={14} fill="currentColor" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-center mt-auto">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none text-center">Neural response diagnostic finalized</p>
        </div>

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-white/98 flex flex-col items-center justify-center p-8 text-center animate-in fade-in z-50">
            <AlertCircle size={64} className="text-rose-500 mb-6" />
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">FALSE START</h3>
            <p className="text-sm text-slate-400 font-bold uppercase mb-10 tracking-[0.2em]">Neural sync interrupted</p>
            <button onClick={startTest} className="bg-slate-900 text-white px-12 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Reset Sync</button>
          </div>
        )}
      </div>
    </div>
  );
}