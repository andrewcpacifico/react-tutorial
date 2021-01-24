import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function calculateWinner(squares) {
  // check lines
  for (let i = 0; i < 8; i += 3) {
    if (squares[i] && squares[i] === squares[i + 1] && squares[i + 1] === squares[i + 2]) {
      return { winner: squares[i], squares: [i, i + 1, i + 2] };
    }
  }

  // check columns
  for (let i = 0; i < 3; i += 1) {
    if (squares[i] && squares[i] === squares[i + 3] && squares[i + 3] === squares[i + 6]) {
      return { winner: squares[i], squares: [i, i + 3, i + 6] };
    }
  }

  // check first diagonal
  if (squares[0] && squares[0] === squares[4] && squares[4] === squares[8]) {
    return { winner: squares[0], squares: [0, 4, 8] };
  }

  // check second diagonal
  if (squares[2] && squares[2] === squares[4] && squares[4] === squares[6]) {
    return { winner: squares[2], squares: [2, 4, 6] };
  }

  return { winner: null, squares: [] };
}

function Square(props) {
  return (
    <button
      className={`square ${props.highlight ? 'highlight' : ''}`}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
      key={i}
      highlight={this.props.winnerSquares[i]}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    const rows = [];
    for (let i = 0; i < 9; i += 3) {
      const squares = [];
      for (let j = i; j < i + 3; j++) {
        squares.push(this.renderSquare(j));
      }
      rows.push(<div className="board-row" key={i}>{squares}</div>);
    }

    return <div>{rows}</div>;
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
      sortMovesAscending: true,
      xIsNext: true,
      stepNumber: 0,
      winnerSquares: {},
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

    const { winner, squares: winnerSquares } = calculateWinner(squares);

    this.setState({
      history: history.concat([{
        squares,
        row: Math.floor(i / 3),
        col: i % 3,
      }]),
      xIsNext: !xIsNext,
      stepNumber: history.length,
      winnerSquares: winnerSquares.reduce((aggr, i) => {
        aggr[i] = true;
        return aggr;
      }, {}),
      winner,
    });
  }

  handleSortButtonClick() {
    this.setState({
      sortMovesAscending: !this.state.sortMovesAscending,
    });
  }

  jumpTo(step) {
    this.setState({
      xIsNext: step % 2 === 0,
      stepNumber: step,
    });
  }

  render() {
    const {
      history,
      xIsNext,
      sortMovesAscending,
      stepNumber,
      winner,
      winnerSquares,
    } = this.state;
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

    if (!sortMovesAscending) {
      moves.reverse();
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current}
            onClick={(i) => this.handleClick(i)}
            winnerSquares={winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div>
            <button onClick={() => this.handleSortButtonClick()}>
              {sortMovesAscending ?
                'Descending' :
                'Ascending' }
            </button>
          </div>
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
