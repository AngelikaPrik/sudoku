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

type SelectedCell = [row: number, col: number];

interface GameProps {
  boardData: PuzzleBoardData | null;
  isLoading: boolean;
}

export const Game = ({ boardData, isLoading }: GameProps) => {
  const [board, setBoard] = useState<SudokuBoard | null>(null);
  const [selected, setSelected] = useState<SelectedCell | null>(null);

  useEffect(() => {
    if (boardData) {
      setSelected(null);
      setBoard(() => boardData.puzzle.map((row) => [...row]));
    }
  }, [boardData]);

  const puzzle = boardData?.puzzle ?? null;
  const hasSelection = selected !== null;
  const [row, col] = selected ?? [0, 0];

  const selectedValue = hasSelection ? (board?.[row]?.[col] ?? null) : null;
  const isPrefilled = hasSelection && (puzzle?.[row]?.[col] ?? '0') !== '0';

  const updateCell = ([rowIdx, colIdx]: SelectedCell, value: SudokuCell) => {
    setBoard((prev) => {
      if (!prev) return prev;

      const nextBoard = [...prev];
      nextBoard[rowIdx] = [...nextBoard[rowIdx]];
      nextBoard[rowIdx][colIdx] = value;

      return nextBoard;
    });
  };

  const onInput = (rowIdx: number, colIdx: number, value: string) => {
    const digit = value.replace(/[^1-9]/g, '').slice(-1);

    if (value !== '' && digit === '') {
      return;
    }

    const nextValue = digit === '' ? '0' : (digit as SudokuFilledCell);

    updateCell([rowIdx, colIdx], nextValue);
  };

  const onChangeCellValue = (value: SudokuCell) => {
    if (!selected || isPrefilled) {
      return;
    }

    updateCell(selected, value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.game}>
        {isLoading || !board || !puzzle ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : (
          <table className={styles.table}>
            <tbody>
              {board.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  {row.map((cell, colIdx) => {
                    const isPrefilled = puzzle[rowIdx][colIdx] !== '0';
                    const isSameRow = hasSelection && rowIdx === selected[0];
                    const isSameCol = hasSelection && colIdx === selected[1];
                    const isSelected = isSameRow && isSameCol;
                    const isSameBox =
                      hasSelection &&
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
                          inputMode='numeric'
                          pattern='[1-9]*'
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
        )}
      </div>
      <Controls
        isDisabled={selected === null || isPrefilled}
        onSelectValue={onChangeCellValue}
        onErase={() => onChangeCellValue('0')}
      />
    </div>
  );
};
