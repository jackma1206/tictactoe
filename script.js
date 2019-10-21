let p1, p2, game;
const readyButton = document.querySelector(".ready");
const onePlayer = document.querySelector(".cpu");
const twoPlayer = document.querySelector(".twoPlayer");
const nameForm = document.querySelector(".nameForm");
const gameType = document.querySelector(".gameType");
const gameWrap = document.querySelector(".gameWrap");
twoPlayer.addEventListener("click", function() {
  gameType.style.opacity = "0";
});
gameType.addEventListener("transitionend", detectEnd, false);

readyButton.addEventListener("click", function() {
  const p1n = document.querySelector(".p1").value;
  const p2n = document.querySelector(".p2").value;

  game = newGame();
  p1 = newPlayer(p1n, game.x);
  p2 = newPlayer(p2n, game.o);
  displayController.renderBoard();
  nameForm.style.opacity = "0";
});

nameForm.addEventListener("transitionend", detectNameFormEnd, false);
const newGame = () => {
  const x = "&#xf00d";
  const o = "&#xf111";
  let counter = 0;
  let gameBoard = [];

  const winnerCheck = (pname, x) => {
    if (
      (gameBoard[0] == x && gameBoard[1] == x && gameBoard[2] == x) ||
      (gameBoard[3] == x && gameBoard[4] == x && gameBoard[5] == x) ||
      (gameBoard[6] == x && gameBoard[7] == x && gameBoard[8] == x) ||
      (gameBoard[0] == x && gameBoard[3] == x && gameBoard[6] == x) ||
      (gameBoard[1] == x && gameBoard[4] == x && gameBoard[7] == x) ||
      (gameBoard[2] == x && gameBoard[5] == x && gameBoard[8] == x) ||
      (gameBoard[0] == x && gameBoard[4] == x && gameBoard[8] == x) ||
      (gameBoard[2] == x && gameBoard[4] == x && gameBoard[6] == x)
    ) {
      displayController.showWinner(pname);
    }
  };

  return { x, o, counter, gameBoard, winnerCheck };
};

const displayController = (() => {
  const gameWrap = document.querySelector(".gameWrap");

  const renderBoard = () => {
    if (gameWrap.hasChildNodes()) {
      while (gameWrap.firstChild) {
        gameWrap.removeChild(gameWrap.firstChild);
      }
    }
    for (let i = 0; i < 9; i++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.addEventListener("click", handleSquareClick);
      square.addEventListener("mouseover", handleSquareHover);
      square.addEventListener("mouseleave", handleSquareLeave);
      square.setAttribute("data-id", i);
      gameWrap.appendChild(square);
    }
  };

  const showWinner = player => {
    const pName = document.querySelector(".player-name");
    const endScreen = document.querySelector(".end-screen");
    pName.innerHTML = `${player} wins!`;
    endScreen.style.display = "flex";
    reset();
  };

  const showTie = () => {
    const endScreen = document.querySelector(".end-screen");
    const pName = document.querySelector(".player-name");
    pName.innerHTML = `Tie Game!`;
    endScreen.style.display = "flex";
    reset();
  };

  const reset = () => {
    const restart = document.querySelector(".restart");
    const newG = document.querySelector(".newGame");
    const endScreen = document.querySelector(".end-screen");
    const gameWrap = document.querySelector(".gameWrap");

    restart.addEventListener("click", function() {
      endScreen.style.display = "none";
      game = newGame();
      renderBoard();
    });
    newG.addEventListener("click", function() {
      endScreen.style.display = "none";
      gameWrap.style.display = "none";
      nameForm.style.display = "none";
      gameType.style.display = "flex";
      gameType.style.opacity = "1";
    });
  };

  return { renderBoard, showWinner, showTie, reset };
})();

const newPlayer = (name, xoro) => {
  return { name, xoro };
};

function handleSquareClick() {
  if (this.classList.contains("marked-square")) {
    return;
  }
  let squareText = document.createElement("h3");
  squareText.classList.add("square-text");
  let removeMe = this.querySelector(".overlay-text");
  this.classList.remove("square-overlay");
  this.removeChild(removeMe);

  if (game.counter % 2 == 0) {
    this.classList.add("marked-square", "x");
    squareText.classList.add("fa");
    squareText.innerHTML = game.x;

    game.gameBoard[this.dataset.id] = game.x;
    game.winnerCheck(p1.name, p1.xoro);
  } else {
    this.classList.add("marked-square", "o");
    squareText.classList.add("far");
    squareText.innerHTML = game.o;
    game.gameBoard[this.dataset.id] = game.o;
    game.winnerCheck(p2.name, p2.xoro);
  }
  this.appendChild(squareText);
  game.counter++;

  if (game.counter == 9) {
    displayController.showTie();
  }
}

function handleSquareHover() {
  if (this.hasChildNodes()) {
    return;
  }

  this.classList.add("square-overlay");
  let overlayText = document.createElement("h3");
  overlayText.classList.add("overlay-text");
  if (game.counter % 2 == 0) {
    overlayText.classList.add("fa");
    overlayText.innerHTML = game.x;
  } else {
    overlayText.classList.add("far");
    overlayText.innerHTML = game.o;
  }
  this.appendChild(overlayText);
}

function handleSquareLeave() {
  if (this.classList.contains("marked-square")) {
    return;
  }
  let overlayText = this.querySelector(".overlay-text");
  this.classList.remove("square-overlay");
  this.removeChild(overlayText);
}
function detectEnd(e) {
  if (e.propertyName !== "opacity") {
    return;
  }

  gameType.style.display = "none";
  nameForm.style.display = "flex";
  nameForm.style.opacity = "1";
}

function detectNameFormEnd(e) {
  if (e.propertyName !== "opacity") {
    return;
  }
  nameForm.style.display = "none";
  gameWrap.style.display = "grid";
  gameWrap.style.opacity = "1";
}