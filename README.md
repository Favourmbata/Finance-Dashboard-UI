# FinanceIQ — Finance Dashboard

A clean, interactive finance dashboard built with React + Vite + Tailwind CSS.

## Setup

```bash
cd finance-dashboard
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Features

### Dashboard
- Summary cards: Total Balance, Income, Expenses, Savings Rate
- Monthly Cash Flow area chart (income vs expenses over time)
- Spending by Category donut chart
- Recent transactions list

### Transactions
- Full transaction table with search, type filter, and category filter
- Sort by date or amount (ascending/descending)
- Admin role: add, edit, and delete transactions via modal

### Insights
- Top spending category
- Month-over-month expense change
- Average monthly spend
- Best saving month
- Category bar chart
- Monthly income vs expenses comparison table

### Role-Based UI
Switch between **Viewer** and **Admin** using the dropdown in the header.
- Viewer: read-only access
- Admin: can add, edit, and delete transactions

### Other
- Dark mode toggle
- Data persisted to localStorage
- Fully responsive (mobile sidebar with overlay)
- Empty state handling throughout

## Tech Stack
- React 19 + Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Recharts for data visualization
- Lucide React for icons
- React Context + useReducer for state management
