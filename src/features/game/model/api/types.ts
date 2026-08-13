export type SudokuCell =
  '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type SudokuDifficulty = 'easy' | 'medium' | 'hard';

export type SudokuBoard = SudokuCell[][];
export type SudokuFilledCell = Exclude<SudokuCell, '0'>;

export interface PuzzleBoardData {
  difficulty: SudokuDifficulty;
  puzzle: SudokuBoard;
  solution: SudokuBoard;
}
