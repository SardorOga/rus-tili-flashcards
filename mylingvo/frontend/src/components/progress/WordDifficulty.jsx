import { formatDate } from '../../utils/helpers';

function getDifficultyLabel(score) {
  if (score <= 0.3) return { label: 'Осон', color: 'var(--success)' };
  if (score <= 0.6) return { label: 'Ўрта', color: 'var(--warning)' };
  return { label: 'Қийин', color: 'var(--error)' };
}

function getCorrectPercentage(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

export default function WordDifficulty({ words }) {
  if (!words || words.length === 0) {
    return (
      <div
        className="rounded-xl p-6 flex items-center justify-center"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,255,255,0.1)',
          minHeight: 200,
        }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>Сўзлар статистикаси йўқ</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="px-5 py-4">
        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Сўзлар қийинлиги
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th
                className="text-left px-5 py-3 font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Сўз
              </th>
              <th
                className="text-center px-3 py-3 font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Кўрилган
              </th>
              <th
                className="text-center px-3 py-3 font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Тўғри %
              </th>
              <th
                className="text-center px-3 py-3 font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Қийинлик
              </th>
              <th
                className="text-center px-3 py-3 font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                Кейинги такрорлаш
              </th>
            </tr>
          </thead>
          <tbody>
            {words.map((word, i) => {
              const difficulty = getDifficultyLabel(word.difficulty_score || 0);
              const correctPct = getCorrectPercentage(word.correct_count, word.times_seen);

              return (
                <tr
                  key={word.id || i}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-5 py-3">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {word.word}
                    </span>
                    {word.word_uz && (
                      <span className="ml-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        ({word.word_uz})
                      </span>
                    )}
                  </td>
                  <td className="text-center px-3 py-3" style={{ color: 'var(--text-primary)' }}>
                    {word.times_seen || 0}
                  </td>
                  <td className="text-center px-3 py-3">
                    <span
                      className="font-medium"
                      style={{
                        color:
                          correctPct >= 70
                            ? 'var(--success)'
                            : correctPct >= 40
                              ? 'var(--warning)'
                              : 'var(--error)',
                      }}
                    >
                      {correctPct}%
                    </span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{
                        background: `${difficulty.color}15`,
                        color: difficulty.color,
                        border: `1px solid ${difficulty.color}30`,
                      }}
                    >
                      {difficulty.label}
                    </span>
                  </td>
                  <td
                    className="text-center px-3 py-3 text-xs"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {word.next_review ? formatDate(word.next_review) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
