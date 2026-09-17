'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const startBtn = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const updateUI = () => {
  const board = game.getState();
  const score = game.getScore();
  const gamestatus = game.getStatus();

  scoreElement.textContent = score;

  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = board[r][c];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';
      cell.textContent = '';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
      cellIndex += 1;
    }
  }

  if (gamestatus === 'win') {
    messageWin.classList.remove('hidden');
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
  } else if (gamestatus === 'lose') {
    messageLose.classList.remove('hidden');
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
};

startBtn.addEventListener('click', () => {
  game.restart();

  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let isMoved = false;

  if (e.key === 'ArrowLeft') {
    isMoved = game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    isMoved = game.moveRight();
  } else if (e.key === 'ArrowUp') {
    isMoved = game.moveUp();
  } else if (e.key === 'ArrowDown') {
    isMoved = game.moveDown();
  }

  if (isMoved) {
    updateUI();
  }
});
