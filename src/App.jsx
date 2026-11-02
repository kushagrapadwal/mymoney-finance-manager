/**
 * src/App.jsx
 * Root application component for MyMoney.
 * Provides responsive dark navy & emerald theme layout,
 * desktop sidebar, mobile bottom navigation, and lazy-loaded tabs for fast startup.
 */

import { lazy, Suspense } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { useFinance } from './context/useFinance';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

// Lazy loaded tab components for optimized code-splitting
const OverviewTab = lazy(() => import('./components/dashboard/OverviewTab'));
const BudgetTab = lazy(() => import('./components/budget/BudgetTab'));
const ExpenseTrackerTab = lazy(() => import('./components/expenses/ExpenseTrackerTab'));
const RemittanceTab = lazy(() => import('./components/remittance/RemittanceTab'));
const SavingsTab = lazy(() => import('./components/savings/SavingsTab'));
const LoanTrackerTab = lazy(() => import('./components/loan/LoanTrackerTab'));
const WishlistTab = lazy(() => import('./components/wishlist/WishlistTab'));
const AnalyticsTab = lazy(() => import('./components/analytics/AnalyticsTab'));

// Lazy loaded modals
const AddTransactionModal = lazy(() => import('./components/modals/AddTransactionModal'));
const AddTransferModal = lazy(() => import('./components/modals/AddTransferModal'));
const AddLoanPaymentModal = lazy(() => import('./components/modals/AddLoanPaymentModal'));

function TabLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
      <div className="w-10 h-10 border-4 border-slate-800 border-t-emerald-400 rounded-full animate-spin" />
      <p className="text-xs text-slate-400 font-mono">Loading MyMoney module...</p>
    </div>
  );
}

function AppContent() {
  const {
    activeTab,
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddType,
  } = useFinance();

  // Render active tab view
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'budget':
        return <BudgetTab />;
      case 'expenses':
        return <ExpenseTrackerTab />;
      case 'remittance':
        return <RemittanceTab />;
      case 'savings':
        return <SavingsTab />;
      case 'loan':
        return <LoanTrackerTab />;
      case 'wishlist':
        return <WishlistTab />;
      case 'reports':
        return <AnalyticsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Desktop Sidebar Navigation (Hidden on mobile) */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-6">
        {/* Top Header Bar */}
        <Header />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<TabLoadingFallback />}>
            {renderTabContent()}
          </Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Hidden on desktop) */}
      <BottomNav />

      {/* Global Quick Add Modals */}
      <Suspense fallback={null}>
        {isQuickAddOpen && quickAddType === 'expense' && (
          <AddTransactionModal
            isOpen={isQuickAddOpen}
            onClose={() => setIsQuickAddOpen(false)}
          />
        )}

        {isQuickAddOpen && quickAddType === 'transfer' && (
          <AddTransferModal
            isOpen={isQuickAddOpen}
            onClose={() => setIsQuickAddOpen(false)}
          />
        )}

        {isQuickAddOpen && quickAddType === 'loan_payment' && (
          <AddLoanPaymentModal
            isOpen={isQuickAddOpen}
            onClose={() => setIsQuickAddOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
