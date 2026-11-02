/**
 * src/components/expenses/ExpenseTrackerTab.jsx
 * Detailed transaction log & expense tracking in PLN.
 * Supports filtering by category, search by note/description, sorting, and CSV export.
 */

import { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Trash2,
  Download,
} from 'lucide-react';
import { useFinance } from '../../context/useFinance';
import { formatPLN, formatDate } from '../../utils/formatters';
import Card from '../common/Card';
import CategoryIcon from '../common/CategoryIcon';
import EmptyState from '../common/EmptyState';

export default function ExpenseTrackerTab() {
  const {
    state,
    filteredTransactions,
    deleteTransaction,
    setIsQuickAddOpen,
    setQuickAddType,
  } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'expense' | 'income'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'highest' | 'lowest'

  // Apply filters
  const visibleTransactions = filteredTransactions
    .filter((tx) => {
      if (selectedCategory !== 'ALL' && tx.categoryId !== selectedCategory) return false;
      if (selectedType !== 'ALL' && tx.type !== selectedType) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesDesc = tx.description?.toLowerCase().includes(term);
        const matchesNotes = tx.notes?.toLowerCase().includes(term);
        const matchesMethod = tx.paymentMethod?.toLowerCase().includes(term);
        return matchesDesc || matchesNotes || matchesMethod;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'highest') return b.amountPLN - a.amountPLN;
      if (sortBy === 'lowest') return a.amountPLN - b.amountPLN;
      return 0;
    });

  // Calculate totals for filtered set
  const totalExpenses = visibleTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + (Number(tx.amountPLN) || 0), 0);

  const totalIncomes = visibleTransactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + (Number(tx.amountPLN) || 0), 0);

  // Export to CSV
  const exportToCSV = () => {
    if (visibleTransactions.length === 0) {
      alert('No transactions to export.');
      return;
    }
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount PLN', 'Payment Method', 'Notes'];
    const rows = visibleTransactions.map((tx) => {
      const cat = state.budgetCategories.find((c) => c.id === tx.categoryId);
      return [
        tx.date,
        tx.type,
        `"${cat?.name || 'General'}"`,
        `"${tx.description.replace(/"/g, '""')}"`,
        tx.amountPLN,
        `"${tx.paymentMethod}"`,
        `"${(tx.notes || '').replace(/"/g, '""')}"`,
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `mymoney-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Total Filtered Spending</p>
          <p className="text-2xl font-bold font-mono text-white mt-1">{formatPLN(totalExpenses)}</p>
          <p className="text-[11px] text-slate-400 mt-1">{visibleTransactions.length} transactions shown</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Total Filtered Income</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{formatPLN(totalIncomes)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Extra student earnings or allowance</p>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium uppercase text-slate-400">Actions</p>
            <p className="text-xs text-slate-300 mt-1">Export transaction sheet or log entry</p>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => {
                setQuickAddType('expense');
                setIsQuickAddOpen(true);
              }}
              className="flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all text-center flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
            <button
              type="button"
              onClick={exportToCSV}
              className="py-1.5 px-3 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by store, item, BLIK or note..."
              className="w-full bg-[#070D1E] border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Categories</option>
            {state.budgetCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#070D1E] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="highest">Sort: Highest Amount</option>
            <option value="lowest">Sort: Lowest Amount</option>
          </select>
        </div>
      </Card>

      {/* Transactions List */}
      <div>
        {visibleTransactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={searchTerm ? 'No matching transactions found' : 'No transactions recorded yet'}
            description={
              searchTerm
                ? 'Try adjusting your search terms or filters.'
                : 'Per instructions, transactions start empty without invented data. Add your first spending using the button below.'
            }
            actionText="+ Record First Expense"
            onAction={() => {
              setQuickAddType('expense');
              setIsQuickAddOpen(true);
            }}
          />
        ) : (
          <div className="space-y-2">
            {visibleTransactions.map((tx) => {
              const category = state.budgetCategories.find((c) => c.id === tx.categoryId);
              const isIncome = tx.type === 'income';

              return (
                <Card
                  key={tx.id}
                  className="p-4 bg-[#0B132B] hover:border-slate-700 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${category?.color || '#10B981'}20`,
                        color: category?.color || '#10B981',
                        border: `1px solid ${category?.color || '#10B981'}40`,
                      }}
                    >
                      <CategoryIcon name={category?.icon || 'Tag'} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white truncate">{tx.description}</h4>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                          {tx.paymentMethod}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span>{category?.name || 'General'}</span>
                        {tx.notes && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 italic truncate max-w-[200px]">{tx.notes}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p
                        className={`text-base font-bold font-mono ${
                          isIncome ? 'text-emerald-400' : 'text-slate-100'
                        }`}
                      >
                        {isIncome ? '+' : '-'}
                        {formatPLN(tx.amountPLN, true)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this transaction record?')) {
                          deleteTransaction(tx.id);
                        }
                      }}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete transaction"
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
    </div>
  );
}
