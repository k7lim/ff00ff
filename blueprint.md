## HexVex Project Blueprint

**I. Core Logic Modules (Primarily `utils.js` and `game.js`)**

1.  **Color Utilities (`utils.js`):**
    *   Generate random hex color codes.
    *   Convert hex codes to RGB.
    *   Calculate color distance using the specified formula.
2.  **Question Generation (`game.js`):**
    *   Generate a correct answer (hex + RGB).
    *   Generate three distractor hex codes.
    *   Implement the similarity check and regeneration logic for distractors to ensure distinctness.
    *   Assemble a question object: type (Identify Color / Identify Swatch), question value (color/hex), options (with correct flag), and the correct answer.
    *   Randomize option order.
    *   Randomize question type.
3.  **Scoring Logic (`game.js`):**
    *   Calculate points based on the number of guesses.
    *   Factor in hint usage (halve score).
4.  **State Management (`game.js`):**
    *   `currentScore`
    *   `currentQuestion` (the full object)
    *   `hintUsed` (boolean for current question)
    *   `guessesMade` (for current question)

**II. UI & Interaction Module (Primarily `app.js` and `style.css`)**

1.  **HTML Structure (`index.html`):**
    *   Container for score display.
    *   Container for the main question (large swatch or hex).
    *   Container for answer options (clickable swatches or hex codes).
    *   Container for feedback messages and "NEW GAME" button.
    *   "Show Hint" button.
2.  **CSS Styling (`style.css`):**
    *   Minimalist design, white background.
    *   Large, readable fonts (monospace for hex codes).
    *   Uppercase hex codes with black stroke/shadow.
    *   Large circular color swatches with black stroke/shadow.
    *   Layout: question top, options middle, feedback/controls bottom. Score top-right.
3.  **DOM Manipulation & Rendering (`app.js`):**
    *   Update score display.
    *   Render the current question (swatch or hex).
    *   Render answer options (hex codes or swatches), ensuring they are clickable.
    *   Render visual hint on hex codes.
    *   Update feedback text.
    *   Show/hide/enable/disable buttons ("Show Hint", "NEW GAME").
    *   Remove incorrect options after a guess.
4.  **Event Handling (`app.js`):**
    *   Click on answer options.
    *   Click on "Show Hint" button.
    *   Click on "NEW GAME" button.
5.  **Game Flow Control (`app.js`):**
    *   Initialize game on page load (first question).
    *   Process guesses: check correctness, update state, trigger feedback.
    *   Transition to next question.

**III. Overall Application Flow**

1.  **Initialization:** Load page -> display score (0) -> generate and display first question -> "Show Hint" active -> display initial instructions.
2.  **Guessing Loop:** User clicks option ->
    *   **Correct:** Calculate score, update total score, display "CORRECT!" feedback, show correct answer details, show "NEW GAME" button.
    *   **Incorrect:** Remove option, display "TRY AGAIN..." feedback. If 3rd incorrect, display "INCORRECT..." feedback, score 0 for question, show "NEW GAME" button.
3.  **Hint Usage:** User clicks "Show Hint" -> halve potential score, display visual hint, disable hint button for current question.
4.  **New Question:** User clicks "NEW GAME" -> generate and display new random question, reset hint status, reset guesses for question, update instructional text.
5.  **Quitting:** User closes browser.

## Iterative Implementation Plan (Small Steps)

We'll build this incrementally, focusing on getting core pieces working and then layering on UI and advanced features. Each step will be a prompt for the LLM.

---
