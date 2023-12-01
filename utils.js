let playerNameInput, playerNameDisplay, dealerCardsDiv, playerCardsDiv, dealerScoreDisplay, playerScoreDisplay, resultDisplay;
let playerName = '';
let playerHand = [];
let dealerHand = [];

document.addEventListener('DOMContentLoaded', function () {
  playerNameInput = document.getElementById('player-name');
  playerNameDisplay = document.getElementById('player-name-display');
  dealerCardsDiv = document.getElementById('dealer-cards');
  playerCardsDiv = document.getElementById('player-cards');
  dealerScoreDisplay = document.getElementById('dealer-score');
  playerScoreDisplay = document.getElementById('player-score');
  resultDisplay = document.getElementById('result');
});

function startGame() {
  playerName = playerNameInput.value;
  playerNameDisplay.innerText = `Jugador: ${playerName}`;
  playerHand = [];
  dealerHand = [];
  resultDisplay.innerText = '';
  clearDisplay();
  playDealerTurn();
  showGameState();
}

function drawCard() {
  // Cartas del mazo: 2C, 3C, ..., KC, 1C, 2D, 3D, ..., KD, 1D, 2T, 3T, ..., KT, 1T, 2P, 3P, ..., KP, 1P
  const deck = [
    '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC', '1C',
    '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD', '1D',
    '2T', '3T', '4T', '5T', '6T', '7T', '8T', '9T', '10T', 'JT', 'QT', 'KT', '1T',
    '2P', '3P', '4P', '5P', '6P', '7P', '8P', '9P', '10P', 'JP', 'QP', 'KP', '1P'
  ];
  const index = Math.floor(Math.random() * deck.length);
  return deck.splice(index, 1)[0];
}

function calculateScore(hand) {
    let score = 0;
    let numAces = 0;
  
    for (const card of hand) {
      if (card.endsWith('1C') || card.endsWith('1D') || card.endsWith('1T') || card.endsWith('1P')) {
        score += 1;
        numAces += 1;
      } else if (['KC', 'QC', 'JC','JD', 'QD', 'KD','JT', 'QT', 'KT','JP', 'QP', 'KP'].includes(card)) {
        score += 11;  
      } else {
        score += parseInt(card);
      }
    }
  
    while (numAces > 0 && score > 21) {
      score -= 10;
      numAces -= 1;
    }
  
    return score;
  }
  

function playDealerTurn() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }
}

function showGameState() {
  clearDisplay();
  displayCards(dealerHand, dealerCardsDiv, dealerScoreDisplay);
  displayCards(playerHand, playerCardsDiv, playerScoreDisplay);

  if (calculateScore(playerHand) > 21) {
    endGame(`¡Te pasaste de 21, ${playerName}! ¡La Banca gana!`);
  }
}

function displayCards(hand, container, scoreDisplay) {
  hand.forEach(card => displayCard(card, container));
  scoreDisplay.innerText = `Puntos: ${calculateScore(hand)}`;
}

function displayCard(card, container) {
  const cardImage = document.createElement('img');
  cardImage.src = `images/${card}.png`; // Asegúrate de tener la carpeta "images" con las imágenes de las cartas
  cardImage.alt = card;
  cardImage.classList.add('card');
  container.appendChild(cardImage);
}

function clearDisplay() {
  dealerCardsDiv.innerHTML = '';
  playerCardsDiv.innerHTML = '';
  dealerScoreDisplay.innerText = '';
  playerScoreDisplay.innerText = '';
}

function endGame(message) {
  resultDisplay.innerText = message;
  resultDisplay.style.color = 'red';
}

function hit() {
  playerHand.push(drawCard());
  showGameState();
}

function stand() {
  playDealerTurn();
  showGameState();

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (playerScore > 21 || dealerScore === 21 || (dealerScore <= 21 && dealerScore >= playerScore)) {
    endGame(`¡La Banca gana!`);
  } else if (playerScore === dealerScore) {
    endGame('¡Empate!');
  } else {
    endGame(`¡Felicidades, ${playerName}! ¡Ganas el juego!`);
  }
}
