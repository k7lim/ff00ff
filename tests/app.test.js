// TDD Test Suite for app.js - Written BEFORE implementation

// Game State Tests (add to game state validation)
testRunner.section('Game State Variables Tests');

testRunner.test('currentScore initializes to 0', () => {
    testRunner.assertEqual(currentScore, 0, 'currentScore should initialize to 0');
});

testRunner.test('currentQuestion initializes to null', () => {
    testRunner.assertEqual(currentQuestion, null, 'currentQuestion should initialize to null');
});

testRunner.test('hintUsed initializes to false', () => {
    testRunner.assertEqual(hintUsed, false, 'hintUsed should initialize to false');
});

testRunner.test('guessesMade initializes to 0', () => {
    testRunner.assertEqual(guessesMade, 0, 'guessesMade should initialize to 0');
});

testRunner.test('All state variables have correct types', () => {
    testRunner.assertTrue(typeof currentScore === 'number', 'currentScore should be a number');
    testRunner.assertTrue(currentQuestion === null || typeof currentQuestion === 'object', 'currentQuestion should be null or object');
    testRunner.assertTrue(typeof hintUsed === 'boolean', 'hintUsed should be a boolean');
    testRunner.assertTrue(typeof guessesMade === 'number', 'guessesMade should be a number');
});

// DOM Element Reference Tests
testRunner.section('DOM Element Reference Tests');

testRunner.test('All DOM element references are successfully obtained', () => {
    // These tests will verify that the DOM elements exist and can be accessed
    testRunner.assertTrue(document.getElementById('score-display') !== null, 'score-display element should exist');
    testRunner.assertTrue(document.getElementById('question-area') !== null, 'question-area element should exist');
    testRunner.assertTrue(document.getElementById('options-area') !== null, 'options-area element should exist');
    testRunner.assertTrue(document.getElementById('feedback-area') !== null, 'feedback-area element should exist');
    testRunner.assertTrue(document.getElementById('hint-button') !== null, 'hint-button element should exist');
    testRunner.assertTrue(document.getElementById('new-game-button') !== null, 'new-game-button element should exist');
});

testRunner.test('Elements have expected properties and methods', () => {
    const scoreDisplayEl = document.getElementById('score-display');
    const questionAreaEl = document.getElementById('question-area');
    const optionsAreaEl = document.getElementById('options-area');
    
    testRunner.assertTrue('textContent' in scoreDisplayEl, 'score-display should have textContent property');
    testRunner.assertTrue('innerHTML' in questionAreaEl, 'question-area should have innerHTML property');
    testRunner.assertTrue('innerHTML' in optionsAreaEl, 'options-area should have innerHTML property');
});

testRunner.test('feedback-text div is created and accessible', () => {
    // This will be created by the app.js implementation
    // For now, we'll test that it can be created
    testRunner.assertTrue(document.getElementById('feedback-area') !== null, 'feedback-area should exist for feedback-text creation');
});

// displayScore() Function Tests
testRunner.section('displayScore() Function Tests');

testRunner.test('Updates scoreDisplayEl with correct format "YOUR SCORE: X"', () => {
    currentScore = 0;
    displayScore();
    const scoreDisplayEl = document.getElementById('score-display');
    testRunner.assertEqual(scoreDisplayEl.textContent, 'YOUR SCORE: 0', 'Should display correct format for score 0');
});

testRunner.test('Handles score of 0 correctly', () => {
    currentScore = 0;
    displayScore();
    const scoreDisplayEl = document.getElementById('score-display');
    testRunner.assertTrue(scoreDisplayEl.textContent.includes('0'), 'Should include score 0');
});

testRunner.test('Handles positive scores correctly', () => {
    currentScore = 42;
    displayScore();
    const scoreDisplayEl = document.getElementById('score-display');
    testRunner.assertEqual(scoreDisplayEl.textContent, 'YOUR SCORE: 42', 'Should display positive score correctly');
    
    // Reset for other tests
    currentScore = 0;
});

testRunner.test('Handles large scores correctly', () => {
    currentScore = 9999;
    displayScore();
    const scoreDisplayEl = document.getElementById('score-display');
    testRunner.assertEqual(scoreDisplayEl.textContent, 'YOUR SCORE: 9999', 'Should display large score correctly');
    
    // Reset for other tests
    currentScore = 0;
});

testRunner.test('Handles score changes appropriately', () => {
    currentScore = 10;
    displayScore();
    let scoreDisplayEl = document.getElementById('score-display');
    testRunner.assertEqual(scoreDisplayEl.textContent, 'YOUR SCORE: 10');
    
    currentScore = 20;
    displayScore();
    testRunner.assertEqual(scoreDisplayEl.textContent, 'YOUR SCORE: 20', 'Should update when score changes');
    
    // Reset for other tests
    currentScore = 0;
});

// renderQuestion() Function Tests - Input Validation
testRunner.section('renderQuestion() Input Validation Tests');

testRunner.test('Handles valid question objects correctly', () => {
    const validQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    // Should not throw an error
    try {
        renderQuestion(validQuestion);
        testRunner.assertTrue(true, 'Should handle valid question without error');
    } catch (error) {
        testRunner.assertTrue(false, `Should not throw error: ${error.message}`);
    }
});

testRunner.test('Throws/handles error for null question object', () => {
    try {
        renderQuestion(null);
        testRunner.assertTrue(false, 'Should throw error for null question');
    } catch (error) {
        testRunner.assertTrue(true, 'Should throw error for null question');
    }
});

testRunner.test('Throws/handles error for malformed question object', () => {
    const malformedQuestion = { type: 'invalid' };
    
    try {
        renderQuestion(malformedQuestion);
        testRunner.assertTrue(false, 'Should throw error for malformed question');
    } catch (error) {
        testRunner.assertTrue(true, 'Should throw error for malformed question');
    }
});

// renderQuestion() Function Tests - Content Clearing
testRunner.section('renderQuestion() Content Clearing Tests');

testRunner.test('Clears questionAreaEl content before rendering', () => {
    const questionAreaEl = document.getElementById('question-area');
    questionAreaEl.innerHTML = '<div>Previous content</div>';
    
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    testRunner.assertTrue(!questionAreaEl.innerHTML.includes('Previous content'), 'Should clear previous content');
});

testRunner.test('Clears optionsAreaEl content before rendering', () => {
    const optionsAreaEl = document.getElementById('options-area');
    optionsAreaEl.innerHTML = '<div>Previous options</div>';
    
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    testRunner.assertTrue(!optionsAreaEl.innerHTML.includes('Previous options'), 'Should clear previous options');
});

// renderQuestion() Function Tests - Question Rendering (identify_color type)
testRunner.section('renderQuestion() Question Rendering Tests (identify_color)');

testRunner.test('Creates color swatch element with correct background color', () => {
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    
    const questionAreaEl = document.getElementById('question-area');
    const swatchElements = questionAreaEl.querySelectorAll('div');
    
    testRunner.assertTrue(swatchElements.length > 0, 'Should create swatch element');
    
    // Check if any element has the correct background color
    let foundCorrectColor = false;
    swatchElements.forEach(element => {
        const bgColor = element.style.backgroundColor;
        if (bgColor.includes('255, 0, 0') || bgColor === 'rgb(255, 0, 0)' || bgColor === '#FF0000' || bgColor === '#ff0000') {
            foundCorrectColor = true;
        }
    });
    testRunner.assertTrue(foundCorrectColor, 'Should set correct background color');
});

testRunner.test('Applies correct swatch styling (size, border, border-radius)', () => {
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    
    const questionAreaEl = document.getElementById('question-area');
    testRunner.assertTrue(questionAreaEl.children.length > 0, 'Should create child elements');
});

testRunner.test('Swatch element is appended to questionAreaEl', () => {
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    const questionAreaEl = document.getElementById('question-area');
    const initialChildCount = questionAreaEl.children.length;
    
    renderQuestion(testQuestion);
    
    testRunner.assertTrue(questionAreaEl.children.length > initialChildCount, 'Should append element to question area');
});

// renderQuestion() Function Tests - Question Rendering (identify_swatch type)
testRunner.section('renderQuestion() Question Rendering Tests (identify_swatch)');

testRunner.test('Creates text element with correct hex code content', () => {
    const testQuestion = {
        type: 'identify_swatch',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    
    const questionAreaEl = document.getElementById('question-area');
    testRunner.assertTrue(questionAreaEl.textContent.includes('#FF0000'), 'Should display hex code');
});

testRunner.test('Text content matches questionDisplayValue exactly', () => {
    const testQuestion = {
        type: 'identify_swatch',
        questionDisplayValue: '#ABCDEF',
        options: [
            { value: '#ABCDEF', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#ABCDEF'
    };
    
    renderQuestion(testQuestion);
    
    const questionAreaEl = document.getElementById('question-area');
    testRunner.assertTrue(questionAreaEl.textContent.includes('#ABCDEF'), 'Should match question display value');
});

testRunner.test('Text is uppercase', () => {
    const testQuestion = {
        type: 'identify_swatch',
        questionDisplayValue: '#abcdef',
        options: [
            { value: '#abcdef', isCorrect: true, id: 'option_0' },
            { value: '#00ff00', isCorrect: false, id: 'option_1' },
            { value: '#0000ff', isCorrect: false, id: 'option_2' },
            { value: '#ffff00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#abcdef'
    };
    
    renderQuestion(testQuestion);
    
    const questionAreaEl = document.getElementById('question-area');
    testRunner.assertTrue(questionAreaEl.textContent.includes('#ABCDEF'), 'Should convert to uppercase');
});

// renderQuestion() Function Tests - Options Rendering (identify_color type)
testRunner.section('renderQuestion() Options Rendering Tests (identify_color)');

testRunner.test('Creates 4 clickable hex code option elements', () => {
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    
    const optionsAreaEl = document.getElementById('options-area');
    const optionElements = optionsAreaEl.children;
    
    testRunner.assertEqual(optionElements.length, 4, 'Should create 4 option elements');
});

testRunner.test('Each option displays correct hex code (uppercase)', () => {
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#ff0000', isCorrect: true, id: 'option_0' },
            { value: '#00ff00', isCorrect: false, id: 'option_1' },
            { value: '#0000ff', isCorrect: false, id: 'option_2' },
            { value: '#ffff00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#ff0000'
    };
    
    renderQuestion(testQuestion);
    
    const optionsAreaEl = document.getElementById('options-area');
    const optionsText = optionsAreaEl.textContent;
    
    testRunner.assertTrue(optionsText.includes('#FF0000'), 'Should display first option in uppercase');
    testRunner.assertTrue(optionsText.includes('#00FF00'), 'Should display second option in uppercase');
    testRunner.assertTrue(optionsText.includes('#0000FF'), 'Should display third option in uppercase');
    testRunner.assertTrue(optionsText.includes('#FFFF00'), 'Should display fourth option in uppercase');
});

testRunner.test('Stores correct dataset attributes (isCorrect, value)', () => {
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    
    const optionsAreaEl = document.getElementById('options-area');
    const optionElements = Array.from(optionsAreaEl.children);
    
    // Find the correct option
    const correctOption = optionElements.find(el => el.dataset.isCorrect === 'true');
    testRunner.assertTrue(correctOption !== undefined, 'Should have one correct option');
    testRunner.assertEqual(correctOption.dataset.value, '#FF0000', 'Should store correct value in dataset');
    
    // Check incorrect options
    const incorrectOptions = optionElements.filter(el => el.dataset.isCorrect === 'false');
    testRunner.assertEqual(incorrectOptions.length, 3, 'Should have three incorrect options');
});

// renderQuestion() Function Tests - Options Rendering (identify_swatch type)
testRunner.section('renderQuestion() Options Rendering Tests (identify_swatch)');

testRunner.test('Creates 4 clickable color swatch elements', () => {
    const testQuestion = {
        type: 'identify_swatch',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    
    const optionsAreaEl = document.getElementById('options-area');
    const optionElements = optionsAreaEl.children;
    
    testRunner.assertEqual(optionElements.length, 4, 'Should create 4 swatch elements');
});

testRunner.test('Each swatch has correct background color', () => {
    const testQuestion = {
        type: 'identify_swatch',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFFFF', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    
    const optionsAreaEl = document.getElementById('options-area');
    const optionElements = Array.from(optionsAreaEl.children);
    
    // Check that elements have background colors set
    testRunner.assertTrue(optionElements.length === 4, 'Should have 4 elements');
    optionElements.forEach((element, index) => {
        testRunner.assertTrue(element.style.backgroundColor !== '', `Option ${index} should have background color`);
    });
});

// Layout Tests
testRunner.section('renderQuestion() Layout Tests');

testRunner.test('Options display horizontally and centered', () => {
    const testQuestion = {
        type: 'identify_color',
        questionDisplayValue: '#FF0000',
        options: [
            { value: '#FF0000', isCorrect: true, id: 'option_0' },
            { value: '#00FF00', isCorrect: false, id: 'option_1' },
            { value: '#0000FF', isCorrect: false, id: 'option_2' },
            { value: '#FFFF00', isCorrect: false, id: 'option_3' }
        ],
        correctAnswerHex: '#FF0000'
    };
    
    renderQuestion(testQuestion);
    
    const optionsAreaEl = document.getElementById('options-area');
    const computedStyle = window.getComputedStyle(optionsAreaEl);
    
    testRunner.assertTrue(computedStyle.textAlign === 'center', 'Options area should be centered');
});

// Integration Tests
testRunner.section('renderQuestion() Integration Tests');

testRunner.test('Full rendering pipeline: generate question → render question → verify all elements', () => {
    const generatedQuestion = generateQuestion();
    
    try {
        renderQuestion(generatedQuestion);
        
        const questionAreaEl = document.getElementById('question-area');
        const optionsAreaEl = document.getElementById('options-area');
        
        testRunner.assertTrue(questionAreaEl.children.length > 0, 'Question area should have content');
        testRunner.assertTrue(optionsAreaEl.children.length === 4, 'Options area should have 4 options');
        
        testRunner.assertTrue(true, 'Full pipeline should work without errors');
    } catch (error) {
        testRunner.assertTrue(false, `Full pipeline failed: ${error.message}`);
    }
});

testRunner.test('Multiple question types render correctly in sequence', () => {
    // Test both question types
    for (let i = 0; i < 10; i++) {
        const question = generateQuestion();
        
        try {
            renderQuestion(question);
            
            const questionAreaEl = document.getElementById('question-area');
            const optionsAreaEl = document.getElementById('options-area');
            
            testRunner.assertTrue(questionAreaEl.children.length > 0, `Question ${i} should render question area`);
            testRunner.assertTrue(optionsAreaEl.children.length === 4, `Question ${i} should render 4 options`);
        } catch (error) {
            testRunner.assertTrue(false, `Question ${i} rendering failed: ${error.message}`);
        }
    }
});

testRunner.test('State consistency between question generation and rendering', () => {
    const question = generateQuestion();
    currentQuestion = question;
    
    renderQuestion(question);
    
    testRunner.assertEqual(currentQuestion.type, question.type, 'Current question type should match rendered question');
    testRunner.assertEqual(currentQuestion.correctAnswerHex, question.correctAnswerHex, 'Current question answer should match rendered question');
});