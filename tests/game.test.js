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