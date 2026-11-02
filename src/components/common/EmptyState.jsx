/**
 * src/components/common/EmptyState.jsx
 * Reusable empty state view when a list or category has no user records yet.
 */

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-dashed border-slate-800 bg-[#0B132B]/50 ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 mb-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h4 className="text-base font-medium text-slate-200">{title}</h4>
      {description && (
        <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">{description}</p>
      )}
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20 transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

