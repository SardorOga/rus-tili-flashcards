import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../../api/admin';

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => getAdminStats().then((r) => r.data?.data || r.data),
  });

  const statCards = [
    {
      label: 'Жами фойдаланувчилар',
      value: stats?.total_users || 0,
      icon: '\uD83D\uDC65',
      color: '#60a5fa',
      link: '/admin/users',
    },
    {
      label: 'Жами машқлар',
      value: stats?.total_exercises || 0,
      icon: '\uD83C\uDF93',
      color: 'var(--primary-light)',
      link: null,
    },
    {
      label: 'Бугун фаол',
      value: stats?.active_today || 0,
      icon: '\uD83D\uDFE2',
      color: 'var(--success)',
      link: null,
    },
    {
      label: 'Машхур сўзлар',
      value: stats?.popular_words || 0,
      icon: '\u2B50',
      color: 'var(--warning)',
      link: '/admin/words',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Админ панел
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Тизим статистикаси ва бошқарув
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
            style={{ background: 'var(--primary)' }}
          >
            Фойдаланувчилар
          </Link>
          <Link
            to="/admin/words"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white cursor-pointer"
            style={{ background: 'var(--bg-input)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Сўзлар
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)' }}
        >
          Маълумот юклашда хатолик: {error.message}
        </div>
      )}

      {/* Stat cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-6 animate-pulse h-28"
              style={{ background: 'var(--bg-card)' }}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const content = (
              <div
                className="rounded-xl p-6 transition-all hover:scale-[1.02]"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {card.label}
                  </span>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <p className="text-3xl font-bold" style={{ color: card.color }}>
                  {card.value}
                </p>
              </div>
            );

            return card.link ? (
              <Link key={card.label} to={card.link}>
                {content}
              </Link>
            ) : (
              <div key={card.label}>{content}</div>
            );
          })}
        </div>
      )}

      {/* Quick info */}
      {stats && (
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Қўшимча маълумот
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.total_words != null && (
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Жами сўзлар:
                </span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {stats.total_words}
                </span>
              </div>
            )}
            {stats.total_sentences != null && (
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Жами гаплар:
                </span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {stats.total_sentences}
                </span>
              </div>
            )}
            {stats.avg_xp != null && (
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Ўртача XP:
                </span>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {Math.round(stats.avg_xp)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
