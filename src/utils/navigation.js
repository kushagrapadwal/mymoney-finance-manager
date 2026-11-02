/**
 * src/utils/navigation.js
 * Central navigation item definitions for MyMoney.
 */

import {
  LayoutDashboard,
  PieChart,
  Receipt,
  ArrowRightLeft,
  PiggyBank,
  GraduationCap,
  Sparkles,
  BarChart3,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'budget', label: 'Monthly Budget', icon: PieChart },
  { id: 'expenses', label: 'Expense Tracker', icon: Receipt },
  { id: 'remittance', label: 'PLN → INR Remit', icon: ArrowRightLeft },
  { id: 'savings', label: 'Savings Tracker', icon: PiggyBank },
  { id: 'loan', label: 'Avanse Loan', icon: GraduationCap, badge: '₹11L' },
  { id: 'wishlist', label: 'Wishlist', icon: Sparkles },
  { id: 'reports', label: 'Reports & Charts', icon: BarChart3 },
];

