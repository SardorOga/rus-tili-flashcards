import { useQuery } from '@tanstack/react-query';
import { getStreak } from '../../api/progress';

export default function StreakWidget() {
  const { data, isLoading } = useQuery({
    queryKey: ['progress', 'streak'],
    queryFn: () => getStreak().then((r) => r.data?.data || r.data),
  });

  if (isLoading) {
    return (
      <div
        className="rounded-xl p-5 animate-pulse"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="h-20" />
      </div>
    );
  }

  const streak = data || {};
  const currentStreak = streak.current_streak || 0;
  const longestStreak = streak.longest_streak || 0;
  const lastDays = streak.last_7_days || [];

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Серия
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-3xl">&#128293;</span>
          <span className="text-3xl font-bold" style={{ color: 'var(--warning)' }}>
            {currentStreak}
          </span>
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            кун
          </span>
        </div>
      </div>

      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
        Энг узоқ серия:{' '}
        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
          {longestStreak} кун
        </span>
      </p>

      {/* Last 7 days calendar */}
      <div className="flex gap-2 justify-between">
        {Array.from({ length: 7 }, (_, i) => {
          const dayData = lastDays[i];
          const isActive = dayData?.active || false;
          const dayLabel = dayData?.day_label || '';

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                style={{
                  background: isActive
                    ? 'rgba(74, 222, 128, 0.2)'
                    : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? 'var(--success)' : 'rgba(255,255,255,0.1)'}`,
                  color: isActive ? 'var(--success)' : 'var(--text-secondary)',
                }}
              >
                {isActive ? '\u2713' : ''}
              </div>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
