
## HexVex: Developer Specification

**1. Project Overview**
The project is to create **HexVex**, a web-based hex color quiz application. Users will be tested on their ability to identify hex color codes or their corresponding color swatches. **HexVex** is designed to be an infinite loop of questions until the user quits by closing the browser. **HexVex** should prioritize simplicity in its codebase, making it potentially suitable as a learning project.

**2. Core Functionality**

*   **Quiz Start:** The first question loads immediately when the user accesses **HexVex**. No "Start Quiz" button is required.
*   **Infinite Questions:** **HexVex** will continuously present new questions until the user closes the browser tab or navigates away.
*   **Question Types:** There are two types of questions, presented randomly:
    *   **Type 1: Identify Color**
        *   Display: One large color swatch.
        *   Options: Four clickable hex code text options (one correct, three incorrect distractors).
        *   Example: `[fuchsia swatch]` `[#FF00FF] [#DF030D] [#AA3212] [#0000AA]`
    *   **Type 2: Identify Correct Swatch**
        *   Display: One large hex code text.
        *   Options: Four clickable color swatches (one correct, three incorrect distractors).
        *   Example: `#FF00FF` `[black swatch] [fuchsia swatch] [yellow swatch] [blue swatch]`

**3. Question Generation Logic**

*   **Randomness:**
    *   The correct answer (hex code and thus swatch color) for each question in **HexVex** is generated randomly within the full hex color space (`#000000` to `#FFFFFF`).
    *   The three incorrect distractor options are also generated randomly.
*   **Color Similarity Check & Distinctness:**
    1.  **Correct Answer Generation:** Generate the correct answer hex code.
    2.  **Distractor Generation:** Generate three random distractor hex codes.
    3.  **Similarity Calculation:** Convert all four hex codes to their RGB values (0-255 for each R, G, B component). Calculate the "distance" between any two colors using the formula:
        `Distance = |R1-R2| + |G1-G2| + |B1-B2|`
    4.  **Threshold:** Two colors are considered "too similar" if their calculated Distance is **less than 75**.
    5.  **Regeneration Logic:**
        *   Compare each of the four colors (correct answer + 3 distractors) with every other color in the set.
        *   If *any* pair is found to be "too similar," discard *all three* current distractors and return to step 2 (generate a brand new set of three distractors).
        *   Repeat this process until a set of four colors (correct answer + 3 distinct distractors) is achieved.
*   **Option Order:** The display order of the four answer options (whether hex codes or swatches) must be randomized for each new question in **HexVex**.

**4. User Interface (UI) & User Experience (UX)**

*   **General Layout:**
    *   **Top Area (Question):** The large hex code (for "Identify Correct Swatch") OR the large color swatch (for "Identify Color") is displayed prominently, centered.
    *   **Middle Area (Options):** A horizontal row of 4 clickable color swatches OR 4 clickable hex code texts is displayed below the question.
    *   **Bottom Area (Instructions/Feedback/Controls):** Content changes based on game state (see Feedback section).
    *   **Top-Right Corner:** Display the running "YOUR SCORE: [Total Score]". This score is session-based and resets to 0 on page refresh. No user accounts for **HexVex**.
*   **Visual Style:**
    *   **Overall:** Minimalist design for **HexVex**.
    *   **Background:** Plain white page background (`#FFFFFF`).
    *   **Emphasis:** Colors should "pop" and be the dominant visual element in **HexVex**.
*   **Element Styling:**
    *   **Hex Code Text:**
        *   Font: Large, "Muxtape-like" (prominent and easily readable).
        *   Case: Always uppercase (e.g., `#FF00FF`).
        *   Appearance: Apply a thin black stroke or a subtle text-shadow to ensure readability against any color, especially during the "hint" display. This styling applies at all times.
    *   **Color Swatches:**
        *   Shape: Large circles.
        *   Appearance: Apply a consistent black stroke or subtle shadow effect to help them stand out against the white background.
*   **Interaction:**
    *   Selecting an answer is done by directly clicking on the swatch or the hex code text.
    *   There is no separate "Submit Answer" button; clicking an option immediately registers it as a guess in **HexVex**.

**5. Hint System**

*   **"Show Hint" Button:**
    *   **Visibility:** Always visible during the guessing phase of a question in **HexVex**.
    *   **Default State (New Question):** Active (clickable), text reads "Show Hint".
    *   **On Click:**
        1.  The visual hint (see below) is applied to the relevant hex codes.
        2.  The potential score for the current question is immediately halved (see Scoring System).
        3.  The "Show Hint" button becomes inactive (e.g., greyed out, unclickable).
        4.  The button text changes to "Hint Shown".
    *   **Persistence:** Once activated for a question, the visual hint and the button's "Hint Shown" (inactive) state remain for all subsequent guesses on that *same* question. It resets for the next question.
*   **Visual Hint Representation:**
    *   When active, the characters of affected hex codes are colored to show their individual RGB component strengths.
    *   For a hex code like `#AABBCC`:
        *   The `AA` characters are colored with `#AA0000`.
        *   The `BB` characters are colored with `#00BB00`.
        *   The `CC` characters are colored with `#0000CC`.
    *   This applies to:
        *   The four hex code options in "Identify Color" questions.
        *   The single large hex code question in "Identify Correct Swatch" questions.
    *   The standard black stroke/shadow must still be applied to these colored characters for readability.

**6. Scoring System**

*   **Points per Question (4 options total) in HexVex:**
    *   1st correct guess: 8 points
    *   2nd correct guess: 4 points
    *   3rd correct guess: 2 points
    *   4th guess (only one option left after 3 incorrect): 0 points
*   **Impact of "Show Hint":** If "Show Hint" is activated for a question, the above scores are halved:
    *   1st correct guess (hint on): 4 points
    *   2nd correct guess (hint on): 2 points
    *   3rd correct guess (hint on): 1 point
    *   4th guess (hint on): 0 points
*   **Total Score:**
    *   Displayed in the upper-right as "YOUR SCORE: [Total Score]".
    *   Initializes to 0 when **HexVex** first loads.
    *   Updates after each question is resolved.
    *   Resets if the page is refreshed or navigated away from.

**7. Feedback Mechanisms & Game Flow in HexVex**

*   **On Incorrect Guess:**
    1.  The incorrectly chosen option (swatch or hex code) is removed from the displayed choices.
    2.  A feedback message appears in the bottom area:
        *   If "Identify Color" (user picked wrong hex): "TRY AGAIN. THAT HEX CODE WAS [actual color swatch of the hex they picked]"
        *   If "Identify Correct Swatch" (user picked wrong swatch): "TRY AGAIN. THAT COLOR WAS #[hex code of the swatch they picked]" (hex code text colored with its actual color).
    3.  User can then guess from the remaining options.
*   **On Correct Guess:**
    1.  All other options are removed.
    2.  The bottom area displays:
        *   The question element (large hex/swatch).
        *   The correct answer element displayed clearly below it.
        *   Text: "CORRECT! +[ScoreAwardedForThisQuestion]" (e.g., "CORRECT! +8").
        *   A button labeled "NEW GAME".
    3.  The total score in the upper-right is updated.
    4.  Clicking "NEW GAME" loads the next random question immediately.
*   **On Third Incorrect Guess (0 points awarded for the question):**
    *   This occurs when two options were remaining, and the user picked the incorrect one.
    *   The selected incorrect option is removed.
    *   The bottom area displays:
        *   Text: "INCORRECT. The correct answer was [show the correct hex code/swatch, appropriately formatted/colored]."
        *   Text: "+0" (indicating score for this question).
        *   A button labeled "NEW GAME".
    *   The total score is updated (effectively unchanged).
    *   Clicking "NEW GAME" loads the next random question immediately.
    *   Crucially, do *not* display "CORRECT!" in this scenario for the last remaining item.
*   **Initial State (Page Load):**
    *   A random question is immediately displayed in **HexVex**.
    *   "YOUR SCORE: 0" is visible.
    *   "Show Hint" button is active.
    *   Instructional text like "GUESS THE COLOR" or "CHOOSE THE HEX CODE" is visible in the bottom area.

**8. Application Flow & State Management for HexVex**

*   **Next Question Transition:** Instant change when "NEW GAME" is clicked. No loading screens or animations for MVP.
*   **Quitting:** User "quits" by closing the browser tab or navigating away. No explicit "Quit" button in **HexVex**.

**9. Technical Specifications for HexVex**

*   **Primary Goal:** MVP with minimal complexity.
*   **Technology Stack:** Plain HTML, CSS, and JavaScript ("Vanilla JS") is preferred to keep dependencies and conceptual overhead low. No specific frameworks required for **HexVex**.
*   **Responsiveness:** Design for desktop-first. Mobile/tablet responsiveness is a future iteration and not part of this MVP.
*   **Performance:** While **HexVex** is infinite, advanced performance optimization for extremely long sessions is out of scope for the MVP. Assume standard browser capabilities.

**10. Error Handling & Logging for HexVex**

*   **Error Display:** Standard browser error handling is acceptable for issues like resource loading failures.
*   **Logging:** Implement `console.log()` statements for any **HexVex**-specific errors or notable events that might occur during runtime (e.g., unexpected issues in color generation, though the logic should prevent most). This will aid future debugging.

**11. Testing Plan (High-Level for MVP of HexVex)**

*   **A. Unit/Function Tests (Developer responsibility):**
    *   Verify the `Distance = |R1-R2| + |G1-G2| + |B1-B2|` calculation is correct.
    *   Test the color generation logic:
        *   Ensures 4 options are generated.
        *   Ensures the similarity check (distance < 75) correctly identifies similar colors.
        *   Ensures the "blow up the 3 distractors" logic works and eventually produces a distinct set.
    *   Test the scoring logic:
        *   Correct points awarded for 1st, 2nd, 3rd guess without hint.
        *   Correct points awarded for 1st, 2nd, 3rd guess with hint.
        *   0 points for 4th forced "guess" or 3rd incorrect guess scenario.
    *   Test hint activation halves score correctly.
*   **B. Functional/End-to-End Tests (Manual for MVP):**
    *   **Question Type 1 (Identify Color):**
        *   Verify large swatch displays.
        *   Verify 4 hex code options display, positions randomized.
        *   Verify clicking correct/incorrect hex codes triggers appropriate feedback and scoring.
    *   **Question Type 2 (Identify Correct Swatch):**
        *   Verify large hex code displays.
        *   Verify 4 swatch options display, positions randomized.
        *   Verify clicking correct/incorrect swatches triggers appropriate feedback and scoring.
    *   **Hint System:**
        *   "Show Hint" button functions: "Show Hint" -> "Hint Shown", becomes inactive.
        *   Visual hint (colored hex characters) appears correctly for both question types.
        *   Score halving is applied correctly when hint is used.
        *   Hint persists for the duration of the question.
    *   **Scoring & Feedback:**
        *   Verify correct points awarded and total score updates for all guess scenarios.
        *   Verify all feedback messages ("TRY AGAIN...", "CORRECT! +X", "INCORRECT...") are accurate and display as specified.
        *   Verify removal of incorrect options.
    *   **General Flow:**
        *   First question loads immediately.
        *   "NEW GAME" button loads next question instantly.
        *   Total score starts at 0 and persists within session.
    *   **Visuals:**
        *   Confirm white background, large fonts, large circular swatches.
        *   Confirm hex codes are uppercase with stroke/shadow.
        *   Confirm swatches have stroke/shadow.
        *   Confirm layout matches specification (question top, options middle, controls/feedback bottom, score top-right).
    *   **Color Distinctness:** Play several rounds of **HexVex** to anecdotally verify that options are generally distinct and the similarity threshold feels reasonable.
*   **C. User Acceptance Testing (UAT - by Product Owner/Requestor):**
    *   Overall usability and enjoyment of **HexVex**.
    *   Adherence to the specified look, feel, and core mechanics.
    *   Confirmation that the MVP meets the initial vision for **HexVex**.

This revised specification now consistently uses "HexVex" as requested.
