// ABOUTME: This file contains specification compliance tests for the HexVex game
// ABOUTME: Tests verify that all requirements from spec.md are met exactly

/**
 * Specification Compliance Test Suite for HexVex
 * Tests all requirements from spec.md for exact compliance
 */

/**
 * Technical Specification Tests
 */

// Test: Pure HTML/CSS/JavaScript (no frameworks)
function testNoFrameworkUsage() {
    console.log('Testing: No framework usage...');
    
    // Check for common framework indicators in the global scope
    const frameworkIndicators = [
        'React', 'Vue', 'Angular', 'jQuery', '$', 'Svelte', 'Alpine',
        'Preact', 'Lit', 'Stencil', 'Ember', 'Backbone'
    ];
    
    for (let indicator of frameworkIndicators) {
        if (typeof window[indicator] !== 'undefined') {
            throw new Error(`Framework detected: ${indicator} is present in global scope`);
        }
    }
    
    // Check for framework-specific attributes in DOM
    const body = document.body;
    const frameworkAttributes = [
        'ng-app', 'ng-controller', 'v-app', 'data-react-root',
        'data-vue-app', 'x-data', 'data-alpine'
    ];
    
    for (let attr of frameworkAttributes) {
        if (body.hasAttribute(attr) || body.querySelector(`[${attr}]`)) {
            throw new Error(`Framework attribute detected: ${attr}`);
        }
    }
    
    console.log('✓ No framework usage test passed');
}

// Test: Desktop-first design (responsive not required for MVP)
function testDesktopFirstDesign() {
    console.log('Testing: Desktop-first design...');
    
    // Verify basic desktop layout assumptions
    const questionArea = document.getElementById('question-area');
    const optionsArea = document.getElementById('options-area');
    const scoreDisplay = document.getElementById('score-display');
    
    if (!questionArea || !optionsArea || !scoreDisplay) {
        throw new Error('Required layout elements missing');
    }
    
    // Check that layout is designed for desktop dimensions
    const questionStyle = window.getComputedStyle(questionArea);
    const optionsStyle = window.getComputedStyle(optionsArea);
    
    // Verify adequate spacing for desktop
    const questionPadding = parseInt(questionStyle.padding) || 0;
    const optionsMaxWidth = parseInt(optionsStyle.maxWidth) || 0;
    
    if (questionPadding < 20) {
        throw new Error('Question area padding too small for desktop design');
    }
    
    if (optionsMaxWidth > 0 && optionsMaxWidth < 500) {
        throw new Error('Options area max-width too small for desktop design');
    }
    
    console.log('✓ Desktop-first design test passed');
}

// Test: All color calculations match spec formula exactly
function testColorCalculationFormula() {
    console.log('Testing: Color calculation formula compliance...');
    
    // Test the Manhattan distance formula: |R1-R2| + |G1-G2| + |B1-B2|
    const testCases = [
        { color1: '#000000', color2: '#FFFFFF', expectedDistance: 765 },
        { color1: '#FF0000', color2: '#00FF00', expectedDistance: 510 },
        { color1: '#ABCDEF', color2: '#FEDCBA', expectedDistance: 151 },
        { color1: '#123456', color2: '#654321', expectedDistance: 151 },
        { color1: '#000000', color2: '#000000', expectedDistance: 0 }
    ];
    
    for (let testCase of testCases) {
        const rgb1 = hexToRgb(testCase.color1);
        const rgb2 = hexToRgb(testCase.color2);
        const actualDistance = calculateColorDistance(rgb1, rgb2);
        
        if (actualDistance !== testCase.expectedDistance) {
            throw new Error(`Color distance calculation incorrect for ${testCase.color1} and ${testCase.color2}: expected ${testCase.expectedDistance}, got ${actualDistance}`);
        }
    }
    
    console.log('✓ Color calculation formula test passed');
}

// Test: Question types appear randomly (50/50 distribution)
function testQuestionTypeDistribution() {
    console.log('Testing: Question type distribution...');
    
    const sampleSize = 1000;
    let identifyColorCount = 0;
    let identifySwatchCount = 0;
    
    for (let i = 0; i < sampleSize; i++) {
        const question = generateQuestion();
        
        if (question.type === 'identify_color') {
            identifyColorCount++;
        } else if (question.type === 'identify_swatch') {
            identifySwatchCount++;
        } else {
            throw new Error(`Invalid question type: ${question.type}`);
        }
    }
    
    // Allow 5% deviation from perfect 50/50 split
    const expectedEach = sampleSize / 2;
    const tolerance = sampleSize * 0.05;
    
    if (Math.abs(identifyColorCount - expectedEach) > tolerance) {
        throw new Error(`Question type distribution skewed: ${identifyColorCount} identify_color vs ${identifySwatchCount} identify_swatch (expected ~${expectedEach} each)`);
    }
    
    console.log(`✓ Question type distribution test passed (${identifyColorCount} identify_color, ${identifySwatchCount} identify_swatch)`);
}

// Test: Option order properly randomized
function testOptionOrderRandomization() {
    console.log('Testing: Option order randomization...');
    
    const sampleSize = 400; // Should give us ~100 per position
    const positionCounts = [0, 0, 0, 0]; // Track correct answer positions
    
    for (let i = 0; i < sampleSize; i++) {
        const question = generateQuestion();
        
        // Find position of correct answer
        let correctPosition = -1;
        for (let j = 0; j < question.options.length; j++) {
            if (question.options[j].isCorrect) {
                correctPosition = j;
                break;
            }
        }
        
        if (correctPosition === -1) {
            throw new Error(`No correct answer found in question ${i + 1}`);
        }
        
        positionCounts[correctPosition]++;
    }
    
    // Check that each position has roughly 25% of answers (allow 10% deviation)
    const expectedPerPosition = sampleSize / 4;
    const tolerance = sampleSize * 0.1;
    
    for (let i = 0; i < 4; i++) {
        if (Math.abs(positionCounts[i] - expectedPerPosition) > tolerance) {
            throw new Error(`Correct answer position ${i} appears ${positionCounts[i]} times (expected ~${expectedPerPosition}), indicating poor randomization`);
        }
    }
    
    console.log(`✓ Option order randomization test passed (positions: ${positionCounts.join(', ')})`);
}

/**
 * Feature Completeness Tests
 */

// Test: Infinite gameplay loop works
function testInfiniteGameplayLoop() {
    console.log('Testing: Infinite gameplay loop...');
    
    // Initialize game
    initApp();
    
    // Complete several questions to test the loop
    for (let i = 0; i < 5; i++) {
        // Verify question is displayed
        const questionArea = document.getElementById('question-area');
        const optionsArea = document.getElementById('options-area');
        
        if (questionArea.children.length === 0 || optionsArea.children.length !== 4) {
            throw new Error(`Game loop broken at iteration ${i + 1}: question not properly displayed`);
        }
        
        // Find and click correct answer
        let correctOption = null;
        for (let option of optionsArea.children) {
            if (option.dataset.isCorrect === 'true') {
                correctOption = option;
                break;
            }
        }
        
        if (!correctOption) {
            throw new Error(`No correct option found at iteration ${i + 1}`);
        }
        
        correctOption.click();
        
        // Verify new game button appears
        const newGameButton = document.getElementById('new-game-button');
        if (newGameButton.style.display === 'none') {
            throw new Error(`New game button not shown after correct answer at iteration ${i + 1}`);
        }
        
        // Start new question
        newGameButton.click();
    }
    
    console.log('✓ Infinite gameplay loop test passed');
}

// Test: No "Start Quiz" button (auto-start)
function testAutoStart() {
    console.log('Testing: Auto-start functionality...');
    
    // Reset game and initialize
    if (typeof window !== 'undefined') {
        window.currentScore = 0;
        window.currentQuestion = null;
        window.hintUsed = false;
        window.guessesMade = 0;
    }
    
    // Clear DOM
    document.getElementById('question-area').innerHTML = '';
    document.getElementById('options-area').innerHTML = '';
    
    // Initialize app
    initApp();
    
    // Verify that a question was automatically generated and displayed
    const questionArea = document.getElementById('question-area');
    const optionsArea = document.getElementById('options-area');
    
    if (questionArea.children.length === 0) {
        throw new Error('Game did not auto-start: no question displayed');
    }
    
    if (optionsArea.children.length !== 4) {
        throw new Error('Game did not auto-start: options not displayed');
    }
    
    // Verify no "Start Quiz" or similar button exists
    const allButtons = document.querySelectorAll('button');
    for (let button of allButtons) {
        const buttonText = button.textContent.toLowerCase();
        if (buttonText.includes('start') && (buttonText.includes('quiz') || buttonText.includes('game'))) {
            throw new Error('Found prohibited start button: ' + button.textContent);
        }
    }
    
    console.log('✓ Auto-start test passed');
}

// Test: Two question types implemented correctly
function testTwoQuestionTypes() {
    console.log('Testing: Two question types implementation...');
    
    let foundIdentifyColor = false;
    let foundIdentifySwatch = false;
    
    // Generate questions until we find both types
    for (let i = 0; i < 100; i++) {
        const question = generateQuestion();
        
        if (question.type === 'identify_color') {
            foundIdentifyColor = true;
            
            // Verify structure for identify_color
            if (typeof question.questionDisplayValue !== 'string' || !question.questionDisplayValue.startsWith('#')) {
                throw new Error('identify_color question should have hex color as questionDisplayValue');
            }
            
            // Verify options are hex codes
            for (let option of question.options) {
                if (!option.value.startsWith('#') || option.value.length !== 7) {
                    throw new Error('identify_color options should be hex codes');
                }
            }
        } else if (question.type === 'identify_swatch') {
            foundIdentifySwatch = true;
            
            // Verify structure for identify_swatch
            if (typeof question.questionDisplayValue !== 'string' || !question.questionDisplayValue.startsWith('#')) {
                throw new Error('identify_swatch question should have hex color as questionDisplayValue');
            }
            
            // Verify options are hex codes (for color swatches)
            for (let option of question.options) {
                if (!option.value.startsWith('#') || option.value.length !== 7) {
                    throw new Error('identify_swatch options should be hex codes');
                }
            }
        }
        
        if (foundIdentifyColor && foundIdentifySwatch) {
            break;
        }
    }
    
    if (!foundIdentifyColor || !foundIdentifySwatch) {
        throw new Error('Both question types not found: identify_color=' + foundIdentifyColor + ', identify_swatch=' + foundIdentifySwatch);
    }
    
    console.log('✓ Two question types test passed');
}

// Test: Hint system fully functional
function testHintSystemFunctionality() {
    console.log('Testing: Hint system functionality...');
    
    // Test hint for identify_color question
    let question = generateQuestion();
    while (question.type !== 'identify_color') {
        question = generateQuestion();
    }
    
    window.currentQuestion = question;
    renderQuestion(question);
    
    // Click hint button
    const hintButton = document.getElementById('hint-button');
    hintButton.click();
    
    // Verify hint was applied to options
    const optionsArea = document.getElementById('options-area');
    let foundColoredHint = false;
    for (let option of optionsArea.children) {
        if (option.innerHTML.includes('span') && option.innerHTML.includes('color:')) {
            foundColoredHint = true;
            break;
        }
    }
    
    if (!foundColoredHint) {
        throw new Error('Hint not applied correctly for identify_color question');
    }
    
    // Test hint for identify_swatch question
    question = generateQuestion();
    while (question.type !== 'identify_swatch') {
        question = generateQuestion();
    }
    
    window.currentQuestion = question;
    window.hintUsed = false;
    renderQuestion(question);
    
    // Reset and enable hint button
    hintButton.disabled = false;
    hintButton.textContent = 'Show Hint';
    
    // Click hint button
    hintButton.click();
    
    // Verify hint was applied to question
    const questionArea = document.getElementById('question-area');
    const questionElement = questionArea.children[0];
    if (!questionElement.innerHTML.includes('span') || !questionElement.innerHTML.includes('color:')) {
        throw new Error('Hint not applied correctly for identify_swatch question');
    }
    
    console.log('✓ Hint system functionality test passed');
}

// Test: Scoring system matches specification exactly
function testScoringSystemSpecCompliance() {
    console.log('Testing: Scoring system specification compliance...');
    
    // Test all scoring scenarios as per specification
    const scoringTests = [
        { guesses: 1, hint: false, expected: 8 },
        { guesses: 2, hint: false, expected: 4 },
        { guesses: 3, hint: false, expected: 2 },
        { guesses: 4, hint: false, expected: 0 }, // 3+ incorrect guesses
        { guesses: 1, hint: true, expected: 4 },  // 8/2 = 4
        { guesses: 2, hint: true, expected: 2 },  // 4/2 = 2
        { guesses: 3, hint: true, expected: 1 },  // 2/2 = 1
        { guesses: 4, hint: true, expected: 0 }   // 0/2 = 0
    ];
    
    for (let test of scoringTests) {
        const score = calculateScore(test.guesses, test.hint);
        if (score !== test.expected) {
            throw new Error(`Scoring mismatch: ${test.guesses} guesses, hint=${test.hint}, expected ${test.expected}, got ${score}`);
        }
    }
    
    console.log('✓ Scoring system specification compliance test passed');
}

/**
 * Visual Design Compliance Tests
 */

// Test: Color swatches are perfect circles
function testCircularSwatches() {
    console.log('Testing: Circular color swatches...');
    
    initApp();
    
    // Check main swatch if present
    const questionArea = document.getElementById('question-area');
    for (let element of questionArea.children) {
        if (element.classList.contains('color-swatch')) {
            const style = window.getComputedStyle(element);
            if (style.borderRadius !== '50%') {
                throw new Error('Main color swatch is not circular (border-radius should be 50%)');
            }
        }
    }
    
    // Check option swatches if present
    const optionsArea = document.getElementById('options-area');
    for (let element of optionsArea.children) {
        if (element.classList.contains('color-swatch')) {
            const style = window.getComputedStyle(element);
            if (style.borderRadius !== '50%') {
                throw new Error('Option color swatch is not circular (border-radius should be 50%)');
            }
        }
    }
    
    console.log('✓ Circular color swatches test passed');
}

// Test: Hex codes always uppercase
function testUppercaseHexCodes() {
    console.log('Testing: Uppercase hex codes...');
    
    // Generate multiple questions and check hex code display
    for (let i = 0; i < 10; i++) {
        const question = generateQuestion();
        renderQuestion(question);
        
        // Check option buttons for hex codes
        const optionsArea = document.getElementById('options-area');
        for (let option of optionsArea.children) {
            if (option.tagName === 'BUTTON') {
                const text = option.textContent;
                if (text !== text.toUpperCase()) {
                    throw new Error(`Hex code not uppercase: ${text}`);
                }
            }
        }
        
        // Check question area for hex codes
        const questionArea = document.getElementById('question-area');
        for (let element of questionArea.children) {
            if (element.classList.contains('hex-code-text') || element.classList.contains('large-hex-display')) {
                const text = element.textContent;
                if (text && text.includes('#') && text !== text.toUpperCase()) {
                    throw new Error(`Question hex code not uppercase: ${text}`);
                }
            }
        }
    }
    
    console.log('✓ Uppercase hex codes test passed');
}

// Test: Text-stroke/shadow applied correctly
function testTextStroke() {
    console.log('Testing: Text-stroke/shadow application...');
    
    initApp();
    
    // Check for text-shadow or text-stroke on hex codes
    const hexElements = document.querySelectorAll('.hex-code-text');
    
    if (hexElements.length === 0) {
        // Generate a question that will create hex elements
        const question = generateQuestion();
        renderQuestion(question);
    }
    
    const updatedHexElements = document.querySelectorAll('.hex-code-text');
    
    for (let element of updatedHexElements) {
        const style = window.getComputedStyle(element);
        const textShadow = style.textShadow;
        
        if (!textShadow || textShadow === 'none') {
            throw new Error('Hex code text should have text-shadow for readability');
        }
        
        // Verify text-shadow includes stroke effect (multiple shadows)
        if (!textShadow.includes('-1px') || !textShadow.includes('1px')) {
            throw new Error('Text-shadow should create stroke effect with multiple directional shadows');
        }
    }
    
    console.log('✓ Text-stroke/shadow test passed');
}

// Test: Layout matches specification description
function testLayoutSpecCompliance() {
    console.log('Testing: Layout specification compliance...');
    
    initApp();
    
    // Test score in top-right corner
    const scoreDisplay = document.getElementById('score-display');
    const scoreStyle = window.getComputedStyle(scoreDisplay);
    
    if (scoreStyle.position !== 'absolute') {
        throw new Error('Score display should be absolutely positioned');
    }
    
    if (scoreStyle.top !== '20px' || scoreStyle.right !== '20px') {
        throw new Error('Score display should be positioned at top: 20px, right: 20px');
    }
    
    // Test centered layout
    const questionArea = document.getElementById('question-area');
    const questionStyle = window.getComputedStyle(questionArea);
    
    if (questionStyle.textAlign !== 'center') {
        throw new Error('Question area should be center-aligned');
    }
    
    // Test white background
    const bodyStyle = window.getComputedStyle(document.body);
    const bgColor = bodyStyle.backgroundColor;
    
    if (bgColor !== 'rgb(255, 255, 255)' && bgColor !== 'white' && bgColor !== '#ffffff') {
        throw new Error('Body background should be white (#FFFFFF)');
    }
    
    console.log('✓ Layout specification compliance test passed');
}

/**
 * Run all specification compliance tests
 */
function runAllSpecComplianceTests() {
    console.log('=== Running Specification Compliance Tests ===');
    
    try {
        // Technical Specification Tests
        testNoFrameworkUsage();
        testDesktopFirstDesign();
        testColorCalculationFormula();
        testQuestionTypeDistribution();
        testOptionOrderRandomization();
        
        // Feature Completeness Tests
        testInfiniteGameplayLoop();
        testAutoStart();
        testTwoQuestionTypes();
        testHintSystemFunctionality();
        testScoringSystemSpecCompliance();
        
        // Visual Design Compliance Tests
        testCircularSwatches();
        testUppercaseHexCodes();
        testTextStroke();
        testLayoutSpecCompliance();
        
        console.log('\n✅ All Specification Compliance tests passed!');
        return true;
    } catch (error) {
        console.error('\n❌ Specification Compliance test failed:', error.message);
        return false;
    }
}

// Export for browser usage
if (typeof window !== 'undefined') {
    window.runAllSpecComplianceTests = runAllSpecComplianceTests;
    window.specComplianceTests = {
        testNoFrameworkUsage,
        testDesktopFirstDesign,
        testColorCalculationFormula,
        testQuestionTypeDistribution,
        testOptionOrderRandomization,
        testInfiniteGameplayLoop,
        testAutoStart,
        testTwoQuestionTypes,
        testHintSystemFunctionality,
        testScoringSystemSpecCompliance,
        testCircularSwatches,
        testUppercaseHexCodes,
        testTextStroke,
        testLayoutSpecCompliance
    };
}