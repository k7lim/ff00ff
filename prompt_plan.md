### Prompt Series for LLM Code Generation

**Project Setup & File Structure:**

I'll assume you'll create the following file structure:

```
hexvex/
├── index.html
├── style.css
├── app.js
├── utils.js
└── game.js
```

Let's start with the foundational elements.

---

**Prompt 1: Basic HTML and CSS Setup** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
We are starting a new project called HexVex, a hex color quiz game.

**Task:** Create the basic HTML structure and initial CSS.

**`index.html` requirements:**
1.  Standard HTML5 boilerplate.
2.  Title: "HexVex - Color Quiz".
3.  Link to `style.css`.
4.  Include placeholders for the main UI areas:
    *   A `div` with id `score-display` (e.g., "YOUR SCORE: 0").
    *   A `div` with id `question-area` (for the large swatch or hex code).
    *   A `div` with id `options-area` (for the clickable options).
    *   A `div` with id `feedback-area` (for messages and controls).
    *   Inside `feedback-area`, include a button with id `hint-button` ("Show Hint").
    *   Inside `feedback-area`, include a button with id `new-game-button` ("NEW GAME"), initially hidden.
5.  Link to `app.js`, `utils.js`, and `game.js` at the end of the `<body>` (defer `app.js` if possible, or ensure order is `utils.js`, `game.js`, then `app.js`).

**`style.css` requirements:**
1.  A simple CSS reset (e.g., `* { margin: 0; padding: 0; box-sizing: border-box; }`).
2.  Style `body` with `font-family: Arial, sans-serif;` and `background-color: #FFFFFF;`.
3.  Initially hide the `new-game-button` (`display: none;`).
4.  Add some temporary visible borders or background colors to `score-display`, `question-area`, `options-area`, and `feedback-area` so we can see their layout during early development.

**No JavaScript functionality is needed in this step.**
```

---

**Prompt 2: Core Color Utilities with TDD Test Suite** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
Following TDD principles, we'll write comprehensive tests BEFORE implementing the color utility functions.

**Task:** Create test files and implement core color utilities using TDD.

**File Structure to Create:**
```
hexvex/
├── tests/
│   ├── utils.test.js
│   ├── game.test.js
│   └── test-runner.html
├── utils.js
├── game.js
└── app.js
```

**Step 1: Create Test Infrastructure**

**`tests/test-runner.html` requirements:**
1.  Basic HTML page that loads all test files
2.  Simple test framework or use browser's console for output
3.  Include all source files (utils.js, game.js) and test files
4.  Display test results clearly (pass/fail counts, specific failures)

**Step 2: Write Failing Tests First**

**`tests/utils.test.js` requirements:**

**Unit Tests for `generateRandomHexColor()`:**
*   Test: Returns string starting with '#'
*   Test: Returns exactly 7 characters (# + 6 hex digits)
*   Test: Only contains valid hex characters (0-9, A-F)
*   Test: Multiple calls return different values (randomness check)
*   Test: All returned values are valid hex colors
*   Edge case: No parameters required

**Unit Tests for `hexToRgb(hexString)`:**
*   Test: `hexToRgb("#FF00FF")` returns `{ r: 255, g: 0, b: 255 }`
*   Test: `hexToRgb("00FF00")` returns `{ r: 0, g: 255, b: 0 }` (no # prefix)
*   Test: `hexToRgb("#000000")` returns `{ r: 0, g: 0, b: 0 }`
*   Test: `hexToRgb("#FFFFFF")` returns `{ r: 255, g: 255, b: 255 }`
*   Test: `hexToRgb("#123ABC")` returns `{ r: 18, g: 58, b: 188 }`
*   Error case: Invalid hex string should throw error or return null
*   Error case: Wrong length string should throw error or return null
*   Error case: Non-hex characters should throw error or return null

**Unit Tests for `calculateColorDistance(rgb1, rgb2)`:**
*   Test: `calculateColorDistance({ r: 255, g: 0, b: 0 }, { r: 250, g: 5, b: 10 })` returns 20
*   Test: `calculateColorDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })` returns 765 (max distance)
*   Test: `calculateColorDistance({ r: 100, g: 100, b: 100 }, { r: 100, g: 100, b: 100 })` returns 0 (identical colors)
*   Test: `calculateColorDistance({ r: 128, g: 64, b: 192 }, { r: 130, g: 60, b: 200 })` returns 14
*   Error case: Invalid RGB object should throw error
*   Error case: RGB values outside 0-255 range should throw error or clamp

**Integration Tests:**
*   Test: Generate random hex, convert to RGB, distance to itself is 0
*   Test: Generate two random hex colors, convert both to RGB, calculate distance
*   Test: Chain all functions together in realistic usage scenario

**Step 3: Implement Functions to Pass Tests**

**`utils.js` requirements:**
1.  Implement functions to make ALL tests pass
2.  Add proper error handling as defined by tests
3.  Include 2-line ABOUTME comment at top of file
4.  Use TDD cycle: write minimal code to pass each test, then refactor

**Step 4: Test Execution and Verification**
*   Run all tests and verify 100% pass rate
*   Test output must be pristine (no console errors, warnings, or unexpected output)
*   Document any test failures and fix implementation accordingly
*   Ensure functions are globally accessible for other modules

**Testing Commands:**
*   Open `tests/test-runner.html` in browser
*   All tests should pass with green indicators
*   Console should show detailed test results
*   Any failures should show expected vs actual values clearly
```

---

**Prompt 3: Question Generation Logic with TDD Test Suite** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
Following TDD principles, we'll write comprehensive tests BEFORE implementing the question generation logic.

**Task:** Write tests first, then implement question generation functions using TDD.

**Step 1: Write Failing Tests First**

**`tests/game.test.js` requirements:**

**Unit Tests for `MIN_DISTANCE_THRESHOLD` Constant:**
*   Test: Constant is defined and equals 75
*   Test: Constant is a number type
*   Test: Constant is not modifiable (if using const)

**Unit Tests for `generateQuestionOptions()` function:**

**Return Value Structure Tests:**
*   Test: Returns an object with `correctHex` and `distractors` properties
*   Test: `correctHex` is a valid hex string (starts with #, 7 characters, valid hex)
*   Test: `distractors` is an array with exactly 3 elements
*   Test: All distractor elements are valid hex strings
*   Test: `correctHex` is different from all distractors
*   Test: All distractors are different from each other

**Color Distinctness Tests (Critical):**
*   Test: Distance between correct color and each distractor >= 75
*   Test: Distance between each pair of distractors >= 75  
*   Test: All 6 unique pairs meet the distance threshold
*   Test: Function eventually succeeds even with difficult color combinations
*   Test: Maximum regeneration attempts don't exceed reasonable limit (e.g., 100 tries)

**Randomness Tests:**
*   Test: Multiple calls return different correct colors
*   Test: Multiple calls return different distractor sets
*   Test: Color distribution appears random (not clustered)

**Performance Tests:**
*   Test: Function completes within reasonable time (< 1 second)
*   Test: Regeneration loop doesn't run excessively (log warnings for > 10 attempts)
*   Test: Memory usage doesn't grow excessively during regeneration

**Integration Tests with Utils:**
*   Test: Uses `generateRandomHexColor()` correctly
*   Test: Uses `hexToRgb()` correctly
*   Test: Uses `calculateColorDistance()` correctly
*   Test: All utils functions are called with valid parameters

**Edge Case Tests:**
*   Test: Function works consistently across 100+ iterations
*   Test: No infinite loops occur (add timeout protection)
*   Test: Handles extreme color values (very dark, very bright)

**Step 2: Implement Functions to Pass Tests**

**`game.js` requirements:**

1.  **Add ABOUTME comment** (2 lines describing the file's purpose)

2.  **`MIN_DISTANCE_THRESHOLD` Constant:**
    *   Define as `const MIN_DISTANCE_THRESHOLD = 75;`

3.  **`generateQuestionOptions()` function:**
    *   Implement the exact regeneration logic specified in the spec
    *   Add safety mechanisms (max iterations, timeout protection)
    *   Add performance logging for regeneration attempts > 10
    *   Ensure all tests pass with pristine output

**Step 3: Test-Driven Implementation Process**

1.  **Red Phase:** Write failing tests first
2.  **Green Phase:** Write minimal code to pass each test
3.  **Refactor Phase:** Improve code while keeping tests green
4.  **Repeat:** For each new test case

**Step 4: Comprehensive Test Execution**

**Testing Commands:**
*   Run all utils tests (should still pass)
*   Run all game tests 
*   Execute integration tests combining both modules
*   Performance test: Run `generateQuestionOptions()` 1000 times, verify consistency
*   Stress test: Ensure no memory leaks or infinite loops

**Success Criteria:**
*   100% test pass rate
*   No console errors, warnings, or unexpected output
*   All 6 color pair distances >= 75 in every generated question
*   Function completes reliably within performance bounds
*   Logging shows regeneration efficiency (warn if > 10 attempts)

**Error Handling Tests:**
*   Test: Function handles edge cases gracefully
*   Test: Invalid utility function responses are handled
*   Test: Memory constraints don't cause crashes
```

---

**Prompt 4: Full Question Object Generation with TDD Test Suite** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
Following TDD principles, we'll write comprehensive tests BEFORE implementing the full question generation logic.

**Task:** Write tests first, then implement `generateQuestion()` using TDD.

**Step 1: Write Failing Tests First**

**Add to `tests/game.test.js`:**

**Unit Tests for `generateQuestion()` function:**

**Return Object Structure Tests:**
*   Test: Returns object with required properties: `type`, `questionDisplayValue`, `options`, `correctAnswerHex`
*   Test: `type` is either `'identify_color'` or `'identify_swatch'`
*   Test: `questionDisplayValue` is a valid hex string (starts with #, 7 chars, valid hex)
*   Test: `correctAnswerHex` is a valid hex string
*   Test: `questionDisplayValue` equals `correctAnswerHex`
*   Test: `options` is an array with exactly 4 elements

**Options Array Tests:**
*   Test: Each option has `value`, `isCorrect`, and `id` properties
*   Test: All option `value` properties are valid hex strings
*   Test: Exactly one option has `isCorrect: true`
*   Test: Three options have `isCorrect: false`
*   Test: The correct option's `value` matches `correctAnswerHex`
*   Test: All option `id` values are unique
*   Test: Option `id` values follow expected format (e.g., "option_0", "option_1", etc.)

**Randomization Tests:**
*   Test: Question type distribution is approximately 50/50 over 100 iterations
*   Test: Correct answer position varies across multiple generations
*   Test: Each position (0,1,2,3) gets the correct answer roughly equally over 100 iterations
*   Test: Option order is truly randomized (not just rotated)

**Integration Tests:**
*   Test: Uses `generateQuestionOptions()` correctly
*   Test: All colors from `generateQuestionOptions()` appear in final options
*   Test: Color distinctness is preserved from `generateQuestionOptions()`
*   Test: No duplicate colors in final options array

**Consistency Tests:**
*   Test: Generated question is internally consistent
*   Test: Correct answer appears exactly once in options
*   Test: All 4 colors from question options are present in final options
*   Test: No extra or missing colors

**Performance Tests:**
*   Test: Function completes quickly (< 100ms)
*   Test: Consistent performance across multiple calls
*   Test: No memory leaks over many iterations

**Edge Case Tests:**
*   Test: Function works reliably across 1000+ iterations
*   Test: No duplicate questions generated consecutively (different enough)
*   Test: Handles all possible question types correctly

**Step 2: Implement Shuffle Algorithm Tests**

**Shuffle Function Tests (if implementing separate shuffle):**
*   Test: Array length remains the same after shuffle
*   Test: All original elements are preserved
*   Test: Order is actually changed (not identity shuffle)
*   Test: Distribution is approximately uniform over many shuffles
*   Test: Works with different array sizes
*   Test: Handles edge cases (empty array, single element)

**Step 3: Implement Functions to Pass Tests**

**`game.js` requirements:**

1.  **`generateQuestion()` function implementation:**
    *   Determine question type with proper randomization
    *   Call `generateQuestionOptions()` for color data
    *   Build options array with correct structure
    *   Implement proper shuffling algorithm (Fisher-Yates recommended)
    *   Add unique IDs to each option
    *   Return properly structured question object

2.  **Shuffling implementation:**
    *   Use proper randomization (not Math.random() sort)
    *   Ensure uniform distribution
    *   Test shuffling function independently

**Step 4: Test-Driven Implementation Process**

1.  **Red Phase:** Write all failing tests for question generation
2.  **Green Phase:** Implement minimal code to pass tests
3.  **Refactor Phase:** Optimize while keeping tests green
4.  **Integration Phase:** Ensure compatibility with existing functions

**Step 5: Comprehensive Test Execution**

**Testing Commands:**
*   Run all previous tests (utils, game options) - should still pass
*   Run new generateQuestion tests
*   Statistical validation: Generate 1000 questions, verify randomization
*   Integration test: Full pipeline from utils → options → question

**Success Criteria:**
*   100% test pass rate
*   Statistical randomization validation passes
*   No console errors or warnings
*   All questions have distinct color options (distance >= 75)
*   Question types distributed 50/50 (±5%) over large samples
*   Correct answer positions distributed evenly (±5%) over large samples

**Validation Tests:**
*   Generate 1000 questions and verify:
    *   Type distribution: ~500 identify_color, ~500 identify_swatch
    *   Position distribution: ~250 correct answers at each position
    *   No duplicate question structures
    *   All color distance requirements met
```

---

**Prompt 5: Game State and Basic UI Rendering with TDD Test Suite** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
Following TDD principles, we'll write comprehensive tests for UI rendering and state management BEFORE implementation.

**Task:** Write tests first, then implement game state and UI rendering using TDD.

**Step 1: Create UI Test Infrastructure**

**`tests/app.test.js` requirements:**

**DOM Setup Tests:**
*   Test: All required DOM elements exist in index.html
*   Test: DOM elements have correct IDs and structure
*   Test: Elements can be successfully queried with getElementById
*   Test: `feedback-text` div is created and accessible
*   Test: DOM elements have appropriate initial states (visibility, content)

**Step 2: Write Failing Tests First**

**Game State Tests (add to `tests/game.test.js`):**
*   Test: `currentScore` initializes to 0
*   Test: `currentQuestion` initializes to null
*   Test: `hintUsed` initializes to false
*   Test: `guessesMade` initializes to 0
*   Test: All state variables have correct types
*   Test: State variables are accessible globally

**DOM Element Reference Tests:**
*   Test: All DOM element references are successfully obtained
*   Test: Element references are not null/undefined
*   Test: Elements have expected properties and methods
*   Test: Error handling when elements don't exist

**`displayScore()` Function Tests:**
*   Test: Updates scoreDisplayEl with correct format "YOUR SCORE: X"
*   Test: Handles score of 0 correctly
*   Test: Handles positive scores correctly
*   Test: Handles large scores correctly
*   Test: Handles score changes appropriately
*   Test: No console errors during execution

**`renderQuestion()` Function Tests:**

**Input Validation Tests:**
*   Test: Handles valid question objects correctly
*   Test: Throws/handles error for null question object
*   Test: Throws/handles error for malformed question object
*   Test: Validates question object structure before rendering

**Content Clearing Tests:**
*   Test: Clears questionAreaEl content before rendering
*   Test: Clears optionsAreaEl content before rendering
*   Test: Preserves other DOM elements during clearing

**Question Rendering Tests (identify_color type):**
*   Test: Creates color swatch element with correct background color
*   Test: Applies correct swatch styling (size, border, border-radius)
*   Test: Swatch element is appended to questionAreaEl
*   Test: Swatch color matches questionDisplayValue exactly
*   Test: No extra elements created in questionAreaEl

**Question Rendering Tests (identify_swatch type):**
*   Test: Creates text element with correct hex code content
*   Test: Text content matches questionDisplayValue exactly
*   Test: Applies correct text styling (font-size, family, weight, transform)
*   Test: Applies text-shadow for readability
*   Test: Text element is appended to questionAreaEl
*   Test: Text is uppercase

**Options Rendering Tests (identify_color type):**
*   Test: Creates 4 clickable hex code option elements
*   Test: Each option displays correct hex code (uppercase)
*   Test: Applies correct option styling (padding, margin, font)
*   Test: Stores correct dataset attributes (isCorrect, value)
*   Test: All options appended to optionsAreaEl
*   Test: Text-shadow applied to hex code options

**Options Rendering Tests (identify_swatch type):**
*   Test: Creates 4 clickable color swatch elements
*   Test: Each swatch has correct background color
*   Test: Applies correct swatch styling (size, border, cursor)
*   Test: Stores correct dataset attributes (isCorrect, value)
*   Test: All swatches appended to optionsAreaEl
*   Test: Swatches display inline-block and centered

**Layout Tests:**
*   Test: Options display horizontally and centered
*   Test: Proper spacing between option elements
*   Test: Elements don't overlap or overflow containers
*   Test: Responsive behavior within container bounds

**Dataset Attribute Tests:**
*   Test: isCorrect dataset contains boolean values
*   Test: value dataset contains correct hex strings
*   Test: Dataset attributes are retrievable via JavaScript
*   Test: Correct option has isCorrect="true"
*   Test: Distractor options have isCorrect="false"

**Step 3: Create Integration Tests**

**Full Rendering Pipeline Tests:**
*   Test: Generate question → render question → verify all elements
*   Test: Multiple question types render correctly in sequence
*   Test: State consistency between question generation and rendering
*   Test: Performance with rapid re-rendering

**Step 4: Implement Functions to Pass Tests**

**`game.js` state variables:**
*   Initialize all state variables with correct types and values
*   Add ABOUTME comment describing game state management

**`app.js` implementation:**
*   Add ABOUTME comment describing UI rendering responsibilities
*   Implement DOM element acquisition with error handling
*   Implement `displayScore()` with proper formatting
*   Implement `renderQuestion()` with comprehensive rendering logic
*   Add defensive programming for edge cases

**Step 5: End-to-End UI Tests**

**Browser Integration Tests:**
*   Test: Load index.html and verify no console errors
*   Test: Generate and render sample question visually
*   Test: Verify styling matches specification requirements
*   Test: Inspect generated DOM elements and dataset attributes
*   Test: Score display shows "YOUR SCORE: 0" initially

**Visual Verification Tests:**
*   Test: Color swatches render as perfect circles
*   Test: Hex codes display with proper text stroke/shadow
*   Test: Layout is centered and visually appealing
*   Test: Options are clearly clickable and distinguishable
*   Test: Consistent styling across question types

**Success Criteria:**
*   100% test pass rate
*   No console errors in browser
*   Visual elements match specification exactly
*   All DOM manipulations work correctly
*   Proper dataset attributes for future interaction
*   Clean, maintainable code following TDD principles
```

---

**Prompt 6: Initial Game Loop and First Question on Load** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
The UI can now render a question. Let's set up the game to load the first question automatically and prepare for handling answers.

**Task:** Implement the `startNewQuestion` function and initialize the game on page load.

**`app.js` requirements:**

1.  **`startNewQuestion()` function:**
    *   This function will set up and display a new question.
    *   **Steps:**
        1.  `currentQuestion = generateQuestion();`
        2.  `hintUsed = false;`
        3.  `guessesMade = 0;`
        4.  Call `renderQuestion(currentQuestion)`.
        5.  Update `feedbackTextEl.textContent` with instructional text based on `currentQuestion.type` (e.g., "Which hex code matches this color?").
        6.  Ensure `hintButtonEl` is visible, active, and text is "Show Hint".
        7.  Ensure `newGameButtonEl` is hidden.
        8.  (Later, we'll add logic to attach event listeners).

2.  **`initGame()` function (or directly at the end of `app.js`):**
    *   Call `displayScore()` to show the initial score of 0.
    *   Call `startNewQuestion()` to load and display the first question.

3.  **Execution:** Call `initGame()` when the script loads.

**Testing:**
*   Refresh `index.html` in the browser.
*   Verify: A random question loads immediately, score is "0", correct instructions appear, "Show Hint" is visible, and "NEW GAME" is hidden. The temporary layout borders from Prompt 1 can now be removed from `style.css`.
```

---

**Prompt 7: Handling User Guesses (No Scoring Yet, Basic Feedback)** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
The game starts with a question. Now let's make the options clickable and provide basic feedback.

**Task:** Add event listeners to options and implement `handleGuess` for basic correct/incorrect logic.

**`app.js` requirements:**

1.  **Modify `renderQuestion(questionObj)`:**
    *   When creating each option element, add a `'click'` event listener.
    *   The listener should call a new function, `handleGuess(event, optionData)`.
    *   Example: `el.addEventListener('click', (event) => handleGuess(event, optionData));`

2.  **`handleGuess(event, chosenOptionData)` function:**
    *   `chosenOptionData` is the `{ value, isCorrect }` object for the clicked option.
    *   Define a state variable `questionOver = false;` in the main scope, reset to `false` in `startNewQuestion`, and set to `true` when the question is answered. Return from `handleGuess` if `questionOver` is true.
    *   Increment `guessesMade`.
    *   Let `clickedElement = event.currentTarget;`.
    *   If `chosenOptionData.isCorrect`:
        *   Set `feedbackTextEl.textContent = "CORRECT! (Score/Next feature pending)";`
        *   Show `newGameButtonEl`.
        *   Disable the `hintButtonEl`.
        *   Set `questionOver = true`.
    *   Else (incorrect guess):
        *   Set `feedbackTextEl.textContent = \`TRY AGAIN. You picked ${chosenOptionData.value}. (Removal pending)\`;`
        *   Remove the `clickedElement` (`clickedElement.remove();`).
        *   If `guessesMade === 3`:
            *   Set `feedbackTextEl.textContent = "ALL WRONG! The correct answer was [CorrectAnswerValue]. (Score/Next feature pending)";`
            *   Show `newGameButtonEl`.
            *   Set `questionOver = true`.

**Testing:**
*   Refresh `index.html`.
*   Click on an option:
    *   If correct: See "CORRECT!" message, "NEW GAME" appears.
    *   If incorrect: See "TRY AGAIN..." message, the clicked option is removed.
    *   After 3 incorrect guesses: See "ALL WRONG!" message, "NEW GAME" appears.
*   Ensure options are not clickable after the question is over.
```

---

**Prompt 8: Scoring System Implementation with TDD Test Suite** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
Following TDD principles, we'll write comprehensive tests for the scoring system BEFORE implementation.

**Task:** Write tests first, then implement scoring logic using TDD.

**Step 1: Write Failing Tests First**

**Add to `tests/game.test.js`:**

**`calculateScore()` Function Tests:**

**Basic Scoring Logic Tests:**
*   Test: `calculateScore(1, false)` returns 8 (first guess, no hint)
*   Test: `calculateScore(2, false)` returns 4 (second guess, no hint)
*   Test: `calculateScore(3, false)` returns 2 (third guess, no hint)
*   Test: `calculateScore(4, false)` returns 0 (fourth guess, no hint)
*   Test: `calculateScore(5, false)` returns 0 (beyond fourth guess)

**Hint Impact Tests:**
*   Test: `calculateScore(1, true)` returns 4 (first guess with hint: 8/2)
*   Test: `calculateScore(2, true)` returns 2 (second guess with hint: 4/2)
*   Test: `calculateScore(3, true)` returns 1 (third guess with hint: 2/2)
*   Test: `calculateScore(4, true)` returns 0 (fourth guess with hint: 0/2)

**Edge Case Tests:**
*   Test: `calculateScore(0, false)` handles edge case appropriately
*   Test: `calculateScore(-1, false)` handles invalid input
*   Test: Function handles non-integer inputs
*   Test: Function handles null/undefined inputs
*   Test: Function returns integer values only

**Type Validation Tests:**
*   Test: First parameter must be a number
*   Test: Second parameter must be a boolean
*   Test: Return value is always a number
*   Test: Return value is never negative

**Add to `tests/app.test.js`:**

**Score Integration Tests:**

**Score Calculation Integration:**
*   Test: Correct guess on first try updates score by 8
*   Test: Correct guess on second try updates score by 4
*   Test: Correct guess on third try updates score by 2
*   Test: Three incorrect guesses add 0 to score
*   Test: Score accumulates correctly across multiple questions

**Hint Impact on Scoring:**
*   Test: Using hint halves the awarded points
*   Test: Hint status tracked correctly per question
*   Test: Score display updates correctly with hint usage

**Feedback Message Tests:**

**Correct Answer Feedback:**
*   Test: "CORRECT! +8" displays for first correct guess
*   Test: "CORRECT! +4" displays for second correct guess
*   Test: "CORRECT! +2" displays for third correct guess
*   Test: "CORRECT! +4" displays for first correct guess with hint
*   Test: "CORRECT! +2" displays for second correct guess with hint
*   Test: "CORRECT! +1" displays for third correct guess with hint

**Incorrect Answer Feedback:**
*   Test: "TRY AGAIN..." message format for identify_color questions
*   Test: "TRY AGAIN..." message format for identify_swatch questions
*   Test: Incorrect choice color/hex displayed in feedback
*   Test: "INCORRECT. The correct answer was..." for third wrong guess
*   Test: "+0" displayed for failed questions

**UI State Management Tests:**

**Option Removal Tests:**
*   Test: Incorrect options removed from DOM after wrong guess
*   Test: All options except correct one removed after correct guess
*   Test: Correct answer remains visible after correct guess
*   Test: Option removal doesn't affect other DOM elements

**Button State Tests:**
*   Test: "NEW GAME" button appears after question completion
*   Test: "NEW GAME" button hidden during active question
*   Test: Clicking "NEW GAME" triggers new question
*   Test: Button event listeners attached correctly

**Visual Answer Display Tests:**
*   Test: Correct answer displayed below question after completion
*   Test: Visual format matches question type (swatch vs hex code)
*   Test: Correct answer styling matches specification

**Step 2: Game Flow Integration Tests**

**Complete Question Cycle Tests:**
*   Test: Full cycle from question start to completion
*   Test: Score updates correctly throughout game cycle
*   Test: State resets appropriately for new questions
*   Test: UI elements transition correctly between states

**Multiple Question Tests:**
*   Test: Score accumulates across multiple questions
*   Test: Each question starts with clean state
*   Test: Performance remains consistent over many questions

**Step 3: Implement Functions to Pass Tests**

**`game.js` implementation:**
*   Implement `calculateScore()` with exact specification logic
*   Add proper input validation and error handling
*   Ensure function is pure (no side effects)
*   Add comprehensive documentation

**`app.js` modifications:**
*   Integrate scoring into `handleGuess()` function
*   Implement correct feedback message generation
*   Add option removal logic
*   Implement "NEW GAME" button functionality
*   Add visual correct answer display

**Step 4: End-to-End Testing**

**Complete Game Testing:**
*   Test: Play through multiple complete questions
*   Test: Verify scoring accuracy in real gameplay
*   Test: Verify all feedback messages display correctly
*   Test: Verify smooth transitions between game states

**Edge Case Testing:**
*   Test: All possible scoring scenarios in browser
*   Test: Rapid clicking doesn't break scoring
*   Test: UI remains responsive during all interactions

**Success Criteria:**
*   100% test pass rate
*   All scoring scenarios work correctly
*   Feedback messages match specification exactly
*   UI state transitions are smooth and correct
*   No console errors during gameplay
*   Score accumulation works perfectly across multiple questions
```

---

**Prompt 9: Hint System Implementation with TDD Test Suite** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
Following TDD principles, we'll write comprehensive tests for the hint system BEFORE implementation.

**Task:** Write tests first, then implement hint system using TDD.

**Step 1: Write Failing Tests First**

**Add to `tests/app.test.js`:**

**`renderHexWithHint()` Function Tests:**

**Basic Functionality Tests:**
*   Test: `renderHexWithHint("#AABBCC")` returns correctly colored HTML
*   Test: Output contains `<span>#</span>` for hash symbol
*   Test: R component "AA" colored with `#AA0000`
*   Test: G component "BB" colored with `#00BB00`
*   Test: B component "CC" colored with `#0000CC`
*   Test: Function preserves text-stroke/shadow classes
*   Test: Output is valid HTML string

**Input Validation Tests:**
*   Test: Handles hex codes with # prefix correctly
*   Test: Handles hex codes without # prefix correctly
*   Test: Handles lowercase hex codes correctly
*   Test: Handles uppercase hex codes correctly
*   Test: Handles edge cases like "#000000" and "#FFFFFF"
*   Test: Throws/handles error for invalid hex codes
*   Test: Handles malformed input gracefully

**HTML Structure Tests:**
*   Test: Output contains exactly 4 span elements
*   Test: Each component span has correct inline color style
*   Test: CSS classes are preserved in output
*   Test: No XSS vulnerabilities in generated HTML
*   Test: Generated HTML is safe for innerHTML injection

**`handleHintClick()` Function Tests:**

**State Management Tests:**
*   Test: Sets `hintUsed` to true when clicked
*   Test: Updates button text to "Hint Shown"
*   Test: Disables hint button after click
*   Test: Does nothing if `hintUsed` is already true
*   Test: Does nothing if `questionOver` is true
*   Test: Event listener attached correctly to button

**Visual Hint Application Tests:**

**identify_color Question Type:**
*   Test: Updates all hex code option elements with colored hints
*   Test: Each option element innerHTML contains colored spans
*   Test: Original text content is preserved but colored
*   Test: Text-stroke/shadow styling remains intact
*   Test: Option functionality (click handlers) still works

**identify_swatch Question Type:**
*   Test: Updates main question hex code with colored hints
*   Test: Question element innerHTML contains colored spans
*   Test: Original hex code is preserved but colored
*   Test: Question styling (size, positioning) remains correct

**Hint Persistence Tests:**
*   Test: Hint remains visible after incorrect guesses
*   Test: Hint persists until question completion
*   Test: Hint state doesn't affect option removal
*   Test: Colored hint remains after DOM manipulations

**Button State Tests:**
*   Test: Button text changes from "Show Hint" to "Hint Shown"
*   Test: Button becomes unclickable (disabled) after use
*   Test: Button styling reflects disabled state
*   Test: Multiple clicks don't change state further

**Score Impact Integration Tests:**
*   Test: Using hint before correct guess halves score
*   Test: Hint status correctly passed to `calculateScore()`
*   Test: Score calculation integrates hint usage properly
*   Test: Feedback message reflects hint-adjusted score

**Question Lifecycle Integration Tests:**

**New Question Reset Tests:**
*   Test: `startNewQuestion()` resets `hintUsed` to false
*   Test: Hint button text resets to "Show Hint"
*   Test: Hint button becomes enabled again
*   Test: Previous question's hint styling is cleared
*   Test: New question renders without hint initially

**Full Hint Cycle Tests:**
*   Test: Complete cycle: new question → show hint → answer → new question
*   Test: Hint state isolation between questions
*   Test: No hint state leakage between questions
*   Test: Proper cleanup of hint-related DOM modifications

**Step 2: Cross-Question Type Testing**

**Consistency Tests:**
*   Test: Hint works identically for both question types
*   Test: Color accuracy consistent across all hex codes
*   Test: Performance similar for both question types
*   Test: UI behavior consistent regardless of question type

**Visual Validation Tests:**
*   Test: Red component colors display as red tones
*   Test: Green component colors display as green tones
*   Test: Blue component colors display as blue tones
*   Test: Color intensity matches hex component values
*   Test: Hint colors are visually distinguishable

**Step 3: Implement Functions to Pass Tests**

**`app.js` implementation:**
*   Implement `renderHexWithHint()` with proper HTML generation
*   Add XSS protection and input validation
*   Implement `handleHintClick()` with state management
*   Modify `startNewQuestion()` to reset hint state
*   Add proper event listener management
*   Ensure all DOM manipulations are safe and efficient

**Step 4: Integration and End-to-End Testing**

**Browser Testing:**
*   Test: Visual hint appears correctly in browser
*   Test: Colored text is readable with text-stroke
*   Test: Button interactions work smoothly
*   Test: Hint integration with scoring works correctly
*   Test: Multiple hint uses across questions work properly

**Performance Testing:**
*   Test: Hint rendering doesn't cause performance issues
*   Test: DOM manipulation efficiency
*   Test: Memory usage during hint operations
*   Test: No memory leaks from repeated hint usage

**Accessibility Testing:**
*   Test: Hint button remains accessible after state changes
*   Test: Colored text maintains sufficient contrast
*   Test: Screen reader compatibility with colored spans
*   Test: Keyboard navigation works with hint system

**Success Criteria:**
*   100% test pass rate
*   Visual hints display correctly for both question types
*   Score halving works correctly with hint usage
*   Button state management is flawless
*   Hint state properly isolated between questions
*   No console errors or warnings
*   All DOM manipulations are safe and efficient
```

---

**Prompt 10: UI Styling and Polish** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

```text
The core mechanics and hint system are working. Let's apply the final styling to match the spec's visual requirements.

**Task:** Update `style.css` and refine element styling in `app.js` where necessary.

**`style.css` requirements:**

1.  **Layout:** Center the main components. Position `score-display` top-right using `position: absolute;`.
2.  **Fonts & Text:** Use a prominent monospace font for all hex codes. Ensure `text-transform: uppercase;`.
3.  **Hex Code Style:** Apply a class `hex-code-text` to all elements showing hex codes. Style this class with the black text-stroke: `text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;`.
4.  **Color Swatches:**
    *   Apply a class `color-swatch`. Style it with `border-radius: 50%;`, `border: 2px solid #000;`, and `cursor: pointer;`.
    *   Define sizes for the main question swatch and the smaller option swatches.
5.  **Buttons:** Style `hint-button` and `new-game-button` for clarity. Style the `:disabled` state of the hint button.
6.  **Options Area:** Use `display: flex; justify-content: center; align-items: center;` for clean horizontal layout of options.

**`app.js` potentially impacted:**
*   When creating elements in JS, assign the appropriate CSS classes (e.g., `hex-code-text`, `color-swatch`) instead of applying many inline styles.

**Testing:**
*   Visually inspect the application.
*   Confirm layout, fonts, colors, shapes, and effects match the spec.
*   Ensure the hint's colored text still has the black stroke effect.
*   Confirm overall design feels minimalist and polished.
```

---

**Prompt 11: Final Testing, Feedback Messages & Comprehensive Test Suite** &nbsp;&nbsp;&nbsp;&nbsp; Started? [x] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [x]

```text
Following TDD principles, we'll write comprehensive end-to-end tests and finalize all feedback messaging.

**Task:** Create comprehensive final test suite covering all requirements from spec.md.

**Step 1: Complete Feedback Message Test Suite**

**Add to `tests/app.test.js`:**

**Feedback Message Format Tests:**

**Incorrect Guess Feedback (identify_color type):**
*   Test: Message format "TRY AGAIN. THAT HEX CODE WAS [swatch]"
*   Test: Inline color swatch matches the incorrect hex picked
*   Test: Swatch styling consistent with other swatches
*   Test: Message HTML structure is correct and safe
*   Test: Swatch color accuracy matches picked hex exactly

**Incorrect Guess Feedback (identify_swatch type):**
*   Test: Message format "TRY AGAIN. THAT COLOR WAS #[hex]"
*   Test: Hex code in message matches the incorrect swatch picked
*   Test: Hex code text is colored with its actual color
*   Test: Colored hex maintains text-stroke/shadow for readability
*   Test: Hex code is displayed in uppercase

**Correct Guess Feedback:**
*   Test: Message format "CORRECT! +[Score]"
*   Test: Score value matches calculated score exactly
*   Test: Message displays immediately upon correct guess
*   Test: No extra spaces or formatting issues

**Final Incorrect Guess Feedback:**
*   Test: Message format "INCORRECT. The correct answer was [answer]. +0"
*   Test: Correct answer display matches question type
*   Test: For identify_color: shows correct hex code
*   Test: For identify_swatch: shows correct color swatch
*   Test: "+0" score indication is clear

**Instructional Text Tests:**
*   Test: identify_color questions show "GUESS THE COLOR"
*   Test: identify_swatch questions show "CHOOSE THE HEX CODE"
*   Test: Instructions display at start of each question
*   Test: Instructions clear/update between questions

**Step 2: Comprehensive End-to-End Test Suite**

**Create `tests/e2e.test.js`:**

**Complete Game Flow Tests:**
*   Test: Load page → first question appears → all elements visible
*   Test: Complete question correctly → score updates → new game loads
*   Test: Complete question incorrectly → appropriate feedback → new game loads
*   Test: Use hint → score adjustment → complete question
*   Test: Multiple questions in sequence work correctly

**All Scoring Scenarios:**
*   Test: First guess correct (no hint): +8 points
*   Test: Second guess correct (no hint): +4 points
*   Test: Third guess correct (no hint): +2 points
*   Test: First guess correct (with hint): +4 points
*   Test: Second guess correct (with hint): +2 points
*   Test: Third guess correct (with hint): +1 point
*   Test: Three incorrect guesses: +0 points

**Color Distinctness Validation:**
*   Test: Generate 100 questions, verify all color distances >= 75
*   Test: No visually similar colors appear in same question
*   Test: Color generation performs consistently

**UI/UX Requirements from Spec:**
*   Test: White background (#FFFFFF)
*   Test: Score displays in top-right corner
*   Test: Large circular color swatches
*   Test: Uppercase hex codes with text-stroke
*   Test: Minimalist design requirements
*   Test: Proper element positioning and layout

**Step 3: Performance and Stress Testing**

**Add to `tests/performance.test.js`:**

**Performance Tests:**
*   Test: Generate 1000 questions in reasonable time (< 10 seconds)
*   Test: Color distance calculation efficiency
*   Test: DOM manipulation performance during gameplay
*   Test: Memory usage doesn't grow excessively
*   Test: No memory leaks over extended gameplay

**Stress Tests:**
*   Test: Rapid clicking doesn't break game state
*   Test: Rapid new game generation works correctly
*   Test: Extended gameplay (100+ questions) remains stable
*   Test: Browser doesn't slow down or crash

**Step 4: Logging and Debugging Test Suite**

**Logging Tests:**
*   Test: `console.log("HexVex initialized")` appears on page load
*   Test: `console.log("New question:", currentQuestion)` for each question
*   Test: `console.warn()` appears for excessive regeneration attempts
*   Test: No unexpected console errors or warnings
*   Test: Logging doesn't impact game performance

**Error Handling Tests:**
*   Test: Graceful handling of missing DOM elements
*   Test: Invalid color generation handled properly
*   Test: Malformed questions handled without crashing
*   Test: Network issues don't break local functionality

**Step 5: Specification Compliance Tests**

**Create `tests/spec-compliance.test.js`:**

**Technical Specification Tests:**
*   Test: Pure HTML/CSS/JavaScript (no frameworks)
*   Test: Desktop-first design (responsive not required for MVP)
*   Test: All color calculations match spec formula exactly
*   Test: Question types appear randomly (50/50 distribution)
*   Test: Option order properly randomized

**Feature Completeness Tests:**
*   Test: Infinite gameplay loop works
*   Test: No "Start Quiz" button (auto-start)
*   Test: Two question types implemented correctly
*   Test: Hint system fully functional
*   Test: Scoring system matches specification exactly
*   Test: All feedback messages match specification

**Visual Design Compliance:**
*   Test: Color swatches are perfect circles
*   Test: Hex codes always uppercase
*   Test: Text-stroke/shadow applied correctly
*   Test: Layout matches specification description
*   Test: Minimalist design principles followed

**Step 6: Final Implementation and Polish**

**Complete Implementation:**
*   Finalize all feedback message formatting
*   Add comprehensive logging as specified
*   Ensure all visual elements match specification
*   Complete error handling for edge cases

**Final Testing Protocol:**
*   Run all unit tests: 100% pass rate required
*   Run all integration tests: 100% pass rate required
*   Run all end-to-end tests: 100% pass rate required
*   Manual testing: Play 20+ questions, verify all features
*   Browser testing: No console errors, warnings, or crashes
*   Specification review: All requirements met exactly

**Success Criteria:**
*   All tests pass with pristine output
*   Game matches specification exactly
*   Performance is smooth and responsive
*   No bugs or edge case failures
*   Code is clean, maintainable, and well-tested
*   Ready for production deployment
```

---

## Comprehensive Testing Strategy Summary

This plan implements **Test-Driven Development (TDD)** throughout the entire project, ensuring:

### Test Coverage Requirements (NO EXCEPTIONS)
- **Unit Tests**: Every function has comprehensive unit test coverage
- **Integration Tests**: All module interactions are tested
- **End-to-End Tests**: Complete user workflows are validated

### Testing Framework Structure
```
tests/
├── test-runner.html         # Browser-based test execution
├── utils.test.js           # Color utility function tests
├── game.test.js            # Game logic and state tests  
├── app.test.js             # UI rendering and interaction tests
├── e2e.test.js             # Complete game flow tests
├── performance.test.js     # Performance and stress tests
└── spec-compliance.test.js # Specification requirement validation
```

### TDD Implementation Process (Applied to Each Prompt)
1. **Red Phase**: Write failing tests that define desired behavior
2. **Green Phase**: Write minimal code to make tests pass
3. **Refactor Phase**: Improve code while maintaining test success
4. **Validation Phase**: Ensure all requirements met

### Critical Test Categories
- **Color Distance Algorithm**: Exact formula validation (|R1-R2| + |G1-G2| + |B1-B2|)
- **Color Distinctness**: All pairs >= 75 distance threshold
- **Scoring Logic**: All 8 scoring scenarios (with/without hints)
- **Randomization**: Statistical validation of distributions
- **UI Rendering**: Visual element accuracy and DOM manipulation
- **Game State**: Proper state transitions and isolation
- **Error Handling**: Graceful failure modes and edge cases

### Success Criteria for Each Prompt
- **100% test pass rate** (pristine test output required)
- **No console errors or warnings**
- **Specification compliance validation**
- **Performance within defined bounds**
- **Code maintainability and readability**

### Testing Commands
- Open `tests/test-runner.html` in browser
- All tests must pass with green indicators
- Console output must be clean and informative
- Failed tests must show clear expected vs actual comparisons

This testing approach ensures that any AI implementing these prompts will create **well-tested, robust, maintainable code** that fully meets the HexVex specification requirements.
