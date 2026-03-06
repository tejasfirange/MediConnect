import React, { useState, useEffect, useRef } from "react";
import { Brain, Play, RefreshCw, Trophy, AlertCircle, Zap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import memorybg from "../../assets/memorybg.png";

export default function MemoryStrength() {
  const navigate = useNavigate();
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isDisplaying, setIsDisplaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [gameState, setGameState] = useState("idle");
  const [score, setScore] = useState(0);

  const grid = [0, 1, 2, 3];

  const startNewRound = (currentSequence = []) => {
    const nextStep = Math.floor(Math.random() * 4);
    const newSequence = [...currentSequence, nextStep];
    setSequence(newSequence);
    setUserSequence([]);
    setGameState("playing");
    playSequence(newSequence);
  };

  const playSequence = (seq) => {
    setIsDisplaying(true);
    seq.forEach((pad, index) => {
      setTimeout(() => {
        setActiveIndex(pad);
        setTimeout(() => setActiveIndex(null), 500);
        if (index === seq.length - 1) {
          setTimeout(() => setIsDisplaying(false), 600);
        }
      }, index * 800);
    });
  };

  const handlePadClick = (index) => {
    if (isDisplaying || gameState !== "playing") return;
    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (index !== sequence[newUserSequence.length - 1]) {
      setGameState("result");
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(sequence.length);
      setTimeout(() => startNewRound(sequence), 1000);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-end p-4 bg-cover bg-center bg-no-repeat transition-all duration-700" 
      style={{ backgroundImage: `url(${memorybg})` }}
    >
      {/* 1. Increased max-w to 380px for a more impactful block.
          2. Increased md:mr-48 to shift the block further left toward the center.
          3. Enhanced the shadow depth for better separation from the background.
      */}
      <div className="bg-white h-[600px] w-full max-w-[380px] rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.3)] border border-slate-100 p-10 flex flex-col items-center mr-0 md:mr-48 animate-in slide-in-from-right-10 duration-700 relative">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8 w-full border-b border-slate-50 pb-6">
          <div className="bg-purple-600 p-3.5 rounded-2xl text-white shadow-xl shadow-purple-100">
            <Brain size={28} />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black text-slate-800 leading-none tracking-tight">CogniRecall</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">Synaptic Index</p>
          </div>
          <button 
            onClick={() => navigate('/tests')}
            className="p-2 text-slate-300 hover:text-purple-600 transition-colors mr-2"
            title="Back to Tools"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-center">
            <span className="text-[10px] font-black text-slate-300 uppercase block leading-none mb-1">Streak</span>
            <span className="text-2xl font-black text-purple-600 leading-none">{score}</span>
          </div>
        </div>

        {/* Tactical Memory Grid */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          {grid.map((i) => (
            <button
              key={i}
              disabled={isDisplaying || gameState !== "playing"}
              onClick={() => handlePadClick(i)}
              className={`h-32 rounded-[2rem] transition-all duration-300 border-b-8 
                ${activeIndex === i ? 'bg-purple-600 border-purple-800 scale-95 shadow-[inset_0_4px_12px_rgba(0,0,0,0.2)]' : 
                  gameState === 'result' ? 'bg-rose-50 border-rose-200' : 
                  'bg-white border-slate-100 hover:border-purple-200 active:scale-95 shadow-md shadow-slate-100'}
                ${isDisplaying ? 'cursor-default' : 'cursor-pointer'}`}
            >
              <div className={`w-5 h-5 mx-auto rounded-full transition-colors ${activeIndex === i ? 'bg-white animate-ping' : 'bg-slate-100'}`} />
            </button>
          ))}
        </div>

        {/* Real-time Status */}
        <div className="h-16 flex items-center justify-center w-full mb-6 text-center">
          {gameState === "idle" && (
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.25em] leading-relaxed opacity-60">
              Initialize pattern<br/>recognition
            </p>
          )}
          {isDisplaying && (
            <div className="flex items-center gap-2 text-purple-600 animate-pulse">
               <Zap size={16} fill="currentColor" />
               <p className="font-black text-xs uppercase tracking-widest">Encoding Path...</p>
            </div>
          )}
          {!isDisplaying && gameState === "playing" && (
            <p className="text-emerald-500 font-black text-sm uppercase tracking-[0.3em]">Recall Active</p>
          )}
          {gameState === "result" && (
            <div className="flex flex-col items-center gap-1.5 text-rose-500 animate-in zoom-in">
              <AlertCircle size={24} />
              <p className="text-[11px] font-black uppercase tracking-widest leading-tight text-center">Neural Sync Error<br/>Sequence Failed</p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="w-full mt-auto">
          {gameState !== "playing" || isDisplaying ? (
            <button
              onClick={() => { setScore(0); startNewRound([]); }}
              disabled={isDisplaying}
              className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                ${isDisplaying ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 'bg-slate-900 text-white shadow-2xl active:scale-95 hover:bg-indigo-950'}`}
            >
              {gameState === "result" ? <RefreshCw size={18} /> : <Play size={18} fill="currentColor" />}
              {gameState === "result" ? "Recalibrate" : "Begin Analysis"}
            </button>
          ) : (
             <div className="h-[68px]" />
          )}
        </div>
      </div>
    </div>
  );
}