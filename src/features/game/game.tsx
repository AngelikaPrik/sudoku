import cn from 'classnames';
import styles from './game.module.scss';

interface GameProps {
  greenCount: number;
  board: number[][];
  puzzle: number[][];
  selected: [number, number] | null;
  setSelected: (selected: [number, number] | null) => void;
  onInput: (rowIdx: number, colIdx: number, value: string) => void;
}

export const Game = ({
  greenCount,
  board,
  puzzle,
  selected,
  setSelected,
  onInput,
}: GameProps) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          {board?.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => {
                const isPrefilled = puzzle[rowIdx][colIdx] !== null;
                const isSameRow = selected && rowIdx === selected[0];
                const isSameCol = selected && colIdx === selected[1];
                const isSameBox =
                  selected &&
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
