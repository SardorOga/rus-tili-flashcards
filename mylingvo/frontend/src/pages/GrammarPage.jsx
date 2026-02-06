import { useQuery } from '@tanstack/react-query';
import { getGrammarCases } from '../api/grammar';
import CaseOverview from '../components/grammar/CaseOverview';

export default function GrammarPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['grammarCases'],
    queryFn: () => getGrammarCases().then((r) => r.data),
  });

  const cases = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Грамматика
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Рус тили келишиклари (падежлар)
        </p>
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

      {/* Grammar cases grid */}
      {!isLoading && !isError && (
        <>
          {cases.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ background: 'var(--bg-card)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Келишиклар топилмади</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cases.map((grammarCase) => (
                <CaseOverview key={grammarCase.id} grammarCase={grammarCase} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
