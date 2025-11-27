let riddles = [];
let currentIndex = 0;
let isFlipped = false;
let correctCount = 0;
let attemptedCount = 0;

const flipCard = document.getElementById('flip-card');
const revealBtn = document.getElementById('reveal-btn');
const riddleText = document.getElementById('riddle-text');
const answerText = document.getElementById('answer-text');
const currentRiddleSpan = document.getElementById('current-riddle');
const totalRiddlesSpan = document.getElementById('total-riddles');
const correctCountSpan = document.getElementById('correct-count');
const attemptedCountSpan = document.getElementById('attempted-count');
const riddleControls = document.getElementById('riddle-controls');
const answerControls = document.getElementById('answer-controls');
const correctBtn = document.getElementById('correct-btn');
const wrongBtn = document.getElementById('wrong-btn');

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function loadRiddles() {
  try {
    const response = await fetch('/api/riddles');
    const data = await response.json();
    riddles = shuffleArray(data.riddles);
    totalRiddlesSpan.textContent = riddles.length;
    displayRiddle();
  } catch (error) {
    console.error('Failed to load riddles:', error);
    riddleText.textContent = 'Failed to load riddles. Please refresh the page.';
  }
}

function displayRiddle() {
  if (riddles.length === 0) return;

  const currentRiddle = riddles[currentIndex];
  riddleText.textContent = currentRiddle.question;
  answerText.textContent = currentRiddle.answer;
  currentRiddleSpan.textContent = currentIndex + 1;

  if (isFlipped) {
    flipCard.classList.remove('flipped');
    isFlipped = false;
    updateControls();
  }
}

function toggleFlip() {
  flipCard.classList.toggle('flipped');
  isFlipped = !isFlipped;
  updateControls();
}

function updateControls() {
  if (isFlipped) {
    riddleControls.classList.add('hidden');
    answerControls.classList.remove('hidden');
  } else {
    riddleControls.classList.remove('hidden');
    answerControls.classList.add('hidden');
  }
}

function updateScore() {
  correctCountSpan.textContent = correctCount;
  attemptedCountSpan.textContent = attemptedCount;
}

function nextRiddle() {
  currentIndex = (currentIndex + 1) % riddles.length;
  displayRiddle();
}

function handleReveal() {
  toggleFlip();
}

function handleCorrect() {
  correctCount++;
  attemptedCount++;
  updateScore();
  nextRiddle();
}

function handleWrong() {
  attemptedCount++;
  updateScore();
  nextRiddle();
}

flipCard.addEventListener('click', toggleFlip);
revealBtn.addEventListener('click', handleReveal);
correctBtn.addEventListener('click', handleCorrect);
wrongBtn.addEventListener('click', handleWrong);

loadRiddles();
