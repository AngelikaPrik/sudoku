import { useEffect, useState } from 'react';
import { Game } from '@features/game';
import { usePuzzleMutation } from '@features/game/model/api';
import { Header } from '@features/header';
import { SudokuDifficulty } from '@features/game/model/api/types';

import styles from './app.module.scss';
import { Timer } from '@features/timer';

function App() {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('easy');
  const { data, mutate, isPending } = usePuzzleMutation();

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
          mutate(newDifficulty);
        }}
        onNewGame={() => mutate(difficulty)}
      />
      <Game boardData={data || null} isLoading={isPending} timer={<Timer />} />
    </div>
  );
}

export default App;
