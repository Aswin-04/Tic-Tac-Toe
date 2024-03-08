function createCell() {

    let value = ""

    const changeValue = (givenValue) => {
        value = givenValue
    }

    const getValue = () => value

    return {
        changeValue, 
        getValue,
    }
}

function createPlayer(value) {

    let name

    if(value === "X") {
        name = prompt("Enter Player1's Name") || "Luffy"
    }

    else {
        name = prompt("Enter Player2's Name") || "Zoro"
    }
    
    const getName = () => name
    const getAssignedValue = () => value

    return {
        getName,
        getAssignedValue,
    }
}

function gameBoard() {

    const ROW = 3
    const COLUMN = 3
    const board = []

    for(let i = 0; i < ROW*COLUMN; i++) {
        board.push(createCell())
    }
    
    const getBoard = () => board

    const printBoard = () => {
        board.forEach((cell) => console.log(cell.getValue()))
    }

    const setValue = (index, player) => {
        if(board[index].getValue() != "") {
            console.log("This place is already taken, please try somewhere else")
            return false
        }
        board[index].changeValue(player.getAssignedValue())
        return true
    }
    
    return {
        getBoard,
        printBoard,
        setValue,
    }
}

const gameController = (() => {
    
    const game = gameBoard()
    const playerArray = []
    const player1 = createPlayer("X")
    const player2 = createPlayer("O")

    playerArray.push(player1, player2)

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
    
    let activePlayer = player1

    const switchPlayerTurn = () => {
        activePlayer = player1 === activePlayer ? player2 : player1
    }

    const checkForWin = () => {

        for(const combo of winningCombos) {
            const checkArray = combo.map((index) => board[index].getValue())
            
            if(checkArray.every(val => val === "X") || checkArray.every(val => val === "O")) {
                console.log(`${activePlayer.getName()} has won the game!!!`)
                return true
            }
        }
        return false
    }

    const checkForTie = () => {
        for(let cell of board) {
            if(cell.getValue() === "") return false
        }
        console.log("Oops....   It's a Tie")
        return true
    }

    const printNewRound = () => {
        console.log(`${activePlayer.getName()}'s turn!`)
    }

    const playRound = (index) => {

        if(!game.setValue(index, activePlayer)) return
        game.printBoard()
        if(checkForWin() || checkForTie()) {
            board.forEach((cell) => cell.changeValue(""))
        }
        switchPlayerTurn()
        printNewRound()
    }

    printNewRound()

    return {
        playRound,
    }
    
})()
