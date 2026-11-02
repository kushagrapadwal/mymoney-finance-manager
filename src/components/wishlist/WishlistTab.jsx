/**
 * src/components/wishlist/WishlistTab.jsx
 * Wishlist management module.
 * Plan purchases in advance, assess priorities (High, Medium, Low),
 * and track item status from Planned to Saved to Purchased.
 */

import { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  ShoppingBag,
} from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatPLN, formatINR, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import EmptyState from '../common/EmptyState';
import AddWishlistItemModal from '../modals/AddWishlistItemModal';

export default function WishlistTab() {
  const { state, updateWishlistItem, deleteWishlistItem } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const visibleItems = state.wishlist.filter((item) => {
    if (filterPriority !== 'ALL' && item.priority !== filterPriority) return false;
    if (filterStatus !== 'ALL' && item.status !== filterStatus) return false;
    return true;
  });

  const totalWishlistPLN = state.wishlist
    .filter((w) => w.status !== 'Purchased')
    .reduce((sum, w) => sum + (w.currency === 'PLN' ? w.estimatedCost : w.estimatedCost / 20.8), 0);

  const priorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Purchased':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Saved For':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 border-emerald-500/25 bg-gradient-to-br from-[#0B132B] to-[#122247]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-medium text-slate-400">Total Planned Wishlist</p>
              <h3 className="text-2xl font-bold font-mono text-white mt-1">
                ≈ {formatPLN(Math.round(totalWishlistPLN))}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-3">
            Delayed gratification tracker to prevent impulse purchases
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-medium text-slate-400">Total Items Tracked</p>
              <h3 className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {state.wishlist.length} Items
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-slate-800 text-slate-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            {state.wishlist.filter((w) => w.status === 'Purchased').length} items already purchased
          </p>
        </Card>

        <Card className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase font-medium text-slate-400">Quick Actions</p>
            <p className="text-xs text-slate-300 mt-1">Plan a future want or goal</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Wishlist Item</span>
          </button>
        </Card>
      </div>

      {/* Filter bar */}
      <Card className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 flex-1 sm:flex-initial"
          >
            <option value="ALL">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#070D1E] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 flex-1 sm:flex-initial"
          >
            <option value="ALL">All Statuses</option>
            <option value="Planned">Planned</option>
            <option value="Saved For">Saved For</option>
            <option value="Purchased">Purchased</option>
          </select>
        </div>

        <span className="text-xs font-mono text-slate-400 self-end sm:self-auto">
          Showing {visibleItems.length} of {state.wishlist.length}
        </span>
      </Card>

      {/* Wishlist Items List */}
      <div>
        {visibleItems.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Wishlist is empty"
            description="Add items you want to buy in the future. Planning items avoids impulse buys and keeps your budget solid."
            actionText="+ Add Item to Wishlist"
            onAction={() => setIsAddModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleItems.map((item) => {
              const isPurchased = item.status === 'Purchased';

              return (
                <Card
                  key={item.id}
                  className={`p-5 flex flex-col justify-between space-y-3 transition-all ${
                    isPurchased ? 'opacity-70 bg-slate-900/50' : 'bg-[#0B132B]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-base font-bold text-white ${
                              isPurchased ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {item.title}
                          </h4>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${priorityBadge(
                              item.priority
                            )}`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Category: {item.category} {item.targetDate && `• Target: ${formatDate(item.targetDate)}`}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-lg font-bold font-mono text-emerald-400">
                          {item.currency === 'PLN'
                            ? formatPLN(item.estimatedCost)
                            : formatINR(item.estimatedCost)}
                        </p>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-400 mt-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Status Toggle & Delete */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Status:</span>
                      <select
                        value={item.status}
                        onChange={(e) => updateWishlistItem(item.id, { status: e.target.value })}
                        className={`text-xs px-2 py-1 rounded-lg border focus:outline-none ${statusBadge(
                          item.status
                        )}`}
                      >
                        <option value="Planned">Planned</option>
                        <option value="Saved For">Saved For</option>
                        <option value="Purchased">Purchased ✓</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Remove "${item.title}" from wishlist?`)) {
                          deleteWishlistItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <AddWishlistItemModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
