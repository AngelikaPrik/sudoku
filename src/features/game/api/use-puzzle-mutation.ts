import { useMutation } from '@tanstack/react-query';
import type { PuzzleBoardData, SudokuDifficulty } from './types';

const fetchPuzzle = async (
  difficulty: SudokuDifficulty,
): Promise<PuzzleBoardData> => {
  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      difficulty,
      solution: true,
      array: true,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to load puzzle');
  }

  return response.json();
};

export const usePuzzleMutation = () =>
  useMutation<PuzzleBoardData, Error, SudokuDifficulty>({
    mutationFn: fetchPuzzle,
  });
