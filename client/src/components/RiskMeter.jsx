import React from 'react';
import { getRiskMeta } from '../utils/riskColors';

function RiskMeter({ riskLevel = 'low', totalScore = 0 }) {
  const risk = getRiskMeta(riskLevel);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900">Risk Level</p>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${risk.chipClass}`}>{risk.label}</span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${risk.barClass}`} style={{ width: risk.barWidth }} />
      </div>

      <p className="mt-3 text-sm text-slate-600">Total score: {totalScore}</p>
    </div>
  );
}

export default RiskMeter;
