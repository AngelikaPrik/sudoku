import { useEffect, useState } from 'react';
import cn from 'classnames';
import type {
  PuzzleBoardData,
  SudokuBoard,
  SudokuCell,
  SudokuFilledCell,
} from './api/types';
import styles from './game.module.scss';
import { Loader } from '@shared/ui/loader';
import { Controls } from './controls';

type SelectedCell = [number, number];

interface GameProps {
  boardData: PuzzleBoardData | null;
  isLoading: boolean;
}

export const Game = ({ boardData, isLoading }: GameProps) => {
  const puzzle = boardData?.puzzle ?? null;

  const [board, setBoard] = useState<SudokuBoard | null>(null);
  const [selected, setSelected] = useState<SelectedCell | null>(null);

  useEffect(() => {
    if (!boardData) {
      return;
    }

    setSelected(null);
    setBoard(() => boardData.puzzle.map((row) => [...row]));
  }, [boardData]);

  const updateCellValue = (
    rowIdx: number,
    colIdx: number,
    value: SudokuCell,
  ) => {
    setBoard((prev) => {
      if (!prev) {
        return prev;
      }

      const nextBoard = [...prev];
      nextBoard[rowIdx] = [...nextBoard[rowIdx]];
      nextBoard[rowIdx][colIdx] = value;

      return nextBoard;
    });
  };

  const onInput = (rowIdx: number, colIdx: number, value: string) => {
    if (value !== '' && !/^[1-9]$/.test(value)) {
      return;
    }

    const nextValue = value === '' ? '0' : (value as SudokuFilledCell);

    updateCellValue(rowIdx, colIdx, nextValue);
  };

  const selectedValue =
    selected !== null ? (board?.[selected[0]]?.[selected[1]] ?? null) : null;
  const isSelectedPrefilled =
    selected !== null && puzzle !== null
      ? puzzle[selected[0]][selected[1]] !== '0'
      : false;

  const onControlSelectValue = (value: SudokuFilledCell) => {
    if (!selected || isSelectedPrefilled) {
      return;
    }

    updateCellValue(selected[0], selected[1], value);
  };

  const onErase = () => {
    if (!selected || isSelectedPrefilled) {
      return;
    }

    updateCellValue(selected[0], selected[1], '0');
  };

  if (isLoading || !board || !puzzle) {
    return (
      <div className={styles.loader}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.game}>
        <table className={styles.table}>
          <tbody>
            {board.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => {
                  const isPrefilled = puzzle[rowIdx][colIdx] !== '0';
                  const isSelected =
                    selected !== null &&
                    rowIdx === selected[0] &&
                    colIdx === selected[1];
                  const isSameRow = selected !== null && rowIdx === selected[0];
                  const isSameCol = selected !== null && colIdx === selected[1];
                  const isSameBox =
                    selected !== null &&
                    Math.floor(rowIdx / 3) === Math.floor(selected[0] / 3) &&
                    Math.floor(colIdx / 3) === Math.floor(selected[1] / 3);

                  const isSameValue =
                    selectedValue !== null &&
                    selectedValue !== '0' &&
                    cell === selectedValue &&
                    !isSelected;

                  return (
                    <td
                      key={colIdx}
                      className={cn(styles.cell, {
                        [styles.selected]: isSelected,
                        [styles['same-row']]: isSameRow,
                        [styles['same-col']]: isSameCol,
                        [styles['same-box']]: isSameBox,
                        [styles['same-value']]: isSameValue,
                      })}
                    >
                      <input
                        type='text'
                        maxLength={1}
                        value={cell === '0' ? '' : cell}
                        readOnly={isPrefilled}
                        onFocus={() => setSelected([rowIdx, colIdx])}
                        onClick={() => setSelected([rowIdx, colIdx])}
                        onChange={(e) =>
                          onInput(rowIdx, colIdx, e.target.value)
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Controls
        isDisabled={selected === null || isSelectedPrefilled}
        onSelectValue={onControlSelectValue}
        onErase={onErase}
      />
    </div>
  );
};
