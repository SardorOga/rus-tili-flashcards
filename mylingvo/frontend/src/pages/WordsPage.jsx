import { useState } from 'react';
import { useWords } from '../hooks/useWords';
import WordCard from '../components/words/WordCard';
import { GENDERS } from '../utils/helpers';

const GENDER_OPTIONS = [
  { value: '', label: 'Барчаси' },
  { value: 'м', label: 'м - Мужской' },
  { value: 'ж', label: 'ж - Женский' },
  { value: 'ср', label: 'ср - Средний' },
  { value: 'мн', label: 'мн - Множественное' },
];

export default function WordsPage() {
  const [page, setPage] = useState(1);
  const [gender, setGender] = useState('');

  const params = { page };
  if (gender) params.gender = gender;

  const { data, isLoading, isError, error } = useWords(params);

  const words = data?.data || [];
  const meta = data?.meta || {};
  const lastPage = meta.last_page || 1;
  const currentPage = meta.current_page || page;

  const handleGenderChange = (newGender) => {
    setGender(newGender);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Сўзлар
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Рус тилидаги от ва сифатларни ўрганинг
          </p>
        </div>

        {/* Gender filter */}
        <div className="flex flex-wrap gap-2">
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleGenderChange(opt.value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={{
                background: gender === opt.value ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: gender === opt.value ? 'white' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: gender === opt.value ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>Юкланмоқда...</div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: 'var(--error)' }}>
            Хатолик: {error?.response?.data?.message || 'Маълумотларни юклашда хатолик юз берди'}
          </p>
        </div>
      )}

      {/* Word grid */}
      {!isLoading && !isError && (
        <>
          {words.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ background: 'var(--bg-card)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Сўзлар топилмади</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {words.map((word) => (
                <WordCard key={word.id} word={word} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Олдинги
              </button>

              <div className="flex items-center gap-1">
                {generatePageNumbers(currentPage, lastPage).map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="px-2" style={{ color: 'var(--text-secondary)' }}>
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className="w-9 h-9 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                      style={{
                        background: p === currentPage ? 'var(--primary)' : 'transparent',
                        color: p === currentPage ? 'white' : 'var(--text-secondary)',
                      }}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                disabled={currentPage >= lastPage}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                Кейинги
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function generatePageNumbers(current, last) {
  const pages = [];
  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < last - 2) pages.push('...');
    pages.push(last);
  }
  return pages;
}
