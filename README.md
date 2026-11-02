# MyMoney — Mobile-First Personal Finance Manager

A modern personal finance web application built for international students and professionals managing their finances in **Polish Złoty (PLN)** while tracking cross-border remittances and loan obligations in **Indian Rupees (INR)**.

---

## 🎨 Design & Theme
- **Theme**: Dark Navy (`#070D1E`, `#0B132B`) and Emerald Green (`#10B981`) accent palette.
- **Layout**: Fully responsive mobile-first architecture:
  - **Mobile screens**: Ergonomic fixed bottom navigation bar with a centered quick-add action button and an expandable sheet for secondary tools.
  - **Desktop screens**: Left sidebar with navigation, real-time Avanse loan progress badge, and quick backup/restore utilities.
- **Data Persistence**: Uses `localStorage` to save all user-entered transactions, transfers, loan payments, and budget customizations directly in your browser.

---

## 🚀 Key Features

1. **Overview Dashboard**:
   - High-level KPIs: Monthly PLN Budget vs Spent, Monthly Remittance Target Status, Avanse Loan Balance, and Total Savings.
   - Dynamic progress indicators and quick action shortcuts to record expenses or transfers.

2. **Monthly Budget Management in PLN**:
   - Initial monthly baseline: **2,570 PLN** across 6 standard categories:
     - **Rent**: 1,500 PLN
     - **Groceries**: 250 PLN
     - **Transport**: 140 PLN
     - **Dining + Outings**: 100 PLN
     - **Recharge + Internet**: 80 PLN
     - **Savings**: 500 PLN
   - Inline allocation editing, custom category creation, category deletion, and monthly income target tracking.

3. **Expense Tracking & Transaction History**:
   - Clean initial state (starts with 0 invented transactions).
   - Filter by category, type (expense vs income), search keyword, and sort order.
   - One-click CSV export of transaction records.

4. **Manual PLN-to-INR Transfer Tracking**:
   - Record remittances sent home to India (PLN sent, exchange rate, INR received, platform fee, transfer provider).
   - Live two-way currency conversion estimator.

5. **Monthly Remittance Goal (₹10,000–₹15,000)**:
   - Visual milestone progress bar tracking monthly remittances against the ₹10k (minimum) and ₹15k (target) goal.

6. **Savings Tracker**:
   - Tracks the 500 PLN monthly allocation from your budget.
   - Create milestone envelopes (Emergency Buffer, India Homecoming Flights, Tech Upgrade).
   - Log deposits directly into any savings goal.

7. **Avanse Education Loan Tracker**:
   - Initial starting principal: **₹11,00,000**.
   - Tracks current principal balance, interest rate (e.g. 11.25% p.a.), and estimated monthly EMI.
   - Direct payment logger and automatic remittance linking (check "Credit to Avanse Loan" on any transfer to update loan balance automatically).

8. **Wishlist Management**:
   - Delayed gratification tracker with priority badges (High, Medium, Low) and statuses (`Planned`, `Saved For`, `Purchased`).

9. **Spending Charts & Visual Reports (Recharts)**:
   - Category distribution Donut Chart.
   - Budget vs Actual spending Bar Chart.
   - Monthly Remittance Trajectory Chart.

---

## 📁 Project File Structure & Explanations

Here is a breakdown of every file in the codebase:

```
mymoney-finance-manager/
├── index.html                           # App HTML template with viewport meta and title
├── vite.config.js                       # Vite configuration with React and Tailwind CSS v4 plugins
├── package.json                         # Project dependencies (React 19, Lucide React, Recharts, Tailwind v4)
├── src/
│   ├── main.jsx                         # React entrypoint mounting App onto the DOM
│   ├── index.css                        # Global CSS, Tailwind v4 imports, theme variables & scrollbars
│   ├── App.css                          # Custom component CSS overrides
│   ├── App.jsx                          # Main app layout shell, navigation router, and modal hosts
│   │
│   ├── context/                         # State Management & LocalStorage
│   │   ├── FinanceContextCore.js        # Core React Context definition
│   │   ├── FinanceContext.jsx           # Provider component handling all data CRUD and localStorage persistence
│   │   └── useFinance.js                # Custom hook for easy, type-safe access to FinanceContext
│   │
│   ├── utils/                           # Formatting, Constants & Starter Data
│   │   ├── formatters.js                # Currency (PLN & INR), date, percentage, and ID generator helpers
│   │   ├── initialData.js               # Starter initial budget (2570 PLN), loan (₹11,00,000), and goals
│   │   └── navigation.js                # Definitions of navigation tabs and icons
│   │
│   ├── components/
│   │   ├── common/                      # Reusable UI Atoms & Molecules
│   │   │   ├── Card.jsx                 # Dark navy glassmorphic container card
│   │   │   ├── StatCard.jsx             # Metric card with badge, icon, and title
│   │   │   ├── ProgressBar.jsx          # Accessible progress bar with milestone colors
│   │   │   ├── Modal.jsx                # Accessible modal dialogue overlay with backdrop blur
│   │   │   ├── CategoryIcon.jsx         # Dynamic Lucide icon resolver by name
│   │   │   └── EmptyState.jsx           # Clean empty state placeholder with action button
│   │   │
│   │   ├── layout/                      # Application Shell & Navigation
│   │   │   ├── Header.jsx               # Top app bar with month picker, quick stats, and add buttons
│   │   │   ├── Sidebar.jsx              # Desktop sidebar navigation and loan balance indicator
│   │   │   └── BottomNav.jsx            # Mobile bottom navigation bar and expandable sheet
│   │   │
│   │   ├── dashboard/
│   │   │   └── OverviewTab.jsx          # Top-level financial health overview & KPI dashboard
│   │   │
│   │   ├── budget/
│   │   │   └── BudgetTab.jsx            # Monthly PLN budget envelopes, category editor & income tracker
│   │   │
│   │   ├── expenses/
│   │   │   └── ExpenseTrackerTab.jsx    # Real transaction history log, filters, search & CSV export
│   │   │
│   │   ├── remittance/
│   │   │   └── RemittanceTab.jsx        # PLN-to-INR transfer logger, ₹10k–₹15k goal gauge & converter
│   │   │
│   │   ├── savings/
│   │   │   └── SavingsTab.jsx           # Savings envelopes and milestone funds
│   │   │
│   │   ├── loan/
│   │   │   └── LoanTrackerTab.jsx       # Avanse Education Loan starting at ₹11,00,000 & repayment log
│   │   │
│   │   ├── wishlist/
│   │   │   └── WishlistTab.jsx          # Planned purchases tracker with priorities & status
│   │   │
│   │   ├── analytics/
│   │   │   └── AnalyticsTab.jsx         # Visual spending analytics and Recharts diagrams
│   │   │
│   │   └── modals/                      # User Input Dialogs
│   │       ├── AddTransactionModal.jsx  # Form to record real personal PLN expenses or incomes
│   │       ├── AddTransferModal.jsx     # Form to record PLN-to-INR transfers with loan auto-sync
│   │       ├── AddLoanPaymentModal.jsx  # Form to manually record Avanse loan EMI repayments
│   │       └── AddWishlistItemModal.jsx # Form to add planned wishlist items
```

---

## 💻 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Run linter**:
   ```bash
   npm run lint
   ```
