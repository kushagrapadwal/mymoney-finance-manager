/**
 * src/context/FinanceContext.jsx
 * Central React Context managing all application state for MyMoney.
 * Persists data automatically to browser localStorage so user records survive refresh.
 * Provides clean CRUD functions for transactions, budgets, transfers, loan, savings, and wishlist.
 */

import { useState, useEffect } from 'react';
import { FinanceContext } from './FinanceContextCore';
import { INITIAL_APP_STATE, INITIAL_BUDGET_CATEGORIES } from '../utils/initialData';
import { generateId, getCurrentMonthKey } from '../utils/formatters';

const STORAGE_KEY = 'mymoney_finance_data_v1';

export function FinanceProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure budgetCategories and loan are present even if previous storage had different shape
        return {
          ...INITIAL_APP_STATE,
          ...parsed,
          budgetCategories: parsed.budgetCategories && parsed.budgetCategories.length > 0 
            ? parsed.budgetCategories 
            : INITIAL_BUDGET_CATEGORIES,
          loan: parsed.loan || INITIAL_APP_STATE.loan,
          remittanceGoal: parsed.remittanceGoal || INITIAL_APP_STATE.remittanceGoal,
        };
      }
    } catch (err) {
      console.error('Error loading finance data from localStorage:', err);
    }
    return INITIAL_APP_STATE;
  });

  // Active view tab state: 'overview' | 'budget' | 'expenses' | 'remittance' | 'savings' | 'loan' | 'wishlist' | 'reports'
  const [activeTab, setActiveTab] = useState('overview');

  // Currently selected month for filtering (default current month: "YYYY-MM")
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  // Global Quick Add Modal control
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState('expense'); // 'expense' | 'transfer' | 'loan_payment'

  // Persist state to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [state]);

  // --- TRANSACTIONS (PLN Expenses & Incomes) ---
  const addTransaction = (transaction) => {
    const newTx = {
      id: generateId(),
      date: transaction.date || new Date().toISOString().split('T')[0],
      amountPLN: Number(transaction.amountPLN) || 0,
      categoryId: transaction.categoryId || 'cat-groceries',
      type: transaction.type || 'expense', // 'expense' | 'income'
      description: transaction.description || 'General expense',
      paymentMethod: transaction.paymentMethod || 'Card (BLIK)',
      notes: transaction.notes || '',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));

    return newTx;
  };

  const deleteTransaction = (id) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((tx) => tx.id !== id),
    }));
  };

  const updateTransaction = (id, updatedFields) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updatedFields } : tx
      ),
    }));
  };

  // --- BUDGET CATEGORIES ---
  const updateBudgetCategory = (categoryId, newAllocatedPLN) => {
    setState((prev) => ({
      ...prev,
      budgetCategories: prev.budgetCategories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, allocatedPLN: Number(newAllocatedPLN) || 0 }
          : cat
      ),
    }));
  };

  const addBudgetCategory = (newCat) => {
    const category = {
      id: `cat-${generateId()}`,
      name: newCat.name,
      allocatedPLN: Number(newCat.allocatedPLN) || 0,
      color: newCat.color || '#10B981',
      icon: newCat.icon || 'Tag',
      description: newCat.description || '',
    };
    setState((prev) => ({
      ...prev,
      budgetCategories: [...prev.budgetCategories, category],
    }));
  };

  const deleteBudgetCategory = (categoryId) => {
    setState((prev) => ({
      ...prev,
      budgetCategories: prev.budgetCategories.filter((cat) => cat.id !== categoryId),
    }));
  };

  const updateMonthlyIncome = (amountPLN) => {
    setState((prev) => ({
      ...prev,
      monthlyIncomePLN: Number(amountPLN) || 0,
    }));
  };

  // --- TRANSFERS (PLN to INR Remittance) ---
  const addTransfer = (transferData) => {
    const plnAmount = Number(transferData.amountPLN) || 0;
    const rate = Number(transferData.exchangeRate) || 20.8;
    const inrAmount = Number(transferData.amountINR) || Math.round(plnAmount * rate);

    const newTransfer = {
      id: generateId(),
      date: transferData.date || new Date().toISOString().split('T')[0],
      amountPLN: plnAmount,
      exchangeRate: rate,
      amountINR: inrAmount,
      feePLN: Number(transferData.feePLN) || 0,
      provider: transferData.provider || 'Wise',
      purpose: transferData.purpose || 'Education Loan / Family',
      notes: transferData.notes || '',
      linkedToLoan: Boolean(transferData.linkedToLoan),
      createdAt: new Date().toISOString(),
    };

    setState((prev) => {
      let updatedLoan = { ...prev.loan };
      if (newTransfer.linkedToLoan) {
        const paymentRecord = {
          id: generateId(),
          date: newTransfer.date,
          amountINR: inrAmount,
          transferId: newTransfer.id,
          source: `Remittance via ${newTransfer.provider}`,
          notes: newTransfer.notes || 'Remittance payment credited towards loan balance',
        };
        const newBalance = Math.max(0, updatedLoan.currentPrincipalINR - inrAmount);
        updatedLoan = {
          ...updatedLoan,
          currentPrincipalINR: newBalance,
          payments: [paymentRecord, ...(updatedLoan.payments || [])],
        };
      }

      return {
        ...prev,
        transfers: [newTransfer, ...prev.transfers],
        loan: updatedLoan,
      };
    });

    return newTransfer;
  };

  const deleteTransfer = (id) => {
    setState((prev) => ({
      ...prev,
      transfers: prev.transfers.filter((t) => t.id !== id),
    }));
  };

  const updateRemittanceGoal = (goalData) => {
    setState((prev) => ({
      ...prev,
      remittanceGoal: {
        ...prev.remittanceGoal,
        ...goalData,
      },
    }));
  };

  // --- AVANSE EDUCATION LOAN TRACKER ---
  const addLoanPayment = (paymentData) => {
    const amountINR = Number(paymentData.amountINR) || 0;
    const newPayment = {
      id: generateId(),
      date: paymentData.date || new Date().toISOString().split('T')[0],
      amountINR: amountINR,
      source: paymentData.source || 'Direct Transfer / NetBanking',
      notes: paymentData.notes || '',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => {
      const updatedBalance = Math.max(0, prev.loan.currentPrincipalINR - amountINR);
      return {
        ...prev,
        loan: {
          ...prev.loan,
          currentPrincipalINR: updatedBalance,
          payments: [newPayment, ...(prev.loan.payments || [])],
        },
      };
    });
  };

  const deleteLoanPayment = (paymentId) => {
    setState((prev) => {
      const paymentToRemove = prev.loan.payments.find((p) => p.id === paymentId);
      if (!paymentToRemove) return prev;
      const restoredBalance = prev.loan.currentPrincipalINR + (Number(paymentToRemove.amountINR) || 0);
      return {
        ...prev,
        loan: {
          ...prev.loan,
          currentPrincipalINR: restoredBalance,
          payments: prev.loan.payments.filter((p) => p.id !== paymentId),
        },
      };
    });
  };

  const updateLoanDetails = (loanFields) => {
    setState((prev) => ({
      ...prev,
      loan: {
        ...prev.loan,
        ...loanFields,
      },
    }));
  };

  // --- SAVINGS TRACKER ---
  const addSavingsGoal = (goal) => {
    const newGoal = {
      id: `sav-${generateId()}`,
      name: goal.name,
      targetPLN: Number(goal.targetPLN) || 1000,
      currentPLN: Number(goal.currentPLN) || 0,
      targetDate: goal.targetDate || '',
      category: goal.category || 'General',
      color: goal.color || '#10B981',
    };
    setState((prev) => ({
      ...prev,
      savingsGoals: [...prev.savingsGoals, newGoal],
    }));
  };

  const updateSavingsGoal = (id, updated) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) => (g.id === id ? { ...g, ...updated } : g)),
    }));
  };

  const contributeToSavingsGoal = (id, amountPLN) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) =>
        g.id === id ? { ...g, currentPLN: Math.max(0, g.currentPLN + Number(amountPLN)) } : g
      ),
    }));
  };

  const deleteSavingsGoal = (id) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== id),
    }));
  };

  // --- WISHLIST MANAGEMENT ---
  const addWishlistItem = (item) => {
    const newItem = {
      id: `wish-${generateId()}`,
      title: item.title,
      estimatedCost: Number(item.estimatedCost) || 0,
      currency: item.currency || 'PLN',
      priority: item.priority || 'Medium',
      category: item.category || 'General',
      status: item.status || 'Planned',
      targetDate: item.targetDate || '',
      notes: item.notes || '',
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      wishlist: [newItem, ...prev.wishlist],
    }));
  };

  const updateWishlistItem = (id, updated) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.map((w) => (w.id === id ? { ...w, ...updated } : w)),
    }));
  };

  const deleteWishlistItem = (id) => {
    setState((prev) => ({
      ...prev,
      wishlist: prev.wishlist.filter((w) => w.id !== id),
    }));
  };

  // --- DATA BACKUP & RESET ---
  const resetToDefaultBudget = () => {
    if (window.confirm('Reset all budget numbers, loan, and data back to initial defaults?')) {
      setState(INITIAL_APP_STATE);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mymoney-backup-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.budgetCategories) {
        setState({
          ...INITIAL_APP_STATE,
          ...parsed,
        });
        return { success: true };
      }
      return { success: false, error: 'Invalid data format' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // --- COMPUTED MONTHLY TOTALS ---
  const filteredTransactions = state.transactions.filter((tx) => {
    if (!selectedMonth) return true;
    return tx.date.startsWith(selectedMonth);
  });

  const totalMonthlySpentPLN = filteredTransactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + (Number(tx.amountPLN) || 0), 0);

  const totalBudgetedPLN = state.budgetCategories.reduce(
    (sum, cat) => sum + (Number(cat.allocatedPLN) || 0),
    0
  );

  const currentMonthTransfers = state.transfers.filter((t) =>
    selectedMonth ? t.date.startsWith(selectedMonth) : true
  );

  const totalMonthTransferredINR = currentMonthTransfers.reduce(
    (sum, t) => sum + (Number(t.amountINR) || 0),
    0
  );

  const totalMonthTransferredPLN = currentMonthTransfers.reduce(
    (sum, t) => sum + (Number(t.amountPLN) || 0),
    0
  );

  const totalSavingsProgressPLN = state.savingsGoals.reduce(
    (sum, g) => sum + (Number(g.currentPLN) || 0),
    0
  );

  const value = {
    state,
    activeTab,
    setActiveTab,
    selectedMonth,
    setSelectedMonth,
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddType,
    setQuickAddType,
    // Transactions
    filteredTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    totalMonthlySpentPLN,
    // Budget
    totalBudgetedPLN,
    updateBudgetCategory,
    addBudgetCategory,
    deleteBudgetCategory,
    updateMonthlyIncome,
    // Remittance / Transfers
    currentMonthTransfers,
    totalMonthTransferredINR,
    totalMonthTransferredPLN,
    addTransfer,
    deleteTransfer,
    updateRemittanceGoal,
    // Loan
    addLoanPayment,
    deleteLoanPayment,
    updateLoanDetails,
    // Savings
    totalSavingsProgressPLN,
    addSavingsGoal,
    updateSavingsGoal,
    contributeToSavingsGoal,
    deleteSavingsGoal,
    // Wishlist
    addWishlistItem,
    updateWishlistItem,
    deleteWishlistItem,
    // System
    resetToDefaultBudget,
    exportData,
    importData,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export default FinanceProvider;
