/**
 * src/components/modals/AddWishlistItemModal.jsx
 * Modal dialog for creating a planned purchase in the Wishlist.
 */

import { useState } from 'react';
import Modal from '../common/Modal';
import { useFinance } from '../../context/useFinance';

export default function AddWishlistItemModal({ isOpen, onClose }) {
  const { addWishlistItem } = useFinance();

  const [title, setTitle] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [currency, setCurrency] = useState('PLN');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Clothing');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !estimatedCost || Number(estimatedCost) <= 0) {
      alert('Please enter a valid title and estimated cost.');
      return;
    }

    addWishlistItem({
      title: title.trim(),
      estimatedCost: parseFloat(estimatedCost),
      currency,
      priority,
      category,
      targetDate,
      notes: notes.trim(),
    });

    setTitle('');
    setEstimatedCost('');
    setNotes('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add to Wishlist"
      subtitle="Save for future wants and avoid impulse spending"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Ergonomic Office Chair, Winter Jacket, iPad"
            className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Estimated Cost *
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              required
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="e.g. 299"
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="PLN">PLN (Polish Złoty)</option>
              <option value="INR">INR (Indian Rupee)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low / Nice to Have</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="Clothing">Clothing & Winter Gear</option>
              <option value="Electronics">Electronics & Tech</option>
              <option value="Home">Home & Living</option>
              <option value="Travel">Travel & Trips</option>
              <option value="Books">Books & Learning</option>
              <option value="Personal">Personal Care</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Target Purchase Date
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Notes / Link
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Store link (Allegro, Amazon, Zalando) or specifications"
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
            Add to Wishlist
          </button>
        </div>
      </form>
    </Modal>
  );
}
