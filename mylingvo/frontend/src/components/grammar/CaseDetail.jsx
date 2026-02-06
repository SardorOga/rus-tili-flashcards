export default function CaseDetail({ grammarCase }) {
  const caseInfo = grammarCase.case || {};
  const rows = grammarCase.rows || [];
  const examples = grammarCase.sentence_examples || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl p-6"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderLeft: `4px solid ${grammarCase.color || 'var(--primary)'}`,
        }}
      >
        <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {caseInfo.name_ru}
        </h2>
        <p className="text-sm mb-2" style={{ color: 'var(--primary-light)' }}>
          {caseInfo.name_uz}
        </p>
        <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>Савол: </span>
          {caseInfo.question_ru}
          {caseInfo.question_uz && ` / ${caseInfo.question_uz}`}
        </p>
        {grammarCase.description && (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {grammarCase.description}
          </p>
        )}
        {grammarCase.prepositions && grammarCase.prepositions.length > 0 && (
          <div className="mt-4">
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Предлоглар: </span>
            <div className="inline-flex flex-wrap gap-1.5 ml-1">
              {grammarCase.prepositions.map((prep, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: `${grammarCase.color || 'var(--primary)'}22`,
                    color: grammarCase.color || 'var(--primary-light)',
                  }}
                >
                  {prep}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ending patterns table */}
      {rows.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="px-4 py-3 font-semibold text-sm"
            style={{ background: grammarCase.color || 'var(--primary)', color: 'white' }}
          >
            Қўшимчалар (Окончания)
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Тури</th>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Бирлик</th>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Мисоллар</th>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Кўплик</th>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: 'var(--text-secondary)' }}>Мисоллар</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={row.id}
                  style={{
                    background: index % 2 === 0 ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>
                    {row.type}
                    {row.is_animate != null && (
                      <span className="text-xs ml-1" style={{ color: 'var(--text-secondary)' }}>
                        ({row.is_animate ? 'одуш.' : 'неодуш.'})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="font-mono font-medium px-1.5 py-0.5 rounded"
                      style={{
                        background: `${grammarCase.color || 'var(--primary)'}15`,
                        color: grammarCase.color || 'var(--primary-light)',
                      }}
                    >
                      {row.sg_ending || '---'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                    {Array.isArray(row.sg_examples) ? row.sg_examples.join(', ') : row.sg_examples || '---'}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className="font-mono font-medium px-1.5 py-0.5 rounded"
                      style={{
                        background: `${grammarCase.color || 'var(--primary)'}15`,
                        color: grammarCase.color || 'var(--primary-light)',
                      }}
                    >
                      {row.pl_ending || '---'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                    {Array.isArray(row.pl_examples) ? row.pl_examples.join(', ') : row.pl_examples || '---'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sentence examples */}
      {examples.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="px-4 py-3 font-semibold text-sm"
            style={{ background: grammarCase.color || 'var(--primary)', color: 'white' }}
          >
            Мисол гаплар
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            {examples.map((example, index) => (
              <div
                key={example.id}
                className="px-4 py-3"
                style={{ background: index % 2 === 0 ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)' }}
              >
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                  {example.sentence_ru}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {example.sentence_uz}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
