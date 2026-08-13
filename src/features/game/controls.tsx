import { SudokuFilledCell } from './model/api/types';
import styles from './game.module.scss';

interface ControlsProps {
  isDisabled: boolean;
  onSelectValue: (value: SudokuFilledCell) => void;
  onErase: () => void;
}

const nums: SudokuFilledCell[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export const Controls = ({
  isDisabled,
  onSelectValue,
  onErase,
}: ControlsProps) => (
  <div className={styles.controls}>
    <div className={styles.numpad}>
      {nums.map((num) => (
        <button
          key={num}
          type='button'
          className={styles.numpadBtn}
          data-value={num}
          disabled={isDisabled}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelectValue(num)}
        >
          {num}
        </button>
      ))}
    </div>

    <div className={styles.actions}>
      <button
        type='button'
        className={styles.actionBtn}
        disabled={isDisabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={onErase}
      >
        Erase
      </button>
      <button type='button' className={styles.actionBtn} disabled>
        Notes
      </button>
    </div>
  </div>
);
