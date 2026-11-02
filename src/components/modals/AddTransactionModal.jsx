/**
 * src/components/modals/AddTransactionModal.jsx
 * Modal dialog for logging a real personal expense or income transaction in PLN.
 */

import { useState } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/useFinance';

export default function AddTransactionModal({ isOpen, onClose }) {
  const { state, addTransaction } = useFinance();

  const [amountPLN, setAmountPLN] = useState('');
  const [categoryId, setCategoryId] = useState(state.budgetCategories[0]?.id || 'cat-groceries');
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BLIK');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amountPLN || Number(amountPLN) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    addTransaction({
      amountPLN: parseFloat(amountPLN),
      categoryId,
      type,
      description: description.trim() || 'Expense',
      paymentMethod,
      date,
      notes: notes.trim(),
    });

    // Reset and close
    setAmountPLN('');
    setDescription('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Transaction"
      subtitle="Record real personal spending or income in PLN"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle: Expense / Income */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              type === 'expense'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              type === 'income'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Income (+)
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Amount (PLN) *
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              autoFocus
              value={amountPLN}
              onChange={(e) => setAmountPLN(e.target.value)}
              placeholder="e.g. 45.50"
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-lg focus:outline-none focus:border-emerald-500 transition-colors pl-12"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
              zł
            </span>
          </div>
        </div>

        {/* Category Selector */}
        {type === 'expense' && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Budget Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              {state.budgetCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (Budget: {cat.allocatedPLN} PLN)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Description *
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Biedronka groceries, Tram ticket, Internet bill"
            className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Date & Payment Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="BLIK">BLIK (Polish Mobile Payment)</option>
              <option value="Debit Card">Debit / Bank Card</option>
              <option value="Revolut">Revolut</option>
              <option value="Cash">Cash (Gotówka)</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Optional Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Receipt reference, items bought, or tag"
            className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/25 transition-all"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
}
