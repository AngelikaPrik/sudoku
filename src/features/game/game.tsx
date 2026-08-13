import type { PuzzleBoardData } from './model/api/types';
import styles from './game.module.scss';
import { Loader } from '@shared/ui/loader';
import { Controls } from './controls';
import { Board } from './board';
import { useSudokuBoard } from './model/use-sudoku-board';

interface GameProps {
  boardData: PuzzleBoardData | null;
  isLoading: boolean;
}

export const Game = ({ boardData, isLoading }: GameProps) => {
  const {
    board,
    puzzle,
    selected,
    selectedValue,
    areControlsDisabled,
    selectCell,
    handleCellInput,
    changeSelectedCellValue,
    eraseSelectedCell,
  } = useSudokuBoard(boardData);
  const solution = boardData?.solution ?? null;
  const hasBoard = board !== null && puzzle !== null && solution !== null;

  return (
    <div className={styles.container}>
      <div className={styles.game}>
        {hasBoard ? (
          <Board
            board={board}
            puzzle={puzzle}
            solution={solution}
            selected={selected}
            selectedValue={selectedValue}
            onSelectCell={selectCell}
            onInputCell={handleCellInput}
          />
        ) : null}
        {(!hasBoard || isLoading) && (
          <div className={styles.loader} aria-live='polite' aria-busy='true'>
            <Loader />
          </div>
        )}
      </div>
      <Controls
        isDisabled={isLoading || areControlsDisabled}
        onSelectValue={changeSelectedCellValue}
        onErase={eraseSelectedCell}
      />
    </div>
  );
};
