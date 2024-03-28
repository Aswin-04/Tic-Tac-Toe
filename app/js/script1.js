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

  let gameHasWon = false
  let gameIsTie = false

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

  const resetGameStatus = () => {
    gameHasWon = false
    gameIsTie = false
  }

  const checkForWin = () => {
    for (const combo of winningCombos) {
      const signArray = combo.map((index) => board[index].getSign());

      if (
        signArray.every((val) => val === "X") ||
        signArray.every((val) => val === "O")
      ) {
        activePlayer.hasWon = true;
        gameHasWon = true
        return
      }
    }
  };

  const checkForTie = () => {
    for (let cell of board) {
      if (cell.getSign() === "") return;
    }
    gameIsTie = true
  };

  const resetBoardArray = () => {
    board.forEach((cell) => cell.changeSign(""));
    activePlayer.hasWon = false;
    activePlayer = playerX;
  };

  const playRound = (index) => {
    if (!gameBoard.changeCellSign(index, activePlayer)) return;
    checkForWin()
    if(gameHasWon === true) {
      resetGameStatus()
      return activePlayer.getPlayerSign()
    }

    checkForTie()
    if(gameIsTie === true) {
      resetGameStatus()
      return "Tie"
    }
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
  
  const initPage = document.querySelector('[data-init-page]')
  const inputX = document.querySelector('[data-input-sign="X"]')
  const inputO = document.querySelector('[data-input-sign="O"]')
  const imgX = inputX.querySelector('[data-imgX]')
  const imgO = inputO.querySelector('[data-imgO]')
  const startGameBtn = document.querySelector('[data-start-btn]')
  
  const mainPage = document.querySelector('[data-main-page]')
  const resetBtn = document.querySelector('[data-reset-btn]')
  const gameBoard = document.querySelector('[data-game-board]')
  const playerTurn = document.querySelector('[data-player-turn]')
  const playerTurnImg = playerTurn.querySelector("img")
  
  
  const resultDialog = document.querySelector("[data-result-dialog]")
  const creditTag = resultDialog.querySelector("p")
  const h2 = resultDialog.querySelector("h2")
  const winnerSignImg = document.querySelector('[data-winner-sign-img]')
  const h2Span = h2.querySelector("span")
  const quitBtn = document.querySelector('[data-quit-btn]')
  const playAgainBtn = document.querySelector('[data-play-again-btn]')

  const toggleImage = (clickedInput) => {
    
    if(clickedInput.dataset.inputSign === "X") {
      imgX.src = "app/scss/assets/icon-x-dark.png"
      imgO.src = "app/scss/assets/icon-o-grey.png"
    }

    else {
      imgX.src = "app/scss/assets/icon-x-grey.png"
      imgO.src = "app/scss/assets/icon-o-dark.png"
    }

  }
  
  const toggleChecked = (clickedInput) => {
    
    if(clickedInput.dataset.inputSign === "X") {
      inputX.dataset.checkStatus = "checked"
      inputO.dataset.checkStatus = ""
    }
    
    else {
      inputX.dataset.checkStatus = ""
      inputO.dataset.checkStatus = "checked" 
    }
    
  }

  const handlePlayerPickerSign = (e) => {
    const clickedInput = e.currentTarget
    toggleChecked(clickedInput)
    toggleImage(clickedInput)
    e.stopPropagation()

  }
  
  inputX.addEventListener('click', handlePlayerPickerSign)
  inputO.addEventListener('click', handlePlayerPickerSign)

  const startGame = () => {
    initPage.dataset.disabled = "true"
    mainPage.dataset.disabled = "false"
  }

  startGameBtn.addEventListener('click', startGame)
  
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
  const handleGameStatus = (gameStatus) => {
    if(gameStatus === "Tie") {
      resultDialog.showModal()

      creditTag.textContent = ""
      winnerSignImg.dataset.isHidden = "true"
      h2Span.textContent = "It's a Tie"

    }

    else if(gameStatus === "X") {
      resultDialog.showModal()
      winnerSignImg.src = "app/scss/assets/icon-x-dark-cyan.png"
      h2Span.textContent = "Takes the Round"
    }

    else if(gameStatus === "O") {
      resultDialog.showModal()
      winnerSignImg.src = "app/scss/assets/icon-o-yellow.png"
      h2Span.textContent = "Takes the Round"
    }

  }

  const resetResultConveyer = () => {
    winnerSignImg.dataset.isHidden = ""
    creditTag.textContent = "Congratulations !"
    winnerSignImg.src = ""
    h2Span.textContent = ""
  }
  const clickHandlerForBoard = (e) => {
    const selectedCell = e.target
    const index = selectedCell.dataset.cellIndex
    const getGameStatus = () => game.playRound(index)
    handleGameStatus(getGameStatus())
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

  const handleQuit = () => {
    mainPage.dataset.disabled = true
    initPage.dataset.disabled = false
    resetGameBoard()
    resetResultConveyer()
    resultDialog.close()
  }
  quitBtn.addEventListener('click', handleQuit)

  const handlePlayAgain = () => {
    resetGameBoard()
    resetResultConveyer()
    resultDialog.close()
  }
  playAgainBtn.addEventListener('click', handlePlayAgain)



  createBoard()
})()


