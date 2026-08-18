import styles from './timer.module.scss';
import { formatElapsed } from './model/timer-utils';
import { useTimer, type TimerStatus } from './model/use-timer';

interface TimerProps {
  action?: TimerStatus;
}

export const Timer = ({ action = 'running' }: TimerProps) => {
  const { elapsedMs, isRunning, status, onToggle } = useTimer({
    initialStatus: action,
  });

  return (
    <button
      type='button'
      className={styles.timer}
      data-status={status}
      aria-pressed={!isRunning}
      onClick={onToggle}
    >
      <div className={styles.content}>
        <time className={styles.value}>{formatElapsed(elapsedMs)}</time>
      </div>
      <span className={styles.action} aria-hidden='true'>
        <span className={styles.paused} />
      </span>
    </button>
  );
};
