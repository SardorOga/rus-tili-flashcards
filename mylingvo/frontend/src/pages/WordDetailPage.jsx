import { useParams, Link } from 'react-router-dom';
import { useWord } from '../hooks/useWords';
import DeclensionTable from '../components/words/DeclensionTable';
import { GENDERS } from '../utils/helpers';

const GENDER_COLORS = {
  'м': '#3b82f6',
  'ж': '#ec4899',
  'ср': '#a855f7',
  'мн': '#f59e0b',
};

export default function WordDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useWord(id);

  const word = data?.data || null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>Юкланмоқда...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Link
          to="/words"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'var(--primary-light)' }}
        >
          &larr; Сўзлар рўйхати
        </Link>
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: 'var(--error)' }}>
            Хатолик: {error?.response?.data?.message || 'Сўзни юклашда хатолик юз берди'}
          </p>
        </div>
      </div>
    );
  }

  if (!word) return null;

  const genderColor = GENDER_COLORS[word.gender] || '#6b7280';

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/words"
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: 'var(--primary-light)' }}
      >
        &larr; Сўзлар рўйхати
      </Link>

      {/* Word header card */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {word.noun}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-bold px-3 py-1 rounded-full"
                style={{
                  background: `${genderColor}22`,
                  color: genderColor,
                  border: `1px solid ${genderColor}44`,
                }}
              >
                {word.gender} - {GENDERS[word.gender]}
              </span>
            </div>
          </div>
        </div>

        <div
          className="mt-4 pt-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                Ўзбекча (бирлик)
              </span>
              <p className="text-lg font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                {word.uz_noun}
              </p>
            </div>
            {word.uz_noun_plural && (
              <div>
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Ўзбекча (кўплик)
                </span>
                <p className="text-lg font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {word.uz_noun_plural}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adjectives with declension tables */}
      {word.adjectives && word.adjectives.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Сифатлар ва турланиш
          </h2>
          {word.adjectives.map((adj) => (
            <div key={adj.id} className="space-y-3">
              <div
                className="rounded-xl p-4"
                style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {adj.adjective}
                  </h3>
                  {adj.uz_adjective && (
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {adj.uz_adjective}
                    </span>
                  )}
                </div>
              </div>
              <DeclensionTable
                forms={adj.forms}
                title={`${adj.adjective} ${word.noun} - Турланиш жадвали`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
