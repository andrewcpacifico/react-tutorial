import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  // check lines
  for (let i = 0; i < 8; i += 3) {
    if (squares[i] === squares[i + 1] && squares[i + 1] === squares[i + 2]) {
      return squares[i];
    }
  }

  // check columns
  for (let i = 0; i < 3; i += 1) {
    if (squares[i] === squares[i + 3] && squares[i + 3] === squares[i + 6]) {
      return squares[i];
    }
  }

  // check first diagonal
  if (squares[0] === squares[4] && squares[4] === squares[8]) {
    return squares[0];
  }

  // check second diagonal
  if (squares[2] === squares[4] && squares[4] === squares[6]) {
    return squares[2];
  }

  return null;
}

function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        row: null,
        col: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      winner: null,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const { xIsNext } = this.state;
    const current = history[history.length - 1].squares;

    if (this.state.winner || current[i]) {
      return;
    }

    const squares = current.slice();
    squares[i] = xIsNext ? 'X' : 'O';

    const winner = calculateWinner(squares);
    this.setState({
      history: history.concat([{
        squares,
        row: Math.floor(i / 3),
        col: i % 3,
      }]),
      xIsNext: !xIsNext,
      stepNumber: history.length,
      winner,
    });
  }

  jumpTo(step) {
    this.setState({
      xIsNext: step % 2 === 0,
      stepNumber: step,
    });
  }

  render() {
    const { history, xIsNext, stepNumber, winner } = this.state;
    const current = history[stepNumber].squares;

    const status = !!winner ?
      `Winner: ${winner}` :
      `Next player: ${xIsNext ? 'X' : 'O'}`;

    const moves = history.map(({ row, col }, move) => {
      const desc = move ?
        `Go to move #${move}. (${col}, ${row})` :
        'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            { move === stepNumber ?
              <b>{desc}</b> :
              desc
            }
          </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
