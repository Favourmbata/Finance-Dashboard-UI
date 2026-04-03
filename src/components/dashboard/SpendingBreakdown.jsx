import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../../context/AppContext';
import { CATEGORY_COLORS } from '../../data/transactions';

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className={`rounded-lg p-3 shadow-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <p className="font-semibold">{name}</p>
      <p>${value.toLocaleString()}</p>
    </div>
  );
};

export default function SpendingBreakdown() {
  const { state } = useApp();
  const { transactions, darkMode } = state;

  const categoryMap = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const data = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className={`rounded-xl p-5 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <h2 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Spending by Category</h2>
      {data.length === 0 ? (
        <p className={`text-sm text-center py-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No expense data</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#6366f1'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => (
                <span style={{ color: darkMode ? '#d1d5db' : '#374151' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
