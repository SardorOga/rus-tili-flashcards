import { useQuery } from '@tanstack/react-query';
import { getWords, getWord } from '../api/words';

export function useWords(params) {
  return useQuery({
    queryKey: ['words', params],
    queryFn: () => getWords(params).then(r => r.data),
  });
}

export function useWord(id) {
  return useQuery({
    queryKey: ['word', id],
    queryFn: () => getWord(id).then(r => r.data),
    enabled: !!id,
  });
}
