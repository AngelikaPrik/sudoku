import styles from './timer.module.scss';

export type TimerAction = 'stop' | 'play';

interface TimerProps {
  action?: TimerAction;
}

export const Timer = ({ action = 'stop' }: TimerProps) => {
  return (
    <div className={styles.timer} data-action={action}>
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden='true'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='0.8em'
            height='0.8em'
            viewBox='0 0 24 24'
            fill='none'
          >
            <path
              d='M12 8V12L14.5 14.5'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M9 2H15'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
            />
            <path
              d='M10.5 5H13.5'
              stroke='currentColor'
              strokeWidth='1.8'
              strokeLinecap='round'
            />
            <circle
              cx='12'
              cy='13'
              r='7'
              stroke='currentColor'
              strokeWidth='1.8'
            />
          </svg>
        </span>
        <time className={styles.value}>00:00</time>
      </div>
      <span className={styles.action} aria-hidden='true'>
        <span className={styles[action]} />
        <span className={styles.text}>{action}</span>
      </span>
    </div>
  );
};
