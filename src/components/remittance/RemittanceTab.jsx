/**
 * src/components/remittance/RemittanceTab.jsx
 * Manual PLN-to-INR remittance transfer tracking.
 * Features monthly remittance goal of ₹10,000–₹15,000,
 * live PLN <-> INR currency conversion estimator, and transfer history.
 */

import { useState } from 'react';
import {
  ArrowRightLeft,
  Plus,
  Trash2,
  CheckCircle2,
  GraduationCap,
  Calculator,
} from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatINR, formatPLN, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import EmptyState from '../common/EmptyState';

export default function RemittanceTab() {
  const {
    state,
    totalMonthTransferredINR,
    totalMonthTransferredPLN,
    deleteTransfer,
    setIsQuickAddOpen,
    setQuickAddType,
  } = useFinance();

  const minGoalINR = state.remittanceGoal?.minINR || 10000;
  const maxGoalINR = state.remittanceGoal?.maxINR || 15000;

  // Live currency calculator state
  const [calcPLN, setCalcPLN] = useState('600');
  const [calcRate, setCalcRate] = useState(state.remittanceGoal?.estimatedRate || 20.8);
  const calcINR = (parseFloat(calcPLN) || 0) * (parseFloat(calcRate) || 20.8);

  // Status calculation
  const isMinMet = totalMonthTransferredINR >= minGoalINR;
  const isMaxMet = totalMonthTransferredINR >= maxGoalINR;
  const neededForMin = Math.max(0, minGoalINR - totalMonthTransferredINR);
  const neededForMax = Math.max(0, maxGoalINR - totalMonthTransferredINR);

  return (
    <div className="space-y-6 pb-12">
      {/* Remittance Goal Banner Card */}
      <Card className="p-6 border-emerald-500/30 bg-gradient-to-br from-[#0B132B] via-[#0E1E42] to-[#0B132B]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <ArrowRightLeft className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Monthly Remittance Goal: ₹10,000 – ₹15,000
                </h3>
                <p className="text-xs text-slate-300">
                  Target money to remit from Poland to India for family & Avanse education loan
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setQuickAddType('transfer');
              setIsQuickAddOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-lg shadow-emerald-500/25 active:scale-95 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Record Transfer</span>
          </button>
        </div>

        {/* Goal Milestone Gauges */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-medium">Sent This Month</p>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {formatINR(totalMonthTransferredINR)}
            </p>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              ≈ {formatPLN(totalMonthTransferredPLN)}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-medium">Minimum Target (₹10,000)</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold font-mono text-white">
                {isMinMet ? 'Achieved' : formatINR(neededForMin)}
              </p>
              {isMinMet && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isMinMet ? 'Baseline remittance covered' : `${formatINR(neededForMin)} left to minimum`}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-medium">Full Target (₹15,000)</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-2xl font-bold font-mono text-white">
                {isMaxMet ? 'Achieved' : formatINR(neededForMax)}
              </p>
              {isMaxMet && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isMaxMet ? 'Upper target completed!' : `${formatINR(neededForMax)} left to ideal goal`}
            </p>
          </div>
        </div>

        {/* Multi-step progress bar */}
        <div className="mt-5 space-y-2">
          <ProgressBar
            value={totalMonthTransferredINR}
            max={maxGoalINR}
            colorClass="bg-gradient-to-r from-teal-400 via-emerald-400 to-green-300"
            height="h-3"
          />
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>₹0</span>
            <span className={isMinMet ? 'text-emerald-400 font-semibold' : ''}>
              Min Goal: ₹10,000 {isMinMet && '✓'}
            </span>
            <span className={isMaxMet ? 'text-emerald-400 font-semibold' : ''}>
              Max Goal: ₹15,000 {isMaxMet && '✓'}
            </span>
          </div>
        </div>
      </Card>

      {/* Grid: Currency Converter Tool & Transfer History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Rate & Conversion Estimator (1 col) */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">PLN ↔ INR Quick Estimator</h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Amount to Send (PLN)
              </label>
              <input
                type="number"
                value={calcPLN}
                onChange={(e) => setCalcPLN(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Estimated Rate (1 PLN = ₹ INR)
              </label>
              <input
                type="number"
                step="0.1"
                value={calcRate}
                onChange={(e) => setCalcRate(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Receiver Gets in India</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {formatINR(Math.round(calcINR))}
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {calcPLN || 0} zł @ ₹{calcRate}/zł
              </p>
            </div>
          </div>
        </Card>

        {/* Transfer History Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white tracking-tight">Remittance Transfer History</h4>
              <p className="text-xs text-slate-400">All cross-border remittances logged by you</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{state.transfers.length} total transfers</span>
          </div>

          {state.transfers.length === 0 ? (
            <EmptyState
              icon={ArrowRightLeft}
              title="No transfers logged yet"
              description="Keep track of your remittances to India with live exchange rates and loan auto-sync."
              actionText="+ Record First Transfer"
              onAction={() => {
                setQuickAddType('transfer');
                setIsQuickAddOpen(true);
              }}
            />
          ) : (
            <div className="space-y-2.5">
              {state.transfers.map((t) => (
                <Card
                  key={t.id}
                  className="p-4 bg-[#0B132B] hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{t.provider}</h4>
                        {t.linkedToLoan && (
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            <GraduationCap className="w-3 h-3" />
                            Avanse Loan Credited
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDate(t.date)} • Rate: ₹{t.exchangeRate} • Purpose: {t.purpose}
                      </p>
                      {t.notes && <p className="text-xs text-slate-500 italic mt-1">{t.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-left sm:text-right">
                      <p className="text-base font-bold font-mono text-emerald-400">{formatINR(t.amountINR)}</p>
                      <p className="text-xs text-slate-400 font-mono">
                        Sent: {formatPLN(t.amountPLN)} {t.feePLN > 0 && `(Fee: ${formatPLN(t.feePLN)})`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this remittance record?')) {
                          deleteTransfer(t.id);
                        }
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete transfer"
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
    </div>
  );
}
