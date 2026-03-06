import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { getRiskMeta } from '../utils/riskColors';

function clampScore(score) {
  const value = Number(score || 0);
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, value));
}

function polarToCartesian(cx, cy, r, angleDeg) {
  const angle = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function RiskMeter({ riskLevel = 'low', totalScore = 0 }) {
  const { isDark } = useTheme();
  const risk = getRiskMeta(riskLevel);
  const score = clampScore(totalScore);
  const pointerAngle = 180 - score * 1.8;
  const pointerEnd = polarToCartesian(100, 100, 66, pointerAngle);

  return (
    <div className={`rounded-2xl border p-5 shadow-md ${isDark ? 'border-slate-700 bg-slate-800 shadow-slate-950/30' : 'border-slate-200 bg-white shadow-blue-100/40'}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Risk Level</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${risk.chipClass}`}>{risk.label}</span>
      </div>

      <div className="mt-4">
        <svg viewBox="0 0 200 120" className="h-36 w-full">
          <path d={describeArc(100, 100, 80, 180, 120)} stroke="#10b981" strokeWidth="13" fill="none" strokeLinecap="round" />
          <path d={describeArc(100, 100, 80, 120, 60)} stroke="#f59e0b" strokeWidth="13" fill="none" strokeLinecap="round" />
          <path d={describeArc(100, 100, 80, 60, 0)} stroke="#ef4444" strokeWidth="13" fill="none" strokeLinecap="round" />

          <line
            x1="100"
            y1="100"
            x2={pointerEnd.x}
            y2={pointerEnd.y}
            stroke={isDark ? '#e2e8f0' : '#0f172a'}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill={isDark ? '#e2e8f0' : '#0f172a'} />

          <text x="100" y="88" textAnchor="middle" className={isDark ? 'fill-slate-100' : 'fill-slate-900'} fontSize="17" fontWeight="700">
            {score}
          </text>
          <text x="100" y="104" textAnchor="middle" className={isDark ? 'fill-slate-400' : 'fill-slate-500'} fontSize="10">
            out of 100
          </text>
        </svg>
      </div>

      <p className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Total score: {score}</p>
    </div>
  );
}

export default RiskMeter;
