let riddles = [];
let allRiddles = [];
let currentIndex = 0;
let isFlipped = false;
let correctCount = 0;
let attemptedCount = 0;
let riddlesViewed = 0;
let riddlesRevealed = 0;
let sessionStartTime = Date.now();
let timerInterval = null;
let timeRemaining = 30;
let viewedRiddleIds = new Set(); // Track which riddles have been shown
let sessionId = null;
let totalGamesPlayed = 0;
let lifetimeCorrect = 0;
let lifetimeAttempted = 0;
let totalPlayTime = 0;

// Game settings
let gameSettings = {
  language: 'en',
  difficulty: 'all',
  riddleCount: 'all',
  timerEnabled: false,
  timerDuration: 30
};

// Translations
const translations = {
  en: {
    // Header
    title: 'Riddlz',
    settings: '⚙️ Settings',

    // Stats
    score: 'Score:',

    // Buttons
    revealAnswer: 'Reveal Answer',
    back: '← Back',
    gotItRight: 'Got it Right!',
    gotItWrong: 'Got it Wrong',

    // Settings Modal
    gameSettings: 'Game Settings',
    language: 'Language:',
    difficulty: 'Difficulty:',
    numberOfRiddles: 'Number of Riddles:',
    autoRevealTimer: 'Auto-reveal Timer:',
    timerDuration: 'Timer Duration (seconds):',
    applySettings: 'Apply & Start New Game',

    // Options
    allLevels: 'All Levels',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    allRiddles: 'All Riddles',
    riddles: 'Riddles',
    seconds: 'seconds',
    on: 'On',
    off: 'Off',

    // Timer
    timerSeconds: 's',

    // Loading
    loading: 'Loading riddles...',
    error: 'Failed to load riddles. Please refresh the page.'
  },
  es: {
    // Header
    title: 'Riddlz',
    settings: '⚙️ Ajustes',

    // Stats
    score: 'Puntuación:',

    // Buttons
    revealAnswer: 'Revelar Respuesta',
    back: '← Atrás',
    gotItRight: '¡Lo Acerté!',
    gotItWrong: 'Me Equivoqué',

    // Settings Modal
    gameSettings: 'Ajustes del Juego',
    language: 'Idioma:',
    difficulty: 'Dificultad:',
    numberOfRiddles: 'Número de Acertijos:',
    autoRevealTimer: 'Temporizador Auto-revelar:',
    timerDuration: 'Duración del Temporizador (segundos):',
    applySettings: 'Aplicar e Iniciar Nuevo Juego',

    // Options
    allLevels: 'Todos los Niveles',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    allRiddles: 'Todos los Acertijos',
    riddles: 'Acertijos',
    seconds: 'segundos',
    on: 'Activado',
    off: 'Desactivado',

    // Timer
    timerSeconds: 's',

    // Loading
    loading: 'Cargando acertijos...',
    error: 'Error al cargar acertijos. Por favor, recarga la página.'
  }
};

function t(key) {
  return translations[gameSettings.language][key] || translations.en[key] || key;
}

function updateUILanguage() {
  // Update header
  menuBtn.textContent = t('settings');

  // Update buttons
  revealBtn.textContent = t('revealAnswer');
  backBtn.textContent = t('back');
  correctBtn.textContent = t('gotItRight');
  wrongBtn.textContent = t('gotItWrong');

  // Update settings modal
  document.querySelector('.modal-header h2').textContent = t('gameSettings');
  document.querySelector('label[for="language-select"]').textContent = t('language');
  document.querySelector('label[for="difficulty-select"]').textContent = t('difficulty');
  document.querySelector('label[for="riddle-count"]').textContent = t('numberOfRiddles');
  document.querySelector('label[for="timer-toggle"]').textContent = t('autoRevealTimer');
  document.querySelector('label[for="timer-duration"]').textContent = t('timerDuration');
  applySettingsBtn.textContent = t('applySettings');

  // Update difficulty options
  const difficultyOptions = difficultySelect.querySelectorAll('option');
  difficultyOptions[0].textContent = t('allLevels');
  difficultyOptions[1].textContent = t('easy');
  difficultyOptions[2].textContent = t('medium');
  difficultyOptions[3].textContent = t('hard');

  // Update riddle count options
  const riddleCountOptions = riddleCountSelect.querySelectorAll('option');
  riddleCountOptions[0].textContent = t('allRiddles');
  riddleCountOptions[1].textContent = `3 ${t('riddles')}`;
  riddleCountOptions[2].textContent = `5 ${t('riddles')}`;
  riddleCountOptions[3].textContent = `10 ${t('riddles')}`;
  riddleCountOptions[4].textContent = `15 ${t('riddles')}`;
  riddleCountOptions[5].textContent = `20 ${t('riddles')}`;
  riddleCountOptions[6].textContent = `30 ${t('riddles')}`;
  riddleCountOptions[7].textContent = `50 ${t('riddles')}`;
  riddleCountOptions[8].textContent = `100 ${t('riddles')}`;

  // Update timer duration options
  const timerOptions = timerDurationSelect.querySelectorAll('option');
  timerOptions[0].textContent = `10 ${t('seconds')}`;
  timerOptions[1].textContent = `20 ${t('seconds')}`;
  timerOptions[2].textContent = `30 ${t('seconds')}`;
  timerOptions[3].textContent = `45 ${t('seconds')}`;
  timerOptions[4].textContent = `60 ${t('seconds')}`;

  // Update timer status
  const timerStatus = document.getElementById('timer-status');
  if (timerStatus) {
    timerStatus.textContent = timerToggle.checked ? t('on') : t('off');
  }

  // Update score label
  const scoreLabel = document.getElementById('score-label');
  if (scoreLabel) {
    scoreLabel.textContent = t('score');
  }
}

// DOM elements
const flipCard = document.getElementById('flip-card');
const revealBtn = document.getElementById('reveal-btn');
const backBtn = document.getElementById('back-btn');
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

// Menu/Settings elements
const menuBtn = document.getElementById('menu-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal');
const applySettingsBtn = document.getElementById('apply-settings');
const languageSelect = document.getElementById('language-select');
const difficultySelect = document.getElementById('difficulty-select');
const riddleCountSelect = document.getElementById('riddle-count');
const timerToggle = document.getElementById('timer-toggle');
const timerSettings = document.getElementById('timer-settings');
const timerDurationSelect = document.getElementById('timer-duration');
const timerDisplay = document.getElementById('timer-display');
const timerText = document.getElementById('timer-text');

// Cookie Management Functions
function setCookie(name, value, days = 365) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveGameState() {
  const gameState = {
    settings: gameSettings,
    currentScore: {
      correct: correctCount,
      attempted: attemptedCount
    },
    viewedRiddleIds: Array.from(viewedRiddleIds),
    sessionId: sessionId,
    totalGamesPlayed: totalGamesPlayed,
    lifetimeCorrect: lifetimeCorrect,
    lifetimeAttempted: lifetimeAttempted,
    totalPlayTime: totalPlayTime + Math.round((Date.now() - sessionStartTime) / 1000),
    lastPlayed: Date.now()
  };
  setCookie('riddlzGameState', gameState);
}

function loadGameState() {
  const savedState = getCookie('riddlzGameState');
  if (savedState) {
    // Restore settings
    if (savedState.settings) {
      gameSettings = savedState.settings;
    }

    // Restore session stats
    if (savedState.sessionId) {
      sessionId = savedState.sessionId;
    }

    // Restore viewed riddles
    if (savedState.viewedRiddleIds) {
      viewedRiddleIds = new Set(savedState.viewedRiddleIds);
    }

    // Restore lifetime stats
    totalGamesPlayed = savedState.totalGamesPlayed || 0;
    lifetimeCorrect = savedState.lifetimeCorrect || 0;
    lifetimeAttempted = savedState.lifetimeAttempted || 0;
    totalPlayTime = savedState.totalPlayTime || 0;

    // Check if this is a new session (more than 1 hour since last play)
    const hoursSinceLastPlay = savedState.lastPlayed ?
      (Date.now() - savedState.lastPlayed) / (1000 * 60 * 60) : 999;

    if (hoursSinceLastPlay > 1) {
      // New session - clear current game score but keep viewed riddles and lifetime stats
      correctCount = 0;
      attemptedCount = 0;
    } else {
      // Same session - restore current game score
      correctCount = savedState.currentScore?.correct || 0;
      attemptedCount = savedState.currentScore?.attempted || 0;
    }

    return true;
  }
  return false;
}

function isFirstTimeUser() {
  return getCookie('riddlzGameState') === null;
}

// Analytics helper function
function trackEvent(eventName, eventParams = {}) {
  if (typeof gtag !== 'undefined') {
    // Add session and lifetime stats to all events
    const enrichedParams = {
      ...eventParams,
      session_id: sessionId,
      total_games_played: totalGamesPlayed,
      lifetime_correct: lifetimeCorrect,
      lifetime_attempted: lifetimeAttempted,
      lifetime_accuracy: lifetimeAttempted > 0 ? Math.round((lifetimeCorrect / lifetimeAttempted) * 100) : 0,
      total_play_time_seconds: totalPlayTime + Math.round((Date.now() - sessionStartTime) / 1000),
      unique_riddles_seen: viewedRiddleIds.size
    };
    gtag('event', eventName, enrichedParams);
  }

  // Save state on important events
  if (['riddle_answered_correct', 'riddle_answered_wrong', 'settings_applied', 'session_ended'].includes(eventName)) {
    saveGameState();
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

function createRiddleId(riddle) {
  // Create a unique ID based on question and answer
  return `${riddle.language}_${riddle.question.substring(0, 50)}`;
}

function filterRiddles() {
  let filtered = allRiddles;

  // Filter by language
  filtered = filtered.filter(riddle => riddle.language === gameSettings.language);

  // Filter by difficulty
  if (gameSettings.difficulty !== 'all') {
    filtered = filtered.filter(riddle => riddle.difficulty === gameSettings.difficulty);
  }

  // Add unique IDs to riddles
  filtered = filtered.map(riddle => ({
    ...riddle,
    id: createRiddleId(riddle)
  }));

  // Try to get unviewed riddles first
  let unviewed = filtered.filter(riddle => !viewedRiddleIds.has(riddle.id));

  // If we don't have enough unviewed riddles, include viewed ones
  if (unviewed.length === 0) {
    // All riddles have been viewed - reset the viewed list for this language/difficulty combo
    console.log('All riddles viewed, resetting...');
    const currentViewedIds = Array.from(viewedRiddleIds);
    // Keep viewed IDs from other languages/difficulties
    viewedRiddleIds = new Set(
      currentViewedIds.filter(id => !id.startsWith(gameSettings.language + '_'))
    );
    unviewed = filtered;
  }

  // Shuffle
  let shuffled = shuffleArray(unviewed);

  // Limit count
  if (gameSettings.riddleCount !== 'all') {
    const count = parseInt(gameSettings.riddleCount);
    shuffled = shuffled.slice(0, count);
  }

  return shuffled;
}

async function loadRiddles() {
  try {
    const response = await fetch('/api/riddles');
    const data = await response.json();

    // Filter out riddles that are too long (more than 280 characters)
    allRiddles = data.riddles.filter(riddle => riddle.question.length <= 280);

    // Initialize session ID if not exists
    if (!sessionId) {
      sessionId = generateSessionId();
    }

    // Load saved game state
    const hasExistingState = loadGameState();

    // Check if first time user
    const firstTime = isFirstTimeUser();
    if (firstTime) {
      // Show settings modal for first time users
      openSettings();
      trackEvent('first_time_user', {
        timestamp: new Date().toISOString()
      });
    } else if (hasExistingState) {
      // Restore UI from saved state
      updateScore();
      const savedState = getCookie('riddlzGameState');
      trackEvent('returning_user', {
        days_since_last_play: savedState?.lastPlayed ?
          Math.floor((Date.now() - savedState.lastPlayed) / (1000 * 60 * 60 * 24)) : 0,
        viewed_riddles_count: viewedRiddleIds.size
      });
    }

    // Apply game settings filters
    riddles = filterRiddles();
    totalRiddlesSpan.textContent = riddles.length;

    // Track session started
    trackEvent('session_started', {
      total_riddles: riddles.length,
      available_unviewed_riddles: riddles.filter(r => !viewedRiddleIds.has(r.id)).length,
      language: gameSettings.language,
      difficulty: gameSettings.difficulty,
      timer_enabled: gameSettings.timerEnabled,
      is_first_time: firstTime,
      timestamp: new Date().toISOString()
    });

    // Update UI language
    updateUILanguage();

    if (!firstTime) {
      displayRiddle();
      updateBackButton();
    }
  } catch (error) {
    console.error('Failed to load riddles:', error);
    riddleText.textContent = t('error');
  }
}

function startTimer() {
  if (!gameSettings.timerEnabled || isFlipped) return;

  timeRemaining = gameSettings.timerDuration;
  timerText.textContent = timeRemaining;
  timerDisplay.classList.remove('hidden', 'warning');

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeRemaining--;
    timerText.textContent = timeRemaining;

    if (timeRemaining <= 5) {
      timerDisplay.classList.add('warning');
    }

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      autoReveal();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerDisplay.classList.add('hidden');
  timerDisplay.classList.remove('warning');
}

function autoReveal() {
  if (!isFlipped) {
    toggleFlip();
    trackEvent('riddle_auto_revealed', {
      riddle_number: currentIndex + 1,
      timer_duration: gameSettings.timerDuration
    });
  }
}

function displayRiddle() {
  if (riddles.length === 0) return;

  const currentRiddle = riddles[currentIndex];
  riddleText.textContent = currentRiddle.question;
  answerText.textContent = currentRiddle.answer;
  currentRiddleSpan.textContent = currentIndex + 1;

  // Mark this riddle as viewed
  if (currentRiddle.id) {
    const wasNewRiddle = !viewedRiddleIds.has(currentRiddle.id);
    viewedRiddleIds.add(currentRiddle.id);

    // Save state when viewing a new riddle
    if (wasNewRiddle) {
      saveGameState();
    }
  }

  // Blur the answer text to prevent spoilers
  answerText.classList.add('blurred');

  // Track riddle viewed
  riddlesViewed++;
  const remainingUnviewed = riddles.filter(r => !viewedRiddleIds.has(r.id)).length;
  trackEvent('riddle_viewed', {
    riddle_number: currentIndex + 1,
    riddle_question: currentRiddle.question.substring(0, 100),
    difficulty: currentRiddle.difficulty,
    language: currentRiddle.language,
    total_viewed: riddlesViewed,
    remaining_unviewed_in_set: remainingUnviewed,
    is_repeat: viewedRiddleIds.has(currentRiddle.id)
  });

  if (isFlipped) {
    flipCard.classList.remove('flipped');
    isFlipped = false;
    updateControls();
  }

  updateBackButton();

  // Start timer if enabled
  if (gameSettings.timerEnabled) {
    startTimer();
  }
}

function updateBackButton() {
  if (currentIndex === 0) {
    backBtn.disabled = true;
  } else {
    backBtn.disabled = false;
  }
}

function toggleFlip() {
  flipCard.classList.toggle('flipped');
  isFlipped = !isFlipped;
  updateControls();

  // Track when answer is revealed and remove blur
  if (isFlipped) {
    stopTimer();
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

function previousRiddle() {
  if (currentIndex > 0) {
    stopTimer();
    currentIndex = currentIndex - 1;
    displayRiddle();
  }
}

function handleReveal() {
  toggleFlip();
}

function handleBack() {
  previousRiddle();
}

function handleCorrect() {
  const currentRiddle = riddles[currentIndex];
  correctCount++;
  attemptedCount++;
  lifetimeCorrect++;
  lifetimeAttempted++;

  // Track correct answer
  trackEvent('riddle_answered_correct', {
    riddle_number: currentIndex + 1,
    riddle_question: currentRiddle.question.substring(0, 100),
    riddle_answer: currentRiddle.answer.substring(0, 100),
    difficulty: currentRiddle.difficulty,
    language: currentRiddle.language,
    correct_count: correctCount,
    attempted_count: attemptedCount,
    session_accuracy: Math.round((correctCount / attemptedCount) * 100),
    time_to_answer: gameSettings.timerEnabled ? (gameSettings.timerDuration - timeRemaining) : null
  });

  updateScore();
  nextRiddle();
}

function handleWrong() {
  const currentRiddle = riddles[currentIndex];
  attemptedCount++;
  lifetimeAttempted++;

  // Track wrong answer
  trackEvent('riddle_answered_wrong', {
    riddle_number: currentIndex + 1,
    riddle_question: currentRiddle.question.substring(0, 100),
    riddle_answer: currentRiddle.answer.substring(0, 100),
    difficulty: currentRiddle.difficulty,
    language: currentRiddle.language,
    correct_count: correctCount,
    attempted_count: attemptedCount,
    session_accuracy: attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0
  });

  updateScore();
  nextRiddle();
}

function openSettings() {
  settingsModal.classList.remove('hidden');
  // Populate current settings
  languageSelect.value = gameSettings.language;
  difficultySelect.value = gameSettings.difficulty;
  riddleCountSelect.value = gameSettings.riddleCount;
  timerToggle.checked = gameSettings.timerEnabled;
  timerDurationSelect.value = gameSettings.timerDuration;

  // Store original language for reverting if cancelled
  settingsModal.dataset.originalLanguage = gameSettings.language;

  const timerStatus = document.getElementById('timer-status');
  if (gameSettings.timerEnabled) {
    timerSettings.classList.remove('hidden');
    timerStatus.textContent = t('on');
  } else {
    timerSettings.classList.add('hidden');
    timerStatus.textContent = t('off');
  }
}

function closeSettings() {
  // Revert language if settings were not applied
  const originalLanguage = settingsModal.dataset.originalLanguage;
  if (originalLanguage && gameSettings.language !== originalLanguage) {
    gameSettings.language = originalLanguage;
    updateUILanguage();
  }
  settingsModal.classList.add('hidden');
}

function applySettings() {
  // Check if this is starting a new game (settings changed or first game)
  const isNewGame = currentIndex === 0 && attemptedCount === 0;
  const settingsChanged =
    gameSettings.language !== languageSelect.value ||
    gameSettings.difficulty !== difficultySelect.value ||
    gameSettings.riddleCount !== riddleCountSelect.value;

  // Save settings
  gameSettings.language = languageSelect.value;
  gameSettings.difficulty = difficultySelect.value;
  gameSettings.riddleCount = riddleCountSelect.value;
  gameSettings.timerEnabled = timerToggle.checked;
  gameSettings.timerDuration = parseInt(timerDurationSelect.value);

  // Update UI language if language changed
  updateUILanguage();

  // Reset game state
  currentIndex = 0;
  correctCount = 0;
  attemptedCount = 0;
  riddlesViewed = 0;
  riddlesRevealed = 0;
  sessionStartTime = Date.now();
  stopTimer();

  // Increment games played counter
  if (isNewGame || settingsChanged) {
    totalGamesPlayed++;
  }

  // Reload riddles with new settings
  riddles = filterRiddles();
  totalRiddlesSpan.textContent = riddles.length;
  updateScore();
  displayRiddle();

  closeSettings();

  const unviewedCount = riddles.filter(r => !viewedRiddleIds.has(r.id)).length;
  trackEvent('settings_applied', {
    language: gameSettings.language,
    difficulty: gameSettings.difficulty,
    riddle_count: gameSettings.riddleCount,
    timer_enabled: gameSettings.timerEnabled,
    timer_duration: gameSettings.timerDuration,
    is_new_game: isNewGame || settingsChanged,
    available_riddles: riddles.length,
    unviewed_riddles: unviewedCount,
    repeat_percentage: riddles.length > 0 ? Math.round(((riddles.length - unviewedCount) / riddles.length) * 100) : 0
  });
}

// Event listeners
flipCard.addEventListener('click', toggleFlip);
revealBtn.addEventListener('click', handleReveal);
backBtn.addEventListener('click', handleBack);
correctBtn.addEventListener('click', handleCorrect);
wrongBtn.addEventListener('click', handleWrong);

menuBtn.addEventListener('click', openSettings);
closeModalBtn.addEventListener('click', closeSettings);
applySettingsBtn.addEventListener('click', applySettings);

// Language change preview
languageSelect.addEventListener('change', () => {
  // Temporarily update language for preview
  const previousLanguage = gameSettings.language;
  gameSettings.language = languageSelect.value;
  updateUILanguage();
  // Note: language will be saved when Apply is clicked
});

timerToggle.addEventListener('change', () => {
  const timerStatus = document.getElementById('timer-status');
  if (timerToggle.checked) {
    timerSettings.classList.remove('hidden');
    timerStatus.textContent = t('on');
  } else {
    timerSettings.classList.add('hidden');
    timerStatus.textContent = t('off');
  }
});

// Close modal when clicking outside
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    closeSettings();
  }
});

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
    completion_rate: riddles.length > 0 ? Math.round((riddlesViewed / riddles.length) * 100) : 0,
    language: gameSettings.language,
    difficulty: gameSettings.difficulty,
    timer_enabled: gameSettings.timerEnabled
  });
});

// Initialize UI language from saved settings before loading riddles
const savedState = getCookie('riddlzGameState');
if (savedState?.settings?.language) {
  gameSettings.language = savedState.settings.language;
}
updateUILanguage();

loadRiddles();
