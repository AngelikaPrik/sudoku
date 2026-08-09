import { useQuery } from '@tanstack/react-query';
import type { PuzzleResponse } from './types';

const SUDOKU_API_URL = `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution,difficulty}}}`;

const fetchPuzzle = async (): Promise<PuzzleResponse> => {
  const res = await fetch(SUDOKU_API_URL);

  if (!res.ok) {
    throw new Error('Failed to load puzzle');
  }

  return res.json() as Promise<PuzzleResponse>;
};

export const usePuzzleQuery = () => {
  const query = useQuery<PuzzleResponse, Error>({
    queryKey: ['puzzle'],
    queryFn: fetchPuzzle,
  });

  const grid = query.data?.newboard.grids[0];

  const puzzle = grid?.value.map((row) =>
    row.map((cell) => (cell === 0 ? null : cell)),
  );
  const solution = grid?.solution.map((row) =>
    row.map((cell) => (cell === 0 ? null : cell)),
  );
  const board = puzzle?.map((row) => [...row]);

  return {
    boardData: { puzzle, solution, board },
    ...query,
  };
};
