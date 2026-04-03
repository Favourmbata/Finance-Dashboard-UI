import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';

function buildMonthlyData(transactions) {
  const map = {};
  transactions.forEach(t => {
    const month = t.date.slice(0, 7); 
    if (!map[month]) map[month] = { income: 0, expenses: 0 };
    if (t.type === 'income')  map[month].income   += t.amount;
    else                      map[month].expenses += t.amount;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, vals]) => ({
      month: new Date(month + '-01').toLocaleString('default', { month: 'short', year: '2-digit' }),
      Income:   vals.income,
      Expenses: vals.expenses,
      Balance:  vals.income - vals.expenses,
    }));
}

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-lg p-3 shadow-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function BalanceTrendChart() {
  const { state } = useApp();
  const { transactions, darkMode } = state;
  const data = buildMonthlyData(transactions);

  const axisColor = darkMode ? '#6b7280' : '#9ca3af';
  const gridColor = darkMode ? '#374151' : '#f3f4f6';

  return (
    <div className={`rounded-xl p-5 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <h2 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Cash Flow</h2>
      {data.length === 0 ? (
        <p className={`text-sm text-center py-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No data available</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="Income"   stroke="#10b981" fill="url(#incomeGrad)"  strokeWidth={2} />
            <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" fill="url(#expenseGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
