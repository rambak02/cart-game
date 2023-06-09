import "./styles/style.scss";
import { renderBoard, generateCards } from "./game";
import { startTimer, stopTimer } from "./timer";
import { showGameOverScreen, showGameLoseScreen } from "./showGameScreen";
const rankArray = ["a", "k", "q", "j", "ten", "nine", "eight", "seven", "six"];
const suitArray = ["spades", "hearts", "diamonds", "clubs"];
export let selectedLevel: number = 0;
let cardClasses: string[] = [];
let openedCards: HTMLElement[] = [];
const elapsedTime: number = 0;
const startTime: number = 0;
let closingCards = false;
const cardContainer = document.querySelector<HTMLElement>(".grid");

export function handleLevelSelection() {
  const levelRadio = document.querySelectorAll<HTMLInputElement>(".level");

  for (let i = 0; i < levelRadio.length; i++) {
    if (levelRadio[i].checked) {
      selectedLevel = Number(levelRadio[i].value);

      break;
    }
  }
}
const startButton = document.querySelector(".level__start-form");

startButton?.addEventListener("submit", () => {
  handleLevelSelection();

  if (selectedLevel !== null) {
    localStorage.setItem("selectedLevel", String(selectedLevel));

    window.location.assign("game-board.html");
  }
});
const restartButtonElement = document.querySelector(".restart-btn");
restartButtonElement?.addEventListener("click", () => {
  window.location.assign("index.html");
  selectedLevel = 0;
});
document.addEventListener("DOMContentLoaded", () => {
  selectedLevel = Number(localStorage.getItem("selectedLevel"));
  let numCards = 0;
  if (selectedLevel == 1) {
    numCards = 18;
    cardClasses = generateCards(rankArray, suitArray, numCards);
  }
  if (selectedLevel == 2) {
    numCards = 27;
    cardClasses = generateCards(rankArray, suitArray, numCards);
  }
  if (selectedLevel == 3) {
    numCards = 36;
    cardClasses = generateCards(rankArray, suitArray, numCards);
  }

  renderBoard(cardClasses);
  setTimeout(() => {
    closeCards();
    const timerElement = document.querySelector(".timer") as HTMLElement;
    closingCards = true;
    startTimer(startTime, elapsedTime, timerElement);
  }, 5000);

  cardContainer?.addEventListener("click", (event) => {
    const card = event.target as HTMLElement;
    if (
      card.classList.contains("card") &&
      !card.classList.contains("open") &&
      closingCards === true
    ) {
      openCard(card);
      checkMatch();
    }
  });
});

const closeCards = () => {
  const cardsElement = document.querySelectorAll(".card");
  cardsElement.forEach((card) => {
    card.setAttribute("src", "../../../static/img/cart-back.png");
  });

  openedCards = [];
};

const openCard = (card: HTMLElement) => {
  card.setAttribute("src", `../../../static/img/${card.dataset.value}.png`);
  openedCards.push(card);
};
const checkMatch = () => {
  if (openedCards.length === 2) {
    const [firstCard, secondCard] = openedCards;
    if (firstCard.dataset.suit === secondCard.dataset.suit) {
      setTimeout(() => {
        stopTimer();
      }, 400);
      const winTimerElement = document.getElementById("timer") as HTMLElement;
      const gameOverlayElement = document.querySelector(
        ".game-overlay"
      ) as HTMLElement;
      showGameOverScreen(
        winTimerElement,
        "Вы выиграли!",
        "game-over-screen",
        gameOverlayElement
      );
      const gameRestartButton = document.querySelector(".game-over__btn");
      gameRestartButton?.addEventListener("click", () => {
        window.location.assign("index.html");
        selectedLevel = 0;
      });
    } else {
      setTimeout(() => {
        stopTimer();
      }, 400);
      const loseTimerElement = document.getElementById("timer") as HTMLElement;
      const gameOverlayElement = document.querySelector(
        ".game-overlay"
      ) as HTMLElement;
      showGameLoseScreen(
        loseTimerElement,
        "Вы проиграли!",
        "game-over-screen",
        gameOverlayElement
      );
      const gameRestartButton = document.querySelector(".game-over__btn");
      gameRestartButton?.addEventListener("click", () => {
        window.location.assign("index.html");
        selectedLevel = 0;
      });
    }
  }
};
