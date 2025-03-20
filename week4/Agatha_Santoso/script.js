let counter = 0;
let timer = 10;
let gameStarted = false;
let gameOver = false;
let countdown;
let startTime = 0;

function addOneToCounter() {
  if (!gameOver) {
    counter++;
    document.getElementById("counter").innerText = counter;
  }
}

function startGame() {
  if (!gameStarted) {
    gameStarted = true;
    gameOver = false;
    counter = 0;
    startTime = Date.now();
    document.getElementById("counter").innerText = counter;
    document.getElementById("timer").innerText = `${timer}s`;
    document.getElementById("avg-speed").innerText = "";
    document.getElementById("cross").style.display = "none";
    startTimer();
  }
}

function restartGame() {
  counter = 0;
  timer = 10;
  gameStarted = false;
  gameOver = false;
  clearInterval(countdown);

  document.getElementById("counter").innerText = counter;
  document.getElementById("timer").innerText = "Bite to start";
  document.getElementById("average-speed").innerText = "";
  document.getElementById("cross").style.display = "none";
}

function startTimer() {
  let timerElement = document.getElementById("timer");
  countdown = setInterval(() => {
    if (timer > 0) {
      timer--;
      timerElement.innerText = `${timer}s`;
    } else {
      clearInterval(countdown);
      gameOver = true;
      timerElement.innerText = "Time's up!";

      let totalTime = (Date.now() - startTime) / 1000;
      let avgClicks = (counter / totalTime).toFixed(2);
      document.getElementById(
        "avg-speed"
      ).innerText = `You bite ${avgClicks} cookies/sec`;
      document.getElementById("cross").style.display = "block";
    }
  }, 1000);
}
