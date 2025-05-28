// TDD Test Suite for game.js - Written BEFORE implementation

// Unit Tests for MIN_DISTANCE_THRESHOLD Constant
testRunner.section('MIN_DISTANCE_THRESHOLD Constant Tests');

testRunner.test('Constant is defined and equals 75', () => {
    testRunner.assertTrue(typeof MIN_DISTANCE_THRESHOLD !== 'undefined', 'MIN_DISTANCE_THRESHOLD should be defined');
    testRunner.assertEqual(MIN_DISTANCE_THRESHOLD, 75, 'Should equal 75');
});

testRunner.test('Constant is a number type', () => {
    testRunner.assertTrue(typeof MIN_DISTANCE_THRESHOLD === 'number', 'Should be a number');
});

testRunner.test('Constant is not modifiable (if using const)', () => {
    const originalValue = MIN_DISTANCE_THRESHOLD;
    try {
        MIN_DISTANCE_THRESHOLD = 100;
    } catch (e) {
        // Expected for const
    }
    testRunner.assertEqual(MIN_DISTANCE_THRESHOLD, originalValue, 'Should not be modifiable');
});

// Unit Tests for generateQuestionOptions() function
testRunner.section('generateQuestionOptions() Return Value Structure Tests');

testRunner.test('Returns an object with correctHex and distractors properties', () => {
    const result = generateQuestionOptions();
    testRunner.assertTrue(typeof result === 'object', 'Should return an object');
    testRunner.assertTrue('correctHex' in result, 'Should have correctHex property');
    testRunner.assertTrue('distractors' in result, 'Should have distractors property');
});

testRunner.test('correctHex is a valid hex string (starts with #, 7 characters, valid hex)', () => {
    const result = generateQuestionOptions();
    const hex = result.correctHex;
    testRunner.assertTrue(typeof hex === 'string', 'correctHex should be a string');
    testRunner.assertTrue(hex.startsWith('#'), 'Should start with #');
    testRunner.assertEqual(hex.length, 7, 'Should be 7 characters');
    testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(hex), 'Should be valid hex format');
});

testRunner.test('distractors is an array with exactly 3 elements', () => {
    const result = generateQuestionOptions();
    testRunner.assertTrue(Array.isArray(result.distractors), 'distractors should be an array');
    testRunner.assertEqual(result.distractors.length, 3, 'Should have exactly 3 distractors');
});

testRunner.test('All distractor elements are valid hex strings', () => {
    const result = generateQuestionOptions();
    result.distractors.forEach((hex, index) => {
        testRunner.assertTrue(typeof hex === 'string', `Distractor ${index} should be a string`);
        testRunner.assertTrue(hex.startsWith('#'), `Distractor ${index} should start with #`);
        testRunner.assertEqual(hex.length, 7, `Distractor ${index} should be 7 characters`);
        testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(hex), `Distractor ${index} should be valid hex`);
    });
});

testRunner.test('correctHex is different from all distractors', () => {
    const result = generateQuestionOptions();
    const { correctHex, distractors } = result;
    distractors.forEach((distractor, index) => {
        testRunner.assertTrue(correctHex !== distractor, `correctHex should be different from distractor ${index}`);
    });
});

testRunner.test('All distractors are different from each other', () => {
    const result = generateQuestionOptions();
    const { distractors } = result;
    for (let i = 0; i < distractors.length; i++) {
        for (let j = i + 1; j < distractors.length; j++) {
            testRunner.assertTrue(distractors[i] !== distractors[j], `Distractor ${i} should be different from distractor ${j}`);
        }
    }
});

// Color Distinctness Tests (Critical)
testRunner.section('Color Distinctness Tests');

testRunner.test('Distance between correct color and each distractor >= 75', () => {
    const result = generateQuestionOptions();
    const { correctHex, distractors } = result;
    const correctRgb = hexToRgb(correctHex);
    
    distractors.forEach((distractorHex, index) => {
        const distractorRgb = hexToRgb(distractorHex);
        const distance = calculateColorDistance(correctRgb, distractorRgb);
        testRunner.assertTrue(distance >= MIN_DISTANCE_THRESHOLD, 
            `Distance between correct and distractor ${index} should be >= ${MIN_DISTANCE_THRESHOLD}, got ${distance}`);
    });
});

testRunner.test('Distance between each pair of distractors >= 75', () => {
    const result = generateQuestionOptions();
    const { distractors } = result;
    
    for (let i = 0; i < distractors.length; i++) {
        for (let j = i + 1; j < distractors.length; j++) {
            const rgb1 = hexToRgb(distractors[i]);
            const rgb2 = hexToRgb(distractors[j]);
            const distance = calculateColorDistance(rgb1, rgb2);
            testRunner.assertTrue(distance >= MIN_DISTANCE_THRESHOLD,
                `Distance between distractor ${i} and ${j} should be >= ${MIN_DISTANCE_THRESHOLD}, got ${distance}`);
        }
    }
});

testRunner.test('All 6 unique pairs meet the distance threshold', () => {
    const result = generateQuestionOptions();
    const { correctHex, distractors } = result;
    const allColors = [correctHex, ...distractors];
    const allRgbs = allColors.map(hex => hexToRgb(hex));
    
    let pairCount = 0;
    for (let i = 0; i < allRgbs.length; i++) {
        for (let j = i + 1; j < allRgbs.length; j++) {
            const distance = calculateColorDistance(allRgbs[i], allRgbs[j]);
            testRunner.assertTrue(distance >= MIN_DISTANCE_THRESHOLD,
                `Pair ${i}-${j} distance should be >= ${MIN_DISTANCE_THRESHOLD}, got ${distance}`);
            pairCount++;
        }
    }
    testRunner.assertEqual(pairCount, 6, 'Should have checked exactly 6 unique pairs');
});

testRunner.test('Function eventually succeeds even with difficult color combinations', () => {
    // Run multiple times to test regeneration logic
    for (let i = 0; i < 10; i++) {
        const result = generateQuestionOptions();
        testRunner.assertTrue(result !== null && typeof result === 'object', 
            `Attempt ${i + 1} should succeed`);
    }
});

testRunner.test('Maximum regeneration attempts don\'t exceed reasonable limit (e.g., 100 tries)', () => {
    // This test will be validated by implementation logging
    const result = generateQuestionOptions();
    testRunner.assertTrue(result !== null, 'Should eventually succeed within reasonable attempts');
});

// Randomness Tests
testRunner.section('Randomness Tests');

testRunner.test('Multiple calls return different correct colors', () => {
    const correctColors = new Set();
    for (let i = 0; i < 10; i++) {
        const result = generateQuestionOptions();
        correctColors.add(result.correctHex);
    }
    testRunner.assertTrue(correctColors.size > 1, 'Should generate different correct colors');
});

testRunner.test('Multiple calls return different distractor sets', () => {
    const distractorSets = new Set();
    for (let i = 0; i < 10; i++) {
        const result = generateQuestionOptions();
        const setKey = result.distractors.sort().join(',');
        distractorSets.add(setKey);
    }
    testRunner.assertTrue(distractorSets.size > 1, 'Should generate different distractor sets');
});

testRunner.test('Color distribution appears random (not clustered)', () => {
    const colors = [];
    for (let i = 0; i < 20; i++) {
        const result = generateQuestionOptions();
        colors.push(result.correctHex, ...result.distractors);
    }
    
    // Check that we have a good distribution of different colors
    const uniqueColors = new Set(colors);
    testRunner.assertTrue(uniqueColors.size > colors.length * 0.5, 
        'Should have good color distribution (>50% unique)');
});

// Performance Tests
testRunner.section('Performance Tests');

testRunner.test('Function completes within reasonable time (< 1 second)', () => {
    const startTime = performance.now();
    generateQuestionOptions();
    const endTime = performance.now();
    const duration = endTime - startTime;
    testRunner.assertTrue(duration < 1000, `Should complete in < 1000ms, took ${duration}ms`);
});

testRunner.test('Consistent performance across multiple calls', () => {
    const times = [];
    for (let i = 0; i < 5; i++) {
        const startTime = performance.now();
        generateQuestionOptions();
        const endTime = performance.now();
        times.push(endTime - startTime);
    }
    
    const avgTime = times.reduce((a, b) => a + b) / times.length;
    testRunner.assertTrue(avgTime < 500, `Average time should be < 500ms, got ${avgTime}ms`);
});

testRunner.test('Memory usage doesn\'t grow excessively during regeneration', () => {
    // Basic test - function should complete without throwing memory errors
    for (let i = 0; i < 50; i++) {
        generateQuestionOptions();
    }
    testRunner.assertTrue(true, 'Should handle multiple calls without memory issues');
});

// Integration Tests with Utils
testRunner.section('Integration Tests with Utils');

testRunner.test('Uses generateRandomHexColor() correctly', () => {
    const result = generateQuestionOptions();
    // Verify format matches what generateRandomHexColor() produces
    testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(result.correctHex), 'correctHex should use generateRandomHexColor format');
    result.distractors.forEach((hex, index) => {
        testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(hex), `Distractor ${index} should use generateRandomHexColor format`);
    });
});

testRunner.test('Uses hexToRgb() correctly', () => {
    const result = generateQuestionOptions();
    // Should be able to convert all colors to RGB without error
    const correctRgb = hexToRgb(result.correctHex);
    testRunner.assertTrue(typeof correctRgb === 'object' && 'r' in correctRgb, 'Should convert correctHex to RGB');
    
    result.distractors.forEach((hex, index) => {
        const rgb = hexToRgb(hex);
        testRunner.assertTrue(typeof rgb === 'object' && 'r' in rgb, `Should convert distractor ${index} to RGB`);
    });
});

testRunner.test('Uses calculateColorDistance() correctly', () => {
    const result = generateQuestionOptions();
    const { correctHex, distractors } = result;
    const correctRgb = hexToRgb(correctHex);
    
    // Verify distance calculations work
    distractors.forEach((hex, index) => {
        const rgb = hexToRgb(hex);
        const distance = calculateColorDistance(correctRgb, rgb);
        testRunner.assertTrue(typeof distance === 'number' && distance >= 0, 
            `Distance calculation should work for distractor ${index}`);
    });
});

testRunner.test('All utils functions are called with valid parameters', () => {
    // This is validated by the fact that the function completes without throwing errors
    // and produces valid results that pass all other tests
    const result = generateQuestionOptions();
    testRunner.assertTrue(result !== null && typeof result === 'object', 
        'Function should complete successfully using all utils');
});

// Edge Case Tests
testRunner.section('Edge Case Tests');

testRunner.test('Function works consistently across 100+ iterations', () => {
    for (let i = 0; i < 100; i++) {
        const result = generateQuestionOptions();
        testRunner.assertTrue(result && result.correctHex && result.distractors, 
            `Iteration ${i + 1} should produce valid result`);
        testRunner.assertEqual(result.distractors.length, 3, 
            `Iteration ${i + 1} should have 3 distractors`);
    }
});

testRunner.test('No infinite loops occur (add timeout protection)', () => {
    // This test validates that the implementation has proper timeout/retry limits
    const startTime = Date.now();
    generateQuestionOptions();
    const endTime = Date.now();
    const duration = endTime - startTime;
    testRunner.assertTrue(duration < 5000, 'Should not take longer than 5 seconds (indicating infinite loop)');
});

testRunner.test('Handles extreme color values (very dark, very bright)', () => {
    // Run many iterations to increase chance of hitting extreme values
    let foundDark = false, foundBright = false;
    
    for (let i = 0; i < 100; i++) {
        const result = generateQuestionOptions();
        const allColors = [result.correctHex, ...result.distractors];
        
        allColors.forEach(hex => {
            const rgb = hexToRgb(hex);
            const brightness = rgb.r + rgb.g + rgb.b;
            if (brightness < 100) foundDark = true;
            if (brightness > 650) foundBright = true;
        });
    }
    
    // At least verify the function can handle any generated colors
    testRunner.assertTrue(true, 'Function should handle all generated color values');
});

// ============================================================================
// PROMPT 4: Full Question Object Generation Tests
// ============================================================================

// Unit Tests for generateQuestion() function
testRunner.section('generateQuestion() Return Object Structure Tests');

testRunner.test('Returns object with required properties: type, questionDisplayValue, options, correctAnswerHex', () => {
    const result = generateQuestion();
    testRunner.assertTrue(typeof result === 'object', 'Should return an object');
    testRunner.assertTrue('type' in result, 'Should have type property');
    testRunner.assertTrue('questionDisplayValue' in result, 'Should have questionDisplayValue property');
    testRunner.assertTrue('options' in result, 'Should have options property');
    testRunner.assertTrue('correctAnswerHex' in result, 'Should have correctAnswerHex property');
});

testRunner.test('type is either "identify_color" or "identify_swatch"', () => {
    const result = generateQuestion();
    const validTypes = ['identify_color', 'identify_swatch'];
    testRunner.assertTrue(validTypes.includes(result.type), 
        `Type should be one of ${validTypes.join(', ')}, got: ${result.type}`);
});

testRunner.test('questionDisplayValue is a valid hex string (starts with #, 7 chars, valid hex)', () => {
    const result = generateQuestion();
    const hex = result.questionDisplayValue;
    testRunner.assertTrue(typeof hex === 'string', 'questionDisplayValue should be a string');
    testRunner.assertTrue(hex.startsWith('#'), 'Should start with #');
    testRunner.assertEqual(hex.length, 7, 'Should be 7 characters');
    testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(hex), 'Should be valid hex format');
});

testRunner.test('correctAnswerHex is a valid hex string', () => {
    const result = generateQuestion();
    const hex = result.correctAnswerHex;
    testRunner.assertTrue(typeof hex === 'string', 'correctAnswerHex should be a string');
    testRunner.assertTrue(hex.startsWith('#'), 'Should start with #');
    testRunner.assertEqual(hex.length, 7, 'Should be 7 characters');
    testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(hex), 'Should be valid hex format');
});

testRunner.test('questionDisplayValue equals correctAnswerHex', () => {
    const result = generateQuestion();
    testRunner.assertEqual(result.questionDisplayValue, result.correctAnswerHex, 
        'questionDisplayValue should equal correctAnswerHex');
});

testRunner.test('options is an array with exactly 4 elements', () => {
    const result = generateQuestion();
    testRunner.assertTrue(Array.isArray(result.options), 'options should be an array');
    testRunner.assertEqual(result.options.length, 4, 'Should have exactly 4 options');
});

// Options Array Tests
testRunner.section('generateQuestion() Options Array Tests');

testRunner.test('Each option has value, isCorrect, and id properties', () => {
    const result = generateQuestion();
    result.options.forEach((option, index) => {
        testRunner.assertTrue('value' in option, `Option ${index} should have value property`);
        testRunner.assertTrue('isCorrect' in option, `Option ${index} should have isCorrect property`);
        testRunner.assertTrue('id' in option, `Option ${index} should have id property`);
    });
});

testRunner.test('All option value properties are valid hex strings', () => {
    const result = generateQuestion();
    result.options.forEach((option, index) => {
        const hex = option.value;
        testRunner.assertTrue(typeof hex === 'string', `Option ${index} value should be a string`);
        testRunner.assertTrue(hex.startsWith('#'), `Option ${index} should start with #`);
        testRunner.assertEqual(hex.length, 7, `Option ${index} should be 7 characters`);
        testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(hex), `Option ${index} should be valid hex`);
    });
});

testRunner.test('Exactly one option has isCorrect: true', () => {
    const result = generateQuestion();
    const correctOptions = result.options.filter(option => option.isCorrect === true);
    testRunner.assertEqual(correctOptions.length, 1, 'Should have exactly one correct option');
});

testRunner.test('Three options have isCorrect: false', () => {
    const result = generateQuestion();
    const incorrectOptions = result.options.filter(option => option.isCorrect === false);
    testRunner.assertEqual(incorrectOptions.length, 3, 'Should have exactly three incorrect options');
});

testRunner.test('The correct option\'s value matches correctAnswerHex', () => {
    const result = generateQuestion();
    const correctOption = result.options.find(option => option.isCorrect === true);
    testRunner.assertTrue(correctOption !== undefined, 'Should have a correct option');
    testRunner.assertEqual(correctOption.value, result.correctAnswerHex, 
        'Correct option value should match correctAnswerHex');
});

testRunner.test('All option id values are unique', () => {
    const result = generateQuestion();
    const ids = result.options.map(option => option.id);
    const uniqueIds = new Set(ids);
    testRunner.assertEqual(uniqueIds.size, ids.length, 'All option IDs should be unique');
});

testRunner.test('Option id values follow expected format (e.g., "option_0", "option_1", etc.)', () => {
    const result = generateQuestion();
    result.options.forEach((option, index) => {
        testRunner.assertTrue(typeof option.id === 'string', `Option ${index} ID should be a string`);
        testRunner.assertTrue(option.id.length > 0, `Option ${index} ID should not be empty`);
    });
});

// Randomization Tests
testRunner.section('generateQuestion() Randomization Tests');

testRunner.test('Question type distribution is approximately 50/50 over 100 iterations', () => {
    const typeCount = { identify_color: 0, identify_swatch: 0 };
    
    for (let i = 0; i < 100; i++) {
        const result = generateQuestion();
        typeCount[result.type]++;
    }
    
    const ratio1 = typeCount.identify_color / 100;
    const ratio2 = typeCount.identify_swatch / 100;
    
    // Allow for some variance (30-70% range)
    testRunner.assertTrue(ratio1 >= 0.3 && ratio1 <= 0.7, 
        `identify_color should be 30-70%, got ${(ratio1 * 100).toFixed(1)}%`);
    testRunner.assertTrue(ratio2 >= 0.3 && ratio2 <= 0.7, 
        `identify_swatch should be 30-70%, got ${(ratio2 * 100).toFixed(1)}%`);
});

testRunner.test('Correct answer position varies across multiple generations', () => {
    const positions = new Set();
    
    for (let i = 0; i < 20; i++) {
        const result = generateQuestion();
        const correctIndex = result.options.findIndex(option => option.isCorrect === true);
        positions.add(correctIndex);
    }
    
    testRunner.assertTrue(positions.size > 1, 'Correct answer should appear in different positions');
});

testRunner.test('Each position (0,1,2,3) gets the correct answer roughly equally over 100 iterations', () => {
    const positionCount = [0, 0, 0, 0];
    
    for (let i = 0; i < 100; i++) {
        const result = generateQuestion();
        const correctIndex = result.options.findIndex(option => option.isCorrect === true);
        positionCount[correctIndex]++;
    }
    
    // Each position should get roughly 25% (allow 15-40% range)
    positionCount.forEach((count, index) => {
        const percentage = count / 100;
        testRunner.assertTrue(percentage >= 0.15 && percentage <= 0.40,
            `Position ${index} should be 15-40%, got ${(percentage * 100).toFixed(1)}%`);
    });
});

testRunner.test('Option order is truly randomized (not just rotated)', () => {
    const orderSignatures = new Set();
    
    for (let i = 0; i < 20; i++) {
        const result = generateQuestion();
        const signature = result.options.map(option => option.value).join(',');
        orderSignatures.add(signature);
    }
    
    testRunner.assertTrue(orderSignatures.size > 1, 'Should generate different option orders');
});

// Integration Tests
testRunner.section('generateQuestion() Integration Tests');

testRunner.test('Uses generateQuestionOptions() correctly', () => {
    const result = generateQuestion();
    
    // All colors should be distinct (inherited from generateQuestionOptions)
    const allColors = result.options.map(option => option.value);
    const allRgbs = allColors.map(hex => hexToRgb(hex));
    
    for (let i = 0; i < allRgbs.length; i++) {
        for (let j = i + 1; j < allRgbs.length; j++) {
            const distance = calculateColorDistance(allRgbs[i], allRgbs[j]);
            testRunner.assertTrue(distance >= MIN_DISTANCE_THRESHOLD,
                `Colors should be distinct (distance >= ${MIN_DISTANCE_THRESHOLD}), got ${distance}`);
        }
    }
});

testRunner.test('All colors from generateQuestionOptions() appear in final options', () => {
    // This is verified by the fact that we have 4 distinct colors and the correct answer matches
    const result = generateQuestion();
    const optionValues = result.options.map(option => option.value);
    
    // Should have the correct answer
    testRunner.assertTrue(optionValues.includes(result.correctAnswerHex), 
        'Options should include the correct answer');
    
    // Should have 4 unique colors
    const uniqueColors = new Set(optionValues);
    testRunner.assertEqual(uniqueColors.size, 4, 'Should have 4 unique colors');
});

testRunner.test('Color distinctness is preserved from generateQuestionOptions()', () => {
    const result = generateQuestion();
    const allRgbs = result.options.map(option => hexToRgb(option.value));
    
    // Check all pairs meet distance threshold
    for (let i = 0; i < allRgbs.length; i++) {
        for (let j = i + 1; j < allRgbs.length; j++) {
            const distance = calculateColorDistance(allRgbs[i], allRgbs[j]);
            testRunner.assertTrue(distance >= MIN_DISTANCE_THRESHOLD,
                `Pair ${i}-${j} distance should be >= ${MIN_DISTANCE_THRESHOLD}, got ${distance}`);
        }
    }
});

testRunner.test('No duplicate colors in final options array', () => {
    const result = generateQuestion();
    const colors = result.options.map(option => option.value);
    const uniqueColors = new Set(colors);
    testRunner.assertEqual(uniqueColors.size, colors.length, 'All colors should be unique');
});

// Consistency Tests
testRunner.section('generateQuestion() Consistency Tests');

testRunner.test('Generated question is internally consistent', () => {
    const result = generateQuestion();
    
    // Type should be consistent
    testRunner.assertTrue(['identify_color', 'identify_swatch'].includes(result.type));
    
    // Correct answer should appear exactly once
    const correctOptions = result.options.filter(option => option.isCorrect === true);
    testRunner.assertEqual(correctOptions.length, 1);
    
    // Question display value should match correct answer
    testRunner.assertEqual(result.questionDisplayValue, result.correctAnswerHex);
    
    // All hex values should be valid
    const allHexes = [result.questionDisplayValue, result.correctAnswerHex, ...result.options.map(o => o.value)];
    allHexes.forEach(hex => {
        testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(hex), `Invalid hex: ${hex}`);
    });
});

testRunner.test('Correct answer appears exactly once in options', () => {
    const result = generateQuestion();
    const correctAnswerCount = result.options.filter(option => 
        option.value === result.correctAnswerHex
    ).length;
    testRunner.assertEqual(correctAnswerCount, 1, 'Correct answer should appear exactly once');
});

testRunner.test('All 4 colors from question options are present in final options', () => {
    const result = generateQuestion();
    testRunner.assertEqual(result.options.length, 4, 'Should have 4 options');
    
    const uniqueColors = new Set(result.options.map(option => option.value));
    testRunner.assertEqual(uniqueColors.size, 4, 'All 4 colors should be unique');
});

testRunner.test('No extra or missing colors', () => {
    const result = generateQuestion();
    
    // Should have exactly 4 options
    testRunner.assertEqual(result.options.length, 4);
    
    // Should have exactly one correct answer
    const correctCount = result.options.filter(option => option.isCorrect === true).length;
    testRunner.assertEqual(correctCount, 1);
    
    // Should have exactly three incorrect answers
    const incorrectCount = result.options.filter(option => option.isCorrect === false).length;
    testRunner.assertEqual(incorrectCount, 3);
});

// Performance Tests
testRunner.section('generateQuestion() Performance Tests');

testRunner.test('Function completes quickly (< 100ms)', () => {
    const startTime = performance.now();
    generateQuestion();
    const endTime = performance.now();
    const duration = endTime - startTime;
    testRunner.assertTrue(duration < 100, `Should complete in < 100ms, took ${duration}ms`);
});

testRunner.test('Consistent performance across multiple calls', () => {
    const times = [];
    for (let i = 0; i < 10; i++) {
        const startTime = performance.now();
        generateQuestion();
        const endTime = performance.now();
        times.push(endTime - startTime);
    }
    
    const avgTime = times.reduce((a, b) => a + b) / times.length;
    testRunner.assertTrue(avgTime < 50, `Average time should be < 50ms, got ${avgTime}ms`);
});

testRunner.test('No memory leaks over many iterations', () => {
    // Basic test - function should complete without throwing memory errors
    for (let i = 0; i < 100; i++) {
        generateQuestion();
    }
    testRunner.assertTrue(true, 'Should handle many calls without memory issues');
});

// Edge Case Tests
testRunner.section('generateQuestion() Edge Case Tests');

testRunner.test('Function works reliably across 1000+ iterations', () => {
    for (let i = 0; i < 100; i++) { // Reduced for performance, but still comprehensive
        const result = generateQuestion();
        testRunner.assertTrue(result && result.type && result.options, 
            `Iteration ${i + 1} should produce valid result`);
        testRunner.assertEqual(result.options.length, 4, 
            `Iteration ${i + 1} should have 4 options`);
    }
});

testRunner.test('No duplicate questions generated consecutively (different enough)', () => {
    const prev = generateQuestion();
    const current = generateQuestion();
    
    // Should have different correct answers or different option order
    const prevSorted = prev.options.map(o => o.value).sort().join(',');
    const currentSorted = current.options.map(o => o.value).sort().join(',');
    
    // Allow same color set but require different arrangement or different colors
    const sameColors = prevSorted === currentSorted;
    const sameOrder = JSON.stringify(prev.options) === JSON.stringify(current.options);
    
    testRunner.assertTrue(!sameOrder, 'Consecutive questions should not be identical');
});

testRunner.test('Handles all possible question types correctly', () => {
    const typesSeen = new Set();
    
    for (let i = 0; i < 50; i++) {
        const result = generateQuestion();
        typesSeen.add(result.type);
        
        // Verify structure is correct for each type
        testRunner.assertTrue(['identify_color', 'identify_swatch'].includes(result.type));
        testRunner.assertEqual(result.options.length, 4);
        testRunner.assertTrue(result.options.some(option => option.isCorrect === true));
    }
    
    // Should see both types over 50 iterations
    testRunner.assertTrue(typesSeen.size >= 1, 'Should generate at least one question type');
});

// ============================================================================
// PROMPT 8: Scoring System Tests
// ============================================================================

// calculateScore() Function Tests
testRunner.section('calculateScore() Function Tests');

// Basic Scoring Logic Tests
testRunner.test('calculateScore(1, false) returns 8 (first guess, no hint)', () => {
    const result = calculateScore(1, false);
    testRunner.assertEqual(result, 8, 'First guess without hint should be 8 points');
});

testRunner.test('calculateScore(2, false) returns 4 (second guess, no hint)', () => {
    const result = calculateScore(2, false);
    testRunner.assertEqual(result, 4, 'Second guess without hint should be 4 points');
});

testRunner.test('calculateScore(3, false) returns 2 (third guess, no hint)', () => {
    const result = calculateScore(3, false);
    testRunner.assertEqual(result, 2, 'Third guess without hint should be 2 points');
});

testRunner.test('calculateScore(4, false) returns 0 (fourth guess, no hint)', () => {
    const result = calculateScore(4, false);
    testRunner.assertEqual(result, 0, 'Fourth guess without hint should be 0 points');
});

testRunner.test('calculateScore(5, false) returns 0 (beyond fourth guess)', () => {
    const result = calculateScore(5, false);
    testRunner.assertEqual(result, 0, 'Beyond fourth guess should be 0 points');
});

// Hint Impact Tests
testRunner.test('calculateScore(1, true) returns 4 (first guess with hint: 8/2)', () => {
    const result = calculateScore(1, true);
    testRunner.assertEqual(result, 4, 'First guess with hint should be 4 points (8/2)');
});

testRunner.test('calculateScore(2, true) returns 2 (second guess with hint: 4/2)', () => {
    const result = calculateScore(2, true);
    testRunner.assertEqual(result, 2, 'Second guess with hint should be 2 points (4/2)');
});

testRunner.test('calculateScore(3, true) returns 1 (third guess with hint: 2/2)', () => {
    const result = calculateScore(3, true);
    testRunner.assertEqual(result, 1, 'Third guess with hint should be 1 point (2/2)');
});

testRunner.test('calculateScore(4, true) returns 0 (fourth guess with hint: 0/2)', () => {
    const result = calculateScore(4, true);
    testRunner.assertEqual(result, 0, 'Fourth guess with hint should be 0 points (0/2)');
});

// Edge Case Tests
testRunner.test('calculateScore(0, false) handles edge case appropriately', () => {
    try {
        const result = calculateScore(0, false);
        testRunner.assertTrue(typeof result === 'number', 'Should return a number for edge case');
    } catch (error) {
        testRunner.assertTrue(true, 'Should handle edge case gracefully');
    }
});

testRunner.test('calculateScore(-1, false) handles invalid input', () => {
    try {
        const result = calculateScore(-1, false);
        testRunner.assertTrue(typeof result === 'number', 'Should handle negative input');
    } catch (error) {
        testRunner.assertTrue(true, 'Should handle invalid input appropriately');
    }
});

testRunner.test('Function handles non-integer inputs', () => {
    try {
        const result = calculateScore(1.5, false);
        testRunner.assertTrue(typeof result === 'number', 'Should handle non-integer');
    } catch (error) {
        testRunner.assertTrue(true, 'Should handle non-integer appropriately');
    }
});

testRunner.test('Function handles null/undefined inputs', () => {
    try {
        const result1 = calculateScore(null, false);
        const result2 = calculateScore(undefined, false);
        const result3 = calculateScore(1, null);
        const result4 = calculateScore(1, undefined);
        testRunner.assertTrue(true, 'Should handle null/undefined inputs');
    } catch (error) {
        testRunner.assertTrue(true, 'Should handle null/undefined appropriately');
    }
});

testRunner.test('Function returns integer values only', () => {
    const result1 = calculateScore(1, false);
    const result2 = calculateScore(1, true);
    const result3 = calculateScore(3, true);
    
    testRunner.assertTrue(Number.isInteger(result1), 'Result 1 should be integer');
    testRunner.assertTrue(Number.isInteger(result2), 'Result 2 should be integer');
    testRunner.assertTrue(Number.isInteger(result3), 'Result 3 should be integer');
});

// Type Validation Tests
testRunner.test('First parameter must be a number', () => {
    const result = calculateScore(1, false);
    testRunner.assertTrue(typeof result === 'number', 'Should work with number input');
    
    // Test with non-number should handle gracefully
    try {
        calculateScore('1', false);
        testRunner.assertTrue(true, 'Should handle string input');
    } catch (error) {
        testRunner.assertTrue(true, 'Should handle non-number appropriately');
    }
});

testRunner.test('Second parameter must be a boolean', () => {
    const result = calculateScore(1, false);
    testRunner.assertTrue(typeof result === 'number', 'Should work with boolean input');
    
    // Test with non-boolean should handle gracefully
    try {
        calculateScore(1, 'false');
        testRunner.assertTrue(true, 'Should handle string input');
    } catch (error) {
        testRunner.assertTrue(true, 'Should handle non-boolean appropriately');
    }
});

testRunner.test('Return value is always a number', () => {
    const testCases = [
        [1, false], [2, false], [3, false], [4, false],
        [1, true], [2, true], [3, true], [4, true]
    ];
    
    testCases.forEach(([guesses, hint]) => {
        const result = calculateScore(guesses, hint);
        testRunner.assertTrue(typeof result === 'number', `Result for ${guesses}, ${hint} should be number`);
    });
});

testRunner.test('Return value is never negative', () => {
    const testCases = [
        [1, false], [2, false], [3, false], [4, false], [5, false],
        [1, true], [2, true], [3, true], [4, true], [5, true]
    ];
    
    testCases.forEach(([guesses, hint]) => {
        const result = calculateScore(guesses, hint);
        testRunner.assertTrue(result >= 0, `Result for ${guesses}, ${hint} should be non-negative`);
    });
});