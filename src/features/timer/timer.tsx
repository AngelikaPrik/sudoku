import styles from './timer.module.scss';
import { formatElapsed } from './model/timer-utils';
import { useTimer, type TimerStatus } from './model/use-timer';
import PauseIcon from '@assets/pause.svg?react';
import PlayIcon from '@assets/play.svg?react';

interface TimerProps {
  status: TimerStatus;
  onToggle: (nextStatus: TimerStatus) => void;
}

export const Timer = ({ status, onToggle }: TimerProps) => {
  const { elapsedMs } = useTimer({ status });
  const isRunning = status === 'running';

  return (
    <button
      type='button'
      className={styles.timer}
      data-status={status}
      aria-pressed={!isRunning}
      onClick={() => onToggle(isRunning ? 'paused' : 'running')}
    >
      <div className={styles.content}>
        <time className={styles.value}>{formatElapsed(elapsedMs)}</time>
      </div>
      <span className={styles.action} aria-hidden='true'>
        {isRunning ? (
          <PauseIcon className={styles.actionIcon} />
        ) : (
          <PlayIcon className={styles.actionIcon} />
        )}
      </span>
    </button>
  );
};
