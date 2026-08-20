import { useEffect } from 'react';
import { Game } from '@features/game';
import { Header } from '@features/header';
import { useAppStore } from '@/store/use-app-store';

import styles from './app.module.scss';

function App() {
  const startNewGame = useAppStore(state => state.startNewGame);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  return (
    <div className={styles.app}>
      <Header />
      <Game />
    </div>
  );
}

export default App;
