let riddles = [];
let currentIndex = 0;
let isFlipped = false;
let correctCount = 0;
let attemptedCount = 0;
let riddlesViewed = 0;
let riddlesRevealed = 0;
let sessionStartTime = Date.now();

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

// Analytics helper function
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventParams);
  }
}

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

    // Track session started
    trackEvent('session_started', {
      total_riddles: riddles.length,
      timestamp: new Date().toISOString()
    });

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

  // Blur the answer text to prevent spoilers
  answerText.classList.add('blurred');

  // Track riddle viewed
  riddlesViewed++;
  trackEvent('riddle_viewed', {
    riddle_number: currentIndex + 1,
    riddle_question: currentRiddle.question.substring(0, 100),
    total_viewed: riddlesViewed
  });

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

  // Track when answer is revealed and remove blur
  if (isFlipped) {
    answerText.classList.remove('blurred');
    riddlesRevealed++;
    const currentRiddle = riddles[currentIndex];
    trackEvent('riddle_revealed', {
      riddle_number: currentIndex + 1,
      riddle_question: currentRiddle.question.substring(0, 100),
      riddle_answer: currentRiddle.answer.substring(0, 100),
      total_revealed: riddlesRevealed
    });
  }
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
  const currentRiddle = riddles[currentIndex];
  correctCount++;
  attemptedCount++;

  // Track correct answer
  trackEvent('riddle_answered_correct', {
    riddle_number: currentIndex + 1,
    riddle_question: currentRiddle.question.substring(0, 100),
    riddle_answer: currentRiddle.answer.substring(0, 100),
    correct_count: correctCount,
    attempted_count: attemptedCount,
    accuracy: Math.round((correctCount / attemptedCount) * 100)
  });

  updateScore();
  nextRiddle();
}

function handleWrong() {
  const currentRiddle = riddles[currentIndex];
  attemptedCount++;

  // Track wrong answer
  trackEvent('riddle_answered_wrong', {
    riddle_number: currentIndex + 1,
    riddle_question: currentRiddle.question.substring(0, 100),
    riddle_answer: currentRiddle.answer.substring(0, 100),
    correct_count: correctCount,
    attempted_count: attemptedCount,
    accuracy: Math.round((correctCount / attemptedCount) * 100)
  });

  updateScore();
  nextRiddle();
}

flipCard.addEventListener('click', toggleFlip);
revealBtn.addEventListener('click', handleReveal);
correctBtn.addEventListener('click', handleCorrect);
wrongBtn.addEventListener('click', handleWrong);

// Track session end
window.addEventListener('beforeunload', () => {
  const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
  trackEvent('session_ended', {
    duration_seconds: sessionDuration,
    riddles_viewed: riddlesViewed,
    riddles_revealed: riddlesRevealed,
    riddles_attempted: attemptedCount,
    riddles_correct: correctCount,
    riddles_wrong: attemptedCount - correctCount,
    accuracy: attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0,
    completion_rate: riddles.length > 0 ? Math.round((riddlesViewed / riddles.length) * 100) : 0
  });
});

loadRiddles();
