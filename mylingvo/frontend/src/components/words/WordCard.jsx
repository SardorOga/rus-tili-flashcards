import { Link } from 'react-router-dom';
import { GENDERS } from '../../utils/helpers';

const GENDER_COLORS = {
  'м': '#3b82f6',
  'ж': '#ec4899',
  'ср': '#a855f7',
  'мн': '#f59e0b',
};

export default function WordCard({ word }) {
  return (
    <Link
      to={`/words/${word.id}`}
      className="block rounded-xl p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {word.noun}
        </h3>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
          style={{
            background: `${GENDER_COLORS[word.gender] || '#6b7280'}22`,
            color: GENDER_COLORS[word.gender] || '#6b7280',
            border: `1px solid ${GENDER_COLORS[word.gender] || '#6b7280'}44`,
          }}
        >
          {word.gender}
        </span>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        {word.uz_noun}
      </p>
      {word.adjectives && word.adjectives.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {word.adjectives.map((adj) => (
            <span
              key={adj.id}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
            >
              {adj.adjective}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
