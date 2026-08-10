import logo from '../../../public/favicon.svg';
import styles from './header.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt='sudoku-logo' />
        <span className={styles.logoText}>Sudoku</span>
      </div>

      <div className={styles.controls}>
        <div className={styles.difficultyGroup}>
          <button className={styles.difficultyBtn + ' ' + styles.active}>
            Easy
          </button>
          <button className={styles.difficultyBtn}>
            Medium
          </button>
          <button className={styles.difficultyBtn}>
            Hard
          </button>
          <button className={styles.difficultyBtn}>
            Expert
          </button>
        </div>

        <button className={styles.newGameBtn}>
          New game
        </button>
      </div>
    </header>
  );
};
