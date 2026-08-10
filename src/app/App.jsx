import { useState } from 'react';
import { Game } from '@features/game';
import { usePuzzleMutation } from '@features/game/api';
import { Header } from '@features/header';

import styles from './App.module.scss';

function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const { data, mutate, isPending } = usePuzzleMutation();

  return (
    <div className={styles.app}>
      <Header
        difficulty={difficulty}
        isLoading={isPending}
        setDifficulty={(newDifficulty) => {
          if (newDifficulty === difficulty) {
            return;
          }
          setDifficulty(newDifficulty);
          mutate(newDifficulty);
        }}
        onNewGame={() => mutate(difficulty)}
      />
      <Game boardData={data} isLoading={isPending} />
    </div>
  );
}

export default App;
