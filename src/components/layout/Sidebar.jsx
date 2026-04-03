import { LayoutDashboard, ArrowLeftRight, Lightbulb, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights',     label: 'Insights',     icon: Lightbulb },
];

export default function Sidebar({ open, onClose }) {
  const { state, dispatch } = useApp();
  const { activeTab, darkMode } = state;

  return (
    <>
      
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
          ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
          border-r
        `}
      >
        
        <div className={`flex items-center justify-between px-6 py-5 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              FinanceIQ
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

     
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { dispatch({ type: 'SET_TAB', payload: id }); onClose(); }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${activeTab === id
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>

      
        <div className={`px-6 py-4 border-t text-xs ${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          Finance Dashboard v1.0
        </div>
      </aside>
    </>
  );
}
