import useAuth from '../hooks/useAuth';
import { getLevelFromXp, getXpForNextLevel } from '../utils/helpers';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>Юкланмоқда...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl p-12 text-center" style={{ background: 'var(--bg-card)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Фойдаланувчи маълумотлари топилмади</p>
      </div>
    );
  }

  const xp = user.progress?.xp || 0;
  const level = getLevelFromXp(xp);
  const nextLevelXp = getXpForNextLevel(xp);
  const xpProgress = nextLevelXp > 0 ? ((xp % 100) / 100) * 100 : 0;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Page header */}
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
        Профил
      </h1>

      {/* User info card */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0"
            style={{
              background: 'var(--primary)',
              color: 'white',
            }}
          >
            {user.name?.charAt(0)?.toUpperCase() || '?'}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate" style={{ color: 'var(--text-primary)' }}>
              {user.name}
            </h2>
            <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Статистика
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatItem label="Даража" value={level} />
          <StatItem label="XP" value={xp} />
          <StatItem
            label="Стрик"
            value={`${user.progress?.streak_days || 0} кун`}
          />
          <StatItem
            label="Сўзлар"
            value={user.progress?.words_learned || 0}
          />
        </div>

        {/* XP progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Кейинги даражагача
            </span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {xp % 100} / 100 XP
            </span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${xpProgress}%`,
                background: 'var(--primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Settings card */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Созламалар
        </h3>

        <div className="space-y-4">
          <SettingRow label="Тил" value={user.locale || 'uz'} />
          <SettingRow label="Вақт минтақаси" value={user.timezone || 'Asia/Tashkent'} />
          <SettingRow
            label="Кундалик мақсад"
            value={`${user.progress?.daily_goal || 10} машқ`}
          />
          <SettingRow
            label="Рўйхатдан ўтган сана"
            value={
              user.created_at
                ? new Date(user.created_at).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '---'
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div
      className="rounded-lg p-3 text-center"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <div className="text-xl font-bold" style={{ color: 'var(--primary-light)' }}>
        {value}
      </div>
      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div
      className="flex items-center justify-between py-2"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      <span
        className="text-sm font-medium px-3 py-1 rounded-lg"
        style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
      >
        {value}
      </span>
    </div>
  );
}
