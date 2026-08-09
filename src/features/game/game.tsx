import { useEffect, useState } from 'react';
import cn from 'classnames';
import { usePuzzleQuery } from './api';
import type { SudokuFilledCell, SudokuPlayableBoard } from './api/types';
import styles from './game.module.scss';

type SelectedCell = [number, number];

export const Game = () => {
  const { boardData, isFetching } = usePuzzleQuery();

  const [board, setBoard] = useState<SudokuPlayableBoard | null>(null);
  const [puzzle, setPuzzle] = useState<SudokuPlayableBoard | null>(null);
  const [selected, setSelected] = useState<SelectedCell | null>(null);
  const [greenCount, setGreenCount] = useState(0);

  useEffect(() => {
    if (isFetching || !boardData) {
      return;
    }

    setGreenCount(0);
    setBoard(boardData.board);
    setPuzzle(boardData.puzzle);
  }, [boardData, isFetching]);

  const onInput = (rowIdx: number, colIdx: number, value: string) => {
    if (value !== '' && !/^[1-9]$/.test(value)) {
      return;
    }

    const nextValue = value === '' ? null : (Number(value) as SudokuFilledCell);

    setBoard((prev) => {
      if (!prev) {
        return prev;
      }

      return prev.map((row, r) =>
        row.map((cell, c) => {
          if (r === rowIdx && c === colIdx) {
            return nextValue;
          }

          return cell;
        }),
      );
    });
  };

  if (!board || !puzzle) {
    return <div className={styles.container} />;
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          {board.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => {
                const isPrefilled = puzzle[rowIdx][colIdx] !== null;
                const isSameRow = selected !== null && rowIdx === selected[0];
                const isSameCol = selected !== null && colIdx === selected[1];
                const isSameBox =
                  selected !== null &&
                  Math.floor(rowIdx / 3) === Math.floor(selected[0] / 3) &&
                  Math.floor(colIdx / 3) === Math.floor(selected[1] / 3);

                const cellIndex = rowIdx * 9 + colIdx;
                const isGreen = cellIndex < greenCount;

                return (
                  <td
                    key={colIdx}
                    className={cn(styles.cell, {
                      [styles.green]: isGreen,
                      [styles['same-row']]: isSameRow,
                      [styles['same-col']]: isSameCol,
                      [styles['same-box']]: isSameBox,
                    })}
                  >
                    <input
                      type='text'
                      maxLength={1}
                      value={cell ?? ''}
                      readOnly={isPrefilled}
                      onFocus={() => setSelected([rowIdx, colIdx])}
                      onClick={() => setSelected([rowIdx, colIdx])}
                      onChange={(e) => onInput(rowIdx, colIdx, e.target.value)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
