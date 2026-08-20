import cn from 'classnames';
import logo from '../../../public/favicon.svg';
import { selectDifficulty, selectIsLoading } from '@/store/selectors';
import { useAppStore } from '@/store/use-app-store';
import type { SudokuDifficulty } from 'src/features/game/model/api/types';
import styles from './header.module.scss';

const difficultyButtons: SudokuDifficulty[] = ['easy', 'medium', 'hard'];

export const Header = () => {
  const difficulty = useAppStore(selectDifficulty);
  const isLoading = useAppStore(selectIsLoading);
  const startNewGame = useAppStore(state => state.startNewGame);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt='sudoku-logo' />
        <span className={styles.logoText}>Sudoku</span>
      </div>

      <div className={styles.controls}>
        <div className={styles.difficultyGroup}>
          {difficultyButtons.map(button => (
            <button
              key={button}
              type='button'
              className={cn(styles.difficultyBtn, {
                [styles.active]: button === difficulty,
              })}
              disabled={isLoading}
              aria-pressed={button === difficulty}
              onClick={() => {
                if (button === difficulty) {
                  return;
                }

                startNewGame(button);
              }}
            >
              {button}
            </button>
          ))}
        </div>

        <button
          type='button'
          className={styles.newGameBtn}
          disabled={isLoading}
          onClick={() => startNewGame()}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='1em'
            height='1em'
            viewBox='0 0 24 24'
          >
            <path d='M0 0h24v24H0z' fill='none' />
            <g
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeWidth='1.5'
            >
              <path
                strokeMiterlimit='10'
                d='M18.024 7.043A8.374 8.374 0 0 0 3.74 12.955'
              />
              <path
                strokeLinejoin='round'
                d='m17.35 2.75l.832 3.372a1.123 1.123 0 0 1-.854 1.382l-3.372.843'
              />
              <path
                strokeMiterlimit='10'
                d='M5.976 16.957a8.374 8.374 0 0 0 14.285-5.912'
              />
              <path
                strokeLinejoin='round'
                d='m6.65 21.25l-.832-3.372a1.124 1.124 0 0 1 .855-1.382l3.371-.843'
              />
            </g>
          </svg>
          <span>New game</span>
        </button>
      </div>
    </header>
  );
};
