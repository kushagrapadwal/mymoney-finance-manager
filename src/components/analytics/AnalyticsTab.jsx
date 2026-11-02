/**
 * src/components/analytics/AnalyticsTab.jsx
 * Visual reports and spending charts powered by Recharts.
 * Displays category distribution donut chart, Budget vs Actual spending comparison,
 * and remittance trends.
 */

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { useFinance } from '../../context/useFinance';
import { formatPLN, formatINR } from '../../utils/formatters';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import { BarChart3, PieChart as PieIcon, ArrowRightLeft } from 'lucide-react';

// Custom Dark Navy Tooltip for Recharts declared outside of render
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B132B] border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1">
        <p className="font-bold text-white mb-1">{label || payload[0].name}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.fill }}>
            {entry.name}:{' '}
            <strong className="font-mono">
              {entry.name.includes('inr') || entry.name.includes('INR')
                ? formatINR(entry.value)
                : formatPLN(entry.value)}
            </strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function AnalyticsTab() {
  const { state, filteredTransactions, totalBudgetedPLN, totalMonthlySpentPLN } = useFinance();

  // Prepare Category Spending Data for Donut Chart
  const categorySpendingData = state.budgetCategories.map((cat) => {
    const spent = filteredTransactions
      .filter((tx) => tx.type === 'expense' && tx.categoryId === cat.id)
      .reduce((sum, tx) => sum + (Number(tx.amountPLN) || 0), 0);
    return {
      name: cat.name,
      value: spent,
      budget: cat.allocatedPLN,
      color: cat.color,
    };
  });

  const activeSpendingData = categorySpendingData.filter((c) => c.value > 0);

  // Budget vs Actual Comparison Data
  const budgetVsActualData = state.budgetCategories.map((cat) => {
    const spent = filteredTransactions
      .filter((tx) => tx.type === 'expense' && tx.categoryId === cat.id)
      .reduce((sum, tx) => sum + (Number(tx.amountPLN) || 0), 0);
    return {
      category: cat.name,
      Budgeted: cat.allocatedPLN,
      Spent: spent,
    };
  });

  // Remittance by month data
  const remittanceByMonthMap = {};
  state.transfers.forEach((t) => {
    const monthKey = t.date.substring(0, 7); // "YYYY-MM"
    if (!remittanceByMonthMap[monthKey]) {
      remittanceByMonthMap[monthKey] = { month: monthKey, inr: 0, pln: 0 };
    }
    remittanceByMonthMap[monthKey].inr += t.amountINR;
    remittanceByMonthMap[monthKey].pln += t.amountPLN;
  });
  const remittanceTrendsData = Object.values(remittanceByMonthMap).sort((a, b) =>
    a.month.localeCompare(b.month)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Total Monthly Allocation</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">{formatPLN(totalBudgetedPLN)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Planned ceiling across all categories</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Actual Real Spending</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {formatPLN(totalMonthlySpentPLN)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {totalBudgetedPLN > 0
              ? `${((totalMonthlySpentPLN / totalBudgetedPLN) * 100).toFixed(1)}% of budget utilized`
              : 'No budget set'}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Remaining Budget Buffer</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">
            {formatPLN(Math.max(0, totalBudgetedPLN - totalMonthlySpentPLN))}
          </p>
          <p className="text-[11px] text-emerald-400 font-mono mt-1">Safe financial headroom</p>
        </Card>
      </div>

      {/* Grid: Donut Chart & Budget Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Spending Donut Chart */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">Expense Distribution by Category</h4>
              <p className="text-xs text-slate-400">Where your money goes in Poland</p>
            </div>
            <PieIcon className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="py-4 h-72 w-full flex items-center justify-center">
            {activeSpendingData.length === 0 ? (
              <EmptyState
                icon={PieIcon}
                title="No expenses logged for this month"
                description="Once you log transactions, a live visual breakdown will render here."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activeSpendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {activeSpendingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#10B981'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Category Legends */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {state.budgetCategories.map((cat) => {
              const spent = filteredTransactions
                .filter((tx) => tx.type === 'expense' && tx.categoryId === cat.id)
                .reduce((sum, tx) => sum + (Number(tx.amountPLN) || 0), 0);
              return (
                <div key={cat.id} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-slate-300 truncate">{cat.name}:</span>
                  <span className="font-mono text-slate-400 shrink-0">{formatPLN(spent)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Budgeted vs Actual Bar Chart */}
        <Card className="p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-sm font-bold text-white">Budget vs. Actual Spending (PLN)</h4>
              <p className="text-xs text-slate-400">Compare allocated limits against real expenses</p>
            </div>
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>

          <div className="py-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetVsActualData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="category"
                  stroke="#64748B"
                  fontSize={10}
                  tickLine={false}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                  iconType="circle"
                />
                <Bar dataKey="Budgeted" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 text-center">
            Emerald represents actual expenses incurred, while Indigo represents planned budget.
          </p>
        </Card>
      </div>

      {/* Remittance History Timeline Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h4 className="text-sm font-bold text-white">Remittance Trajectory (INR Sent Home)</h4>
            <p className="text-xs text-slate-400">Monthly cross-border transfers against ₹10,000–₹15,000 target</p>
          </div>
          <ArrowRightLeft className="w-5 h-5 text-teal-400" />
        </div>

        <div className="py-4 h-64 w-full">
          {remittanceTrendsData.length === 0 ? (
            <EmptyState
              icon={ArrowRightLeft}
              title="No remittances recorded across months"
              description="Record your transfers in the Remittance tab to visualize your trajectory here."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={remittanceTrendsData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="inr" name="INR Sent" fill="#14B8A6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
