import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import InsightsPage from './pages/InsightsPage';

function Layout() {
  const { state } = useApp();
  const { activeTab, darkMode } = state;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pages = {
    dashboard:    <DashboardPage />,
    transactions: <TransactionsPage />,
    insights:     <InsightsPage />,
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {pages[activeTab]}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
