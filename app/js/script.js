function createCell(index) {

    let value = ""

    const getValue = () => value
    const getIndex = () => index

    const changeValue = (givenValue) => {
        value = givenValue
    }

    return {
        changeValue, 
        getValue,
        getIndex,
    }
}

function createPlayer(value) {

    let hasWon = false
    let isTie = false
    
    const getAssignedValue = () => value

    return {
        getAssignedValue,
        hasWon,
        isTie,
    }
}

function gameBoard() {

    const ROW = 3
    const COLUMN = 3
    const board = []

    for(let i = 0; i < ROW*COLUMN; i++) {
        board.push(createCell(i))
    }
    
    const getBoard = () => board

    const setValue = (index, player) => {
        if(board[index].getValue() != "") {
            return false
        }
        board[index].changeValue(player.getAssignedValue())
        return true
    }
    
    return {
        getBoard,
        setValue,
    }
}

function gameController() {
    
    const game = gameBoard()
    const playerArray = []
    const playerX = createPlayer("X")
    const playerO = createPlayer("O")

    playerArray.push(playerX, playerO)

    const board = game.getBoard()
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    
    let activePlayer = playerX

    const getActivePlayer = () => activePlayer

    const switchPlayerTurn = () => {
        activePlayer = playerX === activePlayer ? playerO : playerX
    }

    const checkForWin = () => {

        for(const combo of winningCombos) {
            const checkArray = combo.map((index) => board[index].getValue())
            
            if(checkArray.every(val => val === "X") || checkArray.every(val => val === "O")) {
                activePlayer.hasWon = true
                return true
            }
        }
        return false
    }

    const checkForTie = () => {
        for(let cell of board) {
            if(cell.getValue() === "") return false
        }
        activePlayer.isTie = true
        return true
    }

    const resetBoard = () => {
        board.forEach((cell) => cell.changeValue(""))
        activePlayer.hasWon = false
        activePlayer.isTie = false
        activePlayer = playerX
    }
    const playRound = (index) => {

        if(!game.setValue(index, activePlayer)) return
        if(checkForWin() || checkForTie()) return
        switchPlayerTurn()
    }

    return {
        playRound,
        getActivePlayer,
        getBoard : game.getBoard,
        resetBoard,
    }
}

const screenController = (() =>  {
    const game = gameController()
    const board = game.getBoard()

    const boardDiv = document.querySelector('[data-game-board]')
    const playerTurnDiv = document.querySelector('data-player-turn')

    const createBoard = () => {

        board.forEach((cell) => {
            const box = document.createElement("div")
            const img = document.createElement("img")
            box.classList.add("main-page__game-board__cell")
            box.classList.add("cell")
            box.dataset.cell = cell.getIndex() 
            box.appendChild(img)
            boardDiv.appendChild(box)
        })
    }

    const resetGameBoard = () => {
        boardDiv.forEach((cell) => {
            cell.querySelector('img').remove()
        })
    }


    const updateScreen = () => {


    }


    const clickHandlerForBoard = (e) => {
        const clickedCell = e.target
        const activePlayer = game.getActivePlayer()
        const index = clickedCell.dataset.cell
        const value = activePlayer.getAssignedValue()
        const img = clickedCell.querySelector("img")

        board[index].changeValue(value)

        if(value == "X") {
            img.src = "app/scss/assets/icon-x-dark-cyan.png"
        }

        else {
            img.src = "app/scss/assets/icon-o-yellow.png"
        }
        
    }

    boardDiv.addEventListener("click", clickHandlerForBoard)

    createBoard()
    
    // const boardDiv = document.querySelector(".board")
    // const playerTurnDiv = document.querySelector(".turn")
    // const result = document.querySelector(".result")
    // const playAgainBtn = document.querySelector(".reset")
    
    // const updateScreen = () => {
        
    //     boardDiv.textContent = ""
    //     result.textContent = ""
        
    //     board.forEach((cell) => {
    //         const buttonCell = document.createElement("button")
            
    //         buttonCell.textContent = cell.getValue()
    //         buttonCell.classList.add("cell")
    //         buttonCell.dataset.index = cell.getIndex()
            
    //         boardDiv.appendChild(buttonCell)
    //     })
        
    //     const activePlayer = game.getActivePlayer()
    //     playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`
    //     if(activePlayer.hasWon) {
    //         result.textContent = `${activePlayer.getName()} has won the game`
    //     }

    //     else if(activePlayer.isTie) {
    //         result.textContent = "Oops It's a Tie....."
    //     }
    // }

    // const clickHandlerForBoard = (e) => {

    //     const selectedButton = e.target
    //     const index = parseInt(selectedButton.dataset.index)
    //     selectedButton.textContent = `${board[index].getValue()}`
    //     game.playRound(index)
    //     updateScreen()
    // }

    // boardDiv.addEventListener("click", clickHandlerForBoard)
    // updateScreen()

    // playAgainBtn.addEventListener("click", () => {
    //     game.reset()
    //     updateScreen()
    // })



    // const updateScreen = () => {

        
    // }

    // updateScreen()
})()



// UI  
 

const iconX = document.querySelector('[data-icon="x"]')
const iconO = document.querySelector('[data-icon="o"]')

const imgX = iconX.querySelector("img")
const imgO = iconO.querySelector("img")


function toggleChecked(e) {
    const clickedSign = e.currentTarget

    iconX.classList.remove("checked-icon")
    iconO.classList.remove("checked-icon")

    if(clickedSign.dataset.icon === "x") {
        clickedSign.classList.toggle("checked-icon")
        imgX.src = "app/scss/assets/icon-x-dark.png"
        imgO.src = "app/scss/assets/icon-o-grey.png"
    }

    else {
        clickedSign.classList.toggle("checked-icon") 
        imgX.src = "app/scss/assets/icon-x-grey.png"
        imgO.src = "app/scss/assets/icon-o-dark.png"
    }

    e.stopPropagation()

}

iconX.addEventListener('click', toggleChecked)
iconO.addEventListener('click', toggleChecked)


