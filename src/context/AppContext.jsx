import { createContext, useContext, useReducer, useEffect } from 'react';
import { mockTransactions } from '../data/transactions';

const AppContext = createContext(null);

const STORAGE_KEY = 'finance_dashboard_state';

const initialState = {
  transactions: mockTransactions,
  role: 'viewer', 
  darkMode: false,
  filters: {
    search: '',
    type: 'all',      
    category: 'all',
    sortBy: 'date',   
    sortDir: 'desc',  
  },
  activeTab: 'dashboard',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_FILTER':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed, filters: init.filters };
      }
    } catch {}
    return init;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      transactions: state.transactions,
      role: state.role,
      darkMode: state.darkMode,
    }));
  }, [state.transactions, state.role, state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
