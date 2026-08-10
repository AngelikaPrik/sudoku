import { useMutation } from '@tanstack/react-query';
import type { PuzzleBoardData, SudokuDifficulty } from './types';

const fetchPuzzle = async (
  difficulty: SudokuDifficulty,
): Promise<PuzzleBoardData> => {
  const apiKey = import.meta.env.VITE_YDS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing VITE_YDS_API_KEY');
  }

  const response = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
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
