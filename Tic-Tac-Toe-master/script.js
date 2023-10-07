const selectPartyContainer = document.querySelector(".select-party-container");
const gameContainer = document.querySelector(".game-on-container");
// const resultContainer = document.querySelector('.winner-container');

const gameGrid = document.querySelector('.game-grid')

const switchBtn = document.querySelector('.switch-btn');
const startBtn = document.querySelector(".start-btn")

const quitBtn = document.querySelector(".quit-btn")
const restartBtn = document.querySelector('.restart-btn')

const chance1 = document.querySelector('#player1')
const chance2 = document.querySelector('#player2')

const tds = Array.from(document.querySelectorAll('td'))

const player1State = {
    pName: "Player1",
    pSym: 'X'
}
const player2State = {
    pName: "Player2",
    pSym: 'O'
}

function setGameState(state) {   // states : init, ongame, result
    switch (state) {
        case "init": {
            // hiding and unhiding containers
            selectPartyContainer.classList.remove("hide");
            gameContainer.classList.add('hide');
            // resultContainer.classList.add('hide');
            break
        }
        case 'ongame': {
            // hiding and unhiding containers
            selectPartyContainer.classList.add("hide");
            gameContainer.classList.remove('hide');
            // resultContainer.classList.add('hide');
            break
        }
        case 'result': {
            // hiding and unhiding containers
            selectPartyContainer.classList.add("hide");
            quitBtn.classList.add('hide')
            restartBtn.classList.remove('hide')
            break
        }
    }
}

startBtn.addEventListener('click', () => {
    setGameState('ongame')
})

switchBtn.addEventListener('click', () => {
    let temp = player1State.pSym
    player1State.pSym = player2State.pSym
    player2State.pSym = temp

    updateDisplay(player1State, player2State)
})

function updateDisplay(p1, p2) {
    document.querySelector('.player-1-symbol').innerText = p1.pSym
    document.querySelector('.player-2-symbol').innerText = p2.pSym

    document.querySelector('.chance-1').innerText = player1State.pSym
    document.querySelector('.chance-2').innerText = player2State.pSym
}

// *******************************************
// DEFAULT MODE
function initiateGame() {
    setGameState("init");
    // setCurrentTurn(player1State)
}
initiateGame();

// *************** ONGAME ********************
// ***************SETTING STATES*************
const winningCombinations = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
]

function currentPlayerSym() {
    if (playerTurn % 2 == 0) {
        return player1State.pSym
    }
    else {
        return player2State.pSym
    }
}

let playerTurn = 0; // even: player 1; odd: player 2
const p1occupied = []
const p2occupied = []

function setOccupancy(index) {
    if (playerTurn % 2 == 0) {
        p1occupied.push(index);
        p1occupied.sort()
    }
    else {
        p2occupied.push(index);
        p2occupied.sort();
    }
}

// **************CHECKING WINNER******************

function checkWinner() {
    let containsElement;
    if (p1occupied.length >= 3) {
        for (let combination of winningCombinations) {
            containsElement = combination.every(element => {
                return p1occupied.includes(element)
            })
            if (containsElement) { return [player1State, combination] }
        }
    }
    if (p2occupied.length >= 3) {
        for (let combination of winningCombinations) {
            containsElement = combination.every(element => {
                return p2occupied.includes(element);
            })
            if (containsElement) { return [player2State, combination] }
        }
    }
    return undefined
}

gameGrid.addEventListener('click', (e) => {
    let cell = e.target
    if (cell.dataset.vac == "") {
        cell.innerText = currentPlayerSym()
        cell.dataset.vac = cell.innerText
        // console.log(cell.dataset.vac)
        setOccupancy(parseInt(cell.dataset.index))
        playerTurn++;
        turnDisply()
    }
    let winnerNcomb = checkWinner()
    // console.log(winner)
    if (winnerNcomb) { declareWinner(winnerNcomb) }
    function areCellsFull(tds){
        return tds.every(td => td.dataset.vac !== '')
    }
    console.log(areCellsFull(tds))
    if(areCellsFull(tds) && !winnerNcomb){
        declareTie()
    }
})

function turnDisply(){
    if (playerTurn % 2 == 0) {
        chance1.classList.add('turn')
        chance2.classList.remove('turn')
    }
    else {
        chance1.classList.remove('turn')
        chance2.classList.add('turn')
    }
}

// **********DECLARING TIE***********************
function declareTie(){
    setGameState('result');
    chance1.classList.add('hide');
    chance2.classList.add('hide');
    document.querySelector('.chance-container').innerHTML = `<span class="declaration">It's Tie</span>`;
}
// **********DECLARING WINNER********************

function declareWinner(winnerNcomb) {
    setGameState('result');
    // console.log("winner declared")
    chance1.classList.add('hide');
    chance2.classList.add('hide');

    if(winnerNcomb[1]){
        for(comb of winnerNcomb[1]){
            document.querySelector(`.position-${comb}`).style.color = '#384e45'
            document.querySelector(`.position-${comb}`).style.backgroundColor = '#6b9080'
        }
    }

    document.querySelector('.chance-container').innerHTML = `<span class="declaration">Winner-${winnerNcomb[0].pSym}</span>`;
}

// ******************* WANNA QUIT ************************

quitBtn.addEventListener('click', ()=>{
    let ifSureQuit = confirm("Sure wan'na Quit? You'll lose");
    if(!ifSureQuit)return;

    setGameState('result')
    if (playerTurn % 2 == 0) {
        declareWinner([player2State, undefined])
    }
    else {
        declareWinner([player1State, undefined])
    }
})

// ******************** RESTART GAME *********************

restartBtn.addEventListener('click', ()=>{
    location.reload()
})
