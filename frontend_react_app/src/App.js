import React, { useMemo, useState } from "react";
import "./App.css";

const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function calculateWinner(squares) {
  for (const [a, b, c] of WIN_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

function isDraw(squares) {
  return squares.every((sq) => sq !== null);
}

function Square({ value, onClick, disabled, isWinning }) {
  return (
    <button
      type="button"
      className={`ttt-square ${isWinning ? "is-winning" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={value ? `Square ${value}` : "Empty square"}
    >
      <span className={`ttt-mark ${value ? `is-${value}` : ""}`}>{value}</span>
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Single-game state: 9 squares and whose turn it is. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const draw = useMemo(() => !winner && isDraw(squares), [winner, squares]);

  const currentPlayer = xIsNext ? "X" : "O";
  const gameOver = Boolean(winner) || draw;

  const statusText = winner
    ? `Winner: ${winner}`
    : draw
      ? "It's a draw!"
      : `Turn: ${currentPlayer}`;

  const subStatusText = winner
    ? "Nice! Hit New Game to play again."
    : draw
      ? "So close—try again with a fresh board."
      : "Pick an empty square to place your mark.";

  const handleSquareClick = (index) => {
    if (gameOver) return;
    if (squares[index]) return;

    setSquares((prev) => {
      const next = [...prev];
      next[index] = currentPlayer;
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="ttt-page">
      <main className="ttt-shell">
        <header className="ttt-header">
          <div className="ttt-badge" aria-hidden="true">
            Rainbow Burst
          </div>
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-subtitle">A quick, classic 3×3 showdown.</p>
        </header>

        <section className="ttt-card" aria-label="Game">
          <div className="ttt-status" role="status" aria-live="polite">
            <div className="ttt-status-row">
              <div className="ttt-status-pill">
                <span className="ttt-status-label">{statusText}</span>
              </div>

              <div className="ttt-turn-chip" aria-label="Current player indicator">
                <span className="ttt-chip-label">Next</span>
                <span className={`ttt-chip-mark ${xIsNext ? "is-x" : "is-o"}`}>
                  {currentPlayer}
                </span>
              </div>
            </div>

            <div className="ttt-status-help">{subStatusText}</div>
          </div>

          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {squares.map((value, idx) => (
              <Square
                key={idx}
                value={value}
                onClick={() => handleSquareClick(idx)}
                disabled={gameOver || Boolean(value)}
                isWinning={line.includes(idx)}
              />
            ))}
          </div>

          <div className="ttt-actions">
            <button type="button" className="ttt-btn" onClick={handleReset}>
              New Game
            </button>

            <div className="ttt-legend" aria-label="Legend">
              <span className="ttt-legend-item">
                <span className="ttt-dot is-x" aria-hidden="true" />
                X
              </span>
              <span className="ttt-legend-item">
                <span className="ttt-dot is-o" aria-hidden="true" />
                O
              </span>
              {winner ? (
                <span className="ttt-legend-item">
                  <span className="ttt-dot is-win" aria-hidden="true" />
                  Winning line
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <footer className="ttt-footer">
          Tip: First to get three in a row wins (rows, columns, or diagonals).
        </footer>
      </main>
    </div>
  );
}

export default App;
