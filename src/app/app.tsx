import { useEffect, useState } from 'react';
import { Game } from '@features/game';
import { usePuzzleMutation } from '@features/game/model/api';
import { Header } from '@features/header';
import { SudokuDifficulty } from '@features/game/model/api/types';
import { Timer, type TimerStatus } from '@features/timer';

import styles from './app.module.scss';

function App() {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('easy');
  const [gameId, setGameId] = useState(0);
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('running');
  const { data, mutate, isPending } = usePuzzleMutation();
  const isTimerPaused = timerStatus === 'paused';

  const restartGame = (nextDifficulty: SudokuDifficulty) => {
    setGameId(currentGameId => currentGameId + 1);
    setTimerStatus('running');
    mutate(nextDifficulty);
  };

  useEffect(() => {
    mutate(difficulty);
  }, []);

  return (
    <div className={styles.app}>
      <Header
        difficulty={difficulty}
        isLoading={isPending}
        setDifficulty={newDifficulty => {
          if (newDifficulty === difficulty) {
            return;
          }
          setDifficulty(newDifficulty);
          restartGame(newDifficulty);
        }}
        onNewGame={() => restartGame(difficulty)}
      />
      <Game
        boardData={data || null}
        isLoading={isPending}
        isPaused={isTimerPaused}
        onResume={() => setTimerStatus('running')}
        timer={
          <Timer key={gameId} status={timerStatus} onToggle={setTimerStatus} />
        }
      />
    </div>
  );
}

export default App;
