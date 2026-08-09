import { useEffect, useState } from 'react';
import { Game } from '@features/game';
import { Controls } from '@features/controls';
import { usePuzzleQuery } from '@features/game/api';

import styles from './App.module.scss';

function App() {
  const {
    boardData,
    refetch: refetchPuzzle,
    isLoading,
    status: queryStatus,
    isFetching,
  } = usePuzzleQuery();

  const [board, setBoard] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [solution, setSolution] = useState(null);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState('');
  const [greenCount, setGreenCount] = useState(0);

  useEffect(() => {
    if (isFetching) {
      return;
    }

    setBoard(boardData.board);
    setPuzzle(boardData.puzzle);
    setSolution(boardData.solution);
  }, [isFetching]);

  const onCheck = () => {
    const flatBoard = board?.flat();
    const flatSolution = solution?.flat();

    if (flatBoard?.every((cell, i) => cell === flatSolution[i])) {
      setStatus('Correct!');

      let count = 0;
      const totalCells = 81;
      const interval = setInterval(() => {
        count++;
        setGreenCount(count);
        if (count === totalCells) clearInterval(interval);
      }, 30);
    } else {
      setStatus('Incorrect, try again!');
      setGreenCount(0);
    }
  };

  const onNewPuzzle = async () => {
    setStatus('');
    setSelected(null);
    setGreenCount(0);

    const { boardData } = await refetchPuzzle();

    if (!boardData) {
      return;
    }

    setBoard(boardData.board);
    setPuzzle(boardData.puzzle);
    setSolution(boardData.solution);
  };

  const onInput = (rowIdx, colIdx, value) => {
    if (value === '' || (value >= 1 && value <= 9)) {
      setBoard((prev) => {
        return prev?.map((row, r) =>
          row.map((cell, c) => {
            if (r === rowIdx && c === colIdx) {
              return value ? parseInt(value) : null;
            }
            return cell;
          }),
        );
      });
    }
  };

  return (
    <div className={styles.app}>
      <Game
        board={board}
        puzzle={puzzle}
        selected={selected}
        setSelected={setSelected}
        onInput={onInput}
        greenCount={greenCount}
      />

      <Controls onCheck={onCheck} onNewPuzzle={onNewPuzzle} />
      {status && <div className={styles.status}>{status}</div>}
    </div>
  );
}

export default App;
