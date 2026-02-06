import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVerbs, getVerb } from '../api/verbs';

const GROUP_OPTIONS = [
  { value: '', label: 'Барчаси' },
  { value: '1', label: '1-гуруҳ' },
  { value: '2', label: '2-гуруҳ' },
];

const PERSON_LABELS = ['Я', 'Ты', 'Он/Она/Оно', 'Мы', 'Вы', 'Они'];

export default function VerbsPage() {
  const [page, setPage] = useState(1);
  const [group, setGroup] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const params = { page };
  if (group) params.group = group;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['verbs', params],
    queryFn: () => getVerbs(params).then((r) => r.data),
  });

  const verbs = data?.data || [];
  const meta = data?.meta || {};
  const lastPage = meta.last_page || 1;
  const currentPage = meta.current_page || page;

  const handleGroupChange = (newGroup) => {
    setGroup(newGroup);
    setPage(1);
  };

  const handleToggle = (verbId) => {
    setExpandedId(expandedId === verbId ? null : verbId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Феъллар
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Рус тили феълларини ва тусланишини ўрганинг
          </p>
        </div>

        {/* Group filter */}
        <div className="flex gap-2">
          {GROUP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleGroupChange(opt.value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={{
                background: group === opt.value ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: group === opt.value ? 'white' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: group === opt.value ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>Юкланмоқда...</div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: 'var(--error)' }}>
            Хатолик: {error?.response?.data?.message || 'Маълумотларни юклашда хатолик юз берди'}
          </p>
        </div>
      )}

      {/* Verbs list */}
      {!isLoading && !isError && (
        <>
          {verbs.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ background: 'var(--bg-card)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Феъллар топилмади</p>
            </div>
          ) : (
            <div className="space-y-3">
              {verbs.map((verb) => (
                <VerbCard
                  key={verb.id}
                  verb={verb}
                  isExpanded={expandedId === verb.id}
                  onToggle={() => handleToggle(verb.id)}
                />
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

function VerbCard({ verb, isExpanded, onToggle }) {
  // Fetch full verb data with conjugations when expanded
  const { data, isLoading } = useQuery({
    queryKey: ['verb', verb.id],
    queryFn: () => getVerb(verb.id).then((r) => r.data),
    enabled: isExpanded,
  });

  const fullVerb = data?.data || null;
  const conjugations = fullVerb?.conjugations || [];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Verb header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left cursor-pointer"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {verb.nsv}
            </span>
            {verb.sv && (
              <>
                <span style={{ color: 'var(--text-secondary)' }}>/</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {verb.sv}
                </span>
              </>
            )}
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: verb.group === 1 ? 'rgba(59,130,246,0.15)' : 'rgba(168,85,247,0.15)',
                color: verb.group === 1 ? '#3b82f6' : '#a855f7',
                border: `1px solid ${verb.group === 1 ? '#3b82f644' : '#a855f744'}`,
              }}
            >
              {verb.group}-гуруҳ
            </span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {verb.uz}
          </p>
        </div>
        <span
          className="text-lg transition-transform duration-200"
          style={{
            color: 'var(--text-secondary)',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          &#9660;
        </span>
      </button>

      {/* Conjugation table (expandable) */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="py-4 text-center">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Юкланмоқда...</span>
            </div>
          ) : conjugations.length === 0 ? (
            <div className="py-4 text-center">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Тусланиш маълумотлари мавжуд эмас
              </span>
            </div>
          ) : (
            <ConjugationTable conjugations={conjugations} />
          )}
        </div>
      )}
    </div>
  );
}

function ConjugationTable({ conjugations }) {
  // Group by aspect, then by tense
  const grouped = {};
  conjugations.forEach((conj) => {
    const key = `${conj.aspect}`;
    if (!grouped[key]) grouped[key] = {};
    if (!grouped[key][conj.tense]) grouped[key][conj.tense] = [];
    grouped[key][conj.tense].push(conj);
  });

  const aspectLabels = { nsv: 'НСВ (Несовершенный)', sv: 'СВ (Совершенный)' };
  const tenseLabels = {
    present: 'Ҳозирги замон',
    past: 'Ўтган замон',
    future: 'Келажак замон',
    imperative: 'Буйруқ',
  };

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([aspect, tenses]) => (
        <div key={aspect}>
          <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--primary-light)' }}>
            {aspectLabels[aspect] || aspect}
          </h4>
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--primary)', color: 'white' }}>
                  <th className="text-left px-3 py-2 font-medium">Замон</th>
                  {PERSON_LABELS.map((label, i) => (
                    <th key={i} className="text-left px-3 py-2 font-medium">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(tenses).map(([tense, forms], tenseIdx) => {
                  // Sort forms by person_index
                  const sorted = [...forms].sort((a, b) => a.person_index - b.person_index);

                  return (
                    <tr
                      key={tense}
                      style={{
                        background: tenseIdx % 2 === 0 ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <td className="px-3 py-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {tenseLabels[tense] || tense}
                      </td>
                      {PERSON_LABELS.map((_, personIdx) => {
                        const form = sorted.find((f) => f.person_index === personIdx);
                        return (
                          <td key={personIdx} className="px-3 py-2" style={{ color: 'var(--text-primary)' }}>
                            {form?.form || '---'}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
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
