/**
 * src/components/savings/SavingsTab.jsx
 * Savings Tracker module.
 * Tracks monthly 500 PLN savings allocation from the budget,
 * dedicated milestone targets (Emergency, Travel, etc.), and contribution logs.
 */

import { useState } from 'react';
import {
  PiggyBank,
  Plus,
  Trash2,
  Target,
} from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatPLN, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import Modal from '../common/Modal';

export default function SavingsTab() {
  const {
    state,
    totalSavingsProgressPLN,
    addSavingsGoal,
    contributeToSavingsGoal,
    deleteSavingsGoal,
  } = useFinance();

  // Create Goal Modal
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetPLN, setTargetPLN] = useState('');
  const [currentPLN, setCurrentPLN] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Emergency');

  // Quick Deposit prompt modal
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('100');

  // Find monthly savings allocation from budget categories (default 500 PLN)
  const savingsBudgetCat = state.budgetCategories.find((c) => c.id === 'cat-savings');
  const monthlySavingsAllocated = savingsBudgetCat?.allocatedPLN || 500;

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!goalName.trim() || !targetPLN || Number(targetPLN) <= 0) {
      alert('Please enter a goal name and valid target amount.');
      return;
    }

    addSavingsGoal({
      name: goalName.trim(),
      targetPLN: parseFloat(targetPLN),
      currentPLN: parseFloat(currentPLN) || 0,
      targetDate,
      category,
      color: '#10B981',
    });

    setGoalName('');
    setTargetPLN('');
    setCurrentPLN('');
    setIsNewGoalModalOpen(false);
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (!isNaN(val) && val > 0 && depositGoalId) {
      contributeToSavingsGoal(depositGoalId, val);
      setDepositGoalId(null);
      setDepositAmount('100');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-emerald-500/25 bg-gradient-to-br from-[#0B132B] to-[#0D223F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-medium text-slate-400">Total Saved Across Goals</p>
              <h3 className="text-3xl font-black font-mono text-emerald-400 mt-1">
                {formatPLN(totalSavingsProgressPLN)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PiggyBank className="w-6 h-6" />
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3">
            Accumulated personal safety buffer in Poland
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-medium text-slate-400">Monthly Budget Savings</p>
              <h3 className="text-3xl font-black font-mono text-white mt-1">
                {formatPLN(monthlySavingsAllocated)} / mo
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Configured in your monthly PLN budget allocations
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase font-medium text-slate-400">Milestone Tracker</p>
            <p className="text-xs text-slate-300 mt-1">
              Active Goals: <strong className="text-white font-mono">{state.savingsGoals.length}</strong>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNewGoalModalOpen(true)}
            className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create New Goal</span>
          </button>
        </Card>
      </div>

      {/* Savings Goals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Active Savings Envelopes</h3>
            <p className="text-xs text-slate-400">Target milestones for emergencies, travel, and personal security</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.savingsGoals.map((goal) => {
            const remaining = Math.max(0, goal.targetPLN - goal.currentPLN);

            return (
              <Card key={goal.id} className="p-5 bg-[#0B132B] flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: `${goal.color}25`, border: `1px solid ${goal.color}50` }}
                      >
                        <PiggyBank className="w-5 h-5" style={{ color: goal.color }} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{goal.name}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {goal.category}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete savings goal "${goal.name}"?`)) {
                          deleteSavingsGoal(goal.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-400">Saved</span>
                      <p className="text-2xl font-bold font-mono text-emerald-400 mt-0.5">
                        {formatPLN(goal.currentPLN)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400">Target</span>
                      <p className="text-lg font-bold font-mono text-white mt-0.5">
                        {formatPLN(goal.targetPLN)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <ProgressBar
                      value={goal.currentPLN}
                      max={goal.targetPLN}
                      colorClass="bg-gradient-to-r from-emerald-500 to-teal-400"
                      height="h-2.5"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    {goal.targetDate ? `Target: ${formatDate(goal.targetDate)}` : `${remaining > 0 ? `${formatPLN(remaining)} remaining` : 'Goal achieved!'}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDepositGoalId(goal.id)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors"
                  >
                    + Add Funds
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={Boolean(depositGoalId)}
        onClose={() => setDepositGoalId(null)}
        title="Add Funds to Savings Goal"
        subtitle="Deposit money towards your milestone envelope"
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Deposit Amount (PLN) *
            </label>
            <input
              type="number"
              step="10"
              min="1"
              required
              autoFocus
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDepositGoalId(null)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950"
            >
              Deposit PLN
            </button>
          </div>
        </form>
      </Modal>

      {/* Create New Goal Modal */}
      <Modal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
        title="Create Savings Milestone"
        subtitle="Set a dedicated envelope for a future financial objective"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Goal Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="e.g. Vacation in Zakopane, Emergency 6-month buffer"
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Amount (PLN) *
              </label>
              <input
                type="number"
                step="50"
                min="10"
                required
                value={targetPLN}
                onChange={(e) => setTargetPLN(e.target.value)}
                placeholder="e.g. 2500"
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Initial Saved (PLN)
              </label>
              <input
                type="number"
                step="50"
                min="0"
                value={currentPLN}
                onChange={(e) => setCurrentPLN(e.target.value)}
                placeholder="e.g. 0"
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Emergency">Emergency Fund</option>
                <option value="Travel">Travel & Flights</option>
                <option value="Education">Education & Courses</option>
                <option value="Gadgets">Tech / Electronics</option>
                <option value="Personal">Personal Milestone</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewGoalModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950"
            >
              Save Goal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
