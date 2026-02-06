import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../api/progress';
import useAuthStore from '../stores/authStore';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const user = useAuthStore(s => s.user);
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard().then(r => r.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>Юкланмоқда...</div>
      </div>
    );
  }

  const progress = data?.progress || {};
  const weeklyStats = data?.weekly_stats || [];

  const stats = [
    { label: 'XP', value: progress.total_xp ?? 0, icon: StarIcon, color: 'var(--warning)' },
    { label: 'Даража', value: progress.level ?? 1, icon: TrophyIcon, color: 'var(--primary-light)' },
    { label: 'Кетма-кетлик', value: `${progress.streak_days ?? 0} кун`, icon: FireIcon, color: 'var(--accent)' },
    { label: 'Сўзлар', value: progress.words_learned ?? 0, icon: BookIcon, color: '#60a5fa' },
    { label: 'Машқлар', value: progress.exercises_completed ?? 0, icon: CheckIcon, color: 'var(--success)' },
  ];

  const quickActions = [
    { label: 'Сўзлар', description: 'Янги сўзларни ўрганинг', to: '/words', icon: BookIcon, color: '#60a5fa' },
    { label: 'Машқлар', description: 'Билимингизни синанг', to: '/exercises', icon: PencilIcon, color: 'var(--warning)' },
    { label: 'Грамматика', description: 'Падежларни ўрганинг', to: '/grammar', icon: GrammarIcon, color: 'var(--accent)' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          Салом, {user?.name || 'Фойдаланувчи'}!
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Бугун нима ўрганамиз?</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 flex flex-col items-center text-center"
            style={{ background: 'var(--bg-card)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: `${stat.color}20` }}>
              <stat.icon color={stat.color} />
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {stat.value}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Тез амаллар</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="rounded-xl p-5 flex items-center gap-4 transition-transform hover:scale-[1.02]"
            style={{ background: 'var(--bg-card)' }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${action.color}20` }}>
              <action.icon color={action.color} />
            </div>
            <div>
              <div className="font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>{action.label}</div>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{action.description}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Weekly Activity Chart */}
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Ҳафталик фаоллик</h2>
      <div className="rounded-xl p-6" style={{ background: 'var(--bg-card)' }}>
        {weeklyStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={weeklyStats} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExercises" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a7d3e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3a7d3e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fill: '#a0a0b0', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#a0a0b0', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f3460',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#e8e8e8',
                  fontSize: '13px',
                }}
                labelFormatter={formatDate}
                formatter={(value) => [value, 'Машқлар']}
              />
              <Area
                type="monotone"
                dataKey="exercises_done"
                stroke="#3a7d3e"
                strokeWidth={2}
                fill="url(#colorExercises)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ҳали маълумот йўқ. Машқларни бошланг!</p>
            <Link
              to="/exercises"
              className="mt-4 px-6 py-2 rounded-lg text-white text-sm font-medium"
              style={{ background: 'var(--primary)' }}
            >
              Бошлаш
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* Helper */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const days = ['Як', 'Ду', 'Се', 'Чо', 'Па', 'Жу', 'Ша'];
  return days[date.getDay()];
}

/* Icon Components */
function StarIcon({ color }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function TrophyIcon({ color }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 000-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
      <path d="M18 2H6v7a6 6 0 0012 0V2z" />
    </svg>
  );
}

function FireIcon({ color }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill={color}>
      <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.568 1.885-5.17 3.542-6.858A.75.75 0 0110 9.75v1.5c0 .138.112.25.25.25s.25-.112.25-.25V7.25a.75.75 0 011.207-.593C14.674 8.837 19 12.38 19 16c0 3.866-3.134 7-7 7z" />
    </svg>
  );
}

function BookIcon({ color }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

function CheckIcon({ color }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function PencilIcon({ color }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function GrammarIcon({ color }) {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}
