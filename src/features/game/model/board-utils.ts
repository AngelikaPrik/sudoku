import type { SudokuBoard, SudokuCell, SudokuFilledCell } from './api/types';

export type SelectedCell = [row: number, col: number];

interface CellStateArgs {
  puzzle: SudokuBoard;
  solution: SudokuBoard;
  selected: SelectedCell | null;
  selectedValue: SudokuCell | null;
  cellPosition: SelectedCell;
  cellValue: SudokuCell;
}

export interface CellState {
  isPrefilled: boolean;
  isInvalid: boolean;
  isSameRow: boolean;
  isSameCol: boolean;
  isSameBox: boolean;
  isSameValue: boolean;
  isSelected: boolean;
}

const EMPTY_CELL: SudokuCell = '0';

export const isPrefilledCell = (
  puzzle: SudokuBoard,
  [row, col]: SelectedCell,
): boolean => puzzle[row]?.[col] !== EMPTY_CELL;

export const normalizeCellInput = (value: string): SudokuCell | null => {
  const digit = value.replace(/[^1-9]/g, '').slice(-1);

  if (value !== '' && digit === '') {
    return null;
  }

  return digit === '' ? EMPTY_CELL : (digit as SudokuFilledCell);
};

const isSameBox = (
  [row, col]: SelectedCell,
  [selectedRow, selectedCol]: SelectedCell,
) =>
  Math.floor(row / 3) === Math.floor(selectedRow / 3) &&
  Math.floor(col / 3) === Math.floor(selectedCol / 3);

export const getCellState = ({
  puzzle,
  solution,
  selected,
  selectedValue,
  cellPosition,
  cellValue,
}: CellStateArgs): CellState => {
  const isPrefilled = isPrefilledCell(puzzle, cellPosition);
  const [row, col] = cellPosition;
  const isInvalid =
    !isPrefilled &&
    cellValue !== EMPTY_CELL &&
    solution[row]?.[col] !== cellValue;

  if (!selected) {
    return {
      isPrefilled,
      isInvalid,
      isSameRow: false,
      isSameCol: false,
      isSameBox: false,
      isSameValue: false,
      isSelected: false,
    };
  }

  const [selectedRow, selectedCol] = selected;
  const isSameRow = row === selectedRow;
  const isSameCol = col === selectedCol;
  const isSelected = isSameRow && isSameCol;

  return {
    isPrefilled,
    isInvalid,
    isSameRow,
    isSameCol,
    isSameBox: isSameBox(cellPosition, selected),
    isSameValue:
      selectedValue !== null &&
      selectedValue !== EMPTY_CELL &&
      cellValue === selectedValue &&
      !isSelected,
    isSelected,
  };
};
