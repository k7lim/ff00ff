// ABOUTME: This file handles UI rendering and user interaction management
// ABOUTME: Controls DOM manipulation, event handling, and visual presentation

/**
 * DOM Element References
 * Get and store references to all required DOM elements
 */
let scoreDisplayEl, questionAreaEl, optionsAreaEl, feedbackAreaEl, hintButtonEl, newGameButtonEl, feedbackTextEl, fontSelectEl, scoringPreviewEl;

/**
 * Get access to global game state variables
 * Ensures cross-platform compatibility and direct global variable updates
 */
function getGameState() {
    if (typeof window !== 'undefined') {
        return {
            get currentScore() { return currentScore; },
            set currentScore(value) { 
                currentScore = value; 
                window.currentScore = value; 
            },
            get currentQuestion() { return currentQuestion; },
            set currentQuestion(value) { 
                currentQuestion = value; 
                window.currentQuestion = value; 
            },
            get hintUsed() { return hintUsed; },
            set hintUsed(value) { 
                hintUsed = value; 
                window.hintUsed = value; 
            },
            get guessesMade() { return guessesMade; },
            set guessesMade(value) { 
                guessesMade = value; 
                window.guessesMade = value; 
            }
        };
    } else {
        return {
            get currentScore() { return currentScore; },
            set currentScore(value) { 
                currentScore = value; 
                global.currentScore = value; 
            },
            get currentQuestion() { return currentQuestion; },
            set currentQuestion(value) { 
                currentQuestion = value; 
                global.currentQuestion = value; 
            },
            get hintUsed() { return hintUsed; },
            set hintUsed(value) { 
                hintUsed = value; 
                global.hintUsed = value; 
            },
            get guessesMade() { return guessesMade; },
            set guessesMade(value) { 
                guessesMade = value; 
                global.guessesMade = value; 
            }
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
    fontSelectEl = document.getElementById('font-select');
    scoringPreviewEl = document.getElementById('scoring-preview');
    
    // Validate that all required elements exist
    if (!scoreDisplayEl || !questionAreaEl || !optionsAreaEl || !feedbackAreaEl || !hintButtonEl || !newGameButtonEl || !fontSelectEl || !scoringPreviewEl) {
        throw new Error('Required DOM elements not found. Please check that index.html has all required elements.');
    }
    
    // Create feedback-text div if it doesn't exist
    if (!document.getElementById('feedback-text')) {
        feedbackTextEl = document.createElement('div');
        feedbackTextEl.id = 'feedback-text';
        if (feedbackAreaEl && feedbackAreaEl.insertBefore) {
            feedbackAreaEl.insertBefore(feedbackTextEl, feedbackAreaEl.firstChild);
        }
    } else {
        feedbackTextEl = document.getElementById('feedback-text');
    }
    
    // Make DOM elements available globally for testing
    if (typeof window !== 'undefined') {
        window.hintButtonEl = hintButtonEl;
        window.optionsAreaEl = optionsAreaEl;
        window.questionAreaEl = questionAreaEl;
    } else if (typeof global !== 'undefined') {
        global.hintButtonEl = hintButtonEl;
        global.optionsAreaEl = optionsAreaEl;
        global.questionAreaEl = questionAreaEl;
    }
    
    // Add event listener to new game button (only if not already added)
    if (!newGameButtonEl.hasAttribute('data-listener-added')) {
        newGameButtonEl.addEventListener('click', () => {
            console.log('New game button clicked');
            startNewQuestion();
        });
        newGameButtonEl.setAttribute('data-listener-added', 'true');
    }
    
    // Add event listener to hint button (only if not already added)
    if (!hintButtonEl.hasAttribute('data-listener-added')) {
        hintButtonEl.addEventListener('click', () => {
            console.log('Hint button clicked');
            handleHintClick();
        });
        hintButtonEl.setAttribute('data-listener-added', 'true');
    }
    
    // Add event listener to font selector (only if not already added)
    if (!fontSelectEl.hasAttribute('data-listener-added')) {
        fontSelectEl.addEventListener('change', () => {
            console.log('Font changed to:', fontSelectEl.value);
            handleFontChange();
        });
        fontSelectEl.setAttribute('data-listener-added', 'true');
    }
}

/**
 * Updates the score display with the current score
 * Takes no arguments, uses global currentScore variable
 */
function displayScore() {
    if (!scoreDisplayEl) {
        // Try to get the element if not already initialized
        scoreDisplayEl = document.getElementById('score-display');
        if (!scoreDisplayEl) {
            throw new Error('Score display element not initialized');
        }
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
    
    // Ensure DOM elements are available
    if (!questionAreaEl) {
        questionAreaEl = document.getElementById('question-area');
    }
    if (!optionsAreaEl) {
        optionsAreaEl = document.getElementById('options-area');
    }
    
    if (!questionAreaEl || !optionsAreaEl) {
        throw new Error('Required DOM elements not available');
    }
    
    // Clear previous content
    questionAreaEl.innerHTML = '';
    optionsAreaEl.innerHTML = '';
    
    // Render Question based on type
    if (questionObj.type === 'identify_color') {
        // Create color swatch
        const swatchDiv = document.createElement('div');
        swatchDiv.className = 'color-swatch main-swatch';
        swatchDiv.style.backgroundColor = questionObj.questionDisplayValue;
        
        questionAreaEl.appendChild(swatchDiv);
    } else if (questionObj.type === 'identify_swatch') {
        // Create hex code text
        const hexDiv = document.createElement('div');
        hexDiv.className = 'hex-code-text large-hex-display';
        hexDiv.textContent = questionObj.questionDisplayValue.toUpperCase();
        
        questionAreaEl.appendChild(hexDiv);
    }
    
    // Render Options based on question type
    questionObj.options.forEach((option) => {
        if (questionObj.type === 'identify_color') {
            // Create hex code option buttons
            const optionButton = document.createElement('button');
            optionButton.className = 'hex-option-button';
            optionButton.textContent = option.value.toUpperCase();
            
            // Add click event listener (option data passed via closure)
            optionButton.addEventListener('click', (event) => handleGuess(event, option));
            
            optionsAreaEl.appendChild(optionButton);
        } else if (questionObj.type === 'identify_swatch') {
            // Create color swatch options
            const optionSwatch = document.createElement('div');
            optionSwatch.className = 'color-swatch option-swatch';
            optionSwatch.style.backgroundColor = option.value;
            
            // Add click event listener (option data passed via closure)
            optionSwatch.addEventListener('click', (event) => handleGuess(event, option));
            
            optionsAreaEl.appendChild(optionSwatch);
        }
    });
    
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
    
    // Ensure global variables are updated (for tests)
    if (typeof window !== 'undefined') {
        window.guessesMade = gameState.guessesMade;
    } else if (typeof global !== 'undefined') {
        global.guessesMade = gameState.guessesMade;
    }
    
    // Get the clicked element
    const clickedElement = event.currentTarget;
    
    // Determine if guess is correct by comparing with the correct answer
    const isCorrect = chosenOptionData.value.toLowerCase() === gameState.currentQuestion.correctAnswerHex.toLowerCase();
    
    // Handle correct guess
    if (isCorrect) {
        // Calculate points awarded for this question
        const pointsAwarded = calculateScore(gameState.guessesMade, gameState.hintUsed);
        
        // Update the total score
        gameState.currentScore += pointsAwarded;
        
        // Ensure global variables are updated (for tests)
        if (typeof window !== 'undefined') {
            window.currentScore = gameState.currentScore;
        } else if (typeof global !== 'undefined') {
            global.currentScore = gameState.currentScore;
        }
        
        // Update the score display
        displayScore();
        
        // Show feedback with points earned and hex breakdown
        const hexBreakdown = renderHexWithHint(gameState.currentQuestion.correctAnswerHex);
        feedbackTextEl.innerHTML = `CORRECT! +${pointsAwarded}<br><br>HEX BREAKDOWN: ${hexBreakdown}`;
        
        // Remove all other incorrect options to show final state
        const allOptions = Array.from(optionsAreaEl.children);
        allOptions.forEach(option => {
            if (option !== clickedElement) {
                option.remove();
            }
        });
        
        // Hide scoring preview
        scoringPreviewEl.classList.remove('show');
        
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
            let finalFeedback = "";
            
            const hexBreakdown = renderHexWithHint(gameState.currentQuestion.correctAnswerHex);
            
            if (gameState.currentQuestion.type === 'identify_color') {
                // Show correct hex code for identify_color with breakdown
                finalFeedback = `INCORRECT. The correct answer was ${gameState.currentQuestion.correctAnswerHex}. +0<br><br>HEX BREAKDOWN: ${hexBreakdown}`;
            } else if (gameState.currentQuestion.type === 'identify_swatch') {
                // Show correct color swatch for identify_swatch with breakdown
                finalFeedback = `INCORRECT. The correct answer was <span class="inline-swatch" style="background-color: ${gameState.currentQuestion.correctAnswerHex}; width: 20px; height: 20px; display: inline-block; border-radius: 50%; border: 1px solid #000; margin: 0 5px; vertical-align: middle;"></span>. +0<br><br>HEX BREAKDOWN: ${hexBreakdown}`;
            }
            
            feedbackTextEl.innerHTML = finalFeedback;
            
            // Update score (with +0) and display
            displayScore();
            
            // Remove the 3rd incorrect guess (clicked element) and show only correct answer
            clickedElement.remove();
            
            // Remove all remaining incorrect options, leaving only the correct answer
            const allOptions = Array.from(optionsAreaEl.children);
            allOptions.forEach(option => {
                // For identify_swatch, check background color; for identify_color, check text content
                let isCorrectOption = false;
                if (gameState.currentQuestion.type === 'identify_swatch') {
                    // Compare background colors (normalize to lowercase hex)
                    const optionBgColor = option.style.backgroundColor;
                    if (optionBgColor) {
                        // Convert rgb() to hex for comparison
                        const rgbMatch = optionBgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
                        if (rgbMatch) {
                            const hex = '#' + [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
                                .map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
                            isCorrectOption = hex.toLowerCase() === gameState.currentQuestion.correctAnswerHex.toLowerCase();
                        }
                    }
                } else if (gameState.currentQuestion.type === 'identify_color') {
                    // Compare text content
                    isCorrectOption = option.textContent && 
                        option.textContent.toLowerCase() === gameState.currentQuestion.correctAnswerHex.toLowerCase();
                }
                
                if (!isCorrectOption) {
                    option.remove();
                }
            });
            
            // Hide scoring preview
            scoringPreviewEl.classList.remove('show');
            
            // Disable hint button
            hintButtonEl.disabled = true;
            
            // Show new game button
            newGameButtonEl.style.display = 'inline-block';
            
            // Mark question as over
            questionOver = true;
            
            console.log('All guesses exhausted! No points awarded.');
        } else {
            // 1st or 2nd incorrect guess - show try again message with enhanced feedback
            let feedbackMessage = "";
            
            if (gameState.currentQuestion.type === 'identify_color') {
                // For identify_color: show "TRY AGAIN. THAT HEX CODE WAS [colored swatch]"
                const incorrectHex = chosenOptionData.value;
                feedbackMessage = `TRY AGAIN. THAT HEX CODE WAS <span class="inline-swatch" style="background-color: ${incorrectHex}; width: 20px; height: 20px; display: inline-block; border-radius: 50%; border: 1px solid #000; margin: 0 5px; vertical-align: middle;"></span>`;
            } else if (gameState.currentQuestion.type === 'identify_swatch') {
                // For identify_swatch: show "TRY AGAIN. THAT COLOR WAS #[colored hex]"
                const incorrectHex = chosenOptionData.value;
                const coloredHex = renderHexWithHint(incorrectHex);
                feedbackMessage = `TRY AGAIN. THAT COLOR WAS ${coloredHex}`;
            }
            
            feedbackTextEl.innerHTML = feedbackMessage;
            
            // Remove the clicked element
            clickedElement.remove();
            
            // Update scoring preview for next attempt
            updateScoringPreview();
            
            console.log(`Incorrect guess: ${chosenOptionData.value}. Guesses made: ${gameState.guessesMade}`);
        }
    }
}

/**
 * Renders a hex code with colored R, G, B component backgrounds for hint display
 * @param {string} hexString - Hex color string (e.g., "#AABBCC")
 * @returns {string} HTML string with background-colored components
 */
function renderHexWithHint(hexString) {
    // Input validation
    if (!hexString || typeof hexString !== 'string') {
        throw new Error('Invalid hex string provided');
    }
    
    // Remove # if present and ensure uppercase
    let hex = hexString.startsWith('#') ? hexString.slice(1) : hexString;
    hex = hex.toUpperCase();
    
    // Validate hex format
    if (hex.length !== 6 || !/^[0-9A-F]{6}$/.test(hex)) {
        throw new Error('Hex string must be exactly 6 valid hex characters');
    }
    
    // Extract R, G, B components
    const rComponent = hex.slice(0, 2);
    const gComponent = hex.slice(2, 4);
    const bComponent = hex.slice(4, 6);
    
    // Convert hex components to RGB colors for backgrounds
    const redColor = `#${rComponent}0000`;
    const greenColor = `#00${gComponent}00`;
    const blueColor = `#0000${bComponent}`;
    
    // Create HTML with background-colored components
    const html = `<span class="hex-code-text rgb-component" style="background-color: #333; color: white;">#</span><span class="hex-code-text rgb-component red-bg" style="--red-color: ${redColor};">${rComponent}</span><span class="hex-code-text rgb-component green-bg" style="--green-color: ${greenColor};">${gComponent}</span><span class="hex-code-text rgb-component blue-bg" style="--blue-color: ${blueColor};">${bComponent}</span>`;
    
    return html;
}

/**
 * Handles hint button click event
 * Applies visual hints to hex codes and manages button state
 */
function handleHintClick() {
    // Sync gameState with global variables (for tests)
    if (typeof window !== 'undefined' && window.currentQuestion) {
        gameState.currentQuestion = window.currentQuestion;
    }
    
    // Return early if hint already used or question is over
    if (gameState.hintUsed || questionOver) {
        return;
    }
    
    // Ensure DOM elements are available (check for test mocks first)
    if (!hintButtonEl) {
        // Check for test mock first
        if (typeof window !== 'undefined' && window.hintButtonEl) {
            hintButtonEl = window.hintButtonEl;
        } else if (typeof global !== 'undefined' && global.hintButtonEl) {
            hintButtonEl = global.hintButtonEl;
        } else {
            hintButtonEl = document.getElementById('hint-button');
        }
    }
    if (!questionAreaEl) {
        questionAreaEl = document.getElementById('question-area');
    }
    if (!optionsAreaEl) {
        optionsAreaEl = document.getElementById('options-area');
    }
    
    // Set hint as used
    gameState.hintUsed = true;
    
    // Ensure global variables are updated (for tests)
    if (typeof window !== 'undefined') {
        window.hintUsed = gameState.hintUsed;
    } else if (typeof global !== 'undefined') {
        global.hintUsed = gameState.hintUsed;
    }
    
    // Update button text and disable it
    if (hintButtonEl) {
        hintButtonEl.textContent = "Hint Shown";
        hintButtonEl.disabled = true;
    }
    
    // Update scoring preview to reflect hint usage
    updateScoringPreview();
    
    // Apply visual hint based on question type
    if (gameState.currentQuestion.type === 'identify_color') {
        // Update hex code options with colored hints
        const optionElements = Array.from(optionsAreaEl.children);
        optionElements.forEach(element => {
            const hexValue = element.textContent;
            if (hexValue && hexValue.startsWith('#')) {
                try {
                    element.innerHTML = renderHexWithHint(hexValue);
                } catch (error) {
                    console.warn(`Failed to render hint for ${hexValue}:`, error.message);
                }
            }
        });
    } else if (gameState.currentQuestion.type === 'identify_swatch') {
        // Update main question hex code with colored hints
        const questionElements = Array.from(questionAreaEl.children);
        questionElements.forEach(element => {
            const hexValue = gameState.currentQuestion.questionDisplayValue;
            if (hexValue && hexValue.startsWith('#')) {
                try {
                    const hintHtml = renderHexWithHint(hexValue);
                    element.innerHTML = hintHtml;
                    console.log(`Applied hint to identify_swatch: ${hexValue} -> ${hintHtml}`);
                } catch (error) {
                    console.warn(`Failed to render hint for question ${hexValue}:`, error.message);
                }
            }
        });
    }
    
    console.log('Hint applied for question type:', gameState.currentQuestion.type);
}

/**
 * Handles font selection change
 * Applies the selected font to the body element
 */
function handleFontChange() {
    const selectedFont = fontSelectEl.value;
    
    // Remove existing font classes
    document.body.classList.remove('rubik-font', 'caveat-font');
    
    // Apply selected font class
    if (selectedFont === 'rubik') {
        document.body.classList.add('rubik-font');
    } else if (selectedFont === 'caveat') {
        document.body.classList.add('caveat-font');
    }
    
    console.log('Font changed to:', selectedFont);
}

/**
 * Updates the scoring preview to show potential points for a correct answer
 * Takes into account current guess count and hint usage
 */
function updateScoringPreview() {
    if (!scoringPreviewEl || questionOver) {
        return;
    }
    
    // Calculate what the next guess would be (current guesses + 1)
    const nextGuessNumber = gameState.guessesMade + 1;
    const potentialPoints = calculateScore(nextGuessNumber, gameState.hintUsed);
    
    let previewText = "";
    
    if (nextGuessNumber === 1) {
        previewText = `First try: ${potentialPoints} points`;
    } else if (nextGuessNumber === 2) {
        previewText = `Second try: ${potentialPoints} points`;
    } else if (nextGuessNumber === 3) {
        previewText = `Last chance: ${potentialPoints} points`;
    } else {
        previewText = `No points remaining`;
    }
    
    // Add hint information if relevant
    if (!gameState.hintUsed && nextGuessNumber <= 3) {
        const pointsWithoutHint = calculateScore(nextGuessNumber, false);
        const pointsWithHint = calculateScore(nextGuessNumber, true);
        if (pointsWithoutHint !== pointsWithHint) {
            previewText += ` (${pointsWithHint} with hint)`;
        }
    }
    
    scoringPreviewEl.textContent = previewText;
    scoringPreviewEl.classList.add('show');
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
    
    // Ensure DOM elements are available (check for test mocks first)
    if (!feedbackTextEl) {
        feedbackTextEl = document.getElementById('feedback-text');
    }
    if (!hintButtonEl) {
        // Check for test mock first
        if (typeof window !== 'undefined' && window.hintButtonEl) {
            hintButtonEl = window.hintButtonEl;
        } else if (typeof global !== 'undefined' && global.hintButtonEl) {
            hintButtonEl = global.hintButtonEl;
        } else {
            hintButtonEl = document.getElementById('hint-button');
        }
    }
    if (!newGameButtonEl) {
        newGameButtonEl = document.getElementById('new-game-button');
    }
    
    // Render the question to the DOM
    renderQuestion(gameState.currentQuestion);
    
    // Update feedback text with instructional text based on question type
    if (feedbackTextEl) {
        if (gameState.currentQuestion.type === 'identify_color') {
            feedbackTextEl.textContent = "CHOOSE THE HEX CODE";
        } else if (gameState.currentQuestion.type === 'identify_swatch') {
            feedbackTextEl.textContent = "PICK THE COLOR";
        }
    }
    
    // Ensure hint button is visible, active, and has correct text
    if (hintButtonEl) {
        hintButtonEl.style.display = 'inline-block';
        hintButtonEl.disabled = false;
        hintButtonEl.textContent = "Show Hint";
    }
    
    // Ensure new game button is hidden
    if (newGameButtonEl) {
        newGameButtonEl.style.display = 'none';
    }
    
    // Show and update scoring preview
    updateScoringPreview();
    
    console.log("New question:", gameState.currentQuestion);
}

/**
 * Initialize the game
 * Sets up the initial game state and displays the first question
 */
function initGame() {
    // Ensure score is initialized to 0
    gameState.currentScore = 0;
    
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