const ICON_MAP = {
    '0': 'fa-diamond',
    '1': 'fa-paper-plane-o',
    '2': 'fa-anchor',
    '3': 'fa-bolt',
    '4': 'fa-cube',
    '5': 'fa-leaf',
    '6': 'fa-bicycle',
    '7': 'fa-bomb'
};

const deck = document.querySelector('.deck');
let cards = [];
let viewCards = [];
let counter = 0;
let time = 0;
let gameStarted = false;


function setupGame() {
    gameStarted = true;
    startTime();
    for (let i = 0; i < 8; i++) {
        cards.push({
            label: ICON_MAP[i]
        });
        cards.push({
            label: ICON_MAP[i]
        });
    }
    cards = shuffle(cards);

    cards.forEach(card => {
        let gameCard = document.createElement('li');
        gameCard.className = 'card';
        let cardIcon = document.createElement('i');
        cardIcon.className = 'fa ' + card.label;
        gameCard.appendChild(cardIcon);
        gameCard.addEventListener('click', (event) => {
            let card = event.target;
            if(card && card.className === 'card') {
                cardClicked(card);
                checkCards(card);
            }
        });
        deck.appendChild(gameCard);
        viewCards.push(gameCard);
    });
}

setupGame();

function cleanUpGame() {
    cards = [];
    viewCards = [];
    counter = 0;
    time = 0;
    updateStars('.stars');
    updateTime('.timer');
    document.querySelector('.moves').textContent = counter;

    while (deck.firstChild) {
        deck.removeChild(deck.firstChild);
    }
}

const restart = document.querySelector('.restart');
restart.addEventListener('click', () => {
    cleanUpGame();
    setupGame();
});

function cardClicked(card) {
    if(card.className === 'card') {
        card.className = 'card open show';
    }
}

let openedCards = [];
function checkCards(card) {
    if (openedCards.length === 0) {
        openedCards.push(card);
    } else if (openedCards.length === 1) {
        openedCards.push(card);
        if (openedCards[0].firstChild.className === openedCards[1].firstChild.className) {
            lockCards(openedCards);
            openedCards = [];
        }
        incrementCounter();
        updateStars('.stars');
        checkGameEnd();
    } else if (openedCards.length === 2) {
        if (openedCards[0].firstChild.className !== openedCards[1].firstChild.className) {
            hideCards(openedCards);
            openedCards = [];
        }
        openedCards.push(card);
    }
}

function lockCards(cardArray) {
    cardArray.forEach (card => {
        card.className = 'card match';
    });
}

function hideCards(cardArray) {
    cardArray.forEach (card => {
        card.className = 'card';
    });
}

function incrementCounter() {
    counter++;
    document.querySelector('.moves').textContent = counter;
}

function updateStars(className) {
    let stars = document.querySelector(className);
    let starArr = Array.from(stars.children);
    starArr.forEach((star, index) => {
        if(counter > 10 && index === 2) {
            star.firstChild.className = 'fa fa-star-o';
        } else if(counter >= 15 && index >= 1){
            star.firstChild.className = 'fa fa-star-o';
        } else {
            star.firstChild.className = 'fa fa-star';
        }
    });
}

function checkGameEnd() {
    let found = viewCards.find(card => {
        return card.className !== 'card match';
    });

    if(!found) {
        gameStarted = false;
        document.querySelector('.game-end').className = 'game-end show';
        let message = document.querySelector('.message');
        message.textContent = `Congratulations! You Won! You've managed to do it in ${counter} moves.`;
        updateStars('.final-stars');
        updateTime('.final-time');
    }
}

document.querySelector('#playAgainBtn').addEventListener('click', playAgain);

function playAgain() {
    document.querySelector('.game-end').className = 'game-end';
    cleanUpGame();
    setupGame();
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function startTime() {
    updateTime('.timer');
    if (gameStarted) {
        setTimeout(startTime, 1000);
    }
}

function updateTime(className) {
    let minutes = Math.floor(time/60);
    let seconds = time%60;
    time++;
    minutes = formatTime(minutes);
    seconds = formatTime(seconds);
    document.querySelector(className).textContent = minutes + ':' + seconds;
}

function formatTime(value) {
    if (value === 0) {
        return '00';
    } else if (value < 9) {
        return '0' + value;
    } else {
        return value;
    }
}
