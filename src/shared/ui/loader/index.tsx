import styles from './loader.module.scss';

export const Loader = () => (
  <div className={styles.loader} role='status'>
    <div className={styles.spinner} aria-hidden='true' />
  </div>
);
