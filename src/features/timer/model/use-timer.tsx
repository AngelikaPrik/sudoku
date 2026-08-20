import { useEffect, useState } from 'react';

export type TimerStatus = 'running' | 'paused' | 'stopped';

interface UseTimerOptions {
  status: TimerStatus;
  elapsedBeforePauseMs: number;
  startedAtMs: number | null;
}

const getElapsedMs = ({
  status,
  elapsedBeforePauseMs,
  startedAtMs,
  nowMs,
}: UseTimerOptions & { nowMs: number }) =>
  status === 'running' && startedAtMs !== null
    ? elapsedBeforePauseMs + (nowMs - startedAtMs)
    : elapsedBeforePauseMs;

export const useTimer = ({
  status,
  elapsedBeforePauseMs,
  startedAtMs,
}: UseTimerOptions) => {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (status !== 'running' || startedAtMs === null) {
      return;
    }

    const syncNow = () => {
      setNowMs(Date.now());
    };

    syncNow();
    const elapsed = Date.now() - startedAtMs;
    const elapsedRemainder = elapsed % 1000;
    const msUntilNextSecond =
      elapsedRemainder === 0 ? 1000 : 1000 - elapsedRemainder;
    let intervalId: number | null = null;

    const timeoutId = setTimeout(() => {
      syncNow();
      intervalId = setInterval(syncNow, 1000);
    }, msUntilNextSecond);

    return () => {
      clearTimeout(timeoutId);

      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [startedAtMs, status]);

  const elapsedMs = getElapsedMs({
    status,
    elapsedBeforePauseMs,
    startedAtMs,
    nowMs,
  });
  return { elapsedMs };
};
