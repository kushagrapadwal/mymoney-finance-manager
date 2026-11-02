/**
 * src/components/budget/BudgetTab.jsx
 * Monthly budget management in PLN.
 * Allows viewing, editing, adding, and deleting budget category allocations,
 * and tracks budget vs actual spending for the active month.
 */

import { useState } from 'react';
import {
  PieChart,
  Plus,
  Edit2,
  Trash2,
  Check,
  Wallet,
} from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatPLN } from '../../utils/formatters';
import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import CategoryIcon from '../common/CategoryIcon';
import Modal from '../common/Modal';

export default function BudgetTab() {
  const {
    state,
    totalBudgetedPLN,
    totalMonthlySpentPLN,
    filteredTransactions,
    updateBudgetCategory,
    addBudgetCategory,
    deleteBudgetCategory,
    updateMonthlyIncome,
  } = useFinance();

  // Inline editing state: { categoryId: 'cat-rent', amount: '1500' }
  const [editingCatId, setEditingCatId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  // Add category modal state
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Tag');
  const [newCatColor, setNewCatColor] = useState('#10B981');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Income editing
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [incomeInput, setIncomeInput] = useState(state.monthlyIncomePLN || 3200);

  const startEditing = (cat) => {
    setEditingCatId(cat.id);
    setEditAmount(String(cat.allocatedPLN));
  };

  const handleSaveInline = (catId) => {
    const val = parseFloat(editAmount);
    if (!isNaN(val) && val >= 0) {
      updateBudgetCategory(catId, val);
    }
    setEditingCatId(null);
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim() || !newCatAmount || Number(newCatAmount) < 0) {
      alert('Please enter valid category name and amount.');
      return;
    }

    addBudgetCategory({
      name: newCatName.trim(),
      allocatedPLN: parseFloat(newCatAmount),
      color: newCatColor,
      icon: newCatIcon,
      description: newCatDesc.trim(),
    });

    setNewCatName('');
    setNewCatAmount('');
    setNewCatDesc('');
    setIsAddCatModalOpen(false);
  };

  const remainingIncomePLN = (state.monthlyIncomePLN || 0) - totalBudgetedPLN;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Budget Summary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budget Allocated */}
        <Card className="p-5 border-emerald-500/25 bg-gradient-to-br from-[#0B132B] to-[#0E1A38]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-medium text-slate-400">Total Monthly Budget</p>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                {formatPLN(totalBudgetedPLN)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Initial monthly baseline: 2,570 PLN across 6 standard categories
          </p>
        </Card>

        {/* Current Month Spending */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-medium text-slate-400">Actual Spent This Month</p>
              <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {formatPLN(totalMonthlySpentPLN)}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-800 text-slate-300">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Remaining unspent: <strong className="text-white font-mono">{formatPLN(totalBudgetedPLN - totalMonthlySpentPLN)}</strong>
          </p>
        </Card>

        {/* Monthly Income & Free Cash Flow Buffer */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs uppercase font-medium text-slate-400">Monthly Income Target</p>
                <button
                  type="button"
                  onClick={() => setIsEditingIncome(!isEditingIncome)}
                  className="text-slate-400 hover:text-white"
                  title="Edit Income Target"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
              {isEditingIncome ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value)}
                    className="w-24 bg-[#070D1E] border border-emerald-500 rounded px-2 py-0.5 text-sm text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateMonthlyIncome(incomeInput);
                      setIsEditingIncome(false);
                    }}
                    className="p-1 rounded bg-emerald-500 text-slate-950 text-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <h3 className="text-2xl font-bold font-mono text-white mt-1">
                  {formatPLN(state.monthlyIncomePLN || 3200)}
                </h3>
              )}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-lg border font-mono ${
                remainingIncomePLN >= 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {remainingIncomePLN >= 0 ? `+${formatPLN(remainingIncomePLN)} buffer` : 'Deficit'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Income minus budget leaves an emergency safety buffer
          </p>
        </Card>
      </div>

      {/* Categories Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Budget Categories (PLN)</h2>
          <p className="text-xs text-slate-400">
            Click the edit icon on any card to update its monthly allocation
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCatModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.budgetCategories.map((cat) => {
          // Spent in current month
          const spent = filteredTransactions
            .filter((tx) => tx.type === 'expense' && tx.categoryId === cat.id)
            .reduce((sum, tx) => sum + (Number(tx.amountPLN) || 0), 0);

          const percent = cat.allocatedPLN > 0 ? (spent / cat.allocatedPLN) * 100 : 0;
          const remaining = cat.allocatedPLN - spent;
          const isEditing = editingCatId === cat.id;

          return (
            <Card key={cat.id} className="p-5 flex flex-col justify-between space-y-4">
              <div>
                {/* Header row: Icon, Name, Actions */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl text-white flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}25`, border: `1px solid ${cat.color}50` }}
                    >
                      <CategoryIcon name={cat.icon} className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cat.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{cat.description || 'Monthly allocation'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => (isEditing ? handleSaveInline(cat.id) : startEditing(cat))}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title={isEditing ? 'Save' : 'Edit Allocation'}
                    >
                      {isEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-3.5 h-3.5" />}
                    </button>
                    {!['cat-rent', 'cat-groceries', 'cat-transport', 'cat-dining', 'cat-recharge', 'cat-savings'].includes(
                      cat.id
                    ) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete category "${cat.name}"?`)) {
                            deleteBudgetCategory(cat.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Amount / Inline edit */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Budgeted</span>
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <input
                          type="number"
                          step="10"
                          value={editAmount}
                          autoFocus
                          onChange={(e) => setEditAmount(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveInline(cat.id);
                            if (e.key === 'Escape') setEditingCatId(null);
                          }}
                          className="w-28 bg-[#070D1E] border border-emerald-500 rounded px-2 py-1 text-sm font-mono text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveInline(cat.id)}
                          className="px-2 py-1 rounded bg-emerald-500 text-slate-950 text-xs font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <p className="text-xl font-bold font-mono text-white mt-0.5">
                        {formatPLN(cat.allocatedPLN)}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Spent</span>
                    <p className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                      {formatPLN(spent)}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <ProgressBar
                    value={spent}
                    max={cat.allocatedPLN}
                    statusWarn={true}
                    height="h-2"
                  />
                </div>
              </div>

              {/* Status bottom bar */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  {percent.toFixed(0)}% used
                </span>
                <span
                  className={`font-mono font-medium ${
                    remaining < 0 ? 'text-rose-400' : 'text-slate-300'
                  }`}
                >
                  {remaining < 0 ? `Over by ${formatPLN(Math.abs(remaining))}` : `${formatPLN(remaining)} left`}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Custom Category Modal */}
      <Modal
        isOpen={isAddCatModalOpen}
        onClose={() => setIsAddCatModalOpen(false)}
        title="Add New Budget Category"
        subtitle="Create an envelope allocation in PLN"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. Gym & Sports, Books, Medical"
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Monthly Allocated Budget (PLN) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="10"
                min="0"
                required
                value={newCatAmount}
                onChange={(e) => setNewCatAmount(e.target.value)}
                placeholder="e.g. 150"
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
                PLN
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Category Icon
              </label>
              <select
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Tag">Tag / General</option>
                <option value="Home">Home / Rent</option>
                <option value="ShoppingCart">Groceries / Food</option>
                <option value="Bus">Transport / Commute</option>
                <option value="Utensils">Dining / Outings</option>
                <option value="Wifi">Internet / Tech</option>
                <option value="PiggyBank">Savings</option>
                <option value="CreditCard">Bills & Cards</option>
                <option value="Heart">Health / Wellness</option>
                <option value="Plane">Travel</option>
                <option value="BookOpen">Study / Books</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Theme Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="w-9 h-9 bg-transparent border-0 rounded cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-300">{newCatColor}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description / Notes
            </label>
            <input
              type="text"
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              placeholder="What this category is used for"
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddCatModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 transition-all"
            >
              Add Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
