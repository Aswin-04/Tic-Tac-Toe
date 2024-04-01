function createCell(index) {
  let sign = "";
  const getSign = () => sign;
  const getIndex = () => index;

  const setSign = (playerSign) => {
    sign = playerSign;
  };

  return {
    getSign,
    getIndex,
    setSign,
  };
}

function createPlayer(sign) {
  const getPlayerSign = () => sign;

  return {
    getPlayerSign,
  };
}

function createGameBoard() {
  const totalCells = 9;
  const board = [];

  for (let index = 0; index < totalCells; index++) {
    board.push(createCell(index));
  }

  const getBoard = () => board;

  const setCellSign = (index, sign) => {
    if (board[index].getSign() === "") {
      board[index].setSign(sign);
      return true;
    }
    return null;
  };

  return {
    getBoard,
    setCellSign,
  };
}

function gameController() {
  const gameBoard = createGameBoard();
  const playerList = [];
  const playerX = createPlayer("X");
  const playerO = createPlayer("O");

  playerList.push(playerX, playerO);

  let activePlayer = playerX;

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = playerX === activePlayer ? playerO : playerX;
  };

  const checkForWin = () => {
    const board = gameBoard.getBoard();
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      const signA = board[a].getSign();
      const signB = board[b].getSign();
      const signC = board[c].getSign();

      if (signA && signA === signB && signA === signC) return signA;
    }
    return null;
  };

  const checkForTie = () => {
    const board = gameBoard.getBoard();
    if (board.every((cell) => cell.getSign())) return "Tie";
  };

  const resetBoardArray = () => {
    const board = gameBoard.getBoard();
    board.forEach((cell) => cell.setSign(""));
    activePlayer = playerX;
  };

  const playRound = (index) => {
    if (gameBoard.setCellSign(index, getActivePlayer().getPlayerSign())) {
      const win = checkForWin();
      if (win) return win;

      const tie = checkForTie();
      if (tie) return tie;

      switchPlayerTurn();
    }
    return null;
  };

  return {
    getBoard: gameBoard.getBoard,
    getActivePlayer,
    switchPlayerTurn,
    resetBoardArray,
    playRound,
  };
}

(function screenController() {
  const game = gameController();
  const board = game.getBoard();

  const initPage = document.querySelector("[data-init-page]");
  const playerSignInputs = document.querySelectorAll("[data-input-sign]");
  const inputX = document.querySelector('[data-input-sign="X"]');
  const inputO = document.querySelector('[data-input-sign="O"]');
  const imgX = inputX.querySelector("[data-imgX]");
  const imgO = inputO.querySelector("[data-imgO]");
  const startBtn = document.querySelector("[data-start-btn]");

  const mainPage = document.querySelector("[data-main-page]");
  const playerTurn = document.querySelector("[data-player-turn]");
  const playerTurnImg = playerTurn.querySelector("img");
  const gameBoardContainer = document.querySelector("[data-game-board]");
  const resetBtn = document.querySelector("[data-reset-btn]");

  const resultDialog = document.querySelector("[data-result-dialog]");
  const resultCredit = document.querySelector("[data-credit-tag]");
  const winnerSignImg = document.querySelector("[data-winner-sign-img]");
  const resultStatusSpan = document.querySelector("span");
  const quitBtn = document.querySelector("[data-quit-btn]");
  const playAgainBtn = document.querySelector("[data-play-again-btn]");

  const toggleImage = (clickedInput) => {
    if (clickedInput.dataset.inputSign === "X") {
      imgX.src = "app/scss/assets/icon-x-dark.png";
      imgO.src = "app/scss/assets/icon-o-grey.png";
    } else {
      imgX.src = "app/scss/assets/icon-x-grey.png";
      imgO.src = "app/scss/assets/icon-o-dark.png";
    }
  };

  const toggleChecked = (clickedInput) => {
    if (clickedInput.dataset.inputSign === "X") {
      inputX.dataset.checkStatus = "checked";
      inputO.dataset.checkStatus = "";
    } else {
      inputX.dataset.checkStatus = "";
      inputO.dataset.checkStatus = "checked";
    }
  };

  const togglePlayerIcon = (e) => {
    const clickedSign = e.currentTarget;
    toggleChecked(clickedSign);
    toggleImage(clickedSign);
    e.stopPropagation();
  };

  const startGame = () => {
    initPage.dataset.disabled = "true";
    mainPage.dataset.disabled = "false";
  };

  const createBoard = () => {
    board.forEach((cell) => {
      const squareCell = document.createElement("button");
      const index = cell.getIndex();
      squareCell.classList.add("main-page__game-board__cell");
      squareCell.dataset.cellIndex = index;

      const cellImg = document.createElement("img");
      cellImg.src = "";

      squareCell.addEventListener("click", handleCellClick);

      squareCell.appendChild(cellImg);
      gameBoardContainer.appendChild(squareCell);
    });
  };

  const updatePlayerTurnImg = () => {
    const activePlayer = game.getActivePlayer();
    const sign = activePlayer.getPlayerSign();
    playerTurnImg.src = `app/scss/assets/icon-${sign.toLowerCase()}-grey.png`;
  };

  const resetPlayerTurnImg = () => {
    playerTurnImg.src = 'app/scss/assets/icon-x-grey.png'
  }

  const updateGameBoard = () => {
    board.forEach((cell, index) => {
      const cellElement = document.querySelector(
        `[data-cell-index='${index}']`
      );
      const cellImg = cellElement.querySelector("img");
      const sign = cell.getSign();

      if (sign === "X") {
        cellImg.src = "app/scss/assets/icon-x-dark-cyan.png";
      } else if (sign === "O") {
        cellImg.src = "app/scss/assets/icon-o-yellow.png";
      } else {
        cellImg.src = "";
      }
    });
  };

  const handleGameOutcome = (roundOutcome) => {
    if (roundOutcome === "Tie") {
      showDialog("It's a Tie");
      return roundOutcome;
    } else if (roundOutcome) {
      showDialog(`${roundOutcome} won the game!`);
      return roundOutcome;
    }
    return null;
  };

  const showDialog = (message) => {
    resultDialog.showModal();
    resultStatusSpan.textContent = message;

    if (message != "It's a Tie") {
      const winnerSign = game.getActivePlayer().getPlayerSign();

      if (winnerSign === "X") {
        winnerSignImg.src = `app/scss/assets/icon-${winnerSign.toLowerCase()}-dark-cyan.png`;
      } else {
        winnerSignImg.src = `app/scss/assets/icon-${winnerSign.toLowerCase()}-yellow.png`;
      }
    } else {
      resultCredit.dataset.isHidden = true;
      winnerSignImg.dataset.isHidden = true;
    }
  };

  const resetResultDialog = () => {
    resultCredit.dataset.isHidden = "";
    winnerSignImg.dataset.isHidden = "";
  };

  const resetGame = () => {
    game.resetBoardArray();
    resetPlayerTurnImg()
    updateGameBoard();
    resetResultDialog();
    resultDialog.close();
  };

  const handleQuit = () => {
    mainPage.dataset.disabled = true;
    initPage.dataset.disabled = false;
    resetGame();
  };

  const handlePlayAgain = () => {
    resetGame();
  };

  const handleCellClick = (e) => {
    const index = e.currentTarget.dataset.cellIndex;
    const roundOutcome = game.playRound(index);
    handleGameOutcome(roundOutcome);
    updatePlayerTurnImg();
    updateGameBoard();
  };

  const initializeGame = () => {
    createBoard();
    playerSignInputs.forEach((input) =>
      input.addEventListener("click", togglePlayerIcon)
    );
    startBtn.addEventListener("click", startGame);
    resetBtn.addEventListener("click", resetGame);
    quitBtn.addEventListener("click", handleQuit);
    playAgainBtn.addEventListener("click", handlePlayAgain);
  };

  initializeGame();
})();
