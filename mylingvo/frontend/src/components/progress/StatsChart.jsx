import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="rounded-lg p-3 text-sm"
      style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.15)' }}
    >
      <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

export default function StatsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div
        className="rounded-xl p-6 flex items-center justify-center"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,255,255,0.1)',
          minHeight: 300,
        }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>Маълумот йўқ</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    date: item.date,
    correct: item.correct || 0,
    wrong: item.wrong || 0,
  }));

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
        Кунлик фаоллик (охирги 30 кун)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#a0a0b0', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          />
          <YAxis
            tick={{ fill: '#a0a0b0', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: '#a0a0b0', fontSize: 12 }}
          />
          <Bar
            dataKey="correct"
            name="Тўғри"
            fill="#4ade80"
            stackId="a"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="wrong"
            name="Хато"
            fill="#ef4444"
            stackId="a"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
