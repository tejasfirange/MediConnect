import React, { useEffect, useState } from 'react';
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

const riskColors = {
  low: { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.15)' },
  moderate: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.15)' },
  high: { primary: '#f97316', glow: 'rgba(249, 115, 22, 0.15)' },
  critical: { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.15)' },
};

function RiskMeter({ riskLevel = 'low', totalScore = 0 }) {
  const { isDark } = useTheme();
  const risk = getRiskMeta(riskLevel);
  const score = clampScore(totalScore);
  const riskKey = (riskLevel || 'low').toLowerCase();
  const colors = riskColors[riskKey] || riskColors.low;

  // Animate needle on mount
  const [animatedAngle, setAnimatedAngle] = useState(180);
  const targetAngle = 180 - score * 1.8;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedAngle(targetAngle), 100);
    return () => clearTimeout(timeout);
  }, [targetAngle]);

  const pointerEnd = polarToCartesian(100, 100, 62, animatedAngle);

  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 ${
        isDark
          ? 'border-slate-800 bg-slate-900/80 shadow-lg shadow-black/20'
          : 'border-slate-200/80 bg-white shadow-md shadow-slate-200/60'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Risk Level Overview
          </p>
          <p className={`mt-0.5 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Based on your latest assessment
          </p>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${risk.chipClass}`}>
          {risk.label}
        </span>
      </div>

      {/* Gauge */}
      <div className="mx-auto mt-4 max-w-xs">
        <svg viewBox="0 0 200 115" className="h-auto w-full">
          <defs>
            {/* Track gradient */}
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="65%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            {/* Glow filter */}
            <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background arc (track) */}
          <path
            d={describeArc(100, 100, 80, 178, 2)}
            stroke={isDark ? '#1e293b' : '#e2e8f0'}
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />

          {/* Colored arc */}
          <path
            d={describeArc(100, 100, 80, 178, 2)}
            stroke="url(#gaugeGrad)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />

          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={pointerEnd.x}
            y2={pointerEnd.y}
            stroke={colors.primary}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#needleGlow)"
            style={{
              transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />

          {/* Center dot with glow */}
          <circle cx="100" cy="100" r="8" fill={colors.glow} />
          <circle cx="100" cy="100" r="5" fill={colors.primary} />

          {/* Score text */}
          <text
            x="100"
            y="78"
            textAnchor="middle"
            className={isDark ? 'fill-slate-100' : 'fill-slate-900'}
            fontSize="22"
            fontWeight="800"
          >
            {score}
          </text>
          <text
            x="100"
            y="93"
            textAnchor="middle"
            className={isDark ? 'fill-slate-500' : 'fill-slate-400'}
            fontSize="9"
            fontWeight="500"
            letterSpacing="0.5"
          >
            out of 100
          </text>
        </svg>

        {/* Scale markers below the gauge */}
        <div className="mx-4 -mt-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-500">0</span>
          <span className="text-xs font-semibold text-red-500">100</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-5">
        {[
          { label: 'Low', range: '0–25', color: '#10b981' },
          { label: 'Moderate', range: '26–50', color: '#f59e0b' },
          { label: 'High', range: '51–75', color: '#f97316' },
          { label: 'Critical', range: '76–100', color: '#ef4444' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RiskMeter;
