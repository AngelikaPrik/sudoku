import styles from './game.module.scss';

export const Controls = () => {
  return (
    <div className={styles.controls}>
      <div className={styles.numpad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button className={styles.numpadBtn} data-value={num}>
            {num}
          </button>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.actionBtn}>Erase</button>
        <button className={styles.actionBtn}>Notes</button>
      </div>
    </div>
  );
};
