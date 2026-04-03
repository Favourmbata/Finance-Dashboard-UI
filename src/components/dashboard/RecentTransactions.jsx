import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_COLORS } from '../../data/transactions';

export default function RecentTransactions() {
  const { state, dispatch } = useApp();
  const { transactions, darkMode } = state;

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className={`rounded-xl p-5 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recent Transactions</h2>
        <button
          onClick={() => dispatch({ type: 'SET_TAB', payload: 'transactions' })}
          className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
        >
          View all
        </button>
      </div>

      {recent.length === 0 ? (
        <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No transactions yet</p>
      ) : (
        <ul className="space-y-3">
          {recent.map(t => (
            <li key={t.id} className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: (CATEGORY_COLORS[t.category] || '#6366f1') + '22' }}
              >
                {t.type === 'income'
                  ? <ArrowUpRight size={16} className="text-emerald-500" />
                  : <ArrowDownRight size={16} className="text-rose-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.description}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t.category} · {t.date}</p>
              </div>
              <span className={`text-sm font-semibold flex-shrink-0 ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
