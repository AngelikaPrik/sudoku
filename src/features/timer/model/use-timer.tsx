import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerStatus = 'running' | 'paused';

interface UseTimerOptions {
  initialStatus?: TimerStatus;
}

type TimestampMs = number | null;

export const useTimer = ({
  initialStatus = 'running',
}: UseTimerOptions = {}) => {
  const [status, setStatus] = useState<TimerStatus>(initialStatus);
  const [elapsedMs, setElapsedMs] = useState(0);
  const isRunning = status === 'running';

  const startTimeRef = useRef<TimestampMs>(
    initialStatus === 'running' ? Date.now() : null,
  );
  const intervalRef = useRef<TimestampMs>(null);
  const timeoutRef = useRef<TimestampMs>(null);

  const clearTicking = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateElapsed = useCallback(() => {
    const startTime = startTimeRef.current;

    if (startTime === null) {
      clearTicking();
      return;
    }

    setElapsedMs(Date.now() - startTime);
  }, [clearTicking]);

  useEffect(() => {
    if (!isRunning) {
      clearTicking();
      return;
    }

    const startTime = startTimeRef.current;

    if (startTime === null) {
      return;
    }

    updateElapsed();

    const elapsed = Date.now() - startTime;
    const elapsedRemainder = elapsed % 1000;
    const msUntilNextSecond =
      elapsedRemainder === 0 ? 1000 : 1000 - elapsedRemainder;

    timeoutRef.current = window.setTimeout(() => {
      updateElapsed();
      timeoutRef.current = null;
      intervalRef.current = window.setInterval(updateElapsed, 1000);
    }, msUntilNextSecond);

    return clearTicking;
  }, [clearTicking, isRunning, updateElapsed]);

  const onResume = useCallback(() => {
    if (isRunning) return;

    startTimeRef.current = Date.now() - elapsedMs;
    setStatus('running');
  }, [elapsedMs, isRunning]);

  const onPause = useCallback(() => {
    if (!isRunning) return;

    if (startTimeRef.current !== null) {
      setElapsedMs(Date.now() - startTimeRef.current);
    }

    startTimeRef.current = null;
    clearTicking();
    setStatus('paused');
  }, [clearTicking, isRunning]);

  const onToggle = useCallback(() => {
    if (isRunning) {
      onPause();
      return;
    }

    onResume();
  }, [isRunning, onPause, onResume]);

  return { elapsedMs, isRunning, status, onToggle };
};
