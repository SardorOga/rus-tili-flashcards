import { useQuery } from '@tanstack/react-query';
import { getDashboard, getHistory, getWordStats } from '../api/progress';
import { getLevelFromXp, getXpForNextLevel } from '../utils/helpers';
import StreakWidget from '../components/progress/StreakWidget';
import StatsChart from '../components/progress/StatsChart';
import WordDifficulty from '../components/progress/WordDifficulty';

export default function ProgressPage() {
  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ['progress', 'dashboard'],
    queryFn: () => getDashboard().then((r) => r.data?.data || r.data),
  });

  const { data: history, isLoading: histLoading } = useQuery({
    queryKey: ['progress', 'history'],
    queryFn: () => getHistory(30).then((r) => r.data?.data || r.data),
  });

  const { data: wordStats, isLoading: wordsLoading } = useQuery({
    queryKey: ['progress', 'words'],
    queryFn: () =>
      getWordStats({ sort: 'difficulty_score', order: 'desc' }).then(
        (r) => r.data?.data || r.data
      ),
  });

  const xp = dashboard?.xp || 0;
  const level = getLevelFromXp(xp);
  const nextLevelXp = getXpForNextLevel(xp);
  const xpProgress = nextLevelXp > 0 ? ((xp % 100) / 100) * 100 : 0;

  const statCards = [
    {
      label: 'XP',
      value: xp,
      color: 'var(--warning)',
      icon: '\u2B50',
    },
    {
      label: 'Даража',
      value: level,
      color: 'var(--primary-light)',
      icon: '\uD83C\uDFC6',
    },
    {
      label: 'Серия',
      value: `${dashboard?.streak || 0} кун`,
      color: 'var(--accent)',
      icon: '\uD83D\uDD25',
    },
    {
      label: 'Сўзлар',
      value: dashboard?.words_learned || 0,
      color: 'var(--success)',
      icon: '\uD83D\uDCDA',
    },
    {
      label: 'Машқлар',
      value: dashboard?.exercises_done || 0,
      color: '#60a5fa',
      icon: '\uD83C\uDF93',
    },
  ];

  // Build a 30-day calendar grid for streak visualization
  const streakCalendar = [];
  const activeDays = new Set(
    (history || []).filter((d) => (d.correct || 0) + (d.wrong || 0) > 0).map((d) => d.date)
  );
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    streakCalendar.push({
      date: dateStr,
      active: activeDays.has(dateStr),
      dayNum: d.getDate(),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Прогресс
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Ўрганиш натижаларингиз
        </p>
      </div>

      {/* Stats summary cards */}
      {dashLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-5 animate-pulse h-24"
              style={{ background: 'var(--bg-card)' }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl p-5"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {card.label}
                </span>
                <span className="text-xl">{card.icon}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: card.color }}>
                {card.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* XP progress bar */}
      {!dashLoading && (
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Даража {level}
            </span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {xp} / {nextLevelXp} XP
            </span>
          </div>
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${xpProgress}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
              }}
            />
          </div>
        </div>
      )}

      {/* Streak widget + Streak calendar side by side */}
      <div className="grid md:grid-cols-2 gap-4">
        <StreakWidget />

        {/* Streak calendar (last 30 days) */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Охирги 30 кун
          </h3>
          <div className="grid grid-cols-10 gap-1.5">
            {streakCalendar.map((day) => (
              <div
                key={day.date}
                className="aspect-square rounded flex items-center justify-center text-xs"
                title={day.date}
                style={{
                  background: day.active
                    ? 'rgba(74, 222, 128, 0.25)'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${day.active ? 'var(--success)' : 'rgba(255,255,255,0.08)'}`,
                  color: day.active ? 'var(--success)' : 'var(--text-secondary)',
                  fontSize: '10px',
                }}
              >
                {day.dayNum}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity chart */}
      {histLoading ? (
        <div
          className="rounded-xl p-6 animate-pulse"
          style={{ background: 'var(--bg-card)', minHeight: 350 }}
        />
      ) : (
        <StatsChart data={history || []} />
      )}

      {/* Word difficulty table */}
      {wordsLoading ? (
        <div
          className="rounded-xl p-6 animate-pulse"
          style={{ background: 'var(--bg-card)', minHeight: 200 }}
        />
      ) : (
        <WordDifficulty words={wordStats || []} />
      )}
    </div>
  );
}
