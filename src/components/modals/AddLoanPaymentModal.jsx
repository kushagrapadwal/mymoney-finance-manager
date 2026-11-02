/**
 * src/components/modals/AddLoanPaymentModal.jsx
 * Modal dialog for manually logging an EMI or lump-sum payment towards the Avanse education loan.
 */

import { useState } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/useFinance';
import { formatINR } from '../../utils/formatters';

export default function AddLoanPaymentModal({ isOpen, onClose }) {
  const { addLoanPayment, state } = useFinance();

  const [amountINR, setAmountINR] = useState(state.loan.emiTargetINR || '15000');
  const [source, setSource] = useState('Remittance from Poland (Wise)');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(amountINR);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid repayment amount in INR.');
      return;
    }

    addLoanPayment({
      amountINR: amount,
      source,
      date,
      notes: notes.trim(),
    });

    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Loan Payment"
      subtitle={`Repay Avanse Education Loan (Current: ${formatINR(state.loan.currentPrincipalINR)})`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Payment Amount (INR ₹) *
          </label>
          <div className="relative">
            <input
              type="number"
              step="100"
              min="1"
              required
              autoFocus
              value={amountINR}
              onChange={(e) => setAmountINR(e.target.value)}
              placeholder="e.g. 15000"
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-base focus:outline-none focus:border-emerald-500 pl-10"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400 font-mono text-sm">
              ₹
            </span>
          </div>
          {amountINR && (
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              In Words: {formatINR(amountINR)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Payment Method / Source
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="Remittance from Poland (Wise)">Remittance from Poland (Wise)</option>
            <option value="Remittance from Poland (Remitly)">Remittance from Poland (Remitly)</option>
            <option value="Indian Bank NetBanking (Auto-Debit)">Indian Bank NetBanking (Auto-Debit)</option>
            <option value="UPI / Direct Transfer">UPI / Direct Transfer</option>
            <option value="Family Contribution in India">Family Contribution in India</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Date Paid *
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
            Notes / UTR Reference
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. November EMI auto-debited / UTR #492817294"
            className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

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
            Record Payment
          </button>
        </div>
      </form>
    </Modal>
  );
}
