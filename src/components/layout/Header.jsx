/**
 * src/components/layout/Header.jsx
 * Responsive top application header with view title, month picker, quick stats, and quick add button.
 */

import { Plus, Calendar, Wallet, ArrowRightLeft } from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatPLN } from '../../utils/formatters';

const TAB_TITLES = {
  overview: { title: 'Financial Overview', desc: 'Summary of budget, remittance & loan' },
  budget: { title: 'PLN Monthly Budget', desc: 'Allocation and category limits' },
  expenses: { title: 'Expense Tracker', desc: 'Real transaction records and logs' },
  remittance: { title: 'PLN → INR Remittance', desc: 'Transfer tracker & ₹10k–₹15k monthly goal' },
  savings: { title: 'Savings Tracker', desc: 'Emergency buffer & milestone funds' },
  loan: { title: 'Avanse Education Loan', desc: '₹11,00,000 student loan payoff plan' },
  wishlist: { title: 'Wishlist Manager', desc: 'Planned purchases & goals in PLN' },
  reports: { title: 'Spending Charts & Reports', desc: 'Visual analytics and category breakdowns' },
};

export default function Header() {
  const {
    activeTab,
    selectedMonth,
    setSelectedMonth,
    setIsQuickAddOpen,
    setQuickAddType,
    totalBudgetedPLN,
    totalMonthlySpentPLN,
  } = useFinance();

  const currentInfo = TAB_TITLES[activeTab] || { title: 'Dashboard', desc: 'MyMoney Personal Finance' };

  return (
    <header className="sticky top-0 z-30 bg-[#070D1E]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Title & Description */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {currentInfo.title}
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Local
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block mt-0.5">{currentInfo.desc}</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Month Selector */}
          <div className="relative flex items-center bg-[#0B132B] border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 mr-1.5 shrink-0" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer text-xs"
              title="Filter records by month"
            />
          </div>

          {/* Quick Stat Pill (Budget or Loan) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B132B] border border-slate-800 text-xs text-slate-300">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Budget: <strong className="text-white font-mono">{formatPLN(totalBudgetedPLN)}</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Spent: <strong className="text-emerald-300 font-mono">{formatPLN(totalMonthlySpentPLN)}</strong></span>
          </div>

          {/* Quick Add Button */}
          <div className="flex items-center gap-1 ml-auto sm:ml-0">
            <button
              type="button"
              onClick={() => {
                setQuickAddType('expense');
                setIsQuickAddOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="font-medium">Add Expense</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setQuickAddType('transfer');
                setIsQuickAddOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-all active:scale-95"
              title="Record PLN to INR Remittance Transfer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Transfer</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
