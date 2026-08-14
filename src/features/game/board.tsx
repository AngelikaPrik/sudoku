import cn from 'classnames';
import type { SudokuBoard, SudokuCell } from './model/api/types';
import { getCellState } from './model/board-utils';
import type { SelectedCell } from './model/board-utils';
import styles from './game.module.scss';

interface BoardProps {
  board: SudokuBoard;
  puzzle: SudokuBoard;
  solution: SudokuBoard;
  selected: SelectedCell | null;
  selectedValue: SudokuCell | null;
  onSelectCell: (cell: SelectedCell) => void;
  onInputCell: (rowIdx: number, colIdx: number, value: string) => void;
}

export const Board = ({
  board,
  puzzle,
  solution,
  selected,
  selectedValue,
  onSelectCell,
  onInputCell,
}: BoardProps) => (
  <table className={styles.table}>
    <tbody>
      {board.map((row, rowIdx) => (
        <tr key={rowIdx}>
          {row.map((cell, colIdx) => {
            const cellPosition: SelectedCell = [rowIdx, colIdx];
            const cellState = getCellState({
              puzzle,
              solution,
              selected,
              selectedValue,
              cellPosition,
              cellValue: cell,
            });

            return (
              <td
                key={colIdx}
                className={cn(styles.cell, {
                  [styles.selected]: cellState.isSelected,
                  [styles.invalid]: cellState.isInvalid,
                  [styles['same-row']]: cellState.isSameRow,
                  [styles['same-col']]: cellState.isSameCol,
                  [styles['same-box']]: cellState.isSameBox,
                  [styles['same-value']]: cellState.isSameValue,
                })}
              >
                <input
                  type='text'
                  inputMode='numeric'
                  pattern='[1-9]*'
                  value={cell === '0' ? '' : cell}
                  readOnly={cellState.isPrefilled}
                  onFocus={() => onSelectCell(cellPosition)}
                  onClick={() => onSelectCell(cellPosition)}
                  onChange={event =>
                    onInputCell(rowIdx, colIdx, event.target.value)
                  }
                />
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);
