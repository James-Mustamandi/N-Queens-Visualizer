var numQueens = Number(localStorage.getItem('n'));
const numPixels = 500 / numQueens; // force a 500 x 500 pixel board for all n

var queenImgs = [];

for(let i = 0; i < numQueens; i++) {
    queenImgs.push(document.createElement("img"));
    queenImgs[i].src = "./images/queen.jpg";
    queenImgs[i].width = numPixels;
}



var stringifyQueens = function(n, queens) {
    let currStr = "";
    let finalBoard = [];
    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            if(queens[i] == j) {
                currStr += 'Q';
            }
            else {
                currStr += '.';
            }
        }
        finalBoard.push(currStr);
        currStr = ""
    }
    return finalBoard;
}


function changeThreats(row, col, n, threats, change) {
    let distance = 0;
    for(let i = row + 1; i < n; i++) {
        distance++;
        threats[i][col] += change;
        if(col + distance < n) {
            threats[i][col + distance] += change;
        }
        if(col - distance >= 0) {
            threats[i][col - distance] += change;
        }
    }

}

function solve(res, queens, threats, row, n, found, boardStates, boardStatesThreats) {
    boardStates.push(stringifyQueens(n, queens));
    // boardStatesThreats.push(JSON.parse(JSON.stringify(threats)));

    if(row == n) {
        res.push(stringifyQueens(n, queens));
        return;
    }
    else {
        for(queens[row] = 0; queens[row] < n; queens[row]++) {
            if(threats[row][queens[row]] == 0) {
                changeThreats(row, queens[row], n, threats, 1);
                solve(res, queens, threats, row + 1, n, found, boardStates, boardStatesThreats);
                changeThreats(row, queens[row], n, threats, -1);
            }
        }

    }

}


var solveNQueens = function(n, boardStates, boardStatesThreats) {
    const queens = new Array(n).fill(-1);
    const threats = Array.from({length: n}, () => new Array(n).fill(0));
    const res = [];
    let found = false;
    solve(res, queens, threats, 0, n, found, boardStates, boardStatesThreats);
    return res;
};

class nQueensSolution {
    // This class will contain an array with all board states for the given n.
    boardStates = [];
    boardSolutions = [];
    boardStatesThreats = [];
    constructor(n) {
        this.n = n;
        this.boardSolutions = solveNQueens(this.n, this.boardStates, this.boardStatesThreats);
    }
}



function drawChessBoard(n) {
    // Create a style element for the board and add the .board class
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .board {
            display: grid;
            grid-template-rows: repeat(${n}, ${numPixels}px); 
            grid-template-columns: repeat(${n}, ${numPixels}px);
            grid-auto-rows: ${numPixels}px;
            width: ${n * numPixels}px; /* Set a fixed width based on n and numPixels */
            height: ${n * numPixels}px; /* Set a fixed height based on n and numPixels */
            position: fixed;
            top:50%;
            left:50%;
            transform: translate(-50%, -50%);
        
        }
    `;

    const oddTile = document.createElement('style');
    oddTile.textContent = `
        .odd-tile {
            height: ${numPixels}px;
            width: ${numPixels}px;
            background: rgb(145,140,125);

        }
    `;
    const evenTile = document.createElement('style');
    evenTile.textContent = `
        .even-tile {
            height: ${numPixels}px;
            width: ${numPixels}px;
            background: rgb(180,175,165);
        }
    `;


    // Append the style element to the head
    document.head.appendChild(styleElement);
    document.head.appendChild(oddTile);
    document.head.appendChild(evenTile);

    // Create the main board container
    const boardContainer = document.createElement('div');

    // Add the .board class to the board container
    boardContainer.classList.add('board');

    for (let i = 0; i < n; i++) {
        let rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        let oddFirst = i % 2 === 0;
        for (let j = 0; j < n; j++) {
            let tileDiv = document.createElement('div');
            if (oddFirst) {
                tileDiv.classList.add(j % 2 === 0 ? 'odd-tile' : 'even-tile');
            } else {
                tileDiv.classList.add(j % 2 !== 0 ? 'odd-tile' : 'even-tile');
            }
            rowDiv.appendChild(tileDiv);
        }

        // Append the row to the board container
        boardContainer.appendChild(rowDiv);
    }
        
    // Append the board container to the body
    document.body.appendChild(boardContainer);
}


const currSoln = new nQueensSolution(numQueens);
var currState = 0;
drawChessBoard(numQueens);
const boardArray = document.getElementsByClassName('row');


function removeExistingQueen(col) {
    for(let row = 0; row < numQueens; row++) {
        if(boardArray[col].querySelectorAll('*')[row].contains(queenImgs[col])) {
            boardArray[col].querySelectorAll('*')[row].removeChild(queenImgs[col]);
        }       
    }

}

function printQueens(currState) { // This function takes in a board state and will the state of the ith board state 
    if(currState < 0 || currState >= currSoln.boardStates.length) {
        return;
    }

    for(let col = 0; col < numQueens; col++) {
        removeExistingQueen(col);
        for(let row = 0; row < numQueens; row++) {
            if(currSoln.boardStates[currState][row][col] == 'Q') {
                boardArray[col].querySelectorAll('*')[row].appendChild(queenImgs[col]);
            }
        }
    }
}





var animateButton = document.getElementById("animate-button");

let animationActive = false;
function toggleAnimation() {
    animationActive = !animationActive;
    animateButton.innerHTML = (animationActive) ? "Press to Stop Animation" : "Press to Start Animation"
    if(animationActive) {

        animationLoop();
    }
    else {
        return;
    }

}

function stopAnimation() {
    animationActive = false;
    animateButton.innerHTML = "Press to Start Animation";

}

function animationLoop() {
    if(animationActive) {
        if(currState != currSoln.boardStates.length - 1) {
             printQueens(++currState);
             setTimeout(animationLoop, 500);
        }
        else {
            stopAnimation();
        }
    }
}


function showNextState() {
    if(currState != currSoln.boardStates.length - 1) {
        printQueens(++currState);
    }
    if(animationActive) {
        stopAnimation();
    }
}

function showPreviousState() {
    if(currState != 0) {
        printQueens(--currState);
    } 
    if(animationActive) {
        stopAnimation();
    }
}



document.addEventListener('keydown', function(event) {
    let key = event.keyCode;
    switch(key) {
        case 39:  // KeyPress Right
            showNextState();
            break;
        case 37:  // KeyPress Left
            showPreviousState();
            break;
        case 84:
            // showThreats(currState);
            break;
        case 13:
            toggleAnimation();
            break;

    }
});






