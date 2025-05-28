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

**Prompt 1: Basic HTML and CSS Setup**

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

**Prompt 2: Core Color Utilities**

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

**Prompt 3: Question Generation Logic - Options and Distinctness**

```text
With the color utilities in place, let's move to `game.js` and start building the question generation logic. This is a critical part, especially the color distinctness.

**Task:** Implement functions in `game.js` to generate question options while ensuring color distinctness.

**`game.js` requirements:**

1.  **`MIN_DISTANCE_THRESHOLD` Constant:**
    *   Define a constant `MIN_DISTANCE_THRESHOLD = 75;`.

2.  **`generateQuestionOptions()` function:**
    *   This function will be responsible for creating a set of one correct color and three distinct distractor colors.
    *   **Steps:**
        1.  Generate a `correctHex` using `utils.generateRandomHexColor()`. Convert it to `correctRgb` using `utils.hexToRgb()`.
        2.  Initialize an empty array `distractorHexes`.
        3.  **Loop to generate 3 distinct distractors:**
            a.  Generate a `distractorHex` using `utils.generateRandomHexColor()`.
            b.  Convert it to `distractorRgb` using `utils.hexToRgb()`.
            c.  **Similarity Check 1 (Distractor vs. Correct):** Calculate distance between `distractorRgb` and `correctRgb`. If distance is `< MIN_DISTANCE_THRESHOLD`, discard this `distractorHex` and GOTO step 3a to generate a new one.
            d.  **Similarity Check 2 (Distractor vs. Other Distractors):** For each existing hex in `distractorHexes`, convert it to RGB and calculate distance against the current `distractorRgb`. If *any* distance is `< MIN_DISTANCE_THRESHOLD`, discard the current `distractorHex` and GOTO step 3a.
            e.  If the `distractorHex` passes both checks, add it to `distractorHexes`.
            f.  Repeat until `distractorHexes` contains 3 hex codes.
            *   **Refined Regeneration Logic (as per spec):** The spec states: "If *any* pair is found to be 'too similar,' discard *all three* current distractors and return to step 2 (generate a brand new set of three distractors)."
                Let's implement *this specific regeneration logic*:
                Revised Step:
                1. Generate `correctHex` and `correctRgb`.
                2. Start a `do...while` loop that continues until a valid set of 3 distractors is found.
                   a. `distractors = []` (array of hex strings)
                   b. `distractorRgbs = []`
                   c. Generate 3 random distractor hex codes and their RGB versions. Store them.
                   d. `allColorsHex = [correctHex, ...distractors]`
                   e. `allColorsRgb = [correctRgb, ...distractorRgbs]`
                   f. `isDistinctSet = true`
                   g. Iterate through all unique pairs in `allColorsRgb`. If `utils.calculateColorDistance(pairColor1, pairColor2) < MIN_DISTANCE_THRESHOLD` for *any* pair, set `isDistinctSet = false` and `break` this inner loop.
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

**Prompt 4: Full Question Object Generation**

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

**Prompt 5: Game State and Basic UI Rendering**

```text
Now that we can generate complete question objects, let's set up basic game state variables and render a question to the DOM.

**Task:** Initialize game state in `game.js`, get DOM elements in `app.js`, and implement initial rendering logic.

**`game.js` requirements:**

1.  **Game State Variables:** At the top level of `game.js` (or within a game state object if you prefer), define:
    *   `let currentScore = 0;`
    *   `let currentQuestion = null;` // Will hold the object from generateQuestion()
    *   `let hintUsed = false;`
    *   `let guessesMade = 0;` // Number of incorrect guesses for the current question + 1 for the current attempt

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
    *   Updates `scoreDisplayEl.textContent` to `YOUR SCORE: ${game.currentScore}`. (Assume `game` object is accessible if state is in `game.js`, or pass score).
    *   For now, let's assume `game.js` variables are globally accessible for simplicity, e.g. `currentScore` not `game.currentScore` if not namespaced. To avoid globals, we could wrap `game.js` logic in an object like `HexVexGame`. Let's proceed with simple global-like access for now.
    *   `scoreDisplayEl.textContent = \`YOUR SCORE: ${currentScore}\`;` (assuming `currentScore` is from `game.js`).

3.  **`renderQuestion(questionObj)` function:**
    *   Takes a question object (as generated by `game.generateQuestion()`) as input.
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
            *   Style it: large font (e.g., `font-size: 3em; font-family: monospace; font-weight: bold; text-align: center; margin: 20px; text-transform: uppercase;`). Add the specified text stroke/shadow: `text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000; color: #333;` (use a neutral color like #333 for now, as it might be displayed on white).
            *   Append it to `questionAreaEl`.
    *   **Render Options:**
        *   Iterate through `questionObj.options`. For each `option`:
            *   If `questionObj.type === 'identify_color'` (options are hex codes):
                *   Create a `button` or `div` for the hex code.
                *   Set `textContent` to `option.value` (uppercase).
                *   Style it: clickable appearance, padding, margin, monospace font, uppercase, same text stroke/shadow as above.
                *   Store `option.isCorrect` and `option.value` on the element (e.g., using `dataset` attributes: `element.dataset.isCorrect = option.isCorrect; element.dataset.value = option.value;`).
                *   Append to `optionsAreaEl`.
            *   If `questionObj.type === 'identify_swatch'` (options are color swatches):
                *   Create a `div` for the color swatch.
                *   Set `backgroundColor` to `option.value`.
                *   Style it: clickable, e.g., `width: 100px; height: 100px; border-radius: 50%; border: 2px solid black; margin: 10px; display: inline-block; cursor: pointer;`.
                *   Store `option.isCorrect` and `option.value` on the element (e.g., `dataset`).
                *   Append to `optionsAreaEl`.
    *   Style `optionsAreaEl` to display options horizontally and centered (`text-align: center;`).

**Testing:**
*   Manually in `app.js` (e.g., within an `init` function or at the end of the file):
    1.  Call `game.generateQuestion()` to get a sample question.
    2.  Store it in `game.currentQuestion`.
    3.  Call `renderQuestion(game.currentQuestion)`.
    4.  Call `displayScore()` (score will be 0).
*   Open `index.html` in the browser.
*   Verify:
    *   Score "0" is displayed.
    *   A question (either a large swatch or large hex text) is visible.
    *   Four options (either hex codes or color swatches) are visible below the question, styled as buttons/clickable items.
    *   The temporary borders on layout divs help see the structure.
    *   Check element inspector to see `dataset` attributes on options.
```

---

**Prompt 6: Initial Game Loop and First Question on Load**

```text
The UI can now render a question. Let's set up the game to load the first question automatically and prepare for handling answers.

**Task:** Implement the `startNewQuestion` function and initialize the game on page load.

**`app.js` requirements:**

1.  **`startNewQuestion()` function:**
    *   This function will set up and display a new question.
    *   **Steps:**
        1.  `currentQuestion = generateQuestion();` (assuming `generateQuestion` is from `game.js` and accessible).
        2.  `hintUsed = false;`
        3.  `guessesMade = 0;`
        4.  Call `renderQuestion(currentQuestion)`.
        5.  Update `feedbackTextEl.textContent` with instructional text:
            *   If `currentQuestion.type === 'identify_color'`, set to "Which hex code matches this color?".
            *   If `currentQuestion.type === 'identify_swatch'`, set to "Which color matches this hex code?".
        6.  Ensure `hintButtonEl` is visible, active (clickable), and its text is "Show Hint".
        7.  Ensure `newGameButtonEl` is hidden (`newGameButtonEl.style.display = 'none';`).
        8.  (Later, we'll add logic here to re-attach event listeners to new options).

2.  **`initGame()` function (or directly at the end of `app.js`):**
    *   Call `displayScore()` to show the initial score of 0.
    *   Call `startNewQuestion()` to load and display the first question.

3.  **Execution:** Call `initGame()` when the script loads.

**Testing:**
*   Refresh `index.html` in the browser.
*   Verify:
    *   A random question (either type) loads immediately.
    *   The score "YOUR SCORE: 0" is displayed.
    *   Appropriate instructional text is in the feedback area.
    *   "Show Hint" button is visible and says "Show Hint".
    *   "NEW GAME" button is hidden.
    *   The temporary borders on layout divs can now be removed from `style.css` if desired, as content is populating them.
    *   In `style.css`, ensure `question-area` and `options-area` elements are centered on the page or within their parent. For instance, `margin: 0 auto; text-align: center;` for block elements, or flexbox for parent containers.
```

---

**Prompt 7: Handling User Guesses (No Scoring Yet, Basic Feedback)**

```text
The game starts with a question. Now let's make the options clickable and provide basic feedback.

**Task:** Add event listeners to options and implement `handleGuess` for basic correct/incorrect logic.

**`app.js` requirements:**

1.  **Modify `renderQuestion(questionObj)`:**
    *   When creating each option element (button or div):
        *   Add an event listener (`'click'`).
        *   The event listener should call a new function, `handleGuess(event, optionData)`, passing the event and the specific `option` object (or just its `isCorrect` status and `value`).
        *   It's crucial that these event listeners are added to the *newly created* option elements each time `renderQuestion` is called.
        *   Example for an option element `el`:
            ```javascript
            // Inside the loop creating options in renderQuestion
            const optionData = questionObj.options[i]; // or however you access it
            el.addEventListener('click', (event) => handleGuess(event, optionData));
            ```

2.  **`handleGuess(event, chosenOptionData)` function:**
    *   `event`: The click event object.
    *   `chosenOptionData`: The data object `{ value: hexString, isCorrect: boolean, id: uniqueId }` for the clicked option.
    *   **Steps:**
        1.  Increment `guessesMade` (from `game.js`).
        2.  Let `clickedElement = event.currentTarget;`.
        3.  If `chosenOptionData.isCorrect`:
            *   `feedbackTextEl.textContent = "CORRECT! (Score/Next feature pending)";`
            *   Make all option elements unclickable or visually distinct (e.g., lower opacity for incorrect ones). For now, just disable the `hintButtonEl`.
            *   Show `newGameButtonEl` (`newGameButtonEl.style.display = 'inline-block';`).
            *   Disable further clicks on options for this question (perhaps by clearing `optionsAreaEl.innerHTML` or disabling buttons). A simple way is to set a flag like `questionAnswered = true` and check it in `handleGuess`.
        4.  Else (incorrect guess):
            *   `feedbackTextEl.textContent = \`TRY AGAIN. You picked ${chosenOptionData.value}. (Removal pending)\`;`
            *   Make `clickedElement` unclickable and visually indicate it was wrong (e.g., `clickedElement.style.opacity = '0.5'; clickedElement.style.pointerEvents = 'none';` or remove it: `clickedElement.remove();`).
            *   If `guessesMade === 3` (and this guess was incorrect):
                *   `feedbackTextEl.textContent = "ALL WRONG! The correct answer was [CorrectAnswerValue]. (Score/Next feature pending)";`
                *   Show `newGameButtonEl`.
                *   Disable `hintButtonEl`.
                *   Indicate the correct answer visually if possible (e.g. find the element with `isCorrect=true` and highlight it).

**Testing:**
*   Refresh `index.html`.
*   Click on an option:
    *   If correct: See "CORRECT!" message, "NEW GAME" button appears, hint button might get disabled (or similar).
    *   If incorrect: See "TRY AGAIN..." message, the clicked option becomes disabled/removed.
    *   After 3 incorrect guesses: See "ALL WRONG!" message, "NEW GAME" button appears.
*   The game flow isn't complete yet, but basic interaction should work.
*   Ensure options from previous questions are not interactive after a new question is loaded (clearing `optionsAreaEl.innerHTML` in `renderQuestion` should handle this).
```

---

**Prompt 8: Scoring System Implementation**

```text
We have basic guess handling. Now, let's implement the full scoring logic and update the score display.

**Task:** Implement scoring in `game.js` and integrate it into `app.js`.

**`game.js` requirements:**

1.  **`calculateScore(guessesMadeCount, hintWasUsed)` function:**
    *   `guessesMadeCount`: The number of guesses it took to get the answer right (e.g., 1 for 1st try, 2 for 2nd try, etc.).
    *   `hintWasUsed`: Boolean.
    *   **Logic:**
        *   `let points = 0;`
        *   If `guessesMadeCount === 1`, `points = 8`.
        *   Else if `guessesMadeCount === 2`, `points = 4`.
        *   Else if `guessesMadeCount === 3`, `points = 2`.
        *   Else (`guessesMadeCount === 4` or more, or 3rd incorrect guess leading to 0 points), `points = 0`. (Note: Spec says "4th guess (only one option left after 3 incorrect): 0 points". And "On Third Incorrect Guess (0 points awarded for the question)".) This means if the 3rd guess is *incorrect*, the question score is 0. If the 3rd guess is *correct*, it's 2 points.
    *   If `hintWasUsed` is `true`, `points = Math.floor(points / 2);`.
    *   Return `points`.
    *   **Test this function with various inputs:**
        *   `calculateScore(1, false)` -> 8
        *   `calculateScore(1, true)` -> 4
        *   `calculateScore(3, false)` -> 2
        *   `calculateScore(3, true)` -> 1
        *   `calculateScore(4, false)` -> 0
        *   `calculateScore(0, false)` -> 0 (edge case, should result in 0)

**`app.js` requirements:**

1.  **Modify `handleGuess(event, chosenOptionData)`:**
    *   When `chosenOptionData.isCorrect`:
        1.  `let pointsAwarded = calculateScore(guessesMade, hintUsed);` (Pass current `guessesMade` and `hintUsed` from `game.js` state).
        2.  `currentScore += pointsAwarded;`
        3.  Call `displayScore()`.
        4.  `feedbackTextEl.textContent = \`CORRECT! +${pointsAwarded}\`;`
        5.  Remove all other options from `optionsAreaEl`. Keep the chosen correct one, or simply clear and show correct answer below question area. Per spec: "All other options are removed." and "The correct answer element displayed clearly below it." - this means the main question and the chosen option. Let's simplify for now: clear options, show feedback.
        6.  The `questionAreaEl` should still show the main question (e.g. large swatch). Below it, you can add the text/swatch of the correct answer if it's not already the main display.
           Example: if type was "identify_color", question area has swatch. Now add the correct hex code string below it.
           If type was "identify_swatch", question area has hex. Now add the correct color swatch below it.
           *   To implement "correct answer element displayed clearly below it": After `feedbackTextEl.textContent = ...`, you could append a new element to `feedbackAreaEl` or `questionAreaEl` that shows the correct answer. E.g., if it was an "identify_color" question, show the `currentQuestion.correctAnswerHex`. If "identify_swatch", show a small swatch of `currentQuestion.correctAnswerHex`.
        7.  Show `newGameButtonEl`.
        8.  Disable `hintButtonEl`.
        9.  Set a flag `questionOver = true;` at the start of `handleGuess`, if `questionOver` is true, return early. Set `questionOver = true` on correct guess or 3rd incorrect. Reset in `startNewQuestion`.

    *   When `chosenOptionData.isCorrect` is `false`:
        1.  The clicked element (`event.currentTarget`) should be removed from display (`event.currentTarget.remove();`).
        2.  If `guessesMade === 3` (this was the 3rd incorrect guess):
            *   `feedbackTextEl.textContent = \`INCORRECT. The correct answer was ${currentQuestion.correctAnswerHex}. +0\`;` // Or show swatch if appropriate
            *   If `currentQuestion.type === 'identify_swatch'`, the text should be like: "INCORRECT. The correct answer was [swatch of correctAnswerHex]. +0".
            *   If `currentQuestion.type === 'identify_color'`, the text should be like: "INCORRECT. The correct answer was ${currentQuestion.correctAnswerHex}. +0".
            *   Display the actual correct answer visually (e.g., append the correct hex or a swatch to `feedbackAreaEl`).
            *   `currentScore += 0;` // Explicitly, though it doesn't change
            *   `displayScore();`
            *   Show `newGameButtonEl`.
            *   Disable `hintButtonEl`.
            *   Set `questionOver = true;`.
        3.  Else (1st or 2nd incorrect guess):
            *   To show specific feedback:
                *   If `currentQuestion.type === 'identify_color'` (user picked wrong hex): `feedbackTextEl.textContent = \`TRY AGAIN. THAT HEX CODE WAS...\`;` (We need to show the color of the hex they picked). Create a small inline swatch for `chosenOptionData.value`.
                *   If `currentQuestion.type === 'identify_swatch'` (user picked wrong swatch): `feedbackTextEl.textContent = \`TRY AGAIN. THAT COLOR WAS ${chosenOptionData.value}\`;` (Color the hex code text with its actual color `chosenOptionData.value`).
            *   Example for feedback text: `feedbackTextEl.innerHTML = \`TRY AGAIN. THAT COLOR WAS <span style="color:${chosenOptionData.value}; font-weight:bold;">${chosenOptionData.value}</span>\`;`

2.  **"NEW GAME" Button Functionality:**
    *   Add an event listener to `newGameButtonEl`.
    *   When clicked, it should call `startNewQuestion()`.
    *   `startNewQuestion()` should also reset `questionOver = false;`.

**Testing:**
*   Test all scoring scenarios:
    *   Correct on 1st, 2nd, 3rd try (without hint). Verify points and total score.
    *   3 incorrect guesses. Verify 0 points for question, total score unchanged, correct feedback.
*   Verify "NEW GAME" button works and loads a new question, resetting the state for the new question.
*   Verify feedback messages are accurate and display as specified, including showing the color/hex of the incorrect choice.
*   Verify incorrect options are removed.
*   Verify the display of the correct answer after a correct guess or after 3 incorrect guesses.
```

---

**Prompt 9: Hint System Implementation**

```text
The scoring is in. Now, let's implement the hint system. This involves UI changes for the button, visual changes for hex codes, and score adjustment.

**Task:** Implement the "Show Hint" button functionality and visual hint display.

**`app.js` requirements:**

1.  **`renderHexWithHint(hexString)` function:**
    *   This utility function will be used to display a hex code with its RGB components colored.
    *   Input: `hexString` (e.g., "#AABBCC").
    *   Output: An HTML string.
    *   Example: For `#AABBCC`, it should return something like:
        `<span style="font-family: monospace; font-weight: bold;">#</span>` + // Keep # and styling consistent
        `<span style="color:#AA0000; text-shadow: -1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF;">AA</span>` + // White shadow for dark colors, or adapt
        `<span style="color:#00BB00; text-shadow: ...;">BB</span>` +
        `<span style="color:#0000CC; text-shadow: ...;">CC</span>`
    *   The text shadow here should be light (e.g., white or light gray) if the colored text itself is dark, to ensure readability, or maintain the black stroke if that works better. The spec says "standard black stroke/shadow must still be applied". A simple black `text-shadow: 0 0 1px black;` might be enough over the colored text.
    *   The function should handle hex codes with or without '#'. If '#' is present, it should be part of the output but not colored.
    *   Test this function with a few hex codes to ensure correct HTML output.

2.  **Event Listener for `hintButtonEl`:**
    *   Add a `'click'` event listener to `hintButtonEl`. This should call a new function, `handleHintClick()`.

3.  **`handleHintClick()` function:**
    *   **Steps:**
        1.  If `hintUsed` is already `true` or `questionOver` is true, return (do nothing).
        2.  Set `hintUsed = true;` (the global game state variable from `game.js`).
        3.  Update `hintButtonEl`:
            *   `hintButtonEl.textContent = "Hint Shown";`
            *   Disable it (e.g., `hintButtonEl.disabled = true;`).
        4.  **Apply Visual Hint:**
            *   If `currentQuestion.type === 'identify_color'` (options are hex codes):
                *   Iterate through the currently displayed option elements in `optionsAreaEl`.
                *   For each option element displaying a hex code, get its hex value (from `dataset.value`).
                *   Replace its `innerHTML` with the output of `renderHexWithHint(hexValue)`.
            *   If `currentQuestion.type === 'identify_swatch'` (question is a large hex code):
                *   Get the hex value from `currentQuestion.questionDisplayValue`.
                *   Update the `innerHTML` of the element in `questionAreaEl` (that displays the large hex) with `renderHexWithHint(hexValue)`. Remember to preserve other stylings like font size.

4.  **Modify `startNewQuestion()`:**
    *   Ensure `hintUsed` is reset to `false`.
    *   Reset `hintButtonEl`:
        *   `hintButtonEl.textContent = "Show Hint";`
        *   `hintButtonEl.disabled = false;`

5.  **Modify `calculateScore` (in `game.js`):**
    *   This function already takes `hintWasUsed`. Ensure it's correctly halving the score. No changes needed if it already does.

**Testing:**
*   Start a new game.
*   Click "Show Hint":
    *   Button text changes to "Hint Shown" and becomes inactive.
    *   Visual hint (colored hex characters) appears correctly:
        *   On the 4 hex options if it's an "Identify Color" question.
        *   On the large hex display if it's an "Identify Correct Swatch" question.
    *   The black stroke/shadow on hex characters should still be visible.
*   Answer the question correctly after using the hint. Verify the score awarded is halved.
    *   E.g., 1st guess correct with hint: 4 points.
*   Start a "NEW GAME". Verify the hint button is reset ("Show Hint", active) and `hintUsed` is false for the new question.
*   Verify that using the hint then getting the answer wrong, then getting it right, still applies the halved score for that attempt.
```

---

**Prompt 10: UI Styling and Polish**

```text
The core mechanics and hint system are working. Let's apply the final styling to match the spec's visual requirements.

**Task:** Update `style.css` and refine element styling in `app.js` where necessary.

**`style.css` requirements:**

1.  **General Layout:**
    *   Ensure `question-area`, `options-area`, `feedback-area` are reasonably centered on the page.
    *   `score-display`: Position in the top-right corner. (e.g., `position: absolute; top: 10px; right: 10px; font-size: 1.2em;`).
    *   Provide some spacing between these main areas.

2.  **Font for Hex Codes:**
    *   Use a prominent, readable monospace font. Example: `font-family: 'SF Mono', 'Consolas', 'Liberation Mono', Menlo, Courier, monospace;`. Apply this to elements displaying hex codes.
    *   Ensure hex codes are always uppercase (can be enforced via JS when setting textContent, or `text-transform: uppercase;` in CSS).

3.  **Hex Code Text Styling (Global):**
    *   Apply a thin black stroke or subtle text-shadow for readability, as specified. This should apply to hex codes in the question area and options area, including when the hint is active.
    *   Example: `text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;` (for a stroke effect) or a softer `text-shadow: 1px 1px 2px rgba(0,0,0,0.7);`. The spec preferred a stroke.
    *   When hint is active, `renderHexWithHint` needs to ensure these styles are compatible or reapplied. If `renderHexWithHint` creates spans, these spans should inherit or have this style.

4.  **Color Swatches:**
    *   **Shape:** Large circles. `border-radius: 50%;`.
    *   **Appearance:** Consistent black stroke/shadow. `border: 2px solid #000;` (or `box-shadow: 0 0 5px rgba(0,0,0,0.5);`).
    *   **Size:**
        *   Large swatch in `question-area` (e.g., `width: 150px; height: 150px;` or larger, `min-width/height` if dynamic).
        *   Option swatches in `options-area` (e.g., `width: 80px; height: 80px; margin: 10px;`).
    *   Make sure swatches are `display: inline-block` or use flexbox for layout in `options-area`.
    *   Add `cursor: pointer;` to option swatches.

5.  **Option Elements (General):**
    *   Ensure clickable options (both hex texts and swatches) have a clear clickable affordance (e.g., `cursor: pointer;`, slight hover effect).
    *   Hex code options (buttons/divs) should have padding and look like distinct choices.

6.  **Buttons (`hint-button`, `new-game-button`):**
    *   Style them to be clear and easily clickable. Padding, border, background color.
    *   Disabled state for `hint-button` should be visually distinct (e.g., greyed out).

7.  **Feedback Area:**
    *   Style `feedbackTextEl` for clear readability.

**`app.js` potentially impacted:**
*   In `renderQuestion`, ensure styles applied via JS align with CSS or are primarily handled by CSS classes.
*   The `renderHexWithHint` function needs to be mindful of these global styles, particularly the text stroke/shadow, ensuring it's applied to the colored segments correctly. It might be easier to apply a class to hex display elements and style that class in CSS.

**Testing:**
*   Visually inspect the application on a desktop browser.
*   Confirm:
    *   White background.
    *   Score is top-right.
    *   Question, options, feedback areas are laid out clearly.
    *   Hex codes are uppercase, monospace, with stroke/shadow, and large.
    *   Color swatches are large circles with stroke/shadow.
    *   Options are clearly clickable.
    *   Hint visual effect (colored hex characters) maintains readability and stroke/shadow.
    *   Overall minimalist design, colors "pop".
    *   Buttons are styled and `hint-button` disabled state is clear.
```

---

**Prompt 11: Finalizing Feedback Details & Logging**

```text
We're almost there! Let's ensure all feedback messages are exactly as specified and add some basic logging for debugging.

**Task:** Refine feedback messages in `app.js` and add console logging.

**`app.js` requirements:**

1.  **Review and Refine `handleGuess(event, chosenOptionData)` for feedback messages:**
    *   **On Incorrect Guess:**
        *   When `currentQuestion.type === 'identify_color'` (user picked wrong hex):
            *   The feedback must be: "TRY AGAIN. THAT HEX CODE WAS [actual color swatch of the hex they picked]".
            *   This means `feedbackTextEl.innerHTML` should be something like:
              `"TRY AGAIN. THAT HEX CODE WAS " + chosenOptionData.value + " <div style='display:inline-block; width:20px; height:20px; background-color:${chosenOptionData.value}; border:1px solid black; vertical-align:middle;'></div>"`.
        *   When `currentQuestion.type === 'identify_swatch'` (user picked wrong swatch):
            *   The feedback must be: "TRY AGAIN. THAT COLOR WAS #[hex code of the swatch they picked]" (hex code text colored with its actual color).
            *   `feedbackTextEl.innerHTML` should be:
              `"TRY AGAIN. THAT COLOR WAS <span style='color:${chosenOptionData.value}; font-weight:bold; text-shadow: 1px 1px 1px #000;'>${chosenOptionData.value.toUpperCase()}</span>"`. (Ensure consistent shadow/stroke).
    *   **On Correct Guess:**
        *   Feedback: "CORRECT! +[ScoreAwardedForThisQuestion]". (Already done, just verify points are correct).
        *   Ensure the main question element (large hex/swatch) and the correct answer element are displayed clearly below it, as per spec section 7.
            *   Modify the section after correct guess: Clear `optionsAreaEl`. `feedbackTextEl.textContent = ...`.
            *   Then, append to `feedbackAreaEl` (or a dedicated `correct-answer-display` div) the correct item.
                *   If `currentQuestion.type === 'identify_color'`, append the `currentQuestion.correctAnswerHex` text.
                *   If `currentQuestion.type === 'identify_swatch'`, append a color swatch for `currentQuestion.correctAnswerHex`.
    *   **On Third Incorrect Guess (0 points):**
        *   Feedback: "INCORRECT. The correct answer was [show the correct hex code/swatch, appropriately formatted/colored]. +0".
        *   Ensure the correct answer (hex or swatch) is displayed clearly as part of this message.
        *   `feedbackTextEl.innerHTML = \`INCORRECT. The correct answer was ${ displayCorrectAnswerRepresentation(currentQuestion.correctAnswerHex, currentQuestion.type === 'identify_swatch' ? 'hex' : 'swatch') }. +0\`;`
            *   You'll need a helper `displayCorrectAnswerRepresentation(hex, displayAs)` which returns an HTML string for the hex or swatch.
        *   Crucially, *do not* display "CORRECT!" for the last remaining item if it was reached by elimination due to 3 incorrect prior guesses. (The current logic should handle this, as it branches on `isCorrect` first).

2.  **Initial Instructional Text (in `startNewQuestion()`):**
    *   If `currentQuestion.type === 'identify_color'`, set to "GUESS THE COLOR".
    *   If `currentQuestion.type === 'identify_swatch'`, set to "CHOOSE THE HEX CODE".
    *   (Spec has slight variation from my prompt 6 - update to match spec exactly).

**`game.js` & `app.js` - Logging:**
1.  In `game.js`, within `generateQuestionOptions()`:
    *   If the distractor regeneration loop (the `do...while` loop) iterates more than, say, 10 times, log a warning: `console.warn(\`High distractor regeneration attempts: ${count}\`);`.
2.  In `app.js`, within `startNewQuestion()`:
    *   Log the newly generated question object for debugging: `console.log("New question:", currentQuestion);`.
3.  Add `console.log("HexVex initialized");` at the end of `initGame()`.
4.  Consider logging any unexpected conditions or errors that might arise, though the current logic is fairly straightforward. For example, if `currentQuestion` is somehow null when `handleGuess` is called (should not happen).

**Testing:**
*   Thoroughly test all feedback scenarios:
    *   Incorrect guess for "Identify Color" - check swatch in feedback.
    *   Incorrect guess for "Identify Correct Swatch" - check colored hex in feedback.
    *   Correct guess - check points and display of correct answer.
    *   Third incorrect guess - check "INCORRECT...", display of correct answer, and "+0".
*   Verify initial instructional texts are correct.
*   Check browser console for logs: initialization, new questions, and any warnings from distractor generation.
*   Play several rounds to anecdotally verify color distinctness feels good.
```

This set of prompts should guide the LLM through building HexVex incrementally, with testing and refinement at each stage. Good luck to the LLM!
