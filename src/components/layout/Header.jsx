import { Menu, Moon, Sun, Shield, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const TAB_LABELS = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  insights: 'Insights',
};

export default function Header({ onMenuClick }) {
  const { state, dispatch } = useApp();
  const { darkMode, role, activeTab } = state;

  return (
    <header className={`
      sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4
      border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className={`lg:hidden p-2 rounded-lg ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {TAB_LABELS[activeTab]}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
 
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          {role === 'admin' ? (
            <Shield size={14} className="text-indigo-500" />
          ) : (
            <Eye size={14} className="text-gray-400" />
          )}
          <select
            value={role}
            onChange={e => dispatch({ type: 'SET_ROLE', payload: e.target.value })}
            className={`bg-transparent text-sm font-medium cursor-pointer outline-none ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
            aria-label="Switch role"
          >
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        
        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
          className={`p-2 rounded-lg transition-colors ${
            darkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
