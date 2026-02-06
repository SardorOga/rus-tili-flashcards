import { CASE_NAMES } from '../../utils/helpers';

export default function DeclensionTable({ forms, title }) {
  // Group forms by case_id. case_id is 1-based matching CASE_NAMES index+1
  const formsByCase = {};
  if (forms) {
    forms.forEach((form) => {
      if (!formsByCase[form.case_id]) {
        formsByCase[form.case_id] = { singular: null, plural: null };
      }
      if (form.is_plural) {
        formsByCase[form.case_id].plural = form;
      } else {
        formsByCase[form.case_id].singular = form;
      }
    });
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      {title && (
        <div className="px-4 py-3 font-semibold text-sm" style={{ background: 'var(--primary)', color: 'white' }}>
          {title}
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--primary)', color: 'white' }}>
            <th className="text-left px-4 py-2.5 font-medium">Падеж</th>
            <th className="text-left px-4 py-2.5 font-medium">Савол</th>
            <th className="text-left px-4 py-2.5 font-medium">Бирлик</th>
            <th className="text-left px-4 py-2.5 font-medium">Кўплик</th>
          </tr>
        </thead>
        <tbody>
          {CASE_NAMES.map((caseName, index) => {
            const caseId = index + 1;
            const caseData = formsByCase[caseId];
            const sg = caseData?.singular;
            const pl = caseData?.plural;

            return (
              <tr
                key={caseId}
                className="transition-colors"
                style={{
                  background: index % 2 === 0 ? 'var(--bg-card)' : 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <td className="px-4 py-2.5">
                  <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{caseName.ru}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{caseName.uz}</div>
                </td>
                <td className="px-4 py-2.5" style={{ color: 'var(--text-secondary)' }}>
                  {caseName.question}
                </td>
                <td className="px-4 py-2.5" style={{ color: 'var(--text-primary)' }}>
                  {sg ? `${sg.adj_form} ${sg.noun_form}` : '---'}
                </td>
                <td className="px-4 py-2.5" style={{ color: 'var(--text-primary)' }}>
                  {pl ? `${pl.adj_form} ${pl.noun_form}` : '---'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
