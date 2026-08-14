import type { SudokuBoard, SudokuCell, SudokuFilledCell } from './api/types';

export type SelectedCell = [row: number, col: number];
export interface FilledDigit {
  value: SudokuFilledCell;
  isDisabled: boolean;
}

const DIGIT_VALUES = Array.from(
  { length: 9 },
  (_, index) => String(index + 1) as SudokuFilledCell,
);

export const FILLED_DIGITS: ReadonlyArray<FilledDigit> = DIGIT_VALUES.map(
  value => ({ value, isDisabled: false }),
);

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
const MAX_DIGIT_USAGE = 9;

const getUsedValueCounts = (
  board: SudokuBoard | null,
): Record<SudokuFilledCell, number> => {
  const usedValueCounts = Object.fromEntries(
    DIGIT_VALUES.map(value => [value, 0]),
  ) as Record<SudokuFilledCell, number>;

  board?.forEach(row => {
    row.forEach(cell => {
      if (cell !== EMPTY_CELL) {
        usedValueCounts[cell] += 1;
      }
    });
  });

  return usedValueCounts;
};

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

export const getFilledDigits = (
  board: SudokuBoard | null,
  isDisabled = false,
): ReadonlyArray<FilledDigit> => {
  const usedValueCounts = getUsedValueCounts(board);

  return FILLED_DIGITS.map(digit => ({
    ...digit,
    isDisabled: isDisabled || usedValueCounts[digit.value] >= MAX_DIGIT_USAGE,
  }));
};

export const canUseCellValue = (
  board: SudokuBoard | null,
  [row, col]: SelectedCell,
  value: SudokuCell,
): boolean => {
  if (value === EMPTY_CELL) {
    return true;
  }

  const currentValue = board?.[row]?.[col] ?? null;
  const usedValueCounts = getUsedValueCounts(board);
  const usedCount = usedValueCounts[value] - (currentValue === value ? 1 : 0);

  return usedCount < MAX_DIGIT_USAGE;
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
