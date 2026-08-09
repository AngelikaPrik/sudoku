export type SudokuCell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type SudokuBoard = SudokuCell[][];
export type SudokuFilledCell = Exclude<SudokuCell, 0>;
export type SudokuPlayableCell = SudokuFilledCell | null;
export type SudokuPlayableBoard = SudokuPlayableCell[][];

export interface SudokuGrid {
  value: SudokuBoard;
  solution: SudokuBoard;
  difficulty: string;
}

export interface NewBoardResponse {
  grids: SudokuGrid[];
}

export interface PuzzleResponse {
  newboard: NewBoardResponse;
}

export interface PuzzleBoardData {
  difficulty: string;
  puzzle: SudokuPlayableBoard;
  solution: SudokuPlayableBoard;
  board: SudokuPlayableBoard;
}
