/**
 * src/components/modals/AddTransferModal.jsx
 * Modal dialog for logging a PLN to INR remittance transfer.
 * Computes exchange rate automatically and can link directly to Avanse loan repayment.
 */

import { useState } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/useFinance';
import { formatINR } from '../../utils/formatters';

export default function AddTransferModal({ isOpen, onClose }) {
  const { addTransfer, state } = useFinance();

  const [amountPLN, setAmountPLN] = useState('');
  const [exchangeRate, setExchangeRate] = useState(state.remittanceGoal?.estimatedRate || 20.8);
  const [amountINR, setAmountINR] = useState('');
  const [feePLN, setFeePLN] = useState('0');
  const [provider, setProvider] = useState('Wise');
  const [purpose, setPurpose] = useState('Avanse Loan Repayment');
  const [linkedToLoan, setLinkedToLoan] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handlePLNChange = (val) => {
    setAmountPLN(val);
    const pln = parseFloat(val);
    const rate = parseFloat(exchangeRate);
    if (!isNaN(pln) && !isNaN(rate) && pln > 0) {
      setAmountINR(String(Math.round(pln * rate)));
    }
  };

  const handleRateChange = (val) => {
    setExchangeRate(val);
    const pln = parseFloat(amountPLN);
    const rate = parseFloat(val);
    if (!isNaN(pln) && !isNaN(rate) && pln > 0) {
      setAmountINR(String(Math.round(pln * rate)));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pln = parseFloat(amountPLN);
    const inr = parseFloat(amountINR);

    if (isNaN(pln) || pln <= 0) {
      alert('Please enter a valid PLN amount.');
      return;
    }

    addTransfer({
      amountPLN: pln,
      exchangeRate: parseFloat(exchangeRate) || 20.8,
      amountINR: inr,
      feePLN: parseFloat(feePLN) || 0,
      provider,
      purpose,
      linkedToLoan,
      date,
      notes: notes.trim(),
    });

    // Reset and close
    setAmountPLN('');
    setAmountINR('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record PLN → INR Transfer"
      subtitle="Track money sent home to India and monitor monthly remittance goal"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Remittance Goal Helper Banner */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
          <span>Monthly Target Goal:</span>
          <strong className="font-mono text-emerald-400">
            {formatINR(state.remittanceGoal?.minINR || 10000)} – {formatINR(state.remittanceGoal?.maxINR || 15000)}
          </strong>
        </div>

        {/* PLN Sent & Exchange Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              PLN Sent *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="1"
                required
                autoFocus
                value={amountPLN}
                onChange={(e) => handlePLNChange(e.target.value)}
                placeholder="e.g. 500"
                className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                PLN
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Exchange Rate (1 PLN = ₹ INR)
            </label>
            <input
              type="number"
              step="0.01"
              min="0.1"
              required
              value={exchangeRate}
              onChange={(e) => handleRateChange(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-base focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* INR Received (Calculated) */}
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
          <label className="block text-xs font-medium text-slate-400 mb-1">
            INR Received in India (Approx / Exact)
          </label>
          <div className="relative">
            <input
              type="number"
              step="1"
              required
              value={amountINR}
              onChange={(e) => setAmountINR(e.target.value)}
              placeholder="e.g. 10400"
              className="w-full bg-[#070D1E] border border-emerald-500/40 rounded-xl px-3.5 py-2 text-emerald-400 font-mono text-lg font-bold focus:outline-none focus:border-emerald-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 font-mono text-xs">
              INR (₹)
            </span>
          </div>
          {amountINR && (
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Formatted: {formatINR(amountINR)}
            </p>
          )}
        </div>

        {/* Provider & Transfer Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Transfer Platform / Service
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="Wise">Wise (TransferWise)</option>
              <option value="Remitly">Remitly</option>
              <option value="Western Union">Western Union</option>
              <option value="Revolut">Revolut</option>
              <option value="Instarem">Instarem</option>
              <option value="Direct Bank Wire">Direct Bank Wire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Transfer Fee (PLN)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={feePLN}
              onChange={(e) => setFeePLN(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Date & Purpose */}
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
              Purpose
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="Avanse Loan Repayment">Avanse Loan Repayment</option>
              <option value="Family Support">Family Maintenance / Support</option>
              <option value="Indian Savings Account">Indian Savings (NRE / NRO)</option>
              <option value="Emergency Fund">Emergency Transfer</option>
            </select>
          </div>
        </div>

        {/* Checkbox: Link to Avanse Loan */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
          <input
            type="checkbox"
            id="linkLoanCheckbox"
            checked={linkedToLoan}
            onChange={(e) => setLinkedToLoan(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-[#070D1E]"
          />
          <label htmlFor="linkLoanCheckbox" className="text-xs text-slate-300 leading-snug cursor-pointer">
            <strong className="text-white">Credit to Avanse Education Loan?</strong>
            <span className="block text-slate-400 text-[11px] mt-0.5">
              Automatically subtracts this INR amount from your ₹11,00,000 Avanse loan balance.
            </span>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Notes / Reference ID
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Wise tracking number #W1029384"
            className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Submit */}
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
            Record Transfer
          </button>
        </div>
      </form>
    </Modal>
  );
}
