/**
 * src/utils/initialData.js
 * Default starter data and configuration for the MyMoney application.
 * Contains user-specified budget values and loan initial parameters.
 */

export const INITIAL_BUDGET_CATEGORIES = [
  {
    id: 'cat-rent',
    name: 'Rent',
    allocatedPLN: 1500,
    color: '#6366F1', // Indigo
    icon: 'Home',
    description: 'Monthly apartment and housing accommodation in Poland',
  },
  {
    id: 'cat-groceries',
    name: 'Groceries',
    allocatedPLN: 250,
    color: '#10B981', // Emerald
    icon: 'ShoppingCart',
    description: 'Biedronka, Lidl, supermarkets, daily essentials',
  },
  {
    id: 'cat-transport',
    name: 'Transport',
    allocatedPLN: 140,
    color: '#3B82F6', // Blue
    icon: 'Bus',
    description: 'Monthly city transit pass (ZTM/Jakdojade), train tickets',
  },
  {
    id: 'cat-dining',
    name: 'Dining + Outings',
    allocatedPLN: 100,
    color: '#F59E0B', // Amber
    icon: 'Utensils',
    description: 'Cafes, weekend dining, social outings, street food',
  },
  {
    id: 'cat-recharge',
    name: 'Recharge + Internet',
    allocatedPLN: 80,
    color: '#EC4899', // Pink
    icon: 'Wifi',
    description: 'Mobile cellular SIM recharge and home broadband internet',
  },
  {
    id: 'cat-savings',
    name: 'Savings',
    allocatedPLN: 500,
    color: '#14B8A6', // Teal
    icon: 'PiggyBank',
    description: 'Direct monthly savings allocation',
  },
];

export const INITIAL_LOAN_DATA = {
  id: 'loan-avanse-1',
  name: 'Avanse Education Loan',
  lender: 'Avanse Financial Services',
  startingPrincipalINR: 1100000, // ₹11,00,000 starting amount
  currentPrincipalINR: 1100000,
  annualInterestRate: 11.25, // Percentage p.a.
  tenureMonths: 120, // 10 years
  emiTargetINR: 15000,
  accountNumber: 'AVN-EDU-99482',
  startDate: '2026-01-01',
  notes: 'Education loan for higher studies abroad. Repayments tracked in INR.',
  payments: [],
};

export const INITIAL_REMITTANCE_GOAL = {
  minINR: 10000,
  maxINR: 15000,
  estimatedRate: 20.8, // 1 PLN ≈ 20.8 INR
  preferredService: 'Wise / Direct Remit',
};

export const INITIAL_SAVINGS_GOALS = [
  {
    id: 'sav-emergency',
    name: 'Emergency Buffer',
    targetPLN: 3000,
    currentPLN: 500,
    targetDate: '2027-06-30',
    category: 'Emergency',
    color: '#10B981',
  },
  {
    id: 'sav-flight',
    name: 'India Homecoming Flight',
    targetPLN: 2500,
    currentPLN: 0,
    targetDate: '2027-12-15',
    category: 'Travel',
    color: '#3B82F6',
  },
];

export const INITIAL_WISHLIST = [
  {
    id: 'wish-1',
    title: 'Winter Parka & Thermal Boots',
    estimatedCost: 350,
    currency: 'PLN',
    priority: 'High',
    category: 'Clothing',
    status: 'Planned',
    targetDate: '2026-12-01',
    notes: 'Warm water-resistant coat for Polish winter season',
  },
  {
    id: 'wish-2',
    title: 'Noise Cancelling Headphones',
    estimatedCost: 450,
    currency: 'PLN',
    priority: 'Medium',
    category: 'Electronics',
    status: 'Planned',
    targetDate: '2027-02-15',
    notes: 'For focused study sessions and library work',
  },
];

export const INITIAL_APP_STATE = {
  budgetCategories: INITIAL_BUDGET_CATEGORIES,
  monthlyIncomePLN: 3200, // Monthly salary or allowance in PLN
  transactions: [], // Zero invented financial transactions per prompt guidelines
  transfers: [], // PLN to INR transfers
  loan: INITIAL_LOAN_DATA,
  remittanceGoal: INITIAL_REMITTANCE_GOAL,
  savingsGoals: INITIAL_SAVINGS_GOALS,
  wishlist: INITIAL_WISHLIST,
};

