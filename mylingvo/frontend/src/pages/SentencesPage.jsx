import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getRandomSentence } from '../api/sentences';
import { CASE_NAMES } from '../utils/helpers';

export default function SentencesPage() {
  const queryClient = useQueryClient();
  const [score, setScore] = useState({ correct: 0, wrong: 0, total: 0 });
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [sentenceKey, setSentenceKey] = useState(0);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['randomSentence', sentenceKey],
    queryFn: () => getRandomSentence(1).then((r) => r.data),
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const sentence = data?.data?.[0] || null;

  // Generate answer options from the correct answer
  const options = useGenerateOptions(sentence);

  const handleSelect = useCallback(
    (option) => {
      if (selected !== null) return; // already answered
      setSelected(option);

      const correct = option === sentence.correct_answer;
      setIsCorrect(correct);
      setScore((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        wrong: prev.wrong + (correct ? 0 : 1),
        total: prev.total + 1,
      }));

      if (correct) {
        // Auto-advance after 3 seconds
        setTimeout(() => {
          handleNext();
        }, 3000);
      } else {
        setShowNext(true);
      }
    },
    [selected, sentence]
  );

  const handleNext = useCallback(() => {
    setSelected(null);
    setIsCorrect(null);
    setShowNext(false);
    setSentenceKey((k) => k + 1);
  }, []);

  const handleReset = () => {
    setScore({ correct: 0, wrong: 0, total: 0 });
    handleNext();
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header + Score */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Гаплар
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Тўғри шаклни танланг
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm">
            <span style={{ color: 'var(--success)' }}>
              {score.correct} тўғри
            </span>
            <span style={{ color: 'var(--error)' }}>
              {score.wrong} нотўғри
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>
              {score.total} жами
            </span>
          </div>
          {score.total > 0 && (
            <button
              onClick={handleReset}
              className="text-xs px-2 py-1 rounded cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}
            >
              Янгидан
            </button>
          )}
        </div>
      </div>

      {/* Score bar */}
      {score.total > 0 && (
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(score.correct / score.total) * 100}%`,
              background: 'var(--success)',
            }}
          />
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: 'var(--bg-card)' }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>Юкланмоқда...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(239,68,68,0.1)' }}>
          <p style={{ color: 'var(--error)' }}>Гапни юклашда хатолик юз берди</p>
          <button
            onClick={handleNext}
            className="mt-3 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
            style={{ background: 'var(--primary)', color: 'white' }}
          >
            Қайта уриниш
          </button>
        </div>
      )}

      {/* Sentence card */}
      {!isLoading && !isError && sentence && (
        <div
          className="rounded-xl p-6 space-y-6"
          style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Case badge */}
          {sentence.case_id && (
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'var(--primary)', color: 'white' }}
              >
                {CASE_NAMES[sentence.case_id - 1]?.ru || `Келишик ${sentence.case_id}`}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {sentence.is_plural ? 'Кўплик' : 'Бирлик'}
              </span>
            </div>
          )}

          {/* Sentence with blank */}
          <p className="text-xl leading-relaxed text-center py-4" style={{ color: 'var(--text-primary)' }}>
            {renderSentenceWithBlank(sentence.sentence_template, selected, sentence.correct_answer, isCorrect)}
          </p>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-3">
            {options.map((option, index) => {
              let btnBg = 'var(--bg-input)';
              let btnBorder = 'rgba(255,255,255,0.1)';
              let btnColor = 'var(--text-primary)';

              if (selected !== null) {
                if (option === sentence.correct_answer) {
                  btnBg = 'rgba(74, 222, 128, 0.15)';
                  btnBorder = 'var(--success)';
                  btnColor = 'var(--success)';
                } else if (option === selected && !isCorrect) {
                  btnBg = 'rgba(239, 68, 68, 0.15)';
                  btnBorder = 'var(--error)';
                  btnColor = 'var(--error)';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  disabled={selected !== null}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:cursor-default"
                  style={{
                    background: btnBg,
                    border: `2px solid ${btnBorder}`,
                    color: btnColor,
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {selected !== null && (
            <div className="text-center space-y-3">
              <p
                className="text-sm font-medium"
                style={{ color: isCorrect ? 'var(--success)' : 'var(--error)' }}
              >
                {isCorrect ? 'Тўғри! Яхши иш!' : `Нотўғри. Тўғри жавоб: ${sentence.correct_answer}`}
              </p>
              {isCorrect && (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Автоматик кейинги саволга ўтилади...
                </p>
              )}
              {showNext && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{ background: 'var(--primary)', color: 'white' }}
                >
                  Кейингиси
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function renderSentenceWithBlank(template, selected, correctAnswer, isCorrect) {
  if (!template) return '';
  const parts = template.split('___');
  if (parts.length < 2) return template;

  return (
    <>
      {parts[0]}
      <span
        className="inline-block mx-1 px-3 py-1 rounded-lg font-semibold"
        style={{
          background: selected
            ? isCorrect
              ? 'rgba(74,222,128,0.2)'
              : 'rgba(239,68,68,0.2)'
            : 'rgba(255,255,255,0.1)',
          color: selected
            ? isCorrect
              ? 'var(--success)'
              : 'var(--error)'
            : 'var(--primary-light)',
          minWidth: '100px',
          textAlign: 'center',
          borderBottom: selected ? 'none' : '2px dashed var(--primary-light)',
        }}
      >
        {selected || '___'}
      </span>
      {parts[1]}
    </>
  );
}

function useGenerateOptions(sentence) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!sentence?.correct_answer) {
      setOptions([]);
      return;
    }

    const correct = sentence.correct_answer;
    const distractors = generateDistractors(correct);
    const allOptions = [correct, ...distractors];

    // Shuffle
    for (let i = allOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
    }

    setOptions(allOptions);
  }, [sentence?.id, sentence?.correct_answer]);

  return options;
}

function generateDistractors(correct) {
  // Generate 3 plausible distractors based on common Russian ending patterns
  const endings = ['ом', 'ой', 'ем', 'ам', 'ами', 'ах', 'у', 'ю', 'е', 'и', 'ы', 'а', 'я', 'ов', 'ей'];
  const words = correct.split(' ');
  const distractors = new Set();

  let attempts = 0;
  while (distractors.size < 3 && attempts < 50) {
    attempts++;
    const modified = words
      .map((word) => {
        if (word.length < 3) return word;
        const randomEnding = endings[Math.floor(Math.random() * endings.length)];
        // Remove last 1-3 chars and add random ending
        const cutLen = Math.min(Math.floor(Math.random() * 3) + 1, word.length - 2);
        return word.slice(0, word.length - cutLen) + randomEnding;
      })
      .join(' ');

    if (modified !== correct) {
      distractors.add(modified);
    }
  }

  // Fill with simple modifications if we still need more
  while (distractors.size < 3) {
    const suffix = ['ов', 'ами', 'ах'][distractors.size] || 'ом';
    const firstWord = words[0];
    const modified = words
      .map((w, i) => (i === 0 ? w.slice(0, Math.max(2, w.length - 2)) + suffix : w))
      .join(' ');
    if (modified !== correct) {
      distractors.add(modified);
    } else {
      distractors.add(correct + '*');
    }
  }

  return [...distractors].slice(0, 3);
}
