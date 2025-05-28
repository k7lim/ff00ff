// ABOUTME: This file contains core game logic and state management
// ABOUTME: Handles question generation, scoring, and game flow control

/**
 * Minimum distance threshold for color distinctness
 * Two colors are considered "too similar" if their distance is below this value
 */
const MIN_DISTANCE_THRESHOLD = 75;

// Make available globally for browser compatibility
if (typeof window !== 'undefined') {
    window.MIN_DISTANCE_THRESHOLD = MIN_DISTANCE_THRESHOLD;
} else {
    global.MIN_DISTANCE_THRESHOLD = MIN_DISTANCE_THRESHOLD;
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
    
    // Log successful generation info
    if (regenerationAttempts > 1) {
        console.log(`Generated distinct color set after ${regenerationAttempts} attempts`);
    }
    
    return {
        correctHex: correctHex,
        distractors: distractors
    };
}