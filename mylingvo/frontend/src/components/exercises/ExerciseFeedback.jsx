import { useEffect } from 'react';

export default function ExerciseFeedback({ isCorrect, correctAnswer, explanation, onNext }) {
  useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => onNext(), 3000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, onNext]);

  return (
    <div
      className="mt-4 rounded-xl p-5 animate-fade-in"
      style={{
        background: isCorrect
          ? 'rgba(74, 222, 128, 0.1)'
          : 'rgba(239, 68, 68, 0.1)',
        border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`,
      }}
    >
      {isCorrect ? (
        <div className="flex items-center gap-3">
          <span className="text-3xl">&#10003;</span>
          <div>
            <p className="text-lg font-bold" style={{ color: 'var(--success)' }}>
              Баракалла!
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Кейинги саволга ўтилмоқда...
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl" style={{ color: 'var(--error)' }}>&#10007;</span>
            <p className="text-lg font-bold" style={{ color: 'var(--error)' }}>
              Нотўғри
            </p>
          </div>

          {correctAnswer && (
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Тўғри жавоб: </span>
              <span className="font-semibold" style={{ color: 'var(--success)' }}>
                {correctAnswer}
              </span>
            </p>
          )}

          {explanation && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {explanation}
            </p>
          )}

          <button
            onClick={onNext}
            className="self-start mt-2 px-5 py-2 rounded-lg font-medium text-white text-sm cursor-pointer transition-opacity hover:opacity-80"
            style={{ background: 'var(--primary)' }}
          >
            Кейингиси &rarr;
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
