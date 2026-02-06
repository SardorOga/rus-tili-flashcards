import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getGrammarCase } from '../api/grammar';
import CaseDetail from '../components/grammar/CaseDetail';

export default function GrammarCasePage() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['grammarCase', id],
    queryFn: () => getGrammarCase(id).then((r) => r.data),
    enabled: !!id,
  });

  const grammarCase = data?.data || null;

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
          to="/grammar"
          className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'var(--primary-light)' }}
        >
          &larr; Грамматика
        </Link>
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: 'var(--error)' }}>
            Хатолик: {error?.response?.data?.message || 'Маълумотларни юклашда хатолик юз берди'}
          </p>
        </div>
      </div>
    );
  }

  if (!grammarCase) return null;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/grammar"
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
        style={{ color: 'var(--primary-light)' }}
      >
        &larr; Грамматика
      </Link>

      <CaseDetail grammarCase={grammarCase} />
    </div>
  );
}
