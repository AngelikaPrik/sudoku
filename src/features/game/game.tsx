import { useMemo } from 'react';
import { Timer } from '@features/timer';
import {
  selectAreControlsDisabled,
  selectBoard,
  selectErrorMessage,
  selectIsLoading,
  selectIsPaused,
  selectIsSolved,
  selectPuzzle,
  selectSelectedCell,
  selectSelectedValue,
  selectSolution,
} from '@/store/selectors';
import { useAppStore } from '@/store/use-app-store';
import styles from './game.module.scss';
import { Loader } from '@shared/ui/loader';
import { Controls } from './controls';
import { Board } from './board';
import { getFilledDigits } from './model/board-utils';
import { useShallow } from 'zustand/react/shallow';

export const Game = () => {
  const {
    board,
    puzzle,
    solution,
    selected,
    selectedValue,
    isLoading,
    isPaused,
    isSolved,
    areControlsDisabled,
    errorMessage,
  } = useAppStore(
    useShallow(state => ({
      board: selectBoard(state),
      puzzle: selectPuzzle(state),
      solution: selectSolution(state),
      selected: selectSelectedCell(state),
      selectedValue: selectSelectedValue(state),
      isLoading: selectIsLoading(state),
      isPaused: selectIsPaused(state),
      isSolved: selectIsSolved(state),
      areControlsDisabled: selectAreControlsDisabled(state),
      errorMessage: selectErrorMessage(state),
    })),
  );
  const selectCell = useAppStore(state => state.selectCell);
  const inputCell = useAppStore(state => state.inputCell);
  const setSelectedCellValue = useAppStore(state => state.setSelectedCellValue);
  const eraseSelectedCell = useAppStore(state => state.eraseSelectedCell);
  const resumeGame = useAppStore(state => state.resumeGame);
  const hasBoard = board !== null && puzzle !== null && solution !== null;
  const isError = !hasBoard && !isLoading && errorMessage !== null;
  const filledDigits = useMemo(
    () => getFilledDigits(board, areControlsDisabled),
    [areControlsDisabled, board],
  );

  return (
    <div className={styles.container}>
      <div className={styles.game}>
        {hasBoard && (
          <Board
            board={board}
            puzzle={puzzle}
            solution={solution}
            selected={selected}
            selectedValue={selectedValue}
            isPaused={isPaused}
            isSolved={isSolved}
            onResume={resumeGame}
            onSelectCell={selectCell}
            onInputCell={inputCell}
          />
        )}
        {(!hasBoard || isLoading) && !isError && (
          <div className={styles.loader} aria-live='polite' aria-busy='true'>
            <Loader />
          </div>
        )}
        {isError && (
          <div className={styles.loader} role='alert'>
            <p className={styles.statusMessage}>{errorMessage}</p>
          </div>
        )}
      </div>
      <div className={styles.aside}>
        <Timer />
        <Controls
          areActionsDisabled={areControlsDisabled}
          filledDigits={filledDigits}
          onSelectValue={setSelectedCellValue}
          onErase={eraseSelectedCell}
        />
      </div>
    </div>
  );
};
