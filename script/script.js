// DOM ELEMENTS
const screens = document.querySelectorAll('.screen');
const choose_insect_btns = document.querySelectorAll('.choose-insect-btn');
const start_btn = document.getElementById('start-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const attemptsEl = document.getElementById('attempts');
const gameOverEl = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const attemptIcons = document.querySelectorAll('.attempt-icon');

// GAME STATE VARIABLES
let seconds = 0;             
let score = 0;               
let attempts = 5;            
let gameOver = false;        
let selected_insect = {};    

// START BUTTON - Moves to insect selection screen
start_btn.addEventListener('click', () => {
  screens[0].classList.add('up');
});

// SELECT INSECT - Saves chosen insect, moves to game screen, starts game
choose_insect_btns.forEach(btn => {
  btn.addEventListener('click', () => {
    const img = btn.querySelector('img');
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    selected_insect = { src, alt };
    screens[1].classList.add('up');
    setTimeout(createInsect, 1000);
    startGame();
  });
});

// START GAME - Begins timer and handles misclick logic
function startGame() {
  setInterval(increaseTime, 1000); // Start the timer

  // Listen for clicks inside game container
  game_container.addEventListener('click', e => {
    if (gameOver) return;

    // If clicked target is NOT inside an insect element, count as miss
    const isInsectClick = e.target.closest('.insect');
    if (!isInsectClick) {
      reduceAttempt();
    }
  });
}

// TIMER FUNCTION - Updates every second
function increaseTime() {
  let m = Math.floor(seconds / 60);
  let s = seconds % 60;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  timeEl.innerHTML = `Time: ${m}:${s}`;
  seconds++;
}

// SPAWN A NEW INSECT AT RANDOM POSITION
function createInsect() {
  if (gameOver) return;

  const insect = document.createElement('div');
  insect.classList.add('insect');
  const { x, y } = getRandomLocation();
  insect.style.top = `${y}px`;
  insect.style.left = `${x}px`;

  // Add rotating image inside insect div
  insect.innerHTML = `<img src="${selected_insect.src}" alt="${selected_insect.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;

  // Add catch event
  insect.addEventListener('click', catchInsect);

  game_container.appendChild(insect);
}

// RANDOM LOCATION GENERATOR (avoids edge overlap)
function getRandomLocation() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const x = Math.random() * (width - 200) + 100;
  const y = Math.random() * (height - 200) + 100;
  return { x, y };
}

// HANDLE INSECT CATCH
function catchInsect() {
  increaseScore();
  this.classList.add('caught');         
  setTimeout(() => this.remove(), 2000); 
  addInsects();                          
}

// SPAWN 2 MORE INSECTS AFTER A CATCH
function addInsects() {
  setTimeout(createInsect, 1000);
  setTimeout(createInsect, 1500);
}

// INCREASE SCORE AND SHOW MESSAGE IF > 19
function increaseScore() {
  score++;
  if (score > 19) {
    message.classList.add('visible');
  }
  scoreEl.innerHTML = `Score: ${score}`;
}

// REDUCE ATTEMPTS ON MISCLICK
function reduceAttempt() {
  attempts--;
  attemptsEl.innerHTML = `Attempts Left: ${attempts}`;

  // Update visual icon (gray out lost attempt)
  const lostIndex = 5 - attempts - 1;
  if (lostIndex >= 0 && lostIndex < attemptIcons.length) {
    attemptIcons[lostIndex].classList.remove('active');
  }

  // End game if no attempts left
  if (attempts === 0) {
    endGame();
  }
}

// HANDLE GAME OVER
function endGame() {
  gameOver = true;
  document.querySelectorAll('.insect').forEach(el => el.remove()); // Remove all insects
  gameOverEl.classList.remove('hidden'); // Show game over screen
}

// RESTART GAME - Reset all state, UI, and spawn first insect
restartBtn.addEventListener('click', () => {
  // Reset state variables
  seconds = 0;
  score = 0;
  attempts = 5;
  gameOver = false;

  // Reset UI
  timeEl.innerHTML = 'Time: 00:00';
  scoreEl.innerHTML = 'Score: 0';
  attemptsEl.innerHTML = 'Attempts Left: 5';
  message.classList.remove('visible');
  gameOverEl.classList.add('hidden');

  // Reset icons
  attemptIcons.forEach(icon => icon.classList.add('active'));

  // Remove any leftover insects
  document.querySelectorAll('.insect').forEach(el => el.remove());

  // Spawn first insect again
  setTimeout(createInsect, 1000);
});
