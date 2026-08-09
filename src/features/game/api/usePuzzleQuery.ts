import { useQuery } from '@tanstack/react-query';
import type {
  PuzzleBoardData,
  PuzzleResponse,
  SudokuBoard,
  SudokuPlayableBoard,
} from './types';

const SUDOKU_API_URL = `https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,solution,difficulty}}}`;

const fetchPuzzle = async (): Promise<PuzzleResponse> => {
  const res = await fetch(SUDOKU_API_URL);

  if (!res.ok) {
    throw new Error('Failed to load puzzle');
  }

  return res.json() as Promise<PuzzleResponse>;
};

const toPlayableBoard = (board: SudokuBoard): SudokuPlayableBoard =>
  board.map((row) => row.map((cell) => (cell === 0 ? null : cell)));

const selectBoardData = (data: PuzzleResponse): PuzzleBoardData => {
  const grid = data.newboard.grids[0];
  const puzzle = toPlayableBoard(grid.value);

  return {
    difficulty: grid.difficulty,
    puzzle,
    solution: toPlayableBoard(grid.solution),
    board: puzzle.map((row) => [...row]),
  };
};

export const usePuzzleQuery = () => {
  const query = useQuery<PuzzleResponse, Error, PuzzleBoardData>({
    queryKey: ['puzzle'],
    queryFn: fetchPuzzle,
    select: selectBoardData,
  });

  return {
    boardData: query.data,
    ...query,
  };
};
