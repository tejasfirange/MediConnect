export const riskMeta = {
  low: {
    label: 'Low',
    barWidth: '33%',
    barClass: 'bg-emerald-500',
    chipClass: 'bg-emerald-100 text-emerald-700',
  },
  moderate: {
    label: 'Moderate',
    barWidth: '66%',
    barClass: 'bg-amber-500',
    chipClass: 'bg-amber-100 text-amber-700',
  },
  high: {
    label: 'High',
    barWidth: '85%',
    barClass: 'bg-orange-500',
    chipClass: 'bg-orange-100 text-orange-700',
  },
  critical: {
    label: 'Critical',
    barWidth: '100%',
    barClass: 'bg-red-600',
    chipClass: 'bg-red-100 text-red-700',
  },
};

export function getRiskMeta(level) {
  return riskMeta[level] || riskMeta.low;
}
