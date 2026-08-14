import { useLayoutEffect, useState } from 'react';
import type { PuzzleBoardData, SudokuBoard, SudokuCell } from './api/types';
import {
  canUseCellValue,
  getFilledDigits,
  isPrefilledCell,
  normalizeCellInput,
} from './board-utils';
import type { FilledDigit, SelectedCell } from './board-utils';

interface UseSudokuBoardResult {
  board: SudokuBoard | null;
  puzzle: SudokuBoard | null;
  selected: SelectedCell | null;
  selectedValue: SudokuCell | null;
  filledDigits: ReadonlyArray<FilledDigit>;
  isSelectedPrefilled: boolean;
  areControlsDisabled: boolean;
  selectCell: (cell: SelectedCell) => void;
  handleCellInput: (rowIdx: number, colIdx: number, value: string) => void;
  changeSelectedCellValue: (value: SudokuCell) => void;
  eraseSelectedCell: () => void;
}

export const useSudokuBoard = (
  boardData: PuzzleBoardData | null,
  isLoading: boolean,
): UseSudokuBoardResult => {
  const [board, setBoard] = useState<SudokuBoard | null>(null);
  const [selected, setSelected] = useState<SelectedCell | null>(null);

  useLayoutEffect(() => {
    if (!boardData) {
      return;
    }

    setSelected(null);
    setBoard(boardData.puzzle.map(row => [...row]));
  }, [boardData]);

  const puzzle = boardData?.puzzle ?? null;
  const selectedValue =
    selected !== null ? (board?.[selected[0]]?.[selected[1]] ?? null) : null;
  const isSelectedPrefilled =
    selected !== null && puzzle !== null && isPrefilledCell(puzzle, selected);
  const areControlsDisabled =
    isLoading || selected === null || isSelectedPrefilled;
  const filledDigits = getFilledDigits(board, areControlsDisabled);

  const updateCell = ([rowIdx, colIdx]: SelectedCell, value: SudokuCell) => {
    setBoard(prev => {
      if (!prev) {
        return prev;
      }

      const nextBoard = [...prev];
      nextBoard[rowIdx] = [...nextBoard[rowIdx]];
      nextBoard[rowIdx][colIdx] = value;

      return nextBoard;
    });
  };

  const handleCellInput = (rowIdx: number, colIdx: number, value: string) => {
    const nextValue = normalizeCellInput(value);

    if (
      nextValue === null ||
      !canUseCellValue(board, [rowIdx, colIdx], nextValue)
    ) {
      return;
    }

    updateCell([rowIdx, colIdx], nextValue);
  };

  const changeSelectedCellValue = (value: SudokuCell) => {
    if (!selected || isSelectedPrefilled) {
      return;
    }

    if (!canUseCellValue(board, selected, value)) {
      return;
    }

    updateCell(selected, value);
  };

  return {
    board,
    puzzle,
    selected,
    selectedValue,
    filledDigits,
    isSelectedPrefilled,
    areControlsDisabled,
    selectCell: setSelected,
    handleCellInput,
    changeSelectedCellValue,
    eraseSelectedCell: () => changeSelectedCellValue('0'),
  };
};
