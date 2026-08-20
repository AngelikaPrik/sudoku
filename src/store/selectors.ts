import type { SudokuCell } from '@features/game/model/api/types';
import { isPrefilledCell } from '@features/game/model/board-utils';
import type { TimerStatus } from '@features/timer/model/use-timer';
import type { AppStoreState } from './use-app-store';

export const selectDifficulty = (state: AppStoreState) => state.difficulty;

export const selectPhase = (state: AppStoreState) => state.phase;

export const selectBoard = (state: AppStoreState) => state.board;

export const selectPuzzle = (state: AppStoreState) => state.puzzle;

export const selectSolution = (state: AppStoreState) => state.solution;

export const selectSelectedCell = (state: AppStoreState) => state.selected;

export const selectErrorMessage = (state: AppStoreState) => state.errorMessage;

export const selectElapsedBeforePauseMs = (state: AppStoreState) =>
  state.elapsedBeforePauseMs;

export const selectStartedAtMs = (state: AppStoreState) => state.startedAtMs;

export const selectIsLoading = (state: AppStoreState) =>
  state.phase === 'idle' || state.phase === 'loading';

export const selectIsPaused = (state: AppStoreState) =>
  state.phase === 'paused';

export const selectIsSolved = (state: AppStoreState) =>
  state.phase === 'solved';

export const selectSelectedValue = (
  state: AppStoreState,
): SudokuCell | null => {
  const { board, selected } = state;

  return selected !== null
    ? (board?.[selected[0]]?.[selected[1]] ?? null)
    : null;
};

export const selectIsSelectedPrefilled = (state: AppStoreState) => {
  const { puzzle, selected } = state;

  return (
    selected !== null && puzzle !== null && isPrefilledCell(puzzle, selected)
  );
};

export const selectAreControlsDisabled = (state: AppStoreState) =>
  state.phase !== 'playing' ||
  state.selected === null ||
  selectIsSelectedPrefilled(state);

export const selectTimerStatus = (state: AppStoreState): TimerStatus => {
  if (state.phase === 'playing') {
    return 'running';
  }

  if (state.phase === 'paused') {
    return 'paused';
  }

  return 'stopped';
};
