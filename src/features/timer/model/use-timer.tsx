import { useCallback, useEffect, useRef, useState } from 'react';

export type TimerStatus = 'running' | 'paused';

interface UseTimerOptions {
  status: TimerStatus;
}

type TimestampMs = number | null;

export const useTimer = ({ status }: UseTimerOptions) => {
  const [elapsedMs, setElapsedMs] = useState(0);
  const elapsedMsRef = useRef(0);
  const isRunning = status === 'running';
  const startTimeRef = useRef<TimestampMs>(isRunning ? Date.now() : null);
  const intervalRef = useRef<TimestampMs>(null);
  const timeoutRef = useRef<TimestampMs>(null);

  const setElapsedValue = useCallback((value: number) => {
    elapsedMsRef.current = value;
    setElapsedMs(value);
  }, []);

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

    setElapsedValue(Date.now() - startTime);
  }, [clearTicking, setElapsedValue]);

  useEffect(() => {
    if (!isRunning) {
      const startTime = startTimeRef.current;

      if (startTime !== null) {
        setElapsedValue(Date.now() - startTime);
        startTimeRef.current = null;
      }

      clearTicking();
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now() - elapsedMsRef.current;
    }

    updateElapsed();

    const startTime = startTimeRef.current;

    if (startTime === null) {
      return;
    }

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

  return { elapsedMs };
};
