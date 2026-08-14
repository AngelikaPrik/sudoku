import type { SudokuFilledCell } from './model/api/types';
import type { FilledDigit } from './model/board-utils';
import styles from './game.module.scss';

interface ControlsProps {
  areActionsDisabled: boolean;
  filledDigits: ReadonlyArray<FilledDigit>;
  onSelectValue: (value: SudokuFilledCell) => void;
  onErase: () => void;
}

export const Controls = ({
  areActionsDisabled,
  filledDigits,
  onSelectValue,
  onErase,
}: ControlsProps) => (
  <div className={styles.controls}>
    <div className={styles.numpad}>
      {filledDigits.map(({ value, isDisabled }) => (
        <button
          key={value}
          type='button'
          className={styles.numpadBtn}
          data-value={value}
          disabled={isDisabled}
          onMouseDown={e => e.preventDefault()}
          onClick={() => onSelectValue(value)}
        >
          {value}
        </button>
      ))}
    </div>

    <div className={styles.actions}>
      <button
        type='button'
        className={styles.actionBtn}
        disabled={areActionsDisabled}
        onMouseDown={e => e.preventDefault()}
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
