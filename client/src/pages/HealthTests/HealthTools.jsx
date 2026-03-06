import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Brain, Droplets, Wind, Zap, 
  Dna, LayoutDashboard, Target, ArrowLeft 
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from "../../context/ThemeContext";

// Using your exact import names
import lungtest from "../../assets/lungtest.png";
import bmi from "../../assets/bmi.png";
import reaction from "../../assets/reactiontime.png";
import hydration from "../../assets/hydration.png";
import stress from "../../assets/stress.png";
import memory from "../../assets/memory.png";

export default function HealthTools() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const tools = [
    { 
      id: "bmi", 
      title: "BMI Calculator", 
      tag: "Vitals", 
      icon: <Dna size={20} />, 
      img: bmi, 
      route: "/bmi",
      desc: "Check your body mass index."
    },
    { 
      id: "lung", 
      title: "Lung Strength Test", 
      tag: "Respiratory", 
      icon: <Wind size={20} />, 
      img: lungtest, 
      route: "/lungs",
      desc: "Breathing strength test."
    },
    { 
      id: "memory", 
      title: "Memory Strength Test", 
      tag: "Cognitive", 
      icon: <Brain size={20} />, 
      img: memory, // Reusing stress asset as per your pattern
      route: "/memory",
      desc: "Evaluate your memory recall."
    },
    { 
      id: "reaction", 
      title: "Reaction Time", 
      tag: "Neural", 
      icon: <Zap size={20} />, 
      img: reaction, 
      route: "/reaction",
      desc: "Check reflex speed."
    },
    { 
      id: "hydration", 
      title: "Hydration Check", 
      tag: "Metabolic", 
      icon: <Droplets size={20} />, 
      img: hydration, 
      route: "/hydration",
      desc: "Water intake calculator."
    },
    { 
      id: "stress", 
      title: "Stress Quiz", 
      tag: "Neuro-Endocrine", 
      icon: <Target size={20} />, 
      img: stress, 
      route: "/stress",
      desc: "Mental stress level check."
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <Navbar />
      
      <main className="flex-1 p-6 md:p-12 font-sans">
        {/* Header Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-2 mb-6 px-3 py-1.5 rounded-xl text-sm font-bold transition-all ${
              isDark 
              ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' 
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100 shadow-sm'
            }`}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <LayoutDashboard size={24} />
            </div>
            <h1 className={`text-2xl font-black tracking-tighter italic uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>MediConnect</h1>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] ml-1">Quick Health Diagnostics</p>
        </div>

        {/* Grid Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool) => (
            <div 
              key={tool.id}
              onClick={() => navigate(tool.route)}
              className={`group rounded-[2rem] shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 cursor-pointer flex flex-col h-full ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
              }`}
            >
              <div className={`h-48 relative overflow-hidden flex items-center justify-center border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-100'}`}>
                <img 
                  src={tool.img} 
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md scale-110"
                />
                <img 
                  src={tool.img} 
                  alt={tool.title}
                  className="relative z-10 w-full h-full object-stretch transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {tool.tag}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-2.5">
                   <div className={`border p-2.5 rounded-xl text-blue-500 opacity-60 group-hover:opacity-100 transition-opacity ${
                     isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'
                   }`}>
                      {tool.icon}
                   </div>
                   <h3 className={`text-xl font-black tracking-tight leading-none group-hover:text-blue-500 transition-colors ${
                     isDark ? 'text-white' : 'text-slate-800'
                   }`}>
                      {tool.title}
                   </h3>
                </div>
                
                <p className={`text-xs font-medium mb-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {tool.desc}
                </p>

                <div className="mt-auto flex items-center justify-between group-hover:text-blue-500 transition-colors">
                  <span className={`text-[10px] font-black uppercase tracking-widest group-hover:text-blue-500 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Start Test
                  </span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer Label */}
        <div className={`max-w-6xl mx-auto mt-16 border-t pt-8 flex justify-center gap-2 ${isDark ? 'border-slate-800 text-slate-700' : 'border-slate-100 text-slate-300'}`}>
            <Dna size={12} className="text-blue-500/20" />
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] leading-none text-center">Biometric core calibration: Synaptic loop processing active</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
