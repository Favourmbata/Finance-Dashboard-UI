import { useState, useMemo } from 'react';
import { Search, Plus, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, CATEGORY_COLORS } from '../../data/transactions';
import TransactionModal from './TransactionModal';

function Badge({ type }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      type === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
    }`}>
      {type}
    </span>
  );
}

export default function TransactionsTable() {
  const { state, dispatch } = useApp();
  const { transactions, filters, role, darkMode } = state;
  const [modal, setModal] = useState(null); // null | 'add' | transaction object

  const { search, type, category, sortBy, sortDir } = filters;

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) list = list.filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (type !== 'all') list = list.filter(t => t.type === type);
    if (category !== 'all') list = list.filter(t => t.category === category);
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'amount') return (a.amount - b.amount) * dir;
      return a.date.localeCompare(b.date) * dir;
    });
    return list;
  }, [transactions, search, type, category, sortBy, sortDir]);

  function toggleSort(field) {
    if (sortBy === field) {
      dispatch({ type: 'SET_FILTER', payload: { sortDir: sortDir === 'asc' ? 'desc' : 'asc' } });
    } else {
      dispatch({ type: 'SET_FILTER', payload: { sortBy: field, sortDir: 'desc' } });
    }
  }

  function SortIcon({ field }) {
    if (sortBy !== field) return <ArrowUpDown size={13} className="opacity-40" />;
    return sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  }

  const inputCls = `px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900'
  }`;

  const thCls = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div>
    
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          <input
            className={`${inputCls} pl-9 w-full`}
            placeholder="Search transactions..."
            value={search}
            onChange={e => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
          />
        </div>
        <select className={inputCls} value={type} onChange={e => dispatch({ type: 'SET_FILTER', payload: { type: e.target.value } })}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select className={inputCls} value={category} onChange={e => dispatch({ type: 'SET_FILTER', payload: { category: e.target.value } })}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {role === 'admin' && (
          <button
            onClick={() => setModal('add')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Plus size={15} /> Add
          </button>
        )}
      </div>

      
      <div className={`rounded-xl border overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
              <tr>
                <th className={thCls}>
                  <button className="flex items-center gap-1 hover:opacity-80" onClick={() => toggleSort('date')}>
                    Date <SortIcon field="date" />
                  </button>
                </th>
                <th className={thCls}>Description</th>
                <th className={thCls}>Category</th>
                <th className={thCls}>Type</th>
                <th className={thCls}>
                  <button className="flex items-center gap-1 hover:opacity-80" onClick={() => toggleSort('amount')}>
                    Amount <SortIcon field="amount" />
                  </button>
                </th>
                {role === 'admin' && <th className={thCls}>Actions</th>}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5} className={`px-4 py-10 text-center text-sm ${darkMode ? 'text-gray-500 bg-gray-800' : 'text-gray-400 bg-white'}`}>
                    No transactions match your filters
                  </td>
                </tr>
              ) : filtered.map(t => (
                <tr key={t.id} className={`transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'}`}>
                  <td className={`px-4 py-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{t.date}</td>
                  <td className={`px-4 py-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.description}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[t.category] || '#6366f1' }} />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{t.category}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3"><Badge type={t.type} /></td>
                  <td className={`px-4 py-3 text-sm font-semibold ${t.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                  </td>
                  {role === 'admin' && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(t)} className={`p-1.5 rounded-lg transition ${darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`} aria-label="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: t.id })} className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition" aria-label="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className={`px-4 py-3 text-xs border-t ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
            Showing {filtered.length} of {transactions.length} transactions
          </div>
        )}
      </div>

      {modal && (
        <TransactionModal
          transaction={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
