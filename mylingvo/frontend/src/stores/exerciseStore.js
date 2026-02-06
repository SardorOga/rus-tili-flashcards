import { create } from 'zustand';

const useExerciseStore = create((set) => ({
  currentExercise: null,
  score: { correct: 0, wrong: 0, total: 0 },
  exerciseType: null,

  setExercise: (exercise, type) => set({ currentExercise: exercise, exerciseType: type }),

  recordAnswer: (isCorrect) => set((state) => ({
    score: {
      correct: state.score.correct + (isCorrect ? 1 : 0),
      wrong: state.score.wrong + (isCorrect ? 0 : 1),
      total: state.score.total + 1,
    }
  })),

  resetScore: () => set({ score: { correct: 0, wrong: 0, total: 0 }, currentExercise: null }),
}));

export default useExerciseStore;
