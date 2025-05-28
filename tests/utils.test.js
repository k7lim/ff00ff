// TDD Test Suite for utils.js - Written BEFORE implementation

// Unit Tests for generateRandomHexColor()
testRunner.section('generateRandomHexColor() Tests');

testRunner.test('Returns string starting with #', () => {
    const result = generateRandomHexColor();
    testRunner.assertTrue(typeof result === 'string', 'Should return a string');
    testRunner.assertTrue(result.startsWith('#'), 'Should start with #');
});

testRunner.test('Returns exactly 7 characters (# + 6 hex digits)', () => {
    const result = generateRandomHexColor();
    testRunner.assertEqual(result.length, 7, 'Should be exactly 7 characters');
});

testRunner.test('Only contains valid hex characters (0-9, A-F)', () => {
    const result = generateRandomHexColor();
    const hexPattern = /^#[0-9A-F]{6}$/;
    testRunner.assertTrue(hexPattern.test(result), `Should match hex pattern, got: ${result}`);
});

testRunner.test('Multiple calls return different values (randomness check)', () => {
    const results = new Set();
    for (let i = 0; i < 10; i++) {
        results.add(generateRandomHexColor());
    }
    testRunner.assertTrue(results.size > 1, 'Should generate different values');
});

testRunner.test('All returned values are valid hex colors', () => {
    for (let i = 0; i < 5; i++) {
        const result = generateRandomHexColor();
        testRunner.assertTrue(/^#[0-9A-F]{6}$/.test(result), `Invalid hex: ${result}`);
    }
});

testRunner.test('No parameters required', () => {
    testRunner.assertTrue(() => generateRandomHexColor(), 'Should work without parameters');
});

// Unit Tests for hexToRgb(hexString)
testRunner.section('hexToRgb() Tests');

testRunner.test('hexToRgb("#FF00FF") returns { r: 255, g: 0, b: 255 }', () => {
    const result = hexToRgb('#FF00FF');
    testRunner.assertEqual(result, { r: 255, g: 0, b: 255 });
});

testRunner.test('hexToRgb("00FF00") returns { r: 0, g: 255, b: 0 } (no # prefix)', () => {
    const result = hexToRgb('00FF00');
    testRunner.assertEqual(result, { r: 0, g: 255, b: 0 });
});

testRunner.test('hexToRgb("#000000") returns { r: 0, g: 0, b: 0 }', () => {
    const result = hexToRgb('#000000');
    testRunner.assertEqual(result, { r: 0, g: 0, b: 0 });
});

testRunner.test('hexToRgb("#FFFFFF") returns { r: 255, g: 255, b: 255 }', () => {
    const result = hexToRgb('#FFFFFF');
    testRunner.assertEqual(result, { r: 255, g: 255, b: 255 });
});

testRunner.test('hexToRgb("#123ABC") returns { r: 18, g: 58, b: 188 }', () => {
    const result = hexToRgb('#123ABC');
    testRunner.assertEqual(result, { r: 18, g: 58, b: 188 });
});

testRunner.test('Invalid hex string should throw error', () => {
    testRunner.assertThrows(() => hexToRgb('invalid'), 'Should throw for invalid hex');
    testRunner.assertThrows(() => hexToRgb('#GG0000'), 'Should throw for invalid characters');
});

testRunner.test('Wrong length string should throw error', () => {
    testRunner.assertThrows(() => hexToRgb('#FF'), 'Should throw for short hex');
    testRunner.assertThrows(() => hexToRgb('#FF00FF00'), 'Should throw for long hex');
});

testRunner.test('Non-hex characters should throw error', () => {
    testRunner.assertThrows(() => hexToRgb('#GGGGGG'), 'Should throw for invalid characters');
});

// Unit Tests for calculateColorDistance(rgb1, rgb2)
testRunner.section('calculateColorDistance() Tests');

testRunner.test('calculateColorDistance({ r: 255, g: 0, b: 0 }, { r: 250, g: 5, b: 10 }) returns 20', () => {
    const result = calculateColorDistance({ r: 255, g: 0, b: 0 }, { r: 250, g: 5, b: 10 });
    testRunner.assertEqual(result, 20);
});

testRunner.test('calculateColorDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) returns 765 (max distance)', () => {
    const result = calculateColorDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
    testRunner.assertEqual(result, 765);
});

testRunner.test('calculateColorDistance({ r: 100, g: 100, b: 100 }, { r: 100, g: 100, b: 100 }) returns 0 (identical colors)', () => {
    const result = calculateColorDistance({ r: 100, g: 100, b: 100 }, { r: 100, g: 100, b: 100 });
    testRunner.assertEqual(result, 0);
});

testRunner.test('calculateColorDistance({ r: 128, g: 64, b: 192 }, { r: 130, g: 60, b: 200 }) returns 14', () => {
    const result = calculateColorDistance({ r: 128, g: 64, b: 192 }, { r: 130, g: 60, b: 200 });
    testRunner.assertEqual(result, 14);
});

testRunner.test('Invalid RGB object should throw error', () => {
    testRunner.assertThrows(() => calculateColorDistance(null, { r: 100, g: 100, b: 100 }), 'Should throw for null');
    testRunner.assertThrows(() => calculateColorDistance({ r: 100 }, { r: 100, g: 100, b: 100 }), 'Should throw for incomplete RGB');
});

testRunner.test('RGB values outside 0-255 range should throw error', () => {
    testRunner.assertThrows(() => calculateColorDistance({ r: -1, g: 100, b: 100 }, { r: 100, g: 100, b: 100 }), 'Should throw for negative values');
    testRunner.assertThrows(() => calculateColorDistance({ r: 100, g: 100, b: 100 }, { r: 256, g: 100, b: 100 }), 'Should throw for values > 255');
});

// Integration Tests
testRunner.section('Integration Tests');

testRunner.test('Generate random hex, convert to RGB, distance to itself is 0', () => {
    const hex = generateRandomHexColor();
    const rgb = hexToRgb(hex);
    const distance = calculateColorDistance(rgb, rgb);
    testRunner.assertEqual(distance, 0);
});

testRunner.test('Generate two random hex colors, convert both to RGB, calculate distance', () => {
    const hex1 = generateRandomHexColor();
    const hex2 = generateRandomHexColor();
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const distance = calculateColorDistance(rgb1, rgb2);
    testRunner.assertTrue(typeof distance === 'number' && distance >= 0, 'Distance should be a non-negative number');
});

testRunner.test('Chain all functions together in realistic usage scenario', () => {
    const hex1 = generateRandomHexColor();
    const hex2 = generateRandomHexColor();
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    const distance = calculateColorDistance(rgb1, rgb2);
    
    testRunner.assertTrue(typeof hex1 === 'string' && hex1.length === 7, 'First hex should be valid');
    testRunner.assertTrue(typeof hex2 === 'string' && hex2.length === 7, 'Second hex should be valid');
    testRunner.assertTrue(typeof rgb1 === 'object' && 'r' in rgb1 && 'g' in rgb1 && 'b' in rgb1, 'First RGB should be valid');
    testRunner.assertTrue(typeof rgb2 === 'object' && 'r' in rgb2 && 'g' in rgb2 && 'b' in rgb2, 'Second RGB should be valid');
    testRunner.assertTrue(typeof distance === 'number' && distance >= 0, 'Distance should be valid');
});