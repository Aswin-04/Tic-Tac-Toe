function createCell(index) {
  let sign = "";
  const getSign = () => sign;
  const getIndex = () => index;

  const changeSign = (playerSign) => {
    sign = playerSign;
  };

  return {
    getSign,
    getIndex,
    changeSign,
  };
}

function createPlayer(assignedSign) {
  let sign = assignedSign;
  let hasWon = false;

  const getPlayerSign = () => sign;

  return {
    getPlayerSign,
    hasWon,
  };
}

function createGameBoard() {
  const totalCells = 9;
  const board = [];

  for (let index = 0; index < totalCells; index++) {
    board.push(createCell(index));
  }

  const getBoard = () => board;

  const changeCellSign = (index, player) => {
    if (board[index].getSign() != "") return false;
    board[index].changeSign(player.getPlayerSign());
    return true;
  };

  return {
    getBoard,
    changeCellSign,
  };
}

function gameController() {
  const gameBoard = createGameBoard();
  const playerList = [];
  const playerX = createPlayer("X");
  const playerO = createPlayer("O");

  playerList.push(playerX, playerO);

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

  let activePlayer = playerX;

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = playerX === activePlayer ? playerO : playerX;
  };


  const checkForWin = () => {
    for (const combo of winningCombos) {
      const signArray = combo.map((index) => board[index].getSign());

      if (
        signArray.every((val) => val === "X") ||
        signArray.every((val) => val === "O")
      ) {
        activePlayer.hasWon = true;
        return true
      }
    }
  };

  const checkForTie = () => {
    for (let cell of board) {
      if (cell.getSign() === "") return;
      return true;
    }
  };

  const resetBoardArray = () => {
    board.forEach((cell) => cell.changeSign(""));
    activePlayer.hasWon = false;
    activePlayer = playerX;
  };

  const playRound = (index) => {
    if (!gameBoard.changeCellSign(index, activePlayer)) return;
    // if (checkForWin() || checkForTie()) return;
    if(checkForWin() === true) return "Win"
    else if(checkForTie() === true) return "Tie"
    switchPlayerTurn();
  };

  return {
    getBoard: gameBoard.getBoard,
    getActivePlayer,
    resetBoardArray,
    playRound,
  };
}

(function screenController() {
  const game = gameController()
  const board = game.getBoard()

  const inputX = document.querySelector('[data-input-sign="X"]')
  const inputO = document.querySelector('[data-input-sign="O"]')
  const imgX = inputX.querySelector('[data-imgX]')
  const imgO = inputO.querySelector('[data-imgO]')
  const resetBtn = document.querySelector('[data-reset-btn]')
  
  const gameBoard = document.querySelector('[data-game-board]')
  const playerTurn = document.querySelector('[data-player-turn]')
  const playerTurnImg = playerTurn.querySelector("img")
  
  const winnerSign = document.querySelector('[data-winner-sign]')
  
  const resultOptionDiv = document.querySelector('[data-result-opt]')
  const quitBtn = document.querySelector('[data-quit-btn]')
  const nextRoundBtn = document.querySelector('[data-next-round-btn]')
  
  const toggleChecked = (e) => {
    const clickedInput = e.currentTarget
    
    if(clickedInput.dataset.input.sign === "X") {
      inputX.dataset.check.status = "checked"
      inputO.dataset.check.status = ""
    }
    
    else {
      inputX.dataset.check.status = ""
      inputO.dataset.check.status = "checked" 
    }
    
    e.stopPropagation()
  }
  
  inputX.addEventListener('click', toggleChecked)
  inputO.addEventListener('click', toggleChecked)
  
  const createBoard = () => {
    board.forEach((cell) => {
      const squareCell = document.createElement("button")
      const index = cell.getIndex()
      squareCell.classList.add("main-page__game-board__cell")
      squareCell.dataset.cellIndex = index
      
      const cellImg = document.createElement("img")
      cellImg.src = ""
      
      squareCell.addEventListener('click', clickHandlerForBoard)
      
      squareCell.appendChild(cellImg)
      gameBoard.appendChild(squareCell)
    })
    
  }
  
  const updatePlayerTurnImg = () => {
    const activePlayer = game.getActivePlayer()
    if(activePlayer.getPlayerSign() === "X") {
      playerTurnImg.src = "app/scss/assets/icon-x-grey.png"
    }
    else {
      playerTurnImg.src = "app/scss/assets/icon-o-grey.png"
    }
  }
  
  const updateGameBoard = () => {
    const squareCells = gameBoard.querySelectorAll('[data-cell-index]')
    squareCells.forEach((squareCell) => {
      const cellIndex = squareCell.dataset.cellIndex
      const cellImg = squareCell.querySelector('img')
      const sign = board[cellIndex].getSign()
      
      if(sign === "X") {
        cellImg.src = "app/scss/assets/icon-x-dark-cyan.png"
      }
      
      else if(sign === "O") {
        cellImg.src = "app/scss/assets/icon-o-yellow.png"
      }

      else {
        cellImg.src = ""
      }
    })
  }
  
  const updateScreen = () => {
    updatePlayerTurnImg()
    updateGameBoard()
  }
  // const checkStatus = () => {

  // }
  const clickHandlerForBoard = (e) => {
    const selectedCell = e.target
    const index = selectedCell.dataset.cellIndex
    // const gameStatus = game.playRound(index)
    updateScreen() 
    e.stopPropagation()
  }
  
  const resetGameBoard = () => {
    const squareCells = gameBoard.querySelectorAll('[data-cell-index]')
    game.resetBoardArray()
  
    squareCells.forEach((cell) => {
      const cellImg = cell.querySelector("img")
      cellImg.src = ""
    })
  
    updateScreen()
  }

  resetBtn.addEventListener('click', resetGameBoard)

  createBoard()
})()


