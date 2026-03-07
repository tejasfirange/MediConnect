import { useState } from "react";
import { Activity, RotateCcw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bmiBg from "../../assets/bmibg.png";

export default function BMICalculator() {
  const navigate = useNavigate();

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  const calculateBMI = () => {

    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);

    if (h > 0 && w > 0) {

      const bmiValue = parseFloat((w / (h * h)).toFixed(1));

      setBmi(bmiValue);

      if (bmiValue < 18.5) setCategory("Underweight");
      else if (bmiValue < 24.9) setCategory("Normal weight");
      else if (bmiValue < 29.9) setCategory("Overweight");
      else setCategory("Obese");

    }
  };

  const reset = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
  };

  return (

    <div
      className="min-h-screen flex items-center justify-center lg:justify-end lg:pr-32 px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bmiBg})` }}
    >

      {/* Calculator Card */}
      <div className="bg-white/90 backdrop-blur-md p-6 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
            <Activity size={24}/>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">
              BMI Calculator
            </h1>
          </div>

          <button 
            onClick={() => navigate('/tests')}
            className="text-slate-400 hover:text-blue-600 transition-colors"
            title="Back to Tools"
          >
            <ArrowLeft size={24} />
          </button>

        </div>

        {/* Height */}
        <div className="mb-6">

          <label className="block text-slate-600 mb-2">
            Height (cm)
          </label>

          <input
            type="number"
            placeholder="e.g. 175"
            value={height}
            onChange={(e)=>setHeight(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

        {/* Weight */}
        <div className="mb-8">

          <label className="block text-slate-600 mb-2">
            Weight (kg)
          </label>

          <input
            type="number"
            placeholder="e.g. 70"
            value={weight}
            onChange={(e)=>setWeight(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            onClick={calculateBMI}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition"
          >
            Calculate
          </button>

          <button
            onClick={reset}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition"
          >
            <RotateCcw size={20}/>
          </button>

        </div>

        {/* Result */}
        {bmi && (

          <div className="mt-8 bg-slate-50 p-6 rounded-xl text-center">

            <p className="text-slate-500 text-sm uppercase tracking-wide">
              Your BMI
            </p>

            <h2 className="text-5xl font-black text-slate-800 my-2">
              {bmi}
            </h2>

            <p className="font-semibold text-blue-600">
              {category}
            </p>

          </div>

        )}

      </div>

    </div>

  );

}