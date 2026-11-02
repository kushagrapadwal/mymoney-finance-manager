/**
 * src/components/common/ProgressBar.jsx
 * Reusable progress indicator with custom colors and optional percentage / label.
 */

export default function ProgressBar({
  value = 0,
  max = 100,
  colorClass = 'bg-emerald-500',
  showLabel = false,
  height = 'h-2',
  className = '',
  statusWarn = false,
}) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  // Dynamic color if statusWarn is enabled (green -> amber -> rose)
  let activeColor = colorClass;
  if (statusWarn) {
    if (percentage > 95) activeColor = 'bg-rose-500';
    else if (percentage > 80) activeColor = 'bg-amber-500';
    else activeColor = 'bg-emerald-500';
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-slate-800/80 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${activeColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-slate-400 mt-1 font-mono">
          <span>{percentage.toFixed(0)}%</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}
    </div>
  );
}

