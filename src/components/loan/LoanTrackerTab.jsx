/**
 * src/components/loan/LoanTrackerTab.jsx
 * Avanse Education Loan Tracker starting at ₹11,00,000.
 * Tracks current balance, interest rate, EMI calculator,
 * payoff trajectory, and repayment transaction history.
 */

import { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  CheckCircle2,
  Edit2,
  Calculator,
} from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatINR, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import EmptyState from '../common/EmptyState';
import AddLoanPaymentModal from '../modals/AddLoanPaymentModal';

export default function LoanTrackerTab() {
  const { state, updateLoanDetails, deleteLoanPayment } = useFinance();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  const loan = state.loan;
  const startingPrincipal = loan.startingPrincipalINR || 1100000;
  const currentPrincipal = loan.currentPrincipalINR ?? 1100000;
  const totalRepaid = startingPrincipal - currentPrincipal;
  const percentRepaid = startingPrincipal > 0 ? (totalRepaid / startingPrincipal) * 100 : 0;

  // Settings form state
  const [interestRateInput, setInterestRateInput] = useState(loan.annualInterestRate || 11.25);
  const [emiTargetInput, setEmiTargetInput] = useState(loan.emiTargetINR || 15000);
  const [tenureInput, setTenureInput] = useState(loan.tenureMonths || 120);

  // EMI Formula Calculation
  // E = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = (loan.annualInterestRate || 11.25) / 12 / 100;
  const nMonths = loan.tenureMonths || 120;
  const calculatedStandardEMI =
    currentPrincipal > 0 && monthlyRate > 0
      ? Math.round(
          (currentPrincipal * monthlyRate * Math.pow(1 + monthlyRate, nMonths)) /
            (Math.pow(1 + monthlyRate, nMonths) - 1)
        )
      : 0;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    updateLoanDetails({
      annualInterestRate: parseFloat(interestRateInput) || 11.25,
      emiTargetINR: parseFloat(emiTargetInput) || 15000,
      tenureMonths: parseInt(tenureInput, 10) || 120,
    });
    setIsEditingSettings(false);
  };

  const payments = loan.payments || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Main Avanse Loan Balance Card */}
      <Card className="p-6 border-indigo-500/30 bg-gradient-to-br from-[#0B132B] via-[#0D193D] to-[#0B132B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white tracking-tight">{loan.name}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {loan.lender}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Principal Starting at ₹11,00,000 • Tracked in Indian Rupees (INR)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditingSettings(!isEditingSettings)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 inline mr-1" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Log Repayment</span>
            </button>
          </div>
        </div>

        {/* Quick Numbers Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs uppercase font-medium text-slate-400">Current Outstanding</p>
            <p className="text-3xl font-black font-mono text-white mt-1">
              {formatINR(currentPrincipal)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Starting: {formatINR(startingPrincipal)}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs uppercase font-medium text-slate-400">Total Repaid</p>
            <p className="text-3xl font-black font-mono text-emerald-400 mt-1">
              {formatINR(totalRepaid)}
            </p>
            <p className="text-[11px] text-emerald-400/90 font-mono mt-1">
              {percentRepaid.toFixed(1)}% of starting loan cleared
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs uppercase font-medium text-slate-400">Monthly EMI Target</p>
            <p className="text-3xl font-black font-mono text-indigo-300 mt-1">
              {formatINR(loan.emiTargetINR || 15000)}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Standard EMI calc: ~{formatINR(calculatedStandardEMI)}/mo
            </p>
          </div>
        </div>

        {/* Payoff Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">Repayment Progress</span>
            <span className="text-emerald-400 font-bold">{percentRepaid.toFixed(2)}% Completed</span>
          </div>
          <ProgressBar
            value={totalRepaid}
            max={startingPrincipal}
            colorClass="bg-gradient-to-r from-indigo-500 via-teal-400 to-emerald-400"
            height="h-3"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>₹0 Repaid</span>
            <span>Target: {formatINR(startingPrincipal)}</span>
          </div>
        </div>
      </Card>

      {/* Edit Loan Settings Drawer/Card if open */}
      {isEditingSettings && (
        <Card className="p-5 border-slate-700 bg-[#0B132B]">
          <h4 className="text-sm font-bold text-white mb-3">Adjust Avanse Loan Parameters</h4>
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Annual Interest Rate (% p.a.)
              </label>
              <input
                type="number"
                step="0.05"
                value={interestRateInput}
                onChange={(e) => setInterestRateInput(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Monthly EMI Target (INR ₹)
              </label>
              <input
                type="number"
                step="500"
                value={emiTargetInput}
                onChange={(e) => setEmiTargetInput(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Remaining Tenure (Months)
              </label>
              <input
                type="number"
                value={tenureInput}
                onChange={(e) => setTenureInput(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingSettings(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950"
              >
                Save Settings
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Grid: Loan Insights & Payment History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Amortization Insights (1 col) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Loan Insights & Breakdown</h4>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Lender:</span>
                <span className="text-white font-medium">{loan.lender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account #:</span>
                <span className="text-slate-300 font-mono">{loan.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Interest Rate:</span>
                <span className="text-emerald-400 font-mono font-semibold">
                  {loan.annualInterestRate}% p.a.
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tenure:</span>
                <span className="text-slate-300 font-mono">{loan.tenureMonths} months</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-slate-300 space-y-1.5">
              <p className="font-semibold text-indigo-300">💡 Remittance Strategy Tip:</p>
              <p className="text-[11px] leading-relaxed">
                By sending your target remittance of <strong>₹15,000 / month</strong> from Poland, you comfortably
                cover your required EMI while steadily diminishing principal interest compounding.
              </p>
            </div>
          </div>
        </Card>

        {/* Repayment History Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">Repayment History</h4>
              <p className="text-xs text-slate-400">Every EMI and remittance payment credited to Avanse</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{payments.length} payments recorded</span>
          </div>

          {payments.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No loan repayments recorded yet"
              description="Record your monthly EMI or send a remittance linked directly to this loan."
              actionText="+ Log First Payment"
              onAction={() => setIsPaymentModalOpen(true)}
            />
          ) : (
            <div className="space-y-2.5">
              {payments.map((p) => (
                <Card
                  key={p.id}
                  className="p-4 bg-[#0B132B] hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white">{p.source}</h5>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Date: {formatDate(p.date)} {p.notes && `• ${p.notes}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-base font-bold font-mono text-emerald-400">
                      {formatINR(p.amountINR)}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this payment record and restore balance?')) {
                          deleteLoanPayment(p.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete payment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AddLoanPaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />
    </div>
  );
}
