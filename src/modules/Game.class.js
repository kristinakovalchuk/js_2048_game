'use strict';

class Game {
  constructor(initialState) {
    if (initialState) {
      this.initialState = this._copyBoard(initialState);
      this.board = this._copyBoard(initialState);
    } else {
      this.initialState = null;
      this.board = this._getEmptyBoard();
    }
    this.score = 0;
    this.status = 'idle';
  }

  _getEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  _copyBoard(board) {
    return board.map((row) => [...row]);
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells[randomIndex];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  _compress(row) {
    const newRow = row.filter((val) => val !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  _merge(row) {
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;

        if (row[i] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  _moveRow(row) {
    const compressedRow = this._compress(row);

    this._merge(compressedRow);

    return this._compress(compressedRow);
  }

  _rotateLeft(board) {
    const newBoard = this._getEmptyBoard();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newBoard[3 - c][r] = board[r][c];
      }
    }

    return newBoard;
  }

  _rotateRight(board) {
    const newBoard = this._getEmptyBoard();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newBoard[c][3 - r] = board[r][c];
      }
    }

    return newBoard;
  }

  _checkMove(oldBoard, newBoard) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (oldBoard[r][c] !== newBoard[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _updateStatus() {
    if (this.status === 'win') {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  _move(transform) {
    if (this.status !== 'playing') {
      return false;
    }

    const newBoard = transform(this.board);

    if (this._checkMove(this.board, newBoard)) {
      this.board = newBoard;
      this._addRandomTile();
      this._updateStatus();

      return true;
    }

    return false;
  }

  moveLeft() {
    return this._move((board) => {
      return board.map((row) => this._moveRow(row));
    });
  }

  moveRight() {
    return this._move((board) => {
      return board.map((row) => {
        const reversedRow = [...row].reverse();
        const movedRow = this._moveRow(reversedRow);

        return movedRow.reverse();
      });
    });
  }

  moveUp() {
    return this._move((board) => {
      const rotated = this._rotateLeft(board);
      const moved = rotated.map((row) => this._moveRow(row));

      return this._rotateRight(moved);
    });
  }

  moveDown() {
    return this._move((board) => {
      const rotated = this._rotateRight(board);
      const moved = rotated.map((row) => this._moveRow(row));

      return this._rotateLeft(moved);
    });
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      if (!this.initialState) {
        this._addRandomTile();
        this._addRandomTile();
      }
    }
  }

  restart() {
    if (this.initialState) {
      this.board = this._copyBoard(this.initialState);
    } else {
      this.board = this._getEmptyBoard();
    }
    this.score = 0;
    this.status = 'idle';
    this.start();
  }
}

export default Game;
