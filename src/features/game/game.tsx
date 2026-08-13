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

  return (
    <div className={styles.container}>
      <div className={styles.game}>
        {isLoading || !board || !puzzle ? (
          <div className={styles.loader}>
            <Loader />
          </div>
        ) : (
          <Board
            board={board}
            puzzle={puzzle}
            selected={selected}
            selectedValue={selectedValue}
            onSelectCell={selectCell}
            onInputCell={handleCellInput}
          />
        )}
      </div>
      <Controls
        isDisabled={areControlsDisabled}
        onSelectValue={changeSelectedCellValue}
        onErase={eraseSelectedCell}
      />
    </div>
  );
};
