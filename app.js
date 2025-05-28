// ABOUTME: This file handles UI rendering and user interaction management
// ABOUTME: Controls DOM manipulation, event handling, and visual presentation

/**
 * DOM Element References
 * Get and store references to all required DOM elements
 */
let scoreDisplayEl, questionAreaEl, optionsAreaEl, feedbackAreaEl, hintButtonEl, newGameButtonEl, feedbackTextEl;

/**
 * Get access to global game state variables
 * Ensures cross-platform compatibility
 */
function getGameState() {
    if (typeof window !== 'undefined') {
        return {
            get currentScore() { return window.currentScore; },
            set currentScore(value) { window.currentScore = value; },
            get currentQuestion() { return window.currentQuestion; },
            set currentQuestion(value) { window.currentQuestion = value; },
            get hintUsed() { return window.hintUsed; },
            set hintUsed(value) { window.hintUsed = value; },
            get guessesMade() { return window.guessesMade; },
            set guessesMade(value) { window.guessesMade = value; }
        };
    } else {
        return {
            get currentScore() { return global.currentScore; },
            set currentScore(value) { global.currentScore = value; },
            get currentQuestion() { return global.currentQuestion; },
            set currentQuestion(value) { global.currentQuestion = value; },
            get hintUsed() { return global.hintUsed; },
            set hintUsed(value) { global.hintUsed = value; },
            get guessesMade() { return global.guessesMade; },
            set guessesMade(value) { global.guessesMade = value; }
        };
    }
}

// Get game state accessor
const gameState = getGameState();

// Additional game state for question handling
let questionOver = false;

/**
 * Initialize DOM element references
 * Called when the page loads to set up element references
 */
function initializeDOMElements() {
    scoreDisplayEl = document.getElementById('score-display');
    questionAreaEl = document.getElementById('question-area');
    optionsAreaEl = document.getElementById('options-area');
    feedbackAreaEl = document.getElementById('feedback-area');
    hintButtonEl = document.getElementById('hint-button');
    newGameButtonEl = document.getElementById('new-game-button');
    
    // Create feedback-text div if it doesn't exist
    if (!document.getElementById('feedback-text')) {
        feedbackTextEl = document.createElement('div');
        feedbackTextEl.id = 'feedback-text';
        feedbackAreaEl.insertBefore(feedbackTextEl, feedbackAreaEl.firstChild);
    } else {
        feedbackTextEl = document.getElementById('feedback-text');
    }
    
    // Validate that all required elements exist
    if (!scoreDisplayEl || !questionAreaEl || !optionsAreaEl || !feedbackAreaEl || !hintButtonEl || !newGameButtonEl) {
        throw new Error('Required DOM elements not found. Please check that index.html has all required elements.');
    }
    
    // Add event listener to new game button
    newGameButtonEl.addEventListener('click', () => {
        console.log('New game button clicked');
        startNewQuestion();
    });
}

/**
 * Updates the score display with the current score
 * Takes no arguments, uses global currentScore variable
 */
function displayScore() {
    if (!scoreDisplayEl) {
        throw new Error('Score display element not initialized');
    }
    
    scoreDisplayEl.textContent = `YOUR SCORE: ${gameState.currentScore}`;
}

/**
 * Renders a question object to the DOM
 * @param {object} questionObj - Question object from generateQuestion()
 */
function renderQuestion(questionObj) {
    // Input validation
    if (!questionObj) {
        throw new Error('Question object is required');
    }
    
    if (!questionObj.type || !questionObj.questionDisplayValue || !questionObj.options || !questionObj.correctAnswerHex) {
        throw new Error('Question object is missing required properties');
    }
    
    if (!['identify_color', 'identify_swatch'].includes(questionObj.type)) {
        throw new Error('Invalid question type');
    }
    
    if (!Array.isArray(questionObj.options) || questionObj.options.length !== 4) {
        throw new Error('Question must have exactly 4 options');
    }
    
    // Clear previous content
    questionAreaEl.innerHTML = '';
    optionsAreaEl.innerHTML = '';
    
    // Render Question based on type
    if (questionObj.type === 'identify_color') {
        // Create color swatch
        const swatchDiv = document.createElement('div');
        swatchDiv.style.backgroundColor = questionObj.questionDisplayValue;
        swatchDiv.style.width = '200px';
        swatchDiv.style.height = '200px';
        swatchDiv.style.borderRadius = '50%';
        swatchDiv.style.border = '2px solid black';
        swatchDiv.style.margin = '20px auto';
        swatchDiv.style.display = 'block';
        
        questionAreaEl.appendChild(swatchDiv);
    } else if (questionObj.type === 'identify_swatch') {
        // Create hex code text
        const hexDiv = document.createElement('div');
        hexDiv.textContent = questionObj.questionDisplayValue.toUpperCase();
        hexDiv.style.fontSize = '3em';
        hexDiv.style.fontFamily = 'monospace';
        hexDiv.style.fontWeight = 'bold';
        hexDiv.style.textAlign = 'center';
        hexDiv.style.margin = '20px';
        hexDiv.style.textTransform = 'uppercase';
        hexDiv.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
        hexDiv.style.color = '#333';
        
        questionAreaEl.appendChild(hexDiv);
    }
    
    // Render Options based on question type
    questionObj.options.forEach((option) => {
        if (questionObj.type === 'identify_color') {
            // Create hex code option buttons
            const optionButton = document.createElement('button');
            optionButton.textContent = option.value.toUpperCase();
            optionButton.style.padding = '10px 15px';
            optionButton.style.margin = '5px';
            optionButton.style.fontFamily = 'monospace';
            optionButton.style.textTransform = 'uppercase';
            optionButton.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
            optionButton.style.color = '#333';
            optionButton.style.cursor = 'pointer';
            optionButton.style.border = '2px solid #333';
            optionButton.style.backgroundColor = '#fff';
            
            // Store data attributes
            optionButton.dataset.isCorrect = option.isCorrect.toString();
            optionButton.dataset.value = option.value;
            
            // Add click event listener
            optionButton.addEventListener('click', (event) => handleGuess(event, option));
            
            optionsAreaEl.appendChild(optionButton);
        } else if (questionObj.type === 'identify_swatch') {
            // Create color swatch options
            const optionSwatch = document.createElement('div');
            optionSwatch.style.backgroundColor = option.value;
            optionSwatch.style.width = '100px';
            optionSwatch.style.height = '100px';
            optionSwatch.style.borderRadius = '50%';
            optionSwatch.style.border = '2px solid black';
            optionSwatch.style.margin = '10px';
            optionSwatch.style.display = 'inline-block';
            optionSwatch.style.cursor = 'pointer';
            
            // Store data attributes
            optionSwatch.dataset.isCorrect = option.isCorrect.toString();
            optionSwatch.dataset.value = option.value;
            
            // Add click event listener
            optionSwatch.addEventListener('click', (event) => handleGuess(event, option));
            
            optionsAreaEl.appendChild(optionSwatch);
        }
    });
    
    // Ensure options area is centered
    optionsAreaEl.style.textAlign = 'center';
}

/**
 * Handles user guess when an option is clicked
 * @param {Event} event - The click event
 * @param {object} chosenOptionData - The option data {value, isCorrect, id}
 */
function handleGuess(event, chosenOptionData) {
    // Return early if question is already over
    if (questionOver) {
        return;
    }
    
    // Increment guess count
    gameState.guessesMade++;
    
    // Get the clicked element
    const clickedElement = event.currentTarget;
    
    // Handle correct guess
    if (chosenOptionData.isCorrect) {
        // Calculate points awarded for this question
        const pointsAwarded = calculateScore(gameState.guessesMade, gameState.hintUsed);
        
        // Update the total score
        gameState.currentScore += pointsAwarded;
        
        // Update the score display
        displayScore();
        
        // Show feedback with points earned
        feedbackTextEl.textContent = `CORRECT! +${pointsAwarded}`;
        
        // Remove all other incorrect options to show final state
        const allOptions = Array.from(optionsAreaEl.children);
        allOptions.forEach(option => {
            if (option !== clickedElement && option.dataset.isCorrect === 'false') {
                option.remove();
            }
        });
        
        // Show new game button
        newGameButtonEl.style.display = 'inline-block';
        
        // Disable hint button
        hintButtonEl.disabled = true;
        
        // Mark question as over
        questionOver = true;
        
        console.log(`Correct answer chosen! Points awarded: ${pointsAwarded}, Total score: ${gameState.currentScore}`);
    } else {
        // Handle incorrect guess
        if (gameState.guessesMade === 3) {
            // This was the 3rd incorrect guess - question over
            feedbackTextEl.textContent = `INCORRECT. The correct answer was ${gameState.currentQuestion.correctAnswerHex}. +0`;
            
            // Update score (with +0) and display
            displayScore();
            
            // Show new game button
            newGameButtonEl.style.display = 'inline-block';
            
            // Mark question as over
            questionOver = true;
            
            console.log('All guesses exhausted! No points awarded.');
        } else {
            // 1st or 2nd incorrect guess - show try again message
            feedbackTextEl.textContent = `TRY AGAIN. You picked ${chosenOptionData.value}.`;
            
            // Remove the clicked element
            clickedElement.remove();
            
            console.log(`Incorrect guess: ${chosenOptionData.value}. Guesses made: ${gameState.guessesMade}`);
        }
    }
}

/**
 * Starts a new question and sets up the game state
 * This function will set up and display a new question
 */
function startNewQuestion() {
    // Generate and set new question
    gameState.currentQuestion = generateQuestion();
    
    // Reset question state
    gameState.hintUsed = false;
    gameState.guessesMade = 0;
    questionOver = false;
    
    // Render the question to the DOM
    renderQuestion(gameState.currentQuestion);
    
    // Update feedback text with instructional text based on question type
    if (gameState.currentQuestion.type === 'identify_color') {
        feedbackTextEl.textContent = "GUESS THE COLOR";
    } else if (gameState.currentQuestion.type === 'identify_swatch') {
        feedbackTextEl.textContent = "CHOOSE THE HEX CODE";
    }
    
    // Ensure hint button is visible, active, and has correct text
    hintButtonEl.style.display = 'inline-block';
    hintButtonEl.disabled = false;
    hintButtonEl.textContent = "Show Hint";
    
    // Ensure new game button is hidden
    newGameButtonEl.style.display = 'none';
    
    console.log("New question:", gameState.currentQuestion);
}

/**
 * Initialize the game
 * Sets up the initial game state and displays the first question
 */
function initGame() {
    // Display the initial score of 0
    displayScore();
    
    // Load and display the first question
    startNewQuestion();
}

/**
 * Initialize the application
 * Called when the page loads
 */
function initApp() {
    try {
        initializeDOMElements();
        initGame();
        console.log('HexVex initialized');
    } catch (error) {
        console.error('Failed to initialize HexVex:', error.message);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}