import styles from './controls.module.scss';

interface ControlsProps {
  onCheck: () => void;
  onNewPuzzle: () => void;
}

export const Controls = ({ onCheck, onNewPuzzle }: ControlsProps) => {
  return (
    <div className={styles.controls}>
      <button onClick={onCheck}>Check</button>
      <button onClick={onNewPuzzle}>New Puzzle</button>
    </div>
  );
};
