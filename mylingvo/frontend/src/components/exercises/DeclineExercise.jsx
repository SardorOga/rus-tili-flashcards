import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDeclineExercise, useCheckAnswer } from '../../hooks/useExercises';
import useExerciseStore from '../../stores/exerciseStore';
import ExerciseFeedback from './ExerciseFeedback';
import { CASE_NAMES, GENDERS } from '../../utils/helpers';

const CASE_KEYS = [
  'imenitelnyy',
  'roditelnyy',
  'datelnyy',
  'vinitelnyy',
  'tvoritelnyy',
  'predlozhnyy',
];

export default function DeclineExercise() {
  const queryClient = useQueryClient();
  const { data: exercise, isLoading, error } = useDeclineExercise();
  const checkAnswer = useCheckAnswer();
  const recordAnswer = useExerciseStore((s) => s.recordAnswer);

  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const handleInputChange = (caseKey, value) => {
    setAnswers((prev) => ({ ...prev, [caseKey]: value }));
  };

  const handleCheck = async () => {
    if (!exercise) return;
    const checkResults = {};
    let correctCount = 0;

    for (let i = 0; i < CASE_KEYS.length; i++) {
      const caseKey = CASE_KEYS[i];
      const userAnswer = (answers[caseKey] || '').trim();

      try {
        const result = await checkAnswer.mutateAsync({
          exercise_type: 'decline',
          exercise_id: exercise.id,
          case_name: caseKey,
          answer: userAnswer,
        });

        checkResults[caseKey] = {
          correct: result.correct,
          correctAnswer: result.correct_answer,
          explanation: result.explanation || null,
        };

        if (result.correct) correctCount++;
      } catch {
        checkResults[caseKey] = {
          correct: false,
          correctAnswer: '',
          explanation: 'Текшириб бўлмади',
        };
      }
    }

    setResults(checkResults);
    setChecked(true);

    const isAllCorrect = correctCount === CASE_KEYS.length;
    setAllCorrect(isAllCorrect);
    recordAnswer(isAllCorrect);
  };

  const handleNext = useCallback(() => {
    setAnswers({});
    setResults(null);
    setChecked(false);
    setAllCorrect(false);
    queryClient.invalidateQueries({ queryKey: ['exercise', 'decline'] });
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Юкланмоқда...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p style={{ color: 'var(--error)' }}>Хатолик юз берди</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['exercise', 'decline'] })}
          className="mt-3 px-4 py-2 rounded-lg text-white text-sm cursor-pointer"
          style={{ background: 'var(--primary)' }}
        >
          Қайта уриниш
        </button>
      </div>
    );
  }

  if (!exercise) return null;

  return (
    <div className="flex flex-col gap-5">
      {/* Word info */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-baseline gap-3 flex-wrap">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {exercise.word}
          </h2>
          {exercise.word_uz && (
            <span className="text-base" style={{ color: 'var(--text-secondary)' }}>
              &mdash; {exercise.word_uz}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {exercise.gender && (
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'var(--primary)', color: 'white' }}
            >
              {GENDERS[exercise.gender] || exercise.gender}
            </span>
          )}
          {exercise.sklonenie && (
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
            >
              {exercise.sklonenie} склонение
            </span>
          )}
        </div>
        <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
          Барча 6 келишикни тўлдиринг
        </p>
      </div>

      {/* Case input fields */}
      <div className="grid gap-3">
        {CASE_KEYS.map((caseKey, i) => {
          const caseName = CASE_NAMES[i];
          const result = results?.[caseKey];
          const borderColor = result
            ? result.correct
              ? 'var(--success)'
              : 'var(--error)'
            : 'rgba(255,255,255,0.1)';

          return (
            <div key={caseKey}>
              <label className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {caseName.ru}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    ({caseName.question})
                  </span>
                </div>
                <input
                  type="text"
                  value={answers[caseKey] || ''}
                  onChange={(e) => handleInputChange(caseKey, e.target.value)}
                  disabled={checked}
                  placeholder={`${caseName.question}`}
                  className="w-full px-4 py-2.5 rounded-lg outline-none text-white text-sm"
                  style={{
                    background: 'var(--bg-input)',
                    border: `1px solid ${borderColor}`,
                    opacity: checked ? 0.8 : 1,
                  }}
                />
              </label>

              {result && !result.correct && (
                <p className="text-xs mt-1 ml-1" style={{ color: 'var(--error)' }}>
                  Тўғри жавоб:{' '}
                  <span className="font-semibold" style={{ color: 'var(--success)' }}>
                    {result.correctAnswer}
                  </span>
                  {result.explanation && (
                    <span style={{ color: 'var(--text-secondary)' }}> &mdash; {result.explanation}</span>
                  )}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Check / Next */}
      {!checked ? (
        <button
          onClick={handleCheck}
          disabled={checkAnswer.isPending}
          className="w-full py-3 rounded-lg font-semibold text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--primary)' }}
        >
          {checkAnswer.isPending ? 'Текширилмоқда...' : 'Текшириш'}
        </button>
      ) : (
        <ExerciseFeedback
          isCorrect={allCorrect}
          correctAnswer={
            allCorrect
              ? null
              : CASE_KEYS.filter((k) => results?.[k] && !results[k].correct)
                  .map(
                    (k, idx) =>
                      `${CASE_NAMES[CASE_KEYS.indexOf(k)].ru}: ${results[k].correctAnswer}`
                  )
                  .join(', ')
          }
          explanation={allCorrect ? null : 'Хато жавобларни қизил рангда кўришингиз мумкин'}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
