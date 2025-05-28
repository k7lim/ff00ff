// ABOUTME: This file handles UI rendering and user interaction management
// ABOUTME: Controls DOM manipulation, event handling, and visual presentation

/**
 * DOM Element References
 * Get and store references to all required DOM elements
 */
let scoreDisplayEl, questionAreaEl, optionsAreaEl, feedbackAreaEl, hintButtonEl, newGameButtonEl, feedbackTextEl;

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
}

/**
 * Updates the score display with the current score
 * Takes no arguments, uses global currentScore variable
 */
function displayScore() {
    if (!scoreDisplayEl) {
        throw new Error('Score display element not initialized');
    }
    
    scoreDisplayEl.textContent = `YOUR SCORE: ${currentScore}`;
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
            
            optionsAreaEl.appendChild(optionSwatch);
        }
    });
    
    // Ensure options area is centered
    optionsAreaEl.style.textAlign = 'center';
}

/**
 * Initialize the application
 * Called when the page loads
 */
function initApp() {
    try {
        initializeDOMElements();
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