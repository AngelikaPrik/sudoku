import {
  selectElapsedBeforePauseMs,
  selectStartedAtMs,
  selectTimerStatus,
} from '@/store/selectors';
import { useAppStore } from '@/store/use-app-store';
import styles from './timer.module.scss';
import { formatElapsed } from './model/timer-utils';
import { useTimer } from './model/use-timer';
import PauseIcon from '@assets/pause.svg?react';
import PlayIcon from '@assets/play.svg?react';

export const Timer = () => {
  const status = useAppStore(selectTimerStatus);
  const elapsedBeforePauseMs = useAppStore(selectElapsedBeforePauseMs);
  const startedAtMs = useAppStore(selectStartedAtMs);
  const togglePause = useAppStore(state => state.togglePause);
  const { elapsedMs } = useTimer({
    status,
    elapsedBeforePauseMs,
    startedAtMs,
  });
  const isRunning = status === 'running';
  const isStopped = status === 'stopped';

  return (
    <button
      type='button'
      className={styles.timer}
      data-status={status}
      disabled={isStopped}
      onClick={togglePause}
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
