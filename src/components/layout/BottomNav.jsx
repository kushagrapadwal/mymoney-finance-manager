/**
 * src/components/layout/BottomNav.jsx
 * Mobile-first sticky bottom navigation bar with quick center action button and expandable menu.
 */

import { useState } from 'react';
import {
  LayoutDashboard,
  PieChart,
  Plus,
  Receipt,
  MoreHorizontal,
  ArrowRightLeft,
  PiggyBank,
  GraduationCap,
  Sparkles,
  BarChart3,
  X,
  RotateCcw,
  Download,
} from 'lucide-react';
import { useFinance } from '../../context/useFinance';

export default function BottomNav() {
  const { activeTab, setActiveTab, setIsQuickAddOpen, setQuickAddType, exportData, resetToDefaultBudget } =
    useFinance();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const mainItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget', icon: PieChart },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'remittance', label: 'Remit', icon: ArrowRightLeft },
  ];

  const moreItems = [
    { id: 'savings', label: 'Savings Tracker', desc: 'Emergency and milestone funds', icon: PiggyBank },
    { id: 'loan', label: 'Avanse Loan Tracker', desc: '₹11,00,000 student loan balance', icon: GraduationCap },
    { id: 'wishlist', label: 'Wishlist Manager', desc: 'Future planned purchases in PLN', icon: Sparkles },
    { id: 'reports', label: 'Spending Charts & Reports', desc: 'Category analytics and trends', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070D1E]/95 backdrop-blur-lg border-t border-slate-800/90 px-2 py-1.5 pb-safe shadow-2xl"
      >
        <div className="flex items-center justify-around">
          {/* First 2 items: Overview, Budget */}
          {mainItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMoreMenuOpen(false);
                }}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </button>
            );
          })}

          {/* Center Quick Action Floating Button */}
          <button
            type="button"
            onClick={() => {
              setQuickAddType('expense');
              setIsQuickAddOpen(true);
            }}
            className="flex items-center justify-center w-12 h-12 -mt-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 transition-transform active:scale-90"
            aria-label="Add new expense or transfer"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Next items: Expenses, More */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('expenses');
              setIsMoreMenuOpen(false);
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              activeTab === 'expenses' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className={`w-5 h-5 ${activeTab === 'expenses' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] font-medium mt-1">Expenses</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMoreMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              !['overview', 'budget', 'expenses'].includes(activeTab)
                ? 'text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium mt-1">More</span>
          </button>
        </div>
      </nav>

      {/* "More" Bottom Sheet Modal for Mobile */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="relative bg-[#0B132B] border-t border-slate-700 rounded-t-3xl p-5 shadow-2xl z-10 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">All Features & Tools</span>
                <span className="text-xs text-emerald-400 font-mono">MyMoney</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Link to Remittance */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('remittance');
                setIsMoreMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-left hover:border-emerald-500/40"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">PLN → INR Remittance</h4>
                  <p className="text-xs text-slate-400">Monthly goal ₹10,000–₹15,000</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-mono">Goal ₹15k</span>
            </button>

            {/* Additional Features */}
            <div className="space-y-2">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-slate-800/20 border-slate-800 text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Backup & Reset actions in mobile sheet */}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  exportData();
                  setIsMoreMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:text-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Backup</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToDefaultBudget();
                  setIsMoreMenuOpen(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
