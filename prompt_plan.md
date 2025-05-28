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

**Prompt 1: Basic HTML and CSS Setup** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

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

**Prompt 2: Core Color Utilities** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

```text
Okay, we have the basic HTML and CSS. Now, let's implement the core color utility functions in `utils.js`.

**Task:** Create and export functions in `utils.js`.

**`utils.js` requirements:**

1.  **`generateRandomHexColor()`:**
    *   Returns a string representing a random hex color (e.g., "#RRGGBB").
    *   Ensure it's a full 6-digit hex code, always starting with '#'.
    *   Test: Call it multiple times, verify format and randomness.

2.  **`hexToRgb(hexString)`:**
    *   Takes a hex color string (e.g., "#FF00FF" or "FF00FF") as input.
    *   Returns an object `{ r, g, b }` with integer values from 0-255.
    *   Handle hex strings with or without the leading '#'.
    *   Test: `hexToRgb("#FF00FF")` should return `{ r: 255, g: 0, b: 255 }`.
    *   Test: `hexToRgb("00FF00")` should return `{ r: 0, g: 255, b: 0 }`.

3.  **`calculateColorDistance(rgb1, rgb2)`:**
    *   Takes two RGB color objects (e.g., `{ r: 255, g: 0, b: 0 }`) as input.
    *   Calculates distance using the formula: `Distance = |R1-R2| + |G1-G2| + |B1-B2|`.
    *   Returns the calculated distance (an integer).
    *   Test: `calculateColorDistance({ r: 255, g: 0, b: 0 }, { r: 250, g: 5, b: 10 })` should return `( |255-250| + |0-5| + |0-10| ) = 5 + 5 + 10 = 20`.

**Provide simple console log tests within the file (or suggest how to test them from the browser console) to verify each function works as expected.**
Make sure these functions are accessible for import by other JS files (e.g., using `export` if modules are intended, or global functions if not explicitly using modules. For simplicity, let's assume global functions or direct script includes mean they'll be available in order. If you plan to use ES6 modules, set that up).

Let's stick to plain JS without explicit module syntax for now to keep it simple, assuming `utils.js` is loaded before `game.js` and `app.js`. So, functions can be globally accessible or wrapped in an IIFE that exposes them.
```

---

**Prompt 3: Question Generation Logic - Options and Distinctness** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

```text
With the color utilities in place, let's move to `game.js` and start building the question generation logic. This is a critical part, especially the color distinctness.

**Task:** Implement functions in `game.js` to generate question options while ensuring color distinctness.

**`game.js` requirements:**

1.  **`MIN_DISTANCE_THRESHOLD` Constant:**
    *   Define a constant `MIN_DISTANCE_THRESHOLD = 75;`.

2.  **`generateQuestionOptions()` function:**
    *   This function will be responsible for creating a set of one correct color and three distinct distractor colors.
    *   **Refined Regeneration Logic (as per spec):** The spec states: "If *any* pair is found to be 'too similar,' discard *all three* current distractors and return to step 2 (generate a brand new set of three distractors)."
        Let's implement *this specific regeneration logic*:
        Revised Step:
        1. Generate `correctHex` and `correctRgb` using `generateRandomHexColor()` and `hexToRgb()`.
        2. Start a `do...while` loop that continues until a valid set of 3 distractors is found.
           a. `distractors = []` (array of hex strings)
           b. `distractorRgbs = []`
           c. Generate 3 random distractor hex codes and their RGB versions. Store them.
           d. `allColorsHex = [correctHex, ...distractors]`
           e. `allColorsRgb = [correctRgb, ...distractorRgbs]`
           f. `isDistinctSet = true`
           g. Iterate through all unique pairs in `allColorsRgb`. If `calculateColorDistance(pairColor1, pairColor2) < MIN_DISTANCE_THRESHOLD` for *any* pair, set `isDistinctSet = false` and `break` this inner loop.
           h. The `do...while` loop condition is `!isDistinctSet`.
        3. If the loop finishes, `distractors` contains 3 hex codes that are distinct from the correct answer and from each other.

    *   **Return Value:** An object `{ correctHex: "...", distractors: ["...", "...", "..."] }`.
    *   **Logging:** Add `console.log` statements if the distractor regeneration loop runs more than, say, 5-10 times for a single call, to monitor its efficiency. "Distractor regeneration attempts: [count]".

**Testing:**
*   In `game.js` or via the browser console:
    *   Call `generateQuestionOptions()` multiple times.
    *   For each result, manually (or with a helper test function) verify:
        *   It returns one `correctHex` and an array of three `distractorHexes`.
        *   Convert all four hexes to RGB.
        *   Calculate the distance between all unique pairs (Correct-D1, Correct-D2, Correct-D3, D1-D2, D1-D3, D2-D3).
        *   Ensure all 6 distances are `>= MIN_DISTANCE_THRESHOLD`.
    *   This function might take a few tries to get right, so focus on robust testing of the distinctness logic.

(Note: The spec's regeneration ("discard *all three* current distractors") is computationally more expensive but explicitly requested. We'll follow that.)
```

---

**Prompt 4: Full Question Object Generation** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

```text
We can now generate a set of distinct color options. Next, let's create the full question object, including randomizing the question type and the order of options.

**Task:** Implement `generateQuestion()` in `game.js`.

**`game.js` requirements:**

1.  **`generateQuestion()` function:**
    *   **Determine Question Type:** Randomly decide if the question is `'identify_color'` (show swatch, guess hex) or `'identify_swatch'` (show hex, guess swatch). A 50/50 chance.
    *   **Get Color Options:** Call `generateQuestionOptions()` to get the `{ correctHex, distractors }`.
    *   **Prepare Options Array:**
        *   Create an array `allOptions`.
        *   Add an object for the correct answer: `{ value: correctHex, isCorrect: true }`.
        *   For each distractor hex, add an object: `{ value: distractorHex, isCorrect: false }`.
        *   This array will now have 4 option objects.
    *   **Randomize Option Order:** Shuffle the `allOptions` array randomly so the correct answer isn't always in the same position. (A common way is the Fisher-Yates shuffle algorithm, or a simpler sort with `Math.random()`).
    *   **Return Question Object:**
        Return an object with the following structure:
        ```javascript
        {
          type: 'identify_color', // or 'identify_swatch'
          questionDisplayValue: correctHex, // This is the hex of the color to be shown as a big swatch (if type 1) or as text (if type 2)
          options: [ // The shuffled array of 4 option objects
            { value: hexString1, isCorrect: boolean, id: uniqueIdForOption1 }, // value is always a hex string
            { value: hexString2, isCorrect: boolean, id: uniqueIdForOption2 },
            // ... and so on for 4 options
          ],
          correctAnswerHex: correctHex // Store the unambiguous correct hex string
        }
        ```
        *   Add a simple unique `id` (e.g., `option_0`, `option_1` etc. or just index) to each option object. This might be useful later for DOM element association.

**Testing:**
*   In `game.js` or via browser console:
    *   Call `generateQuestion()` multiple times.
    *   Log the returned object.
    *   Verify:
        *   `type` is either `'identify_color'` or `'identify_swatch'`.
        *   `questionDisplayValue` is a valid hex string.
        *   `options` array has 4 items.
        *   Exactly one option in `options` has `isCorrect: true`.
        *   The `value` of the correct option matches `correctAnswerHex` and `questionDisplayValue`.
        *   The order of options appears random across multiple calls.
        *   All hex strings are valid.
        *   Each option has a `value` (hex string) and an `isCorrect` boolean.
```

---

**Prompt 5: Game State and Basic UI Rendering** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

```text
Now that we can generate complete question objects, let's set up basic game state variables and render a question to the DOM.

**Task:** Initialize game state in `game.js`, get DOM elements in `app.js`, and implement initial rendering logic.

**`game.js` requirements:**

1.  **Game State Variables:** At the top level of `game.js` (or within a game state object if you prefer), define:
    *   `let currentScore = 0;`
    *   `let currentQuestion = null;` // Will hold the object from generateQuestion()
    *   `let hintUsed = false;`
    *   `let guessesMade = 0;` // Number of incorrect guesses for the current question

**`app.js` requirements:**

1.  **DOM Element References:**
    *   At the beginning of `app.js`, get and store references to the DOM elements created in Prompt 1:
        *   `scoreDisplayEl` (for `score-display`)
        *   `questionAreaEl` (for `question-area`)
        *   `optionsAreaEl` (for `options-area`)
        *   `feedbackAreaEl` (for `feedback-area`)
        *   `hintButtonEl` (for `hint-button`)
        *   `newGameButtonEl` (for `new-game-button`)
    *   Add a new `div` inside `feedback-area` with `id="feedback-text"` for messages, and get a reference `feedbackTextEl`.

2.  **`displayScore()` function:**
    *   Takes no arguments.
    *   Updates `scoreDisplayEl.textContent` to `YOUR SCORE: ${currentScore}` (assuming `currentScore` is an accessible variable from `game.js`).

3.  **`renderQuestion(questionObj)` function:**
    *   Takes a question object (as generated by `generateQuestion()`) as input.
    *   **Clear previous content:**
        *   `questionAreaEl.innerHTML = '';`
        *   `optionsAreaEl.innerHTML = '';`
    *   **Render Question:**
        *   If `questionObj.type === 'identify_color'`:
            *   Create a `div` for the color swatch.
            *   Set its `backgroundColor` to `questionObj.questionDisplayValue`.
            *   Style it: large (e.g., `width: 200px; height: 200px; border-radius: 50%; border: 2px solid black; margin: 20px auto;`).
            *   Append it to `questionAreaEl`.
        *   If `questionObj.type === 'identify_swatch'`:
            *   Create a `div` or `h1` for the hex code text.
            *   Set its `textContent` to `questionObj.questionDisplayValue`.
            *   Style it: large font (e.g., `font-size: 3em; font-family: monospace; font-weight: bold; text-align: center; margin: 20px; text-transform: uppercase;`). Add the specified text stroke/shadow: `text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; color: #333;`.
            *   Append it to `questionAreaEl`.
    *   **Render Options:**
        *   Iterate through `questionObj.options`. For each `option`:
            *   If `questionObj.type === 'identify_color'` (options are hex codes):
                *   Create a `button` or `div`.
                *   Set `textContent` to `option.value` (uppercase).
                *   Style it: clickable, padding, margin, monospace font, uppercase, same text stroke/shadow.
                *   Store `option.isCorrect` and `option.value` on the element using `dataset` attributes.
                *   Append to `optionsAreaEl`.
            *   If `questionObj.type === 'identify_swatch'` (options are color swatches):
                *   Create a `div` for the color swatch.
                *   Set `backgroundColor` to `option.value`.
                *   Style it: clickable, e.g., `width: 100px; height: 100px; border-radius: 50%; border: 2px solid black; margin: 10px; display: inline-block; cursor: pointer;`.
                *   Store `option.isCorrect` and `option.value` using `dataset`.
                *   Append to `optionsAreaEl`.
    *   Style `optionsAreaEl` to display options horizontally and centered (`text-align: center;`).

**Testing:**
*   Manually in `app.js` (e.g., within an `init` function or at the end of the file):
    1.  Call `generateQuestion()` to get a sample question.
    2.  Store it in `currentQuestion`.
    3.  Call `renderQuestion(currentQuestion)`.
    4.  Call `displayScore()` (score will be 0).
*   Open `index.html` in the browser.
*   Verify: Score "0", a question, and four options are visible. Check element inspector for `dataset` attributes.
```

---

**Prompt 6: Initial Game Loop and First Question on Load** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

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

**Prompt 7: Handling User Guesses (No Scoring Yet, Basic Feedback)** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

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

**Prompt 8: Scoring System Implementation** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

```text
We have basic guess handling. Now, let's implement the full scoring logic and update the score display.

**Task:** Implement scoring in `game.js` and integrate it into `app.js`.

**`game.js` requirements:**

1.  **`calculateScore(guessesMadeCount, hintWasUsed)` function:**
    *   `guessesMadeCount`: The number of guesses it took (1 for 1st try, 2 for 2nd try, etc.).
    *   `hintWasUsed`: Boolean.
    *   **Logic:**
        *   `let points = 0;`
        *   Based on `guessesMadeCount`, assign 8, 4, or 2 points. `guessesMadeCount >= 4` is 0 points.
        *   If `hintWasUsed`, `points = Math.floor(points / 2);`.
        *   Return `points`.
    *   **Test this function with various inputs:** `calculateScore(1, false)` -> 8, `calculateScore(1, true)` -> 4, `calculateScore(3, true)` -> 1, `calculateScore(4, false)` -> 0.

**`app.js` requirements:**

1.  **Modify `handleGuess(event, chosenOptionData)`:**
    *   When `chosenOptionData.isCorrect`:
        1.  The number of guesses for scoring is `guessesMade`.
        2.  `let pointsAwarded = calculateScore(guessesMade, hintUsed);`
        3.  `currentScore += pointsAwarded;`
        4.  Call `displayScore()`.
        5.  `feedbackTextEl.textContent = \`CORRECT! +${pointsAwarded}\`;`
        6.  Remove all other options from `optionsAreaEl`.
        7.  Show the correct answer element below the question as per spec.
    *   When `chosenOptionData.isCorrect` is `false`:
        1.  If `guessesMade === 3`:
            *   `feedbackTextEl.textContent = \`INCORRECT. The correct answer was ${currentQuestion.correctAnswerHex}. +0\`;`
            *   Display the correct answer visually.
            *   Update score (with +0) and call `displayScore()`.
        2.  Else (1st or 2nd incorrect guess):
            *   Update `feedbackTextEl` with the specific "TRY AGAIN..." message from the spec, showing the color/hex of the incorrect choice.

2.  **"NEW GAME" Button Functionality:**
    *   Add an event listener to `newGameButtonEl` to call `startNewQuestion()`.

**Testing:**
*   Test all scoring scenarios: 1st/2nd/3rd correct guess, 3 incorrect guesses.
*   Verify "NEW GAME" works.
*   Verify feedback messages are specific and accurate.
*   Verify removal of incorrect options and display of the final correct answer.
```

---

**Prompt 9: Hint System Implementation** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

```text
The scoring is in. Now, let's implement the hint system. This involves UI changes for the button, visual changes for hex codes, and score adjustment.

**Task:** Implement the "Show Hint" button functionality and visual hint display.

**`app.js` requirements:**

1.  **`renderHexWithHint(hexString)` function:**
    *   Input: `hexString` (e.g., "#AABBCC").
    *   Output: An HTML string that colors the R, G, and B components of the hex.
    *   Example for `#AABBCC`: returns `<span>#</span><span style="color:#AA0000;">AA</span><span style="color:#00BB00;">BB</span><span style="color:#0000CC;">CC</span>`.
    *   Ensure the standard black text-stroke/shadow from the spec is still applied to these colored spans (e.g., via a class).

2.  **`handleHintClick()` function:**
    *   Add an event listener on `hintButtonEl` to call this.
    *   If `hintUsed` or `questionOver` is true, return.
    *   Set `hintUsed = true;`.
    *   Update `hintButtonEl` text to "Hint Shown" and disable it.
    *   **Apply Visual Hint:**
        *   If `currentQuestion.type === 'identify_color'`, iterate through option elements and update their `innerHTML` using `renderHexWithHint`.
        *   If `currentQuestion.type === 'identify_swatch'`, update the `innerHTML` of the main question element using `renderHexWithHint`.

3.  **Modify `startNewQuestion()`:**
    *   Reset `hintUsed` to `false`.
    *   Reset `hintButtonEl` to "Show Hint" and enable it.

**Testing:**
*   Click "Show Hint": button state changes, visual hint appears correctly for both question types.
*   Answer correctly after using hint. Verify score is halved.
*   Start a new game. Verify hint button and state are reset.
*   Verify hint persists for the duration of one question, even after incorrect guesses.
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

**Prompt 11: Finalizing Feedback Details & Logging** &nbsp;&nbsp;&nbsp;&nbsp; Started? [ ] &nbsp;&nbsp;&nbsp;&nbsp; Finished? [ ]

```text
We're almost there! Let's ensure all feedback messages are exactly as specified and add some basic logging for debugging.

**Task:** Refine feedback messages in `app.js` and add console logging.

**`app.js` requirements:**

1.  **Review and Refine `handleGuess` for feedback messages:**
    *   **On Incorrect Guess:**
        *   For `identify_color`: "TRY AGAIN. THAT HEX CODE WAS [actual color swatch of the hex they picked]". Implement this using `innerHTML` to create a small inline swatch.
        *   For `identify_swatch`: "TRY AGAIN. THAT COLOR WAS #[hex code of the swatch they picked]". Implement with `innerHTML` to color the hex code text.
    *   **On Correct Guess:** Ensure feedback is "CORRECT! +[Score]".
    *   **On Third Incorrect Guess:** Ensure feedback is "INCORRECT. The correct answer was [correct answer]. +0".
    *   Ensure the correct answer (hex or swatch) is displayed clearly after the question is resolved (either correctly or by 3 incorrect guesses).

2.  **Initial Instructional Text (in `startNewQuestion()`):**
    *   Update to match spec exactly: "GUESS THE COLOR" or "CHOOSE THE HEX CODE".

**`game.js` & `app.js` - Logging:**
1.  In `game.js`, `generateQuestionOptions()`: `console.warn()` if the regeneration loop runs many times.
2.  In `app.js`, `startNewQuestion()`: `console.log("New question:", currentQuestion);`.
3.  In `app.js`, `initGame()`: `console.log("HexVex initialized");`.

**Testing:**
*   Thoroughly test all feedback scenarios to ensure the text and visual aids (inline swatches/colored text) are exactly as specified.
*   Verify initial instructional texts are correct.
*   Check the browser console for logs during gameplay.
*   Play several rounds to confirm the final product is stable and matches the spec.
```
