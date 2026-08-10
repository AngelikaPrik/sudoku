import cn from 'classnames';
import logo from '../../../public/favicon.svg';
import type { SudokuDifficulty } from '@features/game/api/types';
import styles from './header.module.scss';

const difficultyButtons: SudokuDifficulty[] = ['easy', 'medium', 'hard'];

interface HeaderProps {
  difficulty: SudokuDifficulty;
  isLoading: boolean;
  setDifficulty: (difficulty: SudokuDifficulty) => void;
  onNewGame: () => void;
}

export const Header = ({
  difficulty,
  isLoading,
  setDifficulty,
  onNewGame,
}: HeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt='sudoku-logo' />
        <span className={styles.logoText}>Sudoku</span>
      </div>

      <div className={styles.controls}>
        <div className={styles.difficultyGroup}>
          {difficultyButtons.map((button) => (
            <button
              key={button}
              type='button'
              className={cn(styles.difficultyBtn, {
                [styles.active]: button === difficulty,
              })}
              disabled={isLoading}
              aria-pressed={button === difficulty}
              onClick={() => setDifficulty(button)}
            >
              {button}
            </button>
          ))}
        </div>

        <button
          type='button'
          className={styles.newGameBtn}
          disabled={isLoading}
          onClick={onNewGame}
        >
          <span>New game</span>
        </button>
      </div>
    </header>
  );
};
