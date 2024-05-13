// setter de fleste konstantene:
const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const startButtonContainer = document.getElementById('start-button-container');
const instructions = document.getElementById('instructions');
const heartContainer = document.getElementById('hearts');
const hearts = document.querySelectorAll('.heart');
const gameOverMessage = document.getElementById('game-over-message');
let score = 0;
let redApplesDropped = 0;
let greenAppleInterval;
let gameStarted = false;

startButton.addEventListener('click', startGame);

function startGame() {
    gameStarted = true;
    startButtonContainer.style.display = 'none';
    instructions.style.display = 'none';
    setInterval(() => createApple(), 5000); // sier hvor ofte nye røde epler skal dukke opp

    // grønne epler
    greenAppleInterval = setInterval(() => {
        if (Math.random() < 0.2) { // ca hvert 4-5 eple
            createApple(true);
        }
    }, 6000);
}

function createApple(isGreenApple = false) {
    if (!gameStarted) return; //hvis spillet ikke har startet vil ikke denne funksjonen skje

    const apple = document.createElement('div');
    apple.classList.add(isGreenApple ? 'green-apple' : 'apple'); //legger på css klasser
    apple.style.left = `${Math.random() * (gameContainer.offsetWidth - 50)}px`; //tilfeldig x-verdi som eplene kommer fra
    apple.style.top = '0';
    gameContainer.appendChild(apple);

    const fallInterval = setInterval(() => {
        const appleRect = apple.getBoundingClientRect(); //henter str og pos til eple
        const basketRect = basket.getBoundingClientRect(); //henter str og pos til kurv

        if (appleRect.bottom >= window.innerHeight - 50) { //sjekker om eplet har nådd bakken (50px)
            if (appleRect.left >= basketRect.left && appleRect.right <= basketRect.right) { //sjekker om eple og kurv er på samme sted/eplet er fanget
                if (isGreenApple) {
                    endGame(); //spillet slutter hvis det blir fanget grønt eple
                } else {
                    score++;
                    scoreDisplay.textContent = `Score: ${score}`; //hvis eplet ikke var grønt, score går opp
                }
                clearInterval(fallInterval);
                gameContainer.removeChild(apple); //eplet fjernes fra skjermen
            } else { //hvis eplet når bunnen men ikke blir fanget: 
                clearInterval(fallInterval);
                gameContainer.removeChild(apple);
                if (!isGreenApple) { //hvis det er et rødt eple:
                    redApplesDropped++;
                    if (redApplesDropped <= 3) {
                        hearts[redApplesDropped - 1].classList.add('empty-heart'); //et hjerte blir svart
                    }
                    if (redApplesDropped === 3) { //hvis du mister tre epler er spillet over
                        endGame();
                    }
                }
            }
        } else {
            apple.style.top = `${apple.offsetTop + 5}px`; //farten eplene faller med
        }
    }, 50);
}


function endGame() {
    gameOverMessage.textContent = `Game Over! Scoren din ble ${score}.`;
    const retryButton = document.createElement('button');
    retryButton.textContent = 'Prøv på nytt!'; // setter tekst i både game over beskjeden og inni knappen
    retryButton.id = 'retry-button'; //setter id så den kan redigeres i css
    retryButton.addEventListener('click', () => {
        location.reload(); // siden starter på nytt når man prøver på nytt
    });
    gameOverMessage.appendChild(document.createElement('br')); // mellomrom så knappen går under beskjeden
    gameOverMessage.appendChild(retryButton);
    gameOverMessage.style.display = 'block';
    clearInterval(greenAppleInterval);
}

window.addEventListener('keydown', (event) => {
    if (!gameStarted) return;

    const key = event.key;
    const basketRect = basket.getBoundingClientRect();

    //hva som skjer når du trykker på piltastene:
    if (key === 'ArrowLeft' && basketRect.left > 0) {
        basket.style.left = `${basket.offsetLeft - 10}px`;
    } else if (key === 'ArrowRight' && basketRect.right < gameContainer.offsetWidth) {
        basket.style.left = `${basket.offsetLeft + 10}px`;
    }
});