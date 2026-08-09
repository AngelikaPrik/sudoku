import { useEffect, useState } from 'react';
import { Game } from '@features/game';
import { usePuzzleQuery } from '@features/game/api';

import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.app}>
      <Game />
    </div>
  );
}

export default App;
