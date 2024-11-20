const emojis = [
  "😍",
  "😍",
  "😎",
  "😎",
  "🤣",
  "🤣",
  "🤢",
  "🤢",
  "😉",
  "😉",
  "😢",
  "😢",
  "😜",
  "😜",
  "😊",
  "😊",
];
let gameEmojis = emojis.sort(() => Math.random() - 0.5);

// Create a loop to generate the cards dynamically
const cardContainer = document.querySelector(".card-container");
cardContainer.innerHTML = ""; // Clear existing content

for (let i = 0; i < gameEmojis.length; i++) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.textContent = gameEmojis[i];
  cardContainer.appendChild(card);
}

let flippedCards = [];
let canFlip = true;

function flipCard(card) {
  if (
    !canFlip ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  )
    return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    canFlip = false;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.textContent === card2.textContent) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    flippedCards = [];
    canFlip = true;
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      canFlip = true;
    }, 1000);
  }
}

// Add click event listeners to all cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => flipCard(card));
});
// Show all cards for 5 seconds before starting the game
document.querySelectorAll(".card").forEach((card) => {
  card.classList.add("flipped");
});

setTimeout(() => {
  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("flipped");
  });
  // Enable card flipping after the initial reveal
  canFlip = true;
}, 3000); // 5000 milliseconds = 5 seconds

// Disable flipping during the initial reveal
canFlip = false;

function checkForMatch() {
  const [card1, card2] = flippedCards;

  if (card1.textContent === card2.textContent) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    flippedCards = [];
    canFlip = true;
    celebrate(); // Call the celebrate function when a match is found
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
      canFlip = true;
    }, 1000);
  }
}


