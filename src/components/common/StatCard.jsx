/**
 * src/components/common/StatCard.jsx
 * Reusable KPI stat card with title, formatted main figure, subtitle, icon, and optional badge.
 */

import Card from './Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-emerald-400',
  iconBg = 'bg-emerald-500/10 border-emerald-500/20',
  badgeText,
  badgeType = 'neutral', // 'neutral' | 'success' | 'warning' | 'danger'
  className = '',
  onClick,
}) {
  const badgeStyles = {
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <Card
      onClick={onClick}
      hover={Boolean(onClick)}
      className={`relative overflow-hidden flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-400 line-clamp-1">{subtitle}</span>}
        {badgeText && (
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0 ml-auto ${
              badgeStyles[badgeType] || badgeStyles.neutral
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </Card>
  );
}

