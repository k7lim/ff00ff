// ABOUTME: This file contains core game logic and state management
// ABOUTME: Handles question generation, scoring, and game flow control

/**
 * Minimum distance threshold for color distinctness
 * Two colors are considered "too similar" if their distance is below this value
 */
const MIN_DISTANCE_THRESHOLD = 75;

/**
 * Game State Variables
 * These track the current state of the game session
 */
let currentScore = 0;
let currentQuestion = null; // Will hold the object from generateQuestion()
let hintUsed = false;
let guessesMade = 0; // Number of incorrect guesses for the current question

// Make available globally for browser compatibility
if (typeof window !== 'undefined') {
    window.MIN_DISTANCE_THRESHOLD = MIN_DISTANCE_THRESHOLD;
    window.currentScore = currentScore;
    window.currentQuestion = currentQuestion;
    window.hintUsed = hintUsed;
    window.guessesMade = guessesMade;
} else {
    global.MIN_DISTANCE_THRESHOLD = MIN_DISTANCE_THRESHOLD;
    global.currentScore = currentScore;
    global.currentQuestion = currentQuestion;
    global.hintUsed = hintUsed;
    global.guessesMade = guessesMade;
}

/**
 * Generates a set of one correct color and three distinct distractor colors
 * Implements the regeneration logic specified in the requirements:
 * If any pair is found to be 'too similar,' discard all three current distractors
 * and generate a new set of three distractors.
 * 
 * @returns {object} Object with correctHex and distractors array
 */
function generateQuestionOptions() {
    // Generate the correct answer
    const correctHex = generateRandomHexColor();
    const correctRgb = hexToRgb(correctHex);
    
    let distractors = [];
    let distractorRgbs = [];
    let regenerationAttempts = 0;
    let isDistinctSet = false;
    
    // Continue until we find a valid set of 3 distinct distractors
    do {
        regenerationAttempts++;
        
        // Log warning if regeneration takes too many attempts
        if (regenerationAttempts > 10) {
            console.warn(`Distractor regeneration attempts: ${regenerationAttempts}`);
        }
        
        // Safety check to prevent infinite loops
        if (regenerationAttempts > 1000) {
            console.error('Maximum regeneration attempts reached. Using best available set.');
            break;
        }
        
        // Reset for new attempt
        distractors = [];
        distractorRgbs = [];
        
        // Generate 3 random distractor hex codes and their RGB versions
        for (let i = 0; i < 3; i++) {
            const distractorHex = generateRandomHexColor();
            const distractorRgb = hexToRgb(distractorHex);
            distractors.push(distractorHex);
            distractorRgbs.push(distractorRgb);
        }
        
        // Create arrays of all colors for distinctness checking
        const allColorsHex = [correctHex, ...distractors];
        const allColorsRgb = [correctRgb, ...distractorRgbs];
        
        // Check if this set is distinct
        isDistinctSet = true;
        
        // Iterate through all unique pairs
        for (let i = 0; i < allColorsRgb.length && isDistinctSet; i++) {
            for (let j = i + 1; j < allColorsRgb.length && isDistinctSet; j++) {
                const distance = calculateColorDistance(allColorsRgb[i], allColorsRgb[j]);
                if (distance < MIN_DISTANCE_THRESHOLD) {
                    isDistinctSet = false;
                }
            }
        }
        
    } while (!isDistinctSet);
    
    // Log successful generation info and warn if excessive attempts
    if (regenerationAttempts > 1) {
        console.log(`Generated distinct color set after ${regenerationAttempts} attempts`);
    }
    
    if (regenerationAttempts >= 90) {
        console.warn(`Excessive color generation attempts: ${regenerationAttempts}. Consider adjusting MIN_DISTANCE_THRESHOLD.`);
    }
    
    return {
        correctHex: correctHex,
        distractors: distractors
    };
}

/**
 * Fisher-Yates shuffle algorithm for proper randomization
 * @param {Array} array - Array to shuffle (modifies in place)
 * @returns {Array} The shuffled array
 */
function shuffleArray(array) {
    const shuffled = [...array]; // Create a copy to avoid modifying original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Generates a complete question object with randomized type and shuffled options
 * @returns {object} Complete question object ready for UI rendering
 */
function generateQuestion() {
    // Determine question type randomly (50/50 chance)
    const questionTypes = ['identify_color', 'identify_swatch'];
    const type = questionTypes[Math.floor(Math.random() * 2)];
    
    // Get color options from the distinctness algorithm
    const { correctHex, distractors } = generateQuestionOptions();
    
    // Prepare options array with correct structure
    const allOptions = [];
    
    // Add the correct answer option
    allOptions.push({
        value: correctHex,
        isCorrect: true,
        id: `option_0`
    });
    
    // Add the distractor options
    distractors.forEach((distractorHex, index) => {
        allOptions.push({
            value: distractorHex,
            isCorrect: false,
            id: `option_${index + 1}`
        });
    });
    
    // Randomize option order using Fisher-Yates shuffle
    const shuffledOptions = shuffleArray(allOptions);
    
    // Update IDs to reflect new positions after shuffling
    const finalOptions = shuffledOptions.map((option, index) => ({
        ...option,
        id: `option_${index}`
    }));
    
    // Return the complete question object
    return {
        type: type,
        questionDisplayValue: correctHex,
        options: finalOptions,
        correctAnswerHex: correctHex
    };
}

/**
 * Calculates the score for a correct answer based on number of guesses and hint usage
 * @param {number} guessesMadeCount - The number of guesses it took (1 for 1st try, 2 for 2nd try, etc.)
 * @param {boolean} hintWasUsed - Whether the hint was used for this question
 * @returns {number} The points awarded for the correct answer
 */
function calculateScore(guessesMadeCount, hintWasUsed) {
    // Input validation
    if (typeof guessesMadeCount !== 'number') {
        // Try to convert to number if possible
        const parsed = Number(guessesMadeCount);
        if (isNaN(parsed)) {
            console.warn('Invalid guessesMadeCount, defaulting to 4 (0 points)');
            guessesMadeCount = 4;
        } else {
            guessesMadeCount = parsed;
        }
    }
    
    if (typeof hintWasUsed !== 'boolean') {
        // Convert truthy/falsy to boolean
        hintWasUsed = Boolean(hintWasUsed);
    }
    
    // Ensure guessesMadeCount is a positive integer
    guessesMadeCount = Math.max(1, Math.floor(Math.abs(guessesMadeCount)));
    
    let points = 0;
    
    // Assign points based on number of guesses
    switch (guessesMadeCount) {
        case 1:
            points = 8;
            break;
        case 2:
            points = 4;
            break;
        case 3:
            points = 2;
            break;
        default: // 4 or more guesses
            points = 0;
            break;
    }
    
    // If hint was used, halve the points (rounded down)
    if (hintWasUsed) {
        points = Math.floor(points / 2);
    }
    
    return points;
}