import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORY_COLORS } from '../../data/transactions';

function InsightCard({ icon: Icon, title, value, sub, color, darkMode }) {
  return (
    <div className={`rounded-xl p-5 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <div>
          <p className={`text-xs font-medium uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-lg font-bold mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {sub && <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{sub}</p>}
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-lg p-3 shadow-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <p className="font-semibold">{label}</p>
      <p>Expenses: ${payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

export default function InsightsSection() {
  const { state } = useApp();
  const { transactions, darkMode } = state;

  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes  = transactions.filter(t => t.type === 'income');


  const catMap = {};
  expenses.forEach(t => { catMap[t.category] = (catMap[t.category] || 0) + t.amount; });
  const catData = Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const topCat = catData[0];


  const monthMap = {};
  transactions.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!monthMap[m]) monthMap[m] = { income: 0, expense: 0 };
    monthMap[m][t.type] += t.amount;
  });
  const months = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b));
  const lastTwo = months.slice(-2);
  const prevMonth = lastTwo[0];
  const currMonth = lastTwo[1];
  const expenseDiff = currMonth && prevMonth
    ? ((currMonth[1].expense - prevMonth[1].expense) / (prevMonth[1].expense || 1) * 100).toFixed(1)
    : null;

 
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const avgMonthly = months.length > 0 ? (totalExpense / months.length).toFixed(0) : 0;

  
  const bestMonth = months.reduce((best, [m, v]) => {
    const saving = v.income - v.expense;
    return saving > (best?.saving ?? -Infinity) ? { month: m, saving } : best;
  }, null);

  const axisColor = darkMode ? '#6b7280' : '#9ca3af';
  const gridColor = darkMode ? '#374151' : '#f3f4f6';

  return (
    <div className="space-y-6">
     
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <InsightCard
          icon={Award}
          title="Top Spending Category"
          value={topCat?.name ?? 'N/A'}
          sub={topCat ? `$${topCat.value.toLocaleString()} total` : undefined}
          color="bg-orange-500"
          darkMode={darkMode}
        />
        <InsightCard
          icon={expenseDiff >= 0 ? TrendingUp : TrendingDown}
          title="Expense vs Last Month"
          value={expenseDiff !== null ? `${expenseDiff > 0 ? '+' : ''}${expenseDiff}%` : 'N/A'}
          sub={currMonth ? `${currMonth[0]} vs ${prevMonth?.[0]}` : undefined}
          color={expenseDiff >= 0 ? 'bg-rose-500' : 'bg-emerald-500'}
          darkMode={darkMode}
        />
        <InsightCard
          icon={AlertCircle}
          title="Avg Monthly Spend"
          value={`$${Number(avgMonthly).toLocaleString()}`}
          sub="across all months"
          color="bg-indigo-500"
          darkMode={darkMode}
        />
        <InsightCard
          icon={TrendingUp}
          title="Best Saving Month"
          value={bestMonth?.month ?? 'N/A'}
          sub={bestMonth ? `$${bestMonth.saving.toLocaleString()} saved` : undefined}
          color="bg-teal-500"
          darkMode={darkMode}
        />
      </div>

      
      <div className={`rounded-xl p-5 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Expenses by Category</h2>
        {catData.length === 0 ? (
          <p className={`text-sm text-center py-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={catData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} angle={-35} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: axisColor, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {catData.map(entry => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      
      <div className={`rounded-xl p-5 shadow-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Monthly Income vs Expenses</h2>
        {months.length === 0 ? (
          <p className={`text-sm text-center py-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  <th className="text-left py-2 px-3 text-xs font-semibold uppercase">Month</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase">Income</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase">Expenses</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold uppercase">Net</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                {months.map(([month, vals]) => {
                  const net = vals.income - vals.expense;
                  return (
                    <tr key={month} className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      <td className="py-2.5 px-3 font-medium">{month}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-500">${vals.income.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right text-rose-500">${vals.expense.toLocaleString()}</td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {net >= 0 ? '+' : ''}${net.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
