import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFormExercise, useCheckAnswer } from '../../hooks/useExercises';
import useExerciseStore from '../../stores/exerciseStore';
import ExerciseFeedback from './ExerciseFeedback';
import { CASE_NAMES } from '../../utils/helpers';

export default function FormExercise() {
  const queryClient = useQueryClient();
  const { data: exercise, isLoading, error } = useFormExercise();
  const checkAnswer = useCheckAnswer();
  const recordAnswer = useExerciseStore((s) => s.recordAnswer);

  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState(null);

  const getCaseLabel = (caseName) => {
    const found = CASE_NAMES.find((c) => c.ru === caseName);
    return found ? `${found.ru} (${found.question})` : caseName;
  };

  const handleSelect = async (option, index) => {
    if (result) return;
    setSelectedOption(index);

    try {
      const res = await checkAnswer.mutateAsync({
        exercise_type: 'form',
        exercise_id: exercise.id,
        answer: option,
      });

      setResult({
        correct: res.correct,
        correctAnswer: res.correct_answer,
        explanation: res.explanation || null,
        selectedOptionCase: res.selected_case || null,
      });

      recordAnswer(res.correct);
    } catch {
      setResult({
        correct: false,
        correctAnswer: '',
        explanation: 'Текшириб бўлмади',
        selectedOptionCase: null,
      });
    }
  };

  const handleNext = useCallback(() => {
    setSelectedOption(null);
    setResult(null);
    queryClient.invalidateQueries({ queryKey: ['exercise', 'form'] });
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
          onClick={() => queryClient.invalidateQueries({ queryKey: ['exercise', 'form'] })}
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
      {/* Prompt card */}
      <div
        className="rounded-xl p-6"
        style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>
          Тўғри шаклни танланг
        </p>
        <p className="text-xl" style={{ color: 'var(--text-primary)' }}>
          Ёзинг:{' '}
          <span className="font-bold" style={{ color: 'var(--primary-light)' }}>
            {exercise.word}
          </span>{' '}
          ни{' '}
          <span className="font-semibold" style={{ color: 'var(--warning)' }}>
            {getCaseLabel(exercise.target_case)}
          </span>{' '}
          да
        </p>
        {exercise.word_uz && (
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            ({exercise.word_uz})
          </p>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {(exercise.options || []).map((option, i) => {
          let btnStyle = {
            background: 'var(--bg-input)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-primary)',
          };

          if (result) {
            if (option === result.correctAnswer) {
              btnStyle = {
                background: 'rgba(74, 222, 128, 0.15)',
                border: '2px solid var(--success)',
                color: 'var(--success)',
              };
            } else if (i === selectedOption && !result.correct) {
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
              onClick={() => handleSelect(option, i)}
              disabled={!!result || checkAnswer.isPending}
              className="py-4 px-4 rounded-xl text-lg font-medium cursor-pointer transition-all hover:opacity-80 disabled:cursor-default"
              style={btnStyle}
            >
              {option}
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
              : result.selectedOptionCase
                ? `Сиз танлаган шакл ${result.selectedOptionCase} келишикка тегишли`
                : result.explanation
          }
          onNext={handleNext}
        />
      )}
    </div>
  );
}
