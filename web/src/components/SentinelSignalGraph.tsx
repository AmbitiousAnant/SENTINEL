import React from 'react';

export interface SignalGraphProps {
  dataPoints?: number[];
  conformalBand?: number;
  currentScore?: number;
}

export const SentinelSignalGraph: React.FC<SignalGraphProps> = ({ 
  dataPoints = [32, 35, 30, 42, 38, 72, 68], 
  conformalBand = 7.5,
  currentScore
}) => {
  // If currentScore provided, update the last data point
  const activeData = React.useMemo(() => {
    const pts = [...dataPoints];
    if (currentScore !== undefined && pts.length > 0) {
      pts[pts.length - 1] = currentScore;
    }
    return pts;
  }, [dataPoints, currentScore]);

  const maxVal = 100;
  const width = 500;
  const height = 180;
  const dx = width / (activeData.length - 1 || 1);

  const points = activeData.map((val, idx) => {
    const x = idx * dx;
    const y = height - (Math.min(100, Math.max(0, val)) / maxVal) * height;
    return `${x},${y}`;
  }).join(' ');

  const upperBandPoints = activeData.map((val, idx) => {
    const x = idx * dx;
    const upperVal = Math.min(100, Math.max(0, val + conformalBand));
    const y = height - (upperVal / maxVal) * height;
    return `${x},${y}`;
  });

  const lowerBandPoints = [...activeData].reverse().map((val, idx) => {
    const actualIdx = activeData.length - 1 - idx;
    const x = actualIdx * dx;
    const lowerVal = Math.max(0, Math.min(100, val - conformalBand));
    const y = height - (lowerVal / maxVal) * height;
    return `${x},${y}`;
  });

  const polygonPoints = [...upperBandPoints, ...lowerBandPoints].join(' ');
  const latestValue = activeData[activeData.length - 1];

  return (
    <div className="bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-lg text-slate-100 font-sans">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-teal-400 uppercase font-mono">
            Sentinel Signal Graph · 90% Split-Conformal Band
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            Score: {latestValue.toFixed(0)}/100
          </span>
          <span className="text-[10px] bg-teal-950/80 text-teal-300 px-2 py-0.5 rounded border border-teal-800 font-mono">
            Zero-Egress Active
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 overflow-visible">
          {/* Conformal Confidence Interval Band */}
          <polygon points={polygonPoints} fill="rgba(20, 184, 166, 0.15)" stroke="rgba(20, 184, 166, 0.3)" strokeWidth="0.5" />
          
          {/* Critical Threshold Line (75 threshold) */}
          <line 
            x1="0" 
            y1={height - (75 / maxVal) * height} 
            x2={width} 
            y2={height - (75 / maxVal) * height} 
            stroke="#ef4444" 
            strokeDasharray="4 4" 
            strokeWidth="1.2" 
          />
          <text x={width - 5} y={height - (75 / maxVal) * height - 4} fill="#ef4444" fontSize="9" textAnchor="end" fontFamily="monospace">
            Critical Threshold (75)
          </text>

          {/* Elevated Threshold Line (40 threshold) */}
          <line 
            x1="0" 
            y1={height - (40 / maxVal) * height} 
            x2={width} 
            y2={height - (40 / maxVal) * height} 
            stroke="#f59e0b" 
            strokeDasharray="2 2" 
            strokeWidth="0.8" 
          />
          <text x={width - 5} y={height - (40 / maxVal) * height - 4} fill="#f59e0b" fontSize="9" textAnchor="end" fontFamily="monospace">
            Elevated (40)
          </text>

          {/* Main Distress Curve */}
          <polyline fill="none" stroke="#2dd4bf" strokeWidth="2.5" points={points} strokeLinecap="round" strokeLinejoin="round" />

          {/* Highlight data points */}
          {activeData.map((val, idx) => {
            const x = idx * dx;
            const y = height - (Math.min(100, Math.max(0, val)) / maxVal) * height;
            const isLast = idx === activeData.length - 1;
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r={isLast ? 5 : 3}
                fill={isLast ? (val >= 75 ? "#ef4444" : val >= 40 ? "#f97316" : "#2dd4bf") : "#2dd4bf"}
                stroke="#0f172a"
                strokeWidth={isLast ? 2 : 1}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono border-t border-slate-800/60 pt-1.5">
        <span>Day -6 (Baseline)</span>
        <span>Day -3 (Drift)</span>
        <span className="text-teal-300 font-bold">Today (q = ±{conformalBand})</span>
      </div>
    </div>
  );
};

export default SentinelSignalGraph;
