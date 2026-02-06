import { useQuery, useMutation } from '@tanstack/react-query';
import { getDeclineExercise, getIdentifyExercise, getFormExercise, checkAnswer } from '../api/exercises';

export function useDeclineExercise() {
  return useQuery({
    queryKey: ['exercise', 'decline'],
    queryFn: () => getDeclineExercise().then(r => r.data),
    refetchOnWindowFocus: false,
  });
}

export function useIdentifyExercise() {
  return useQuery({
    queryKey: ['exercise', 'identify'],
    queryFn: () => getIdentifyExercise().then(r => r.data),
    refetchOnWindowFocus: false,
  });
}

export function useFormExercise() {
  return useQuery({
    queryKey: ['exercise', 'form'],
    queryFn: () => getFormExercise().then(r => r.data),
    refetchOnWindowFocus: false,
  });
}

export function useCheckAnswer() {
  return useMutation({
    mutationFn: (data) => checkAnswer(data).then(r => r.data),
  });
}
