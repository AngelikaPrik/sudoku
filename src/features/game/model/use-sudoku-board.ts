import { useLayoutEffect, useState } from 'react';
import type { PuzzleBoardData, SudokuBoard, SudokuCell } from './api/types';
import { isPrefilledCell, normalizeCellInput } from './board-utils';
import type { SelectedCell } from './board-utils';

interface UseSudokuBoardResult {
  board: SudokuBoard | null;
  puzzle: SudokuBoard | null;
  selected: SelectedCell | null;
  selectedValue: SudokuCell | null;
  isSelectedPrefilled: boolean;
  areControlsDisabled: boolean;
  selectCell: (cell: SelectedCell) => void;
  handleCellInput: (rowIdx: number, colIdx: number, value: string) => void;
  changeSelectedCellValue: (value: SudokuCell) => void;
  eraseSelectedCell: () => void;
}

export const useSudokuBoard = (
  boardData: PuzzleBoardData | null,
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
  const areControlsDisabled = selected === null || isSelectedPrefilled;

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

    if (nextValue === null) {
      return;
    }

    updateCell([rowIdx, colIdx], nextValue);
  };

  const changeSelectedCellValue = (value: SudokuCell) => {
    if (!selected || isSelectedPrefilled) {
      return;
    }

    updateCell(selected, value);
  };

  return {
    board,
    puzzle,
    selected,
    selectedValue,
    isSelectedPrefilled,
    areControlsDisabled,
    selectCell: setSelected,
    handleCellInput,
    changeSelectedCellValue,
    eraseSelectedCell: () => changeSelectedCellValue('0'),
  };
};
