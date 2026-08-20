import { create } from 'zustand';
import { fetchPuzzle } from '@features/game/model/api';
import type {
  PuzzleBoardData,
  SudokuBoard,
  SudokuCell,
  SudokuDifficulty,
} from '@features/game/model/api/types';
import type { SelectedCell } from '@features/game/model/board-utils';
import {
  canUseCellValue,
  isBoardSolved,
  isPrefilledCell,
  normalizeCellInput,
} from '@features/game/model/board-utils';

export type GamePhase =
  'idle' | 'loading' | 'playing' | 'paused' | 'solved' | 'error';

export interface AppStoreState {
  board: SudokuBoard | null;
  puzzle: SudokuBoard | null;
  solution: SudokuBoard | null;
  selected: SelectedCell | null;
  difficulty: SudokuDifficulty;
  phase: GamePhase;
  errorMessage: string | null;
  elapsedBeforePauseMs: number;
  startedAtMs: number | null;
  requestId: number;
}

interface AppStoreActions {
  startNewGame: (difficulty?: SudokuDifficulty) => Promise<void>;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  selectCell: (cell: SelectedCell) => void;
  inputCell: (rowIdx: number, colIdx: number, rawValue: string) => void;
  setSelectedCellValue: (value: SudokuCell) => void;
  eraseSelectedCell: () => void;
}

export type AppStore = AppStoreState & AppStoreActions;

const getElapsedSnapshot = (
  state: Pick<AppStoreState, 'elapsedBeforePauseMs' | 'startedAtMs' | 'phase'>,
) =>
  state.phase === 'playing' && state.startedAtMs !== null
    ? state.elapsedBeforePauseMs + (Date.now() - state.startedAtMs)
    : state.elapsedBeforePauseMs;

const getLoadedGameState = (
  boardData: PuzzleBoardData,
): Pick<AppStoreState, 'board' | 'puzzle' | 'solution' | 'selected'> => ({
  board: boardData.puzzle.map(row => [...row]),
  puzzle: boardData.puzzle,
  solution: boardData.solution,
  selected: null,
});

const getUpdatedBoardState = (
  state: AppStoreState,
  cell: SelectedCell,
  value: SudokuCell,
): Partial<AppStoreState> => {
  const { board, puzzle, solution } = state;

  if (!board || !puzzle || !solution || isPrefilledCell(puzzle, cell)) {
    return {};
  }

  const [rowIdx, colIdx] = cell;
  const nextBoard = board.map(row => [...row]);
  nextBoard[rowIdx][colIdx] = value;

  if (!isBoardSolved(nextBoard, solution)) {
    return {
      board: nextBoard,
    };
  }

  return {
    board: nextBoard,
    selected: null,
    phase: 'solved',
    elapsedBeforePauseMs: getElapsedSnapshot(state),
    startedAtMs: null,
  };
};

export const useAppStore = create<AppStore>((set, get) => ({
  board: null,
  puzzle: null,
  solution: null,
  selected: null,
  difficulty: 'easy',
  phase: 'idle',
  errorMessage: null,
  elapsedBeforePauseMs: 0,
  startedAtMs: null,
  requestId: 0,

  startNewGame: async nextDifficulty => {
    const difficulty = nextDifficulty ?? get().difficulty;
    const requestId = get().requestId + 1;

    set({
      board: null,
      puzzle: null,
      solution: null,
      selected: null,
      difficulty,
      phase: 'loading',
      errorMessage: null,
      elapsedBeforePauseMs: 0,
      startedAtMs: null,
      requestId,
    });

    try {
      const boardData = await fetchPuzzle(difficulty);

      if (get().requestId !== requestId) {
        return;
      }

      set({
        ...getLoadedGameState(boardData),
        difficulty: boardData.difficulty,
        phase: 'playing',
        errorMessage: null,
        elapsedBeforePauseMs: 0,
        startedAtMs: Date.now(),
      });
    } catch (error) {
      if (get().requestId !== requestId) {
        return;
      }

      set({
        board: null,
        puzzle: null,
        solution: null,
        selected: null,
        phase: 'error',
        errorMessage:
          error instanceof Error ? error.message : 'Failed to load puzzle',
        elapsedBeforePauseMs: 0,
        startedAtMs: null,
      });
    }
  },

  pauseGame: () => {
    set(state => {
      if (state.phase !== 'playing') {
        return {};
      }

      return {
        phase: 'paused',
        elapsedBeforePauseMs: getElapsedSnapshot(state),
        startedAtMs: null,
      };
    });
  },

  resumeGame: () => {
    set(state => {
      if (state.phase !== 'paused') {
        return {};
      }

      return {
        phase: 'playing',
        startedAtMs: Date.now(),
      };
    });
  },

  togglePause: () => {
    const { phase, pauseGame, resumeGame } = get();

    if (phase === 'playing') {
      pauseGame();
      return;
    }

    if (phase === 'paused') {
      resumeGame();
    }
  },

  selectCell: cell => {
    set(state => {
      if (state.phase !== 'playing') {
        return {};
      }

      return {
        selected: cell,
      };
    });
  },

  inputCell: (rowIdx, colIdx, rawValue) => {
    set(state => {
      if (state.phase !== 'playing') {
        return {};
      }

      const nextValue = normalizeCellInput(rawValue);

      if (
        nextValue === null ||
        !canUseCellValue(state.board, [rowIdx, colIdx], nextValue)
      ) {
        return {};
      }

      return getUpdatedBoardState(state, [rowIdx, colIdx], nextValue);
    });
  },

  setSelectedCellValue: value => {
    set(state => {
      if (state.phase !== 'playing' || state.selected === null) {
        return {};
      }

      if (!canUseCellValue(state.board, state.selected, value)) {
        return {};
      }

      return getUpdatedBoardState(state, state.selected, value);
    });
  },

  eraseSelectedCell: () => {
    get().setSelectedCellValue('0');
  },
}));
