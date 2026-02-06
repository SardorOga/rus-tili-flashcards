import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useIdentifyExercise, useCheckAnswer } from '../../hooks/useExercises';
import useExerciseStore from '../../stores/exerciseStore';
import ExerciseFeedback from './ExerciseFeedback';
import { CASE_NAMES } from '../../utils/helpers';

export default function IdentifyExercise() {
  const queryClient = useQueryClient();
  const { data: exercise, isLoading, error } = useIdentifyExercise();
  const checkAnswer = useCheckAnswer();
  const recordAnswer = useExerciseStore((s) => s.recordAnswer);

  const [selectedCase, setSelectedCase] = useState(null);
  const [result, setResult] = useState(null);

  const handleSelect = async (caseIndex) => {
    if (result) return;
    const caseName = CASE_NAMES[caseIndex];
    setSelectedCase(caseIndex);

    try {
      const res = await checkAnswer.mutateAsync({
        exercise_type: 'identify',
        exercise_id: exercise.id,
        answer: caseName.ru,
      });

      setResult({
        correct: res.correct,
        correctAnswer: res.correct_answer,
        explanation: res.explanation || null,
        correctCaseIndex: CASE_NAMES.findIndex((c) => c.ru === res.correct_answer),
      });

      recordAnswer(res.correct);
    } catch {
      setResult({
        correct: false,
        correctAnswer: '',
        explanation: 'Текшириб бўлмади',
        correctCaseIndex: -1,
      });
    }
  };

  const handleNext = useCallback(() => {
    setSelectedCase(null);
    setResult(null);
    queryClient.invalidateQueries({ queryKey: ['exercise', 'identify'] });
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
          onClick={() => queryClient.invalidateQueries({ queryKey: ['exercise', 'identify'] })}
          className="mt-3 px-4 py-2 rounded-lg text-white text-sm cursor-pointer"
          style={{ background: 'var(--primary)' }}
        >
          Қайта уриниш
        </button>
      </div>
    );
  }

  if (!exercise) return null;

  // Build the sentence with highlighted word
  const renderSentence = () => {
    if (!exercise.sentence || !exercise.target_word) {
      return <span>{exercise.sentence || ''}</span>;
    }

    const parts = exercise.sentence.split(
      new RegExp(`(${exercise.target_word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    );

    return parts.map((part, i) =>
      part.toLowerCase() === exercise.target_word.toLowerCase() ? (
        <span
          key={i}
          className="px-2 py-0.5 rounded font-bold"
          style={{
            background: 'rgba(44, 95, 45, 0.3)',
            color: 'var(--success)',
            border: '1px solid var(--primary)',
          }}
        >
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Sentence card */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
          Гапдаги сўзнинг келишигини аниқланг
        </p>
        <p className="text-xl leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {renderSentence()}
        </p>
        {exercise.sentence_uz && (
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {exercise.sentence_uz}
          </p>
        )}
      </div>

      {/* Case buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CASE_NAMES.map((caseName, i) => {
          let btnStyle = {
            background: 'var(--bg-input)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-primary)',
          };

          if (result) {
            if (i === result.correctCaseIndex) {
              btnStyle = {
                background: 'rgba(74, 222, 128, 0.15)',
                border: '2px solid var(--success)',
                color: 'var(--success)',
              };
            } else if (i === selectedCase && !result.correct) {
              btnStyle = {
                background: 'rgba(239, 68, 68, 0.15)',
                border: '2px solid var(--error)',
                color: 'var(--error)',
              };
            } else {
              btnStyle = {
                ...btnStyle,
                opacity: 0.4,
              };
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={!!result || checkAnswer.isPending}
              className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-sm cursor-pointer transition-all hover:opacity-80 disabled:cursor-default"
              style={btnStyle}
            >
              <span className="font-semibold">{caseName.ru}</span>
              <span className="text-xs" style={{ color: result ? 'inherit' : 'var(--text-secondary)' }}>
                {caseName.question}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {result && (
        <ExerciseFeedback
          isCorrect={result.correct}
          correctAnswer={result.correct ? null : result.correctAnswer}
          explanation={
            result.correct
              ? null
              : result.correctCaseIndex >= 0
                ? `Бу сўз ${CASE_NAMES[result.correctCaseIndex].ru} келишикда (${CASE_NAMES[result.correctCaseIndex].question})`
                : result.explanation
          }
          onNext={handleNext}
        />
      )}
    </div>
  );
}
