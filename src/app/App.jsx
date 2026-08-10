import { useEffect, useState } from 'react';
import { Game } from '@features/game';
import { usePuzzleQuery } from '@features/game/api';

import styles from './App.module.scss';
import { Header } from '@features/header';

function App() {
  return (
    <div className={styles.app}>
      <Header />
      <Game />
    </div>
  );
}

export default App;
