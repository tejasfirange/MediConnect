import React, { useState } from "react";
import { Droplets, RefreshCw, AlertCircle, Info, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hydrationBg from "../../assets/hydrationbg.jpeg";

export default function HydrationApp() {
  const navigate = useNavigate();
  const [weight, setWeight] = useState("");
  const [waterGoal, setWaterGoal] = useState(null);
  const [error, setError] = useState("");

  const MAX_WATER_LIMIT = 8.0;

  const calculateHydration = () => {
    const w = parseFloat(weight);
    setError("");

    if (!w || w <= 0) {
      setError("Enter valid weight");
      setWaterGoal(null);
      return;
    }

    let result = w * 0.033;
    if (result > MAX_WATER_LIMIT) result = MAX_WATER_LIMIT;
    setWaterGoal(result.toFixed(1));
  };

  const reset = () => {
    setWeight("");
    setWaterGoal(null);
    setError("");
  };

  const fillPercentage = waterGoal ? (parseFloat(waterGoal) / MAX_WATER_LIMIT) * 100 : 0;

  return (
    <div 
      className="min-h-screen flex items-center justify-center lg:justify-end p-4 font-sans bg-cover bg-center bg-no-repeat"
      style={{ 
        // Removed the linear-gradient overlay completely for 100% clarity
        backgroundImage: `url(${hydrationBg})` 
      }}
    >
      <style>
        {`
          @keyframes waveSlow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          @keyframes waveFast { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
          @keyframes bubbleUp {
            0% { transform: translateY(100%) scale(0.5); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translateY(-80px) scale(1.2); opacity: 0; }
          }
          .animate-wave-slow { animation: waveSlow 8s linear infinite; }
          .animate-wave-fast { animation: waveFast 4s linear infinite; }
          .bubble {
            position: absolute; background: rgba(255, 255, 255, 0.4);
            border-radius: 50%; bottom: 0; animation: bubbleUp 4s infinite ease-in;
          }
        `}
      </style>

      {/* 1. Changed bg-white/95 to solid bg-white to stop background bleed-through 
          2. Removed backdrop-blur-sm
          3. Increased mr-32 to push it further right
      */}
      <div className="bg-white h-[560px] w-full max-w-[350px] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100 flex flex-col transition-all mr-0 lg:mr-32">
        
        {/* Header & Input */}
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Droplets size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Hydration</h1>
              <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">Intake Tracker</p>
            </div>
            <button 
              onClick={() => navigate('/tests')}
              className="ml-auto text-slate-300 hover:text-blue-600 transition-colors"
              title="Back to Tools"
            >
              <ArrowLeft size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 ml-1">
                Body Mass (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="70"
                className={`w-full bg-slate-50 border-2 px-4 py-3 rounded-2xl text-lg font-bold transition-all focus:outline-none 
                  ${error ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-blue-500 shadow-sm'}`}
              />
              {error && <p className="text-red-500 text-[9px] mt-1 font-bold uppercase flex items-center gap-1 ml-1"><AlertCircle size={10}/> {error}</p>}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={calculateHydration} 
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all text-sm"
              >
                Get Goal
              </button>
              <button 
                onClick={reset} 
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-400 rounded-2xl active:rotate-180 transition-all"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Wave Animation Section */}
        <div className="relative flex-grow bg-slate-50 overflow-hidden mt-2">
          {waterGoal ? (
            <div className="h-full w-full relative">
              <div 
                className="absolute bottom-0 w-full bg-blue-700 transition-all duration-1000 ease-out"
                style={{ height: `${fillPercentage}%` }}
              >
                <div className="absolute -top-12 left-0 w-[200%] h-16 animate-wave-slow opacity-30">
                  <svg className="w-full h-full fill-blue-800" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 C150,0 200,100 300,100 C400,100 450,0 600,0 C750,0 800,100 900,100 C1000,100 1050,0 1200,0 V120 H0 Z" />
                  </svg>
                </div>

                <div className="absolute inset-0 bg-blue-500">
                  <div className="bubble w-2 h-2 left-[20%] delay-0"></div>
                  <div className="bubble w-1.5 h-1.5 left-[70%] delay-700"></div>
                </div>

                <div className="absolute -top-10 left-0 w-[200%] h-16 animate-wave-fast">
                  <svg className="w-full h-full fill-blue-500" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0 C150,0 200,100 300,100 C400,100 450,0 600,0 C750,0 800,100 900,100 C1000,100 1050,0 1200,0 V120 H0 Z" />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${fillPercentage > 45 ? 'text-blue-100' : 'text-slate-400'}`}>
                  Target Intake
                </p>
                <div className="flex items-baseline gap-1">
                  <h2 className={`text-7xl font-black tracking-tighter transition-colors ${fillPercentage > 45 ? 'text-white' : 'text-slate-800'}`}>
                    {waterGoal}
                  </h2>
                  <span className={`text-2xl font-black ${fillPercentage > 45 ? 'text-white/60' : 'text-blue-600'}`}>
                    L
                  </span>
                </div>
                <div className={`mt-4 px-6 py-2 rounded-full font-black text-[10px] transition-all ${fillPercentage > 45 ? 'bg-white text-blue-600 shadow-xl' : 'bg-blue-600 text-white'}`}>
                  {Math.round(waterGoal * 4)} GLASSES DAILY
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Info size={28} className="mb-3 opacity-30" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Enter weight to<br/>calculate
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}