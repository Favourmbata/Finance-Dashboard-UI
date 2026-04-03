import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function Card({ icon: Icon, label, value, color, darkMode }) {
  return (
    <div className={`rounded-xl p-5 flex items-center gap-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
        <p className={`text-xl font-bold mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      </div>
    </div>
  );
}

function fmt(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export default function SummaryCards() {
  const { state } = useApp();
  const { transactions, darkMode } = state;

  const income  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savings = income > 0 ? ((balance / income) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card icon={Wallet}      label="Total Balance"  value={fmt(balance)}      color="bg-indigo-500" darkMode={darkMode} />
      <Card icon={TrendingUp}  label="Total Income"   value={fmt(income)}       color="bg-emerald-500" darkMode={darkMode} />
      <Card icon={TrendingDown} label="Total Expenses" value={fmt(expense)}     color="bg-rose-500"   darkMode={darkMode} />
      <Card icon={PiggyBank}   label="Savings Rate"   value={`${savings}%`}    color="bg-amber-500"  darkMode={darkMode} />
    </div>
  );
}
