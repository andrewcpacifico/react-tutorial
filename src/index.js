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
  constructor(props) {
    super(props);

    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      winner: null,
    };
  }

  handleClick(i) {
    if (!!this.state.winner) {
      return;
    }

    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';

    const winner = calculateWinner(squares);
    this.setState({
      squares,
      xIsNext: !this.state.xIsNext,
      winner,
    });
  }

  renderSquare(i) {
    return <Square
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)}
    />;
  }

  render() {
    const status = !!this.state.winner ?
      `Winner: ${this.state.winner}` :
      `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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
