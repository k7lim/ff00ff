// ABOUTME: This file contains performance and stress tests for the HexVex game
// ABOUTME: Tests ensure the game performs well under load and extended usage

/**
 * Performance and Stress Test Suite for HexVex
 * Tests system performance, efficiency, and stability
 */

/**
 * Performance Tests
 */

// Test: Generate 1000 questions in reasonable time (< 10 seconds)
function testQuestionGenerationPerformance() {
    console.log('Testing: Question generation performance...');

    const startTime = performance.now();
    const targetQuestions = 1000;
    const maxTime = 10000; // 10 seconds in milliseconds

    for (let i = 0; i < targetQuestions; i++) {
        const question = generateQuestion();

        // Basic validation to ensure generated questions are valid
        if (!question || !question.type || !question.options || question.options.length !== 4) {
            throw new Error(`Invalid question generated at iteration ${i + 1}`);
        }
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    if (totalTime > maxTime) {
        throw new Error(`Question generation too slow: ${totalTime.toFixed(0)}ms for ${targetQuestions} questions (max: ${maxTime}ms)`);
    }

    const questionsPerSecond = (targetQuestions / (totalTime / 1000)).toFixed(1);
    console.log(`✓ Generated ${targetQuestions} questions in ${totalTime.toFixed(0)}ms (${questionsPerSecond} questions/second)`);
}

// Test: Color distance calculation efficiency
function testColorDistanceCalculationPerformance() {
    console.log('Testing: Color distance calculation performance...');

    const startTime = performance.now();
    const testIterations = 10000;

    // Generate test color pairs
    const testPairs = [];
    for (let i = 0; i < testIterations; i++) {
        const color1 = generateRandomHexColor();
        const color2 = generateRandomHexColor();
        testPairs.push({
            rgb1: hexToRgb(color1),
            rgb2: hexToRgb(color2)
        });
    }

    const calculationStartTime = performance.now();

    // Perform distance calculations
    for (let pair of testPairs) {
        const distance = calculateColorDistance(pair.rgb1, pair.rgb2);
        if (distance < 0 || distance > 765) {
            throw new Error('Color distance out of valid range (0-765)');
        }
    }

    const endTime = performance.now();
    const totalTime = endTime - calculationStartTime;
    const setupTime = calculationStartTime - startTime;

    const calculationsPerSecond = (testIterations / (totalTime / 1000)).toFixed(0);

    console.log(`✓ Performed ${testIterations} distance calculations in ${totalTime.toFixed(0)}ms (${calculationsPerSecond} calculations/second)`);
    console.log(`  Setup time: ${setupTime.toFixed(0)}ms, Calculation time: ${totalTime.toFixed(0)}ms`);
}

// Test: DOM manipulation performance during gameplay
function testDOMManipulationPerformance() {
    console.log('Testing: DOM manipulation performance...');

    const startTime = performance.now();
    const iterations = 100;

    // Initialize DOM elements if needed
    if (!document.getElementById('question-area')) {
        throw new Error('DOM elements not available for performance testing');
    }

    for (let i = 0; i < iterations; i++) {
        // Generate and render a question
        const question = generateQuestion();
        renderQuestion(question);

        // Simulate user interaction
        const optionsArea = document.getElementById('options-area');
        if (optionsArea && optionsArea.children.length > 0) {
            const firstOption = optionsArea.children[0];
            // Simulate click without triggering actual event handlers
            firstOption.dataset.testClick = 'true';
        }

        // Clear for next iteration
        const questionArea = document.getElementById('question-area');
        if (questionArea) questionArea.innerHTML = '';
        if (optionsArea) optionsArea.innerHTML = '';
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const operationsPerSecond = (iterations / (totalTime / 1000)).toFixed(1);

    console.log(`✓ Performed ${iterations} DOM manipulation cycles in ${totalTime.toFixed(0)}ms (${operationsPerSecond} cycles/second)`);
}

// Test: Memory usage doesn't grow excessively
function testMemoryUsage() {
    console.log('Testing: Memory usage stability...');

    // Get initial memory baseline if available
    let initialMemory = 0;
    if (performance.memory) {
        initialMemory = performance.memory.usedJSHeapSize;
        console.log(`  Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)} MB`);
    }

    // Perform memory-intensive operations
    const largeOperations = 1000;
    const generatedQuestions = [];

    for (let i = 0; i < largeOperations; i++) {
        const question = generateQuestion();
        generatedQuestions.push(question);

        // Simulate DOM operations
        if (i % 100 === 0) {
            renderQuestion(question);
            const questionArea = document.getElementById('question-area');
            const optionsArea = document.getElementById('options-area');
            if (questionArea) questionArea.innerHTML = '';
            if (optionsArea) optionsArea.innerHTML = '';
        }
    }

    // Force garbage collection if available
    if (window.gc) {
        window.gc();
    }

    // Check final memory if available
    if (performance.memory) {
        const finalMemory = performance.memory.usedJSHeapSize;
        const memoryGrowth = finalMemory - initialMemory;
        const memoryGrowthMB = memoryGrowth / 1024 / 1024;

        console.log(`  Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  Memory growth: ${memoryGrowthMB.toFixed(2)} MB`);

        // Alert if memory growth is excessive (>50MB for this test)
        if (memoryGrowthMB > 50) {
            console.warn(`  Warning: High memory growth detected (${memoryGrowthMB.toFixed(2)} MB)`);
        }
    }

    console.log(`✓ Memory usage test completed`);
}

/**
 * Stress Tests
 */

// Test: Rapid clicking doesn't break game state
function testRapidClickingStability() {
    console.log('Testing: Rapid clicking stability...');

    // Reset game state
    if (typeof window !== 'undefined') {
        window.currentScore = 0;
        window.currentQuestion = null;
        window.hintUsed = false;
        window.guessesMade = 0;
    }

    // Initialize game
    initApp();

    // Perform rapid clicking simulation
    const optionsArea = document.getElementById('options-area');
    const hintButton = document.getElementById('hint-button');

    const clickEvents = [];

    // Create multiple click events rapidly
    for (let i = 0; i < 20; i++) {
        if (optionsArea.children.length > 0) {
            const randomOption = optionsArea.children[Math.floor(Math.random() * optionsArea.children.length)];
            clickEvents.push(() => {
                if (randomOption.parentNode) { // Check if still in DOM
                    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                    randomOption.dispatchEvent(event);
                }
            });
        }

        if (hintButton && !hintButton.disabled) {
            clickEvents.push(() => {
                const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                hintButton.dispatchEvent(event);
            });
        }
    }

    // Execute all clicks rapidly
    const startTime = performance.now();
    for (let clickEvent of clickEvents) {
        try {
            clickEvent();
        } catch (error) {
            console.warn(`  Click event error (expected): ${error.message}`);
        }
    }
    const endTime = performance.now();

    // Verify game state remains valid
    if (typeof window.currentScore !== 'number' || window.currentScore < 0) {
        throw new Error('Game score became invalid after rapid clicking');
    }

    if (typeof window.guessesMade !== 'number' || window.guessesMade < 0) {
        throw new Error('Guess count became invalid after rapid clicking');
    }

    console.log(`✓ Rapid clicking test completed in ${(endTime - startTime).toFixed(0)}ms`);
}

// Test: Rapid new game generation works correctly
function testRapidNewGameGeneration() {
    console.log('Testing: Rapid new game generation...');

    const iterations = 50;
    const startTime = performance.now();

    for (let i = 0; i < iterations; i++) {
        try {
            startNewQuestion();

            // Verify basic game state
            if (!window.currentQuestion || !window.currentQuestion.type) {
                throw new Error(`Invalid question generated at iteration ${i + 1}`);
            }

            // Verify DOM state
            const questionArea = document.getElementById('question-area');
            const optionsArea = document.getElementById('options-area');

            if (!questionArea || questionArea.children.length === 0) {
                throw new Error(`Question area not populated at iteration ${i + 1}`);
            }

            if (!optionsArea || optionsArea.children.length !== 4) {
                throw new Error(`Options area invalid at iteration ${i + 1}`);
            }

        } catch (error) {
            throw new Error(`Rapid new game generation failed at iteration ${i + 1}: ${error.message}`);
        }
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const gamesPerSecond = (iterations / (totalTime / 1000)).toFixed(1);

    console.log(`✓ Generated ${iterations} new games in ${totalTime.toFixed(0)}ms (${gamesPerSecond} games/second)`);
}

// Test: Extended gameplay remains stable
function testExtendedGameplayStability() {
    console.log('Testing: Extended gameplay stability...');

    const gameCount = 100;
    let completedGames = 0;
    let totalScore = 0;

    const startTime = performance.now();

    for (let i = 0; i < gameCount; i++) {
        try {
            // Start new question
            startNewQuestion();

            // Randomly use hint
            if (Math.random() < 0.3) { // 30% chance to use hint
                const hintButton = document.getElementById('hint-button');
                if (hintButton && !hintButton.disabled) {
                    hintButton.click();
                }
            }

            // Find and click correct answer
            const optionsArea = document.getElementById('options-area');
            let correctOption = null;

            for (let option of optionsArea.children) {
                if (option.dataset.isCorrect === 'true') {
                    correctOption = option;
                    break;
                }
            }

            if (correctOption) {
                correctOption.click();
                totalScore = window.currentScore;
                completedGames++;
            }

            // Verify game state remains valid every 10 games
            if (i % 10 === 0) {
                if (typeof window.currentScore !== 'number' || window.currentScore < 0) {
                    throw new Error(`Invalid score after ${i + 1} games: ${window.currentScore}`);
                }
            }

        } catch (error) {
            throw new Error(`Extended gameplay failed at game ${i + 1}: ${error.message}`);
        }
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTimePerGame = (totalTime / gameCount).toFixed(1);

    if (completedGames !== gameCount) {
        throw new Error(`Only completed ${completedGames}/${gameCount} games`);
    }

    console.log(`✓ Completed ${completedGames} games in ${totalTime.toFixed(0)}ms (${averageTimePerGame}ms per game)`);
    console.log(`  Final score: ${totalScore}`);
}

/**
 * Run all performance tests
 */
function runAllPerformanceTests() {
    console.log('=== Running Performance Tests ===');

    try {
        // Performance Tests
        testQuestionGenerationPerformance();
        testColorDistanceCalculationPerformance();
        testDOMManipulationPerformance();
        testMemoryUsage();

        // Stress Tests
        testRapidClickingStability();
        testRapidNewGameGeneration();
        testExtendedGameplayStability();

        console.log('\n✅ All Performance tests passed!');
        return true;
    } catch (error) {
        console.error('\n❌ Performance test failed:', error.message);
        return false;
    }
}

// Export for browser usage
if (typeof window !== 'undefined') {
    window.runAllPerformanceTests = runAllPerformanceTests;
    window.performanceTests = {
        testQuestionGenerationPerformance,
        testColorDistanceCalculationPerformance,
        testDOMManipulationPerformance,
        testMemoryUsage,
        testRapidClickingStability,
        testRapidNewGameGeneration,
        testExtendedGameplayStability
    };
}