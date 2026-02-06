import { Link } from 'react-router-dom';

export default function CaseOverview({ grammarCase }) {
  const caseInfo = grammarCase.case || {};

  return (
    <Link
      to={`/grammar/${grammarCase.id}`}
      className="block rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderLeft: `4px solid ${grammarCase.color || 'var(--primary)'}`,
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {caseInfo.name_ru}
        </h3>
        <span
          className="text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            background: `${grammarCase.color || 'var(--primary)'}22`,
            color: grammarCase.color || 'var(--primary)',
          }}
        >
          {caseInfo.question_ru}
        </span>
      </div>
      <p className="text-sm mb-2" style={{ color: 'var(--primary-light)' }}>
        {caseInfo.name_uz}
      </p>
      {grammarCase.description && (
        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {grammarCase.description}
        </p>
      )}
      {grammarCase.prepositions && grammarCase.prepositions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {grammarCase.prepositions.slice(0, 5).map((prep, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
            >
              {prep}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
