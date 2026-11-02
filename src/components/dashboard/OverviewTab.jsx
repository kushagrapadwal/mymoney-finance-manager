/**
 * src/components/dashboard/OverviewTab.jsx
 * Central overview dashboard showing key financial metrics:
 * PLN Monthly Budget, Remittance Goal Progress (₹10,00,000–₹15,000),
 * Avanse Education Loan Status (₹11,00,000), and Savings.
 */

import {
  Wallet,
  ArrowRightLeft,
  GraduationCap,
  PiggyBank,
} from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatPLN, formatINR } from '../../utils/formatters';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import CategoryIcon from '../common/CategoryIcon';
import EmptyState from '../common/EmptyState';

export default function OverviewTab() {
  const {
    state,
    setActiveTab,
    setIsQuickAddOpen,
    setQuickAddType,
    filteredTransactions,
    totalMonthlySpentPLN,
    totalBudgetedPLN,
    totalMonthTransferredINR,
    totalMonthTransferredPLN,
    totalSavingsProgressPLN,
  } = useFinance();

  const remainingBudgetPLN = totalBudgetedPLN - totalMonthlySpentPLN;
  const budgetUsagePercent = totalBudgetedPLN > 0 ? (totalMonthlySpentPLN / totalBudgetedPLN) * 100 : 0;

  // Remittance goal computation (₹10k–₹15k)
  const minGoalINR = state.remittanceGoal?.minINR || 10000;
  const maxGoalINR = state.remittanceGoal?.maxINR || 15000;

  // Loan computation
  const loanPaidINR = state.loan.startingPrincipalINR - state.loan.currentPrincipalINR;
  const loanPaidPercent = (loanPaidINR / state.loan.startingPrincipalINR) * 100;

  // Recent transactions (last 4)
  const recentTransactions = filteredTransactions.slice(0, 4);

  // Recent transfers (last 3)
  const recentTransfers = state.transfers.slice(0, 3);

  return (
    <div className="space-y-6 pb-12">
      {/* Top 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. PLN Monthly Budget */}
        <StatCard
          title="Monthly Budget (PLN)"
          value={formatPLN(totalBudgetedPLN)}
          subtitle={`Spent: ${formatPLN(totalMonthlySpentPLN)} (${budgetUsagePercent.toFixed(0)}%)`}
          icon={Wallet}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          badgeText={remainingBudgetPLN >= 0 ? `${formatPLN(remainingBudgetPLN)} left` : 'Over budget'}
          badgeType={remainingBudgetPLN >= 0 ? 'success' : 'danger'}
          onClick={() => setActiveTab('budget')}
        />

        {/* 2. Remittance Goal (₹10k - ₹15k) */}
        <StatCard
          title="Monthly Remittance"
          value={formatINR(totalMonthTransferredINR)}
          subtitle={`Target: ${formatINR(minGoalINR)} – ${formatINR(maxGoalINR)}`}
          icon={ArrowRightLeft}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10 border-teal-500/20"
          badgeText={
            totalMonthTransferredINR >= minGoalINR
              ? totalMonthTransferredINR >= maxGoalINR
                ? 'Goal Achieved'
                : 'Min Goal Met'
              : `${formatINR(minGoalINR - totalMonthTransferredINR)} to min`
          }
          badgeType={totalMonthTransferredINR >= minGoalINR ? 'success' : 'warning'}
          onClick={() => setActiveTab('remittance')}
        />

        {/* 3. Avanse Loan (₹11,00,000) */}
        <StatCard
          title="Avanse Education Loan"
          value={formatINR(state.loan.currentPrincipalINR)}
          subtitle={`Starting: ${formatINR(state.loan.startingPrincipalINR)}`}
          icon={GraduationCap}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10 border-indigo-500/20"
          badgeText={`${loanPaidPercent.toFixed(1)}% Repaid`}
          badgeType={loanPaidPercent > 0 ? 'success' : 'neutral'}
          onClick={() => setActiveTab('loan')}
        />

        {/* 4. Total Savings */}
        <StatCard
          title="Savings Buffer (PLN)"
          value={formatPLN(totalSavingsProgressPLN)}
          subtitle="Budgeted: 500 PLN/mo"
          icon={PiggyBank}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
          badgeText={`${state.savingsGoals.length} Goals Active`}
          badgeType="neutral"
          onClick={() => setActiveTab('savings')}
        />
      </div>

      {/* Remittance Progress Banner */}
      <Card className="border-emerald-500/30 bg-gradient-to-r from-[#0B132B] via-[#0E1B3D] to-[#0B132B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ArrowRightLeft className="w-4 h-4" />
              </span>
              <h3 className="text-base font-semibold text-white">Monthly Remittance Goal</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                ₹10k – ₹15k Target
              </span>
            </div>
            <p className="text-xs text-slate-300">
              You have remitted <strong className="text-white font-mono">{formatINR(totalMonthTransferredINR)}</strong>{' '}
              ({formatPLN(totalMonthTransferredPLN)}) this month toward India support & education loan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setQuickAddType('transfer');
                setIsQuickAddOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 shrink-0"
            >
              Record Transfer
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('remittance')}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors shrink-0"
            >
              View Tracker →
            </button>
          </div>
        </div>

        {/* Progress bar with milestones */}
        <div className="mt-4 space-y-2">
          <ProgressBar
            value={totalMonthTransferredINR}
            max={maxGoalINR}
            colorClass="bg-gradient-to-r from-teal-500 to-emerald-400"
            height="h-3"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>₹0</span>
            <span className={totalMonthTransferredINR >= minGoalINR ? 'text-emerald-400 font-semibold' : ''}>
              Min: ₹10,000 {totalMonthTransferredINR >= minGoalINR ? '✓' : ''}
            </span>
            <span className={totalMonthTransferredINR >= maxGoalINR ? 'text-emerald-400 font-semibold' : ''}>
              Max: ₹15,000 {totalMonthTransferredINR >= maxGoalINR ? '✓' : ''}
            </span>
          </div>
        </div>
      </Card>

      {/* Grid: Budget Breakdown & Avanse Loan Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Budget Categories Snapshot (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Monthly Budget Status (PLN)</h3>
              <p className="text-xs text-slate-400">Initial total: 2,570 PLN across 6 standard categories</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('budget')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Manage Budget →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {state.budgetCategories.map((cat) => {
              const spent = filteredTransactions
                .filter((tx) => tx.type === 'expense' && tx.categoryId === cat.id)
                .reduce((sum, tx) => sum + (Number(tx.amountPLN) || 0), 0);
              const percent = cat.allocatedPLN > 0 ? (spent / cat.allocatedPLN) * 100 : 0;
              const remaining = cat.allocatedPLN - spent;

              return (
                <Card key={cat.id} className="p-4 bg-[#0B132B]/90 hover:border-slate-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="p-2 rounded-xl text-white flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cat.color}25`, border: `1px solid ${cat.color}45` }}
                      >
                        <CategoryIcon name={cat.icon} className="w-4 h-4" style={{ color: cat.color }} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{cat.name}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          Spent: {formatPLN(spent)} / {formatPLN(cat.allocatedPLN)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        remaining < 0
                          ? 'bg-rose-500/20 text-rose-300'
                          : percent > 85
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {remaining < 0 ? 'Over' : `${formatPLN(remaining)} left`}
                    </span>
                  </div>

                  <div className="mt-3">
                    <ProgressBar
                      value={spent}
                      max={cat.allocatedPLN}
                      statusWarn={true}
                      height="h-1.5"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Avanse Loan Spotlight Widget (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">Loan Payoff Plan</h3>
            <button
              type="button"
              onClick={() => setActiveTab('loan')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Loan Details →
            </button>
          </div>

          <Card className="p-5 border-indigo-500/30 bg-[#0B132B] flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{state.loan.name}</h4>
                <p className="text-xs text-slate-400 font-mono">
                  {state.loan.lender} • {state.loan.annualInterestRate}% p.a.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Current Balance:</span>
                <span className="font-bold font-mono text-white text-sm">
                  {formatINR(state.loan.currentPrincipalINR)}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Initial Principal:</span>
                <span className="text-slate-300 font-mono">{formatINR(state.loan.startingPrincipalINR)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Repaid:</span>
                <span className="text-emerald-400 font-mono font-semibold">{formatINR(loanPaidINR)}</span>
              </div>
            </div>

            <ProgressBar
              value={loanPaidINR}
              max={state.loan.startingPrincipalINR}
              colorClass="bg-gradient-to-r from-indigo-500 to-emerald-400"
              height="h-2.5"
              showLabel={true}
            />

            <div className="pt-1 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setQuickAddType('loan_payment');
                  setIsQuickAddOpen(true);
                }}
                className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-center"
              >
                Log Loan Payment
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('loan')}
                className="py-2 px-3 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Plan
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">Recent Transactions (PLN)</h4>
              <p className="text-xs text-slate-400">Personal spending in Poland</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('expenses')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              View All ({state.transactions.length}) →
            </button>
          </div>

          <div className="pt-3">
            {recentTransactions.length === 0 ? (
              <EmptyState
                icon={Wallet}
                title="No transactions logged yet"
                description="Per guidelines, transactions start clean with zero invented records. Click below to add your first real spending."
                actionText="+ Add First Expense"
                onAction={() => {
                  setQuickAddType('expense');
                  setIsQuickAddOpen(true);
                }}
              />
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((tx) => {
                  const category = state.budgetCategories.find((c) => c.id === tx.categoryId);
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `${category?.color || '#10B981'}20`,
                            color: category?.color || '#10B981',
                          }}
                        >
                          <CategoryIcon name={category?.icon || 'Tag'} className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-white line-clamp-1">{tx.description}</p>
                          <p className="text-[10px] text-slate-400">
                            {tx.date} • {category?.name || 'General'} • {tx.paymentMethod}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold ${
                          tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatPLN(tx.amountPLN)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Remittances */}
        <Card className="p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">PLN → INR Remittance History</h4>
              <p className="text-xs text-slate-400">Cross-border transfers to India</p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('remittance')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              All Transfers →
            </button>
          </div>

          <div className="pt-3">
            {recentTransfers.length === 0 ? (
              <EmptyState
                icon={ArrowRightLeft}
                title="No transfers logged yet"
                description="Keep track of every remittance sent home to India, exchange rates, and monthly progress towards ₹10k–₹15k."
                actionText="+ Log First Remittance"
                onAction={() => {
                  setQuickAddType('transfer');
                  setIsQuickAddOpen(true);
                }}
              />
            ) : (
              <div className="space-y-2">
                {recentTransfers.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center shrink-0">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-white">{t.provider}</p>
                        <p className="text-[10px] text-slate-400">
                          {t.date} • Rate: ₹{t.exchangeRate} • {t.purpose}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-emerald-400">{formatINR(t.amountINR)}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{formatPLN(t.amountPLN)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
