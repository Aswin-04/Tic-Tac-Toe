// function createCell(index) {

//     let value = ""

//     const getValue = () => value
//     const getIndex = () => index

//     const changeValue = (givenValue) => {
//         value = givenValue
//     }

//     return {
//         changeValue, 
//         getValue,
//         getIndex,
//     }
// }

// function createPlayer(value) {

//     let name
//     let hasWon = false
//     let isTie = false
//     const getName = () => name

//     if(value === "X") {
//         name = prompt("Enter Player1's Name") || "Luffy"
//     }

//     else {
//         name = prompt("Enter Player2's Name") || "Zoro"
//     }
    
//     const getAssignedValue = () => value

//     return {
//         getName,
//         getAssignedValue,
//         hasWon,
//         isTie,
//     }
// }

// function gameBoard() {

//     const ROW = 3
//     const COLUMN = 3
//     const board = []

//     for(let i = 0; i < ROW*COLUMN; i++) {
//         board.push(createCell(i))
//     }
    
//     const getBoard = () => board

//     const setValue = (index, player) => {
//         if(board[index].getValue() != "") {
//             return false
//         }
//         board[index].changeValue(player.getAssignedValue())
//         return true
//     }
    
//     return {
//         getBoard,
//         setValue,
//     }
// }

// function gameController() {
    
//     const game = gameBoard()
//     const playerArray = []
//     const player1 = createPlayer("X")
//     const player2 = createPlayer("O")

//     playerArray.push(player1, player2)

//     const board = game.getBoard()
//     const winningCombos = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//         [0, 4, 8],
//         [2, 4, 6],
//     ]
    
//     let activePlayer = player1

//     const getActivePlayer = () => activePlayer

//     const switchPlayerTurn = () => {
//         activePlayer = player1 === activePlayer ? player2 : player1
//     }

//     const checkForWin = () => {

//         for(const combo of winningCombos) {
//             const checkArray = combo.map((index) => board[index].getValue())
            
//             if(checkArray.every(val => val === "X") || checkArray.every(val => val === "O")) {
//                 activePlayer.hasWon = true
//                 return true
//             }
//         }
//         return false
//     }

//     const checkForTie = () => {
//         for(let cell of board) {
//             if(cell.getValue() === "") return false
//         }
//         activePlayer.isTie = true
//         return true
//     }

//     const reset = () => {
//         board.forEach((cell) => cell.changeValue(""))
//         activePlayer.hasWon = false
//         activePlayer.isTie = false
//         activePlayer = player1
//     }
//     const playRound = (index) => {

//         if(!game.setValue(index, activePlayer)) return
//         if(checkForWin() || checkForTie()) return
//         switchPlayerTurn()
//     }

//     return {
//         playRound,
//         getActivePlayer,
//         getBoard : game.getBoard,
//         reset,
//     }
// }

// const screenController = (() =>  {
//     const game = gameController()
//     const board = game.getBoard()
    
//     const boardDiv = document.querySelector(".board")
//     const playerTurnDiv = document.querySelector(".turn")
//     const result = document.querySelector(".result")
//     const playAgainBtn = document.querySelector(".reset")
    
//     const updateScreen = () => {
        
//         boardDiv.textContent = ""
//         result.textContent = ""
        
//         board.forEach((cell) => {
//             const buttonCell = document.createElement("button")
            
//             buttonCell.textContent = cell.getValue()
//             buttonCell.classList.add("cell")
//             buttonCell.dataset.index = cell.getIndex()
            
//             boardDiv.appendChild(buttonCell)
//         })
        
//         const activePlayer = game.getActivePlayer()
//         playerTurnDiv.textContent = `${activePlayer.getName()}'s turn...`
//         if(activePlayer.hasWon) {
//             result.textContent = `${activePlayer.getName()} has won the game`
//         }

//         else if(activePlayer.isTie) {
//             result.textContent = "Oops It's a Tie....."
//         }
//     }

//     const clickHandlerForBoard = (e) => {

//         const selectedButton = e.target
//         const index = parseInt(selectedButton.dataset.index)
//         selectedButton.textContent = `${board[index].getValue()}`
//         game.playRound(index)
//         updateScreen()
//     }

//     boardDiv.addEventListener("click", clickHandlerForBoard)
//     updateScreen()

//     playAgainBtn.addEventListener("click", () => {
//         game.reset()
//         updateScreen()
//     })
// })()



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


