/**
 * src/components/layout/Sidebar.jsx
 * Desktop sidebar navigation with links to all feature modules, live loan badge, and data controls.
 */

import { GraduationCap, Download, RotateCcw } from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatINR } from '../../utils/formatters';
import { NAV_ITEMS } from '../../utils/navigation';

export default function Sidebar() {
  const { activeTab, setActiveTab, state, resetToDefaultBudget, exportData } = useFinance();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#0B132B] border-r border-slate-800/80 min-h-screen p-4 sticky top-0 h-screen select-none">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 px-3 py-3 mb-4 border-b border-slate-800/80">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-black text-xl">
          M
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-white text-lg tracking-tight">MyMoney</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">PLN & INR Finance Manager</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-emerald-400 scale-110' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-md font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Mini Loan Status Preview */}
      <div className="my-3 p-3 rounded-xl bg-[#070D1E]/80 border border-slate-800 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1 text-[11px] font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            Avanse Loan
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">Active</span>
        </div>
        <p className="text-sm font-bold text-white font-mono">
          {formatINR(state.loan.currentPrincipalINR)}
        </p>
        <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
          <div
            className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  ((state.loan.startingPrincipalINR - state.loan.currentPrincipalINR) /
                    state.loan.startingPrincipalINR) *
                    100
                )
              )}%`,
            }}
          />
        </div>
        <p className="text-[10px] text-slate-500 flex justify-between">
          <span>Target: {formatINR(state.loan.startingPrincipalINR)}</span>
          <span className="text-emerald-400">
            {Math.round(
              ((state.loan.startingPrincipalINR - state.loan.currentPrincipalINR) /
                state.loan.startingPrincipalINR) *
                100
            )}
            % Paid
          </span>
        </p>
      </div>

      {/* Bottom Utility Actions */}
      <div className="pt-2 border-t border-slate-800 space-y-1">
        <button
          type="button"
          onClick={exportData}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors"
          title="Download JSON backup"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Backup JSON</span>
        </button>

        <button
          type="button"
          onClick={resetToDefaultBudget}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Reset to default initial numbers"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to Defaults</span>
        </button>
      </div>
    </aside>
  );
}
