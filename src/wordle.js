(function() {
    "use strict";

    class GameTile extends HTMLElement {
        _letter = "";
        _state = "empty";
        _animation = "idle";
        _last = false;
        _reveal = false;

        set last(value) {
            this._last = value;
        }

        connectedCallback() {
            var self = this;
            if (!this.$tile) {
                var tileDiv = document.createElement("div");
                tileDiv.classList.add("tile");
                tileDiv.dataset.state = "empty";
                tileDiv.dataset.animation = "idle";
                this.appendChild(tileDiv);
                this.$tile = tileDiv;
                this.$tile.addEventListener("animationend", function(event) {
                    if (event.animationName === "PopIn") {
                        self._animation = "idle";
                    }
                    if (event.animationName === "FlipIn") {
                        self.$tile.dataset.state = self._state;
                        self._animation = "flip-out";
                    }
                    if (event.animationName === "FlipOut") {
                        self._animation = "idle";
                        if (self._last) {
                            self.dispatchEvent(new CustomEvent("game-last-tile-revealed-in-row", {
                                bubbles: true
                            }));
                        }
                    }
                    self._render();
                });
            }
            this._render();
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
            case "letter":
                if (newValue === oldValue) break;
                var letter = "null" === newValue ? "" : newValue;
                this._letter = letter;
                this._state = letter ? "tbd" : "empty";
                this._animation = letter ? "pop" : "idle";
                break;
            case "evaluation":
                if (!newValue) break;
                this._state = newValue;
                break;
            case "reveal":
                this._animation = "flip-in";
                this._reveal = true;
            }
            this._render();
        }

        _render() {
            if (!this.$tile) return;

            this.$tile.textContent = this._letter;

            if (this._state === "empty" || this._state === "tbd") {
                this.$tile.dataset.state = this._state;
            }

            var shouldAnimate = this._state === "empty" || this._state === "tbd" || this._reveal;
            if (shouldAnimate && this.$tile.dataset.animation !== this._animation) {
                this.$tile.dataset.animation = this._animation;
            }
        }

        static get observedAttributes() {
            return ["letter", "evaluation", "reveal"];
        }
    }
    customElements.define("game-tile", GameTile);

    class GameRow extends HTMLElement {
        _letters = "";
        _evaluation = [];
        _length;

        get evaluation() {
            return this._evaluation;
        }

        set evaluation(value) {
            var self = this;
            this._evaluation = value;
            this.$tiles && this.$tiles.forEach(function(tile, idx) {
                tile.setAttribute("evaluation", self._evaluation[idx]);
                setTimeout(function() {
                    tile.setAttribute("reveal", "");
                }, 300 * idx);
            });
        }

        connectedCallback() {
            var self = this;
            var rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
            this.appendChild(rowDiv);
            this.$row = rowDiv;
            var createTile = function(i) {
                var tile = document.createElement("game-tile");
                var letter = self._letters[i];
                if (letter) {
                    tile.setAttribute("letter", letter);
                }
                if (self._evaluation[i]) {
                    tile.setAttribute("evaluation", self._evaluation[i]);
                    setTimeout(function() {
                        tile.setAttribute("reveal", "");
                    }, 100 * i);
                }
                if (i === self._length - 1) {
                    tile.last = true;
                }
                self.$row.appendChild(tile);
            };
            for (var idx = 0; idx < this._length; idx++) {
                createTile(idx);
            }
            this.$tiles = this.querySelectorAll("game-tile");
            this.addEventListener("animationend", function(event) {
                "Shake" === event.animationName && self.removeAttribute("invalid");
            });
        }

        attributeChangedCallback(name, oldValue, newValue) {
            switch (name) {
            case "letters":
                this._letters = newValue || "";
                break;
            case "length":
                this._length = parseInt(newValue, 10);
                break;
            case "win":
                if (null === newValue) {
                    this.$tiles.forEach(function(tile) {
                        tile.classList.remove("win");
                    });
                    break;
                }
                this.$tiles.forEach(function(tile, idx) {
                    tile.classList.add("win");
                    tile.style.animationDelay = "".concat(100 * idx, "ms");
                });
            }
            this._render();
        }

        _render() {
            var self = this;
            this.$row && this.$tiles.forEach(function(tile, idx) {
                var letter = self._letters[idx];
                letter ? tile.setAttribute("letter", letter) : tile.removeAttribute("letter");
            });
        }

        static get observedAttributes() {
            return ["letters", "length", "invalid", "win"];
        }
    }
    customElements.define("game-row", GameRow);

    var DARK_THEME_KEY = "darkTheme",
        COLOR_BLIND_THEME_KEY = "colorBlindTheme",
        SHOW_HELP_ON_LOAD_KEY = "showHelpOnLoad",
        SHARE_TEXT_ADDITIONS_KEY = "shareTextAdditions",
        DEFAULT_SHARE_TEXT_ADDITIONS = { header: "(Left Wordle)", afterGrid: "" };

    class GameThemeManager extends HTMLElement {
        isDarkTheme = false;
        isColorBlindTheme = false;

        constructor() {
            super();
            var darkStored = JSON.parse(window.localStorage.getItem(DARK_THEME_KEY));
            var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            var cbStored = JSON.parse(window.localStorage.getItem(COLOR_BLIND_THEME_KEY));

            if (darkStored === true || darkStored === false) {
                this.setDarkTheme(darkStored);
            } else if (prefersDark) {
                this.setDarkTheme(true);
            }

            if (cbStored === true || cbStored === false) {
                this.setColorBlindTheme(cbStored);
            }
        }

        setDarkTheme(enabled) {
            var body = document.querySelector("body");
            if (enabled) {
                body.classList.add("nightmode");
            } else {
                body.classList.remove("nightmode");
            }
            this.isDarkTheme = enabled;
            window.localStorage.setItem(DARK_THEME_KEY, JSON.stringify(enabled));
        }

        setColorBlindTheme(enabled) {
            var body = document.querySelector("body");
            if (enabled) {
                body.classList.add("colorblind");
            } else {
                body.classList.remove("colorblind");
            }
            this.isColorBlindTheme = enabled;
            window.localStorage.setItem(COLOR_BLIND_THEME_KEY, JSON.stringify(enabled));
        }

        connectedCallback() {
            var self = this;
            this.addEventListener("game-setting-change", function(event) {
                var detail = event.detail,
                    name = detail.name,
                    checked = detail.checked;
                switch (name) {
                case "dark-theme":
                    return void self.setDarkTheme(checked);
                case "color-blind-theme":
                    return void self.setColorBlindTheme(checked);
                }
            });
        }
    }
    customElements.define("game-theme-manager", GameThemeManager);

    function deepMerge(target, source) {
        var result = Object.assign({}, target);
        for (var key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])
                && target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
                result[key] = deepMerge(target[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    }

    var GAME_STATE_KEY = "gameState",
        DEFAULT_GAME_STATE = {
            boardState: null,
            evaluations: null,
            rowIndex: null,
            solution: null,
            gameStatus: null,
            lastPlayedTs: null,
            lastCompletedTs: null,
            restoringFromLocalStorage: null,
            hardMode: false
        };

    function getGameState() {
        var stored = window.localStorage.getItem(GAME_STATE_KEY) || JSON.stringify(DEFAULT_GAME_STATE);
        return JSON.parse(stored);
    }

    function saveGameState(updates) {
        var current = getGameState();
        var merged = deepMerge(current, updates);
        window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(merged));
    }

    var gameSettingsTemplate = document.getElementById("settings-template");

    class GameSettings extends HTMLElement {
        gameApp;

        connectedCallback() {
            var self = this;
            this.appendChild(gameSettingsTemplate.content.cloneNode(true));
            var wordleHash = window.wordle;
            this.querySelector("#hash").textContent = wordleHash ? wordleHash.hash : undefined;
            this.querySelector("#puzzle-number").textContent = "#".concat(this.gameApp.dayOffset);
            this.addEventListener("game-switch-change", function(event) {
                event.stopPropagation();
                var detail = event.detail,
                    name = detail.name,
                    checked = detail.checked,
                    disabled = detail.disabled;
                self.dispatchEvent(new CustomEvent("game-setting-change", {
                    bubbles: true,
                    detail: { name: name, checked: checked, disabled: disabled }
                }));
                self.render();
            });
            // Handle text input changes for share text additions
            this.querySelector("#share-header-append").addEventListener("input", function(event) {
                self.saveShareTextAdditions();
            });
            this.querySelector("#share-after-grid").addEventListener("input", function(event) {
                self.saveShareTextAdditions();
            });
            this.render();
        }

        saveShareTextAdditions() {
            var headerVal = this.querySelector("#share-header-append").value;
            var afterGridVal = this.querySelector("#share-after-grid").value;
            window.localStorage.setItem(SHARE_TEXT_ADDITIONS_KEY, JSON.stringify({
                header: headerVal,
                afterGrid: afterGridVal
            }));
        }

        render() {
            var body = document.querySelector("body");
            if (body.classList.contains("nightmode")) {
                this.querySelector("#dark-theme").setAttribute("checked", "");
            }
            if (body.classList.contains("colorblind")) {
                this.querySelector("#color-blind-theme").setAttribute("checked", "");
            }
            var state = getGameState();
            if (state.hardMode) {
                this.querySelector("#hard-mode").setAttribute("checked", "");
            }
            // Disable hard mode toggle if game is in progress and at least one guess has been made
            if (!state.hardMode && state.gameStatus === "IN_PROGRESS" && state.rowIndex !== 0) {
                this.querySelector("#hard-mode").removeAttribute("checked");
                this.querySelector("#hard-mode").setAttribute("disabled", "");
            }
            // Show help on load - default to true (checked) if not set
            var showHelpOnLoad = JSON.parse(window.localStorage.getItem(SHOW_HELP_ON_LOAD_KEY));
            if (showHelpOnLoad !== false) {
                this.querySelector("#show-help-on-load").setAttribute("checked", "");
            }
            // Share text additions - use stored values or defaults
            var stored = window.localStorage.getItem(SHARE_TEXT_ADDITIONS_KEY);
            var shareAdditions = stored ? JSON.parse(stored) : DEFAULT_SHARE_TEXT_ADDITIONS;
            this.querySelector("#share-header-append").value = shareAdditions.header || "";
            this.querySelector("#share-after-grid").value = shareAdditions.afterGrid || "";
        }
    }
    customElements.define("game-settings", GameSettings);

    class GameToast extends HTMLElement {
        _duration;

        connectedCallback() {
            var self = this;
            var toastDiv = document.createElement("div");
            toastDiv.classList.add("toast");
            this.appendChild(toastDiv);
            toastDiv.textContent = this.getAttribute("text");
            this._duration = this.getAttribute("duration") || 1e3;
            "Infinity" !== this._duration && setTimeout(function() {
                toastDiv.classList.add("fade");
            }, this._duration);
            toastDiv.addEventListener("transitionend", function() {
                self.parentNode.removeChild(self);
            });
        }
    }

    function gtag() {
        dataLayer.push(arguments);
    }
    customElements.define("game-toast", GameToast);
    window.dataLayer = window.dataLayer || [];
    gtag("js", new Date);
    var wordleRef = window.wordle;
    gtag("config", "G-2SSGMHY3NP", {
        app_version: wordleRef ? wordleRef.hash : undefined,
        debug_mode: false
    });

    const PRESENT = "present";
    const CORRECT = "correct";
    const ABSENT = "absent";
    const STATE_PRECEDENCE = {
        unknown: 0,
        absent: 1,
        present: 2,
        correct: 3
    };

    function aggregateLetterEvaluations(boardState, evaluations) {
        var result = {};
        boardState.forEach(function(word, rowIdx) {
            if (evaluations[rowIdx])
                for (var i = 0; i < word.length; i++) {
                    var letter = word[i],
                        evaluation = evaluations[rowIdx][i],
                        current = result[letter] || "unknown";
                    STATE_PRECEDENCE[evaluation] > STATE_PRECEDENCE[current] && (result[letter] = evaluation);
                }
        });
        return result;
    }

    function getOrdinal(num) {
        var suffixes = ["th", "st", "nd", "rd"],
            mod100 = num % 100;
        return num + (suffixes[(mod100 - 20) % 10] || suffixes[mod100] || suffixes[0]);
    }

    const PUZZLE_START_DATE = new Date(2021, 5, 19); // FUCKING JS 0 Index Month, 5 is JUNE

    function calculateDaysBetween(start, end) {
        var startDate = new Date(start);
        var endDate = new Date(end);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        var diffMs = endDate - startDate;
        return Math.round(diffMs / 86_400_000);
    }

    function getSolution(date) {
        var offset = getDayOffset(date);
        // modulo will return the index in a loop if length is 100 and offset is 333 it will return 33
        return answer_list[offset % answer_list.length];
    }

    function getDayOffset(date) {
        return calculateDaysBetween(PUZZLE_START_DATE, date);
    }

    var ALPHABET = "abcdefghijklmnopqrstuvwxyz",
        ROT13_MAP = [].concat(
            Array.from(ALPHABET.split("").slice(13)),
            Array.from(ALPHABET.split("").slice(0, 13))
        );

    function encodeWord(word) {
        console.debug('parsing stats', word);
        for (var result = "", i = 0; i < word.length; i++) {
            var idx = ALPHABET.indexOf(word[i]);
            result += idx >= 0 ? ROT13_MAP[idx] : "_";
        }
        return result;
    }

    const FAIL_KEY = "fail";
    const DEFAULT_STATISTICS = {
        currentStreak: 0,
        maxStreak: 0,
        guesses: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            fail: 0
        },
        winPercentage: 0,
        gamesPlayed: 0,
        gamesWon: 0,
        averageGuesses: 0
    };

    function getStatistics() {
        var storedStats = window.localStorage.getItem("statistics") || JSON.stringify(DEFAULT_STATISTICS);
        console.debug('loaded stats', storedStats);
        return JSON.parse(storedStats);
    }

    function updateStatistics(gameResults) {
        var stats = getStatistics();

        // Update guesses and streak
        if (gameResults.isWin) {
            stats.guesses[gameResults.numGuesses] += 1;
            stats.currentStreak = gameResults.isStreak ? stats.currentStreak + 1 : 1;
        } else {
            stats.currentStreak = 0;
            stats.guesses.fail += 1;
        }

        stats.maxStreak = Math.max(stats.currentStreak, stats.maxStreak);
        stats.gamesPlayed += 1;
        stats.gamesWon += gameResults.isWin ? 1 : 0;
        stats.winPercentage = Math.round(stats.gamesWon / stats.gamesPlayed * 100);

        // Calculate average guesses (excluding failures)
        stats.averageGuesses = Math.round(
            Object.entries(stats.guesses).reduce(function(total, entry) {
                var key = entry[0];
                var count = entry[1];
                return key !== FAIL_KEY ? total + key * count : total;
            }, 0) / stats.gamesWon
        );

        window.localStorage.setItem("statistics", JSON.stringify(stats));
    }

    function evaluateGuess(guessed_wd, ans_wd) {
        var result = Array(ans_wd.length).fill(ABSENT);
        var guessUnmatched = Array(ans_wd.length).fill(true);
        var solutionUnmatched = Array(ans_wd.length).fill(true);

        // First pass: mark exact matches
        for (var idx = 0; idx < guessed_wd.length; idx++) {
            if (guessed_wd[idx] === ans_wd[idx] && solutionUnmatched[idx]) {
                result[idx] = CORRECT;
                guessUnmatched[idx] = false;
                solutionUnmatched[idx] = false;
            }
        }

        // Second pass: mark present (right letter, wrong position)
        for (var idx = 0; idx < guessed_wd.length; idx++) {
            if (guessUnmatched[idx]) {
                var guessChar = guessed_wd[idx];
                for (var ans_idx = 0; ans_idx < ans_wd.length; ans_idx++) {
                    if (solutionUnmatched[ans_idx] && guessChar === ans_wd[ans_idx]) {
                        result[idx] = PRESENT;
                        solutionUnmatched[ans_idx] = false;
                        break;
                    }
                }
            }
        }

        return result;
    }

    function validateHardMode(guess, previousGuess, previousEvaluation) {
        if (!guess || !previousGuess || !previousEvaluation) {
            return { validGuess: true };
        }

        // Check that all previously correct letters are in the same positions
        for (var idx = 0; idx < previousEvaluation.length; idx++) {
            if (previousEvaluation[idx] === CORRECT && guess[idx] !== previousGuess[idx]) {
                return {
                    validGuess: false,
                    errorMessage: "".concat(getOrdinal(idx + 1), " letter must be ").concat(previousGuess[idx].toUpperCase())
                };
            }
        }

        // Count required letters (those marked correct or present in previous evaluation)
        var requiredLetters = {};
        for (var idx = 0; idx < previousEvaluation.length; idx++) {
            if ([CORRECT, PRESENT].includes(previousEvaluation[idx])) {
                var letter = previousGuess[idx];
                requiredLetters[letter] = (requiredLetters[letter] || 0) + 1;
            }
        }

        // Count letters in current guess
        var guessLetterCounts = guess.split("").reduce(function(counts, letter) {
            counts[letter] = (counts[letter] || 0) + 1;
            return counts;
        }, {});

        // Check that all required letters appear enough times
        for (var requiredLetter in requiredLetters) {
            if ((guessLetterCounts[requiredLetter] || 0) < requiredLetters[requiredLetter]) {
                return {
                    validGuess: false,
                    errorMessage: "Guess must contain ".concat(requiredLetter.toUpperCase())
                };
            }
        }

        return { validGuess: true };
    }

    var gameAppTemplate = document.createElement("template");
    gameAppTemplate.innerHTML = document.getElementById('header-container').innerHTML;

    var qaButtons = document.createElement("template");
    qaButtons.innerHTML = `
<button id="reveal">reveal</button>
<button id="shake">shake</button>
<button id="bounce">bounce</button>
<button id="toast">toast</button>
<button id="modal">modal</button>
`;

    const GAME_STATUS_IN_PROGRESS = "IN_PROGRESS";
    const GAME_STATUS_WIN = "WIN";
    const GAME_STATUS_FAIL = "FAIL";
    const WIN_COMMENTS = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Whew"];

    class GameApp extends HTMLElement {
        tileIndex = 0;
        rowIndex = 0;
        solution;
        boardState;
        evaluations;
        canInput = true;
        gameStatus = GAME_STATUS_IN_PROGRESS;
        letterEvaluations = {};
        $board;
        $keyboard;
        $game;
        today;
        lastPlayedTs;
        lastCompletedTs;
        hardMode;
        dayOffset;

        constructor() {
            super();
            this.today = new Date;
            var state = getGameState();
            this.lastPlayedTs = state.lastPlayedTs;
            if (!this.lastPlayedTs || calculateDaysBetween(new Date(this.lastPlayedTs), this.today) >= 1) {
                this.boardState = new Array(6).fill("");
                this.evaluations = new Array(6).fill(null);
                this.solution = getSolution(this.today);
                this.dayOffset = getDayOffset(this.today);
                this.lastCompletedTs = state.lastCompletedTs;
                this.hardMode = state.hardMode;
                this.restoringFromLocalStorage = false;
                saveGameState({
                    rowIndex: this.rowIndex,
                    boardState: this.boardState,
                    evaluations: this.evaluations,
                    solution: this.solution,
                    gameStatus: this.gameStatus
                });
                gtag("event", "level_start", {
                    level_name: encodeWord(this.solution)
                });
            } else {
                this.boardState = state.boardState;
                this.evaluations = state.evaluations;
                this.rowIndex = state.rowIndex;
                this.solution = state.solution;
                this.dayOffset = getDayOffset(this.today);
                this.letterEvaluations = aggregateLetterEvaluations(this.boardState, this.evaluations);
                this.gameStatus = state.gameStatus;
                this.lastCompletedTs = state.lastCompletedTs;
                this.hardMode = state.hardMode;
                this.gameStatus !== GAME_STATUS_IN_PROGRESS && (this.canInput = false);
                this.restoringFromLocalStorage = true;
            }
        }

        evaluateRow() {
            if (5 === this.tileIndex && !(this.rowIndex >= 6)) {
                var row = this.$board.querySelectorAll("game-row")[this.rowIndex];
                var guess = this.boardState[this.rowIndex];
                if (!valid_guesses.includes(guess) && !answer_list.includes(guess)) {
                    row.setAttribute("invalid", "");
                    this.addToast("Not in word list");
                    return;
                }
                if (this.hardMode) {
                    var hardModeResult = validateHardMode(
                        guess,
                        this.boardState[this.rowIndex - 1],
                        this.evaluations[this.rowIndex - 1]
                    );
                    var validGuess = hardModeResult.validGuess;
                    var errorMessage = hardModeResult.errorMessage;
                    if (!validGuess) {
                        row.setAttribute("invalid", "");
                        this.addToast(errorMessage || "Not valid in hard mode");
                        return;
                    }
                }
                var evaluation = evaluateGuess(guess, this.solution);
                this.evaluations[this.rowIndex] = evaluation;
                this.letterEvaluations = aggregateLetterEvaluations(this.boardState, this.evaluations);
                row.evaluation = this.evaluations[this.rowIndex];
                this.rowIndex += 1;
                var outOfGuesses = this.rowIndex >= 6;
                var isCorrect = evaluation.every(function(val) {
                    return val === "correct";
                });
                if (outOfGuesses || isCorrect) {
                    var isStreak = !!this.lastCompletedTs &&
                        calculateDaysBetween(new Date(this.lastCompletedTs), new Date) === 1;
                    updateStatistics({
                        isWin: isCorrect,
                        isStreak: isStreak,
                        numGuesses: this.rowIndex
                    });
                    saveGameState({ lastCompletedTs: Date.now() });
                    window.localStorage.setItem(SHOW_HELP_ON_LOAD_KEY, JSON.stringify(false));
                    if (isCorrect) {
                        this.gameStatus = GAME_STATUS_WIN;
                    } else {
                        this.gameStatus = GAME_STATUS_FAIL;
                    }
                    gtag("event", "level_end", {
                        level_name: encodeWord(this.solution),
                        num_guesses: this.rowIndex,
                        success: isCorrect
                    });
                }
                this.tileIndex = 0;
                this.canInput = false;
                saveGameState({
                    rowIndex: this.rowIndex,
                    boardState: this.boardState,
                    evaluations: this.evaluations,
                    solution: this.solution,
                    gameStatus: this.gameStatus,
                    lastPlayedTs: Date.now()
                });
            }
        }

        addLetter(letter) {
            if (this.gameStatus !== GAME_STATUS_IN_PROGRESS) return;
            if (!this.canInput) return;
            if (this.tileIndex >= 5) return;

            this.boardState[this.rowIndex] += letter;
            var row = this.$board.querySelectorAll("game-row")[this.rowIndex];
            row.setAttribute("letters", this.boardState[this.rowIndex]);
            this.tileIndex += 1;
        }

        removeLetter() {
            if (this.gameStatus !== GAME_STATUS_IN_PROGRESS) return;
            if (!this.canInput) return;
            if (this.tileIndex <= 0) return;

            this.boardState[this.rowIndex] = this.boardState[this.rowIndex].slice(0, -1);
            var row = this.$board.querySelectorAll("game-row")[this.rowIndex];
            if (this.boardState[this.rowIndex]) {
                row.setAttribute("letters", this.boardState[this.rowIndex]);
            } else {
                row.removeAttribute("letters");
            }
            row.removeAttribute("invalid");
            this.tileIndex -= 1;
        }

        submitGuess() {
            if (this.gameStatus !== GAME_STATUS_IN_PROGRESS) return;
            if (!this.canInput) return;

            if (this.tileIndex !== 5) {
                this.$board.querySelectorAll("game-row")[this.rowIndex].setAttribute("invalid", "");
                this.addToast("Not enough letters");
                return;
            }
            this.evaluateRow();
        }

        addToast(text, duration, isSystem) {
            isSystem = isSystem || false;
            var toast = document.createElement("game-toast");
            toast.setAttribute("text", text);
            duration && toast.setAttribute("duration", duration);
            if (isSystem){
                this.querySelector("#system-toaster").prepend(toast);
            } else {
                this.querySelector("#game-toaster").prepend(toast);
            }
        }

        sizeBoard() {
            var container = this.querySelector("#board-container"),
                maxBoardWidth = window.innerWidth < 331 ? 268 : window.innerWidth < 560 ? 315 : 350,
                boardWidth = Math.min(Math.floor(container.clientHeight * (5 / 6)), maxBoardWidth),
                boardHeight = 6 * Math.floor(boardWidth / 5);
            this.$board.style.width = "".concat(boardWidth, "px");
            this.$board.style.height = "".concat(boardHeight, "px");
        }

        showStatsModal() {
            var modal = this.$game.querySelector("game-modal"),
                stats = document.createElement("game-stats");
            this.gameStatus === GAME_STATUS_WIN
                && this.rowIndex <= 6
                && stats.setAttribute("highlight-guess", this.rowIndex);
            stats.gameApp = this;
            modal.appendChild(stats);
            modal.setAttribute("open", "");
        }

        showHelpModal() {
            var modal = this.$game.querySelector("game-modal");
            modal.appendChild(document.createElement("game-help"));
            modal.setAttribute("open", "");
        }

        connectedCallback() {
            var self = this;
            this.appendChild(gameAppTemplate.content.cloneNode(true));
            this.$game = this.querySelector("#game");
            this.$board = this.querySelector("#board");
            this.$keyboard = this.querySelector("game-keyboard");
            this.sizeBoard();
            var willShowStatsModal = this.restoringFromLocalStorage &&
                (this.gameStatus === GAME_STATUS_WIN || this.gameStatus === GAME_STATUS_FAIL);
            if (willShowStatsModal) {
                window.localStorage.setItem(SHOW_HELP_ON_LOAD_KEY, JSON.stringify(false));
            } else {
                var showHelpOnLoad = JSON.parse(window.localStorage.getItem(SHOW_HELP_ON_LOAD_KEY));
                if (showHelpOnLoad !== false) {
                    setTimeout(function() {
                        self.showHelpModal();
                    }, 100);
                }
            }
            for (var i = 0; i < 6; i++) {
                var row = document.createElement("game-row");
                row.setAttribute("letters", this.boardState[i]);
                row.setAttribute("length", 5);
                this.evaluations[i] && (row.evaluation = this.evaluations[i]);
                this.$board.appendChild(row);
            }
            this.$game.addEventListener("game-key-press", function(event) {
                var key = event.detail.key;
                if (key === "←" || key === "Backspace") {
                    self.removeLetter();
                } else if (key === "↵" || key === "Enter") {
                    self.submitGuess();
                } else if (ALPHABET.includes(key.toLowerCase())) {
                    self.addLetter(key.toLowerCase());
                }
            });
            this.$game.addEventListener("game-last-tile-revealed-in-row", function(event) {
                self.$keyboard.letterEvaluations = self.letterEvaluations;
                if (self.rowIndex < 6) {
                    self.canInput = true;
                }
                var lastRow = self.$board.querySelectorAll("game-row")[self.rowIndex - 1];
                var eventPath = event.path || (event.composedPath && event.composedPath());
                if (!eventPath || !eventPath.includes(lastRow)) return;

                var gameOver = self.gameStatus === GAME_STATUS_WIN ||
                    self.gameStatus === GAME_STATUS_FAIL;
                if (gameOver) {
                    if (self.restoringFromLocalStorage) {
                        self.showStatsModal();
                    } else {
                        if (self.gameStatus === GAME_STATUS_WIN) {
                            lastRow.setAttribute("win", "");
                            self.addToast(WIN_COMMENTS[self.rowIndex - 1], 2000);
                        }
                        if (self.gameStatus === GAME_STATUS_FAIL) {
                            self.addToast(self.solution.toUpperCase(), Infinity);
                        }
                        setTimeout(function() {
                            self.showStatsModal();
                        }, 2500);
                    }
                }
                self.restoringFromLocalStorage = false;
            });
            this.addEventListener("game-setting-change", function(event) {
                var detail = event.detail;
                var name = detail.name;
                var checked = detail.checked;
                var disabled = detail.disabled;
                switch (name) {
                case "hard-mode":
                    if (disabled) {
                        self.addToast("Hard mode can only be enabled at the start of a round", 1500, true);
                        return;
                    }
                    self.hardMode = checked;
                    saveGameState({ hardMode: checked });
                    return;
                case "show-help-on-load":
                    window.localStorage.setItem(SHOW_HELP_ON_LOAD_KEY, JSON.stringify(checked));
                    return;
                }
            });
            this.querySelector("#settings-button").addEventListener("click", function() {
                var page = self.$game.querySelector("game-page"),
                    title = document.createTextNode("Settings");
                page.appendChild(title);
                var settings = document.createElement("game-settings");
                settings.setAttribute("slot", "content");
                settings.gameApp = self;
                page.appendChild(settings);
                page.setAttribute("open", "");
            });
            this.querySelector("#help-button").addEventListener("click", function() {
                var page = self.$game.querySelector("game-page"),
                    title = document.createTextNode("How to play");
                page.appendChild(title);
                var help = document.createElement("game-help");
                help.setAttribute("page", "");
                help.setAttribute("slot", "content");
                page.appendChild(help);
                page.setAttribute("open", "");
            });
            this.querySelector("#statistics-button").addEventListener("click", function() {
                self.showStatsModal();
            });
            this.querySelector("#save-button").addEventListener("click", function() {
                var saveDialog = document.querySelector('#save');
                saveDialog.classList.toggle('hidden');
            });
            window.addEventListener("resize", this.sizeBoard.bind(this));
        }

        disconnectedCallback() {}

        debugTools() {
            var self = this;
            this.querySelector("#debug-tools").appendChild(qaButtons.content.cloneNode(true));
            this.querySelector("#toast").addEventListener("click", function() {
                self.addToast("hello world");
            });
            this.querySelector("#modal").addEventListener("click", function() {
                var modal = self.$game.querySelector("game-modal");
                modal.textContent = "hello plz";
                modal.setAttribute("open", "");
            });
            this.querySelector("#reveal").addEventListener("click", function() {
                self.evaluateRow();
            });
            this.querySelector("#shake").addEventListener("click", function() {
                self.$board.querySelectorAll("game-row")[self.rowIndex].setAttribute("invalid", "");
            });
            this.querySelector("#bounce").addEventListener("click", function() {
                var row = self.$board.querySelectorAll("game-row")[self.rowIndex - 1];
                "" === row.getAttribute("win") ? row.removeAttribute("win") : row.setAttribute("win", "");
            });
        }
    }
    customElements.define("game-app", GameApp);

    var modalOverlayTemplate = document.getElementById("modal-overlay-template");

    class GameModal extends HTMLElement {
        connectedCallback() {
            var self = this;
            this.appendChild(modalOverlayTemplate.content.cloneNode(true));
            this.$overlay = this.querySelector(".modal-overlay");
            this.$content = this.querySelector(".modal-content");
            this.addEventListener("click", function() {
                self.$content.classList.add("closing");
            });
            this.addEventListener("animationend", function(event) {
                "SlideOut" === event.animationName && (self.$content.classList.remove("closing"), self.removeAttribute("open"),
                Array.from(self.$content.childNodes).forEach(function(node) {
                    if (!node.classList || !node.classList.contains("close-icon")) {
                        self.$content.removeChild(node);
                    }
                }));
            });
        }

        appendChild(child) {
            if (this.$content && child !== this.$overlay) {
                var closeIcon = this.$content.querySelector(".close-icon");
                this.$content.insertBefore(child, closeIcon);
            } else {
                HTMLElement.prototype.appendChild.call(this, child);
            }
            return child;
        }
    }
    customElements.define("game-modal", GameModal);

    var keyButtonTemplate = document.createElement("template");
    keyButtonTemplate.innerHTML = `<button>key</button>`;
    var spacerTemplate = document.createElement("template");
    spacerTemplate.innerHTML = `<div class="spacer"></div>`;
    var KEYBOARD_LAYOUT = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["-", "a", "s", "d", "f", "g", "h", "j", "k", "l", "-"],
        ["↵", "z", "x", "c", "v", "b", "n", "m", "←"]];

    class GameKeyboard extends HTMLElement {
        _letterEvaluations = {};

        set letterEvaluations(value) {
            this._letterEvaluations = value;
            this._render();
        }

        dispatchKeyPressEvent(key) {
            this.dispatchEvent(new CustomEvent("game-key-press", {
                bubbles: true,
                detail: { key: key }
            }));
        }

        connectedCallback() {
            var self = this;
            var kbDiv = document.createElement("div");
            kbDiv.id = "keyboard";
            this.appendChild(kbDiv);
            this.$keyboard = kbDiv;
            this.$keyboard.addEventListener("click", function(event) {
                var btn = event.target.closest("button");
                btn && self.$keyboard.contains(btn) && self.dispatchKeyPressEvent(btn.dataset.key);
            });
            window.addEventListener("keydown", function(event) {
                if (event.repeat) return;
                // Ignore keyboard input when typing in a text field
                var target = event.target;
                if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
                var key = event.key;
                var meta = event.metaKey;
                var ctrl = event.ctrlKey;
                if (meta || ctrl) return;
                var isLetter = ALPHABET.includes(key.toLowerCase());
                var isBackspace = key === "Backspace";
                var isEnter = key === "Enter";
                if (isLetter || isBackspace || isEnter) {
                    self.dispatchKeyPressEvent(key);
                }
            });
            this.$keyboard.addEventListener("transitionend", function(event) {
                var btn = event.target.closest("button");
                btn && self.$keyboard.contains(btn) && btn.classList.remove("fade");
            });
            KEYBOARD_LAYOUT.forEach(function(row) {
                var rowDiv = document.createElement("div");
                rowDiv.classList.add("row");
                row.forEach(function(keyLabel) {
                    var el;
                    if (keyLabel >= "a" && keyLabel <= "z" || "←" === keyLabel || "↵" === keyLabel) {
                        el = keyButtonTemplate.content.cloneNode(true).firstElementChild;
                        el.dataset.key = keyLabel;
                        el.textContent = keyLabel;
                        if ("←" === keyLabel) {
                            var icon = document.createElement("game-icon");
                            icon.setAttribute("icon", "backspace");
                            el.textContent = "";
                            el.appendChild(icon);
                            el.classList.add("one-and-a-half");
                        }
                        "↵" == keyLabel && (el.textContent = "enter", el.classList.add("one-and-a-half"));
                    } else {
                        el = spacerTemplate.content.cloneNode(true).firstElementChild;
                        el.classList.add(1 === keyLabel.length ? "half" : "one");
                    }
                    rowDiv.appendChild(el);
                });
                self.$keyboard.appendChild(rowDiv);
            });
            this._render();
        }

        _render() {
            for (var key in this._letterEvaluations) {
                var btn = this.$keyboard.querySelector('[data-key="'.concat(key, '"]'));
                btn.dataset.state = this._letterEvaluations[key];
                btn.classList.add("fade");
            }
        }
    }
    customElements.define("game-keyboard", GameKeyboard);

    // Share results via native share API or fall back to clipboard
    async function shareOrCopy(data, onSuccess, onError) {
        try {
            // Try native share if available and supported
            if (navigator.canShare?.(data)) {
                await navigator.share(data);
                onSuccess();
                return;
            }
        } catch (err) {
            console.error('Native share failed:', err.name, err.message, err);
            // User cancelled share or share failed - fall through to clipboard
            if (err.name === 'AbortError') {
                // User cancelled - don't show error, just return
                return;
            }
            Sentry.captureException(err, { tags: { shareMethod: "native" } });
        }

        // Clipboard fallback
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(data.text);
                onSuccess();
                return;
            } catch (err) {
                Sentry.captureException(err, { tags: { shareMethod: "clipboard" } });
                console.error('Clipboard fallback failed:', err.name, err.message, err);
            }
        }

        // Legacy textarea fallback (iOS Chrome, non-secure contexts, etc.)
        try {
            var ta = document.createElement('textarea');
            ta.value = data.text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            var ok = document.execCommand('copy');
            document.body.removeChild(ta);
            if (ok) {
                onSuccess();
            } else {
                onError();
            }
        } catch (err) {
            Sentry.captureException(err, { tags: { shareMethod: "execCommand" } });
            console.error('execCommand copy failed:', err.name, err.message, err);
            onError();
        }
    }

    // Sentry test trigger — only fires when ?test-sentry=true with correct pwd
    (async function() {
        // leaving code in place should it be necessary later, but it's nt needed now.
        return;
        var params = new URLSearchParams(window.location.search);
        if (params.get('test-sentry') !== 'true') return;
        if (btoa(params.get("pwd")) !== "QmVydGhhQDYx") return;
          try {
            try {
              myUndefinedFunction();
            } catch (err) {
              Sentry.captureException(err);
              console.log("Sentry test exception sent:", err.message);
            }
          } catch (err) {
            console.error("Sentry test trigger failed:", err);
          }
    })();

    function buildShareText(gameResults) {
        var evaluations = gameResults.evaluations;
        var dayOffset = gameResults.dayOffset;
        var rowIndex = gameResults.rowIndex;
        var isHardMode = gameResults.isHardMode;
        var isWin = gameResults.isWin;
        var isDarkTheme = JSON.parse(window.localStorage.getItem(DARK_THEME_KEY));
        var isColorBlind = JSON.parse(window.localStorage.getItem(COLOR_BLIND_THEME_KEY));
        var stored = window.localStorage.getItem(SHARE_TEXT_ADDITIONS_KEY);
        var shareAdditions = stored ? JSON.parse(stored) : DEFAULT_SHARE_TEXT_ADDITIONS;

        // Build header line: "Wordle 123 4/6 (1995p)" or "Wordle 123 X/6* (1995p)"
        var header = "Wordle " + dayOffset.toLocaleString();
        header += " " + (isWin ? rowIndex : "X") + "/6";
        if (isHardMode) {
            header += "*";
        }
        // header += " (1995p)";
        if (shareAdditions.header) {
            header += " " + shareAdditions.header.replace(/\\n/g, "\n");
        }
        // Build emoji grid
        var grid = "";
        evaluations.forEach(function (row) {
            if (row) {
                row.forEach(function (tile) {
                    if (tile) {
                        switch (tile) {
                        case CORRECT:
                            grid += isColorBlind ? "🟧" : "🟩";
                            break;
                        case PRESENT:
                            grid += isColorBlind ? "🟦" : "🟨";
                            break;
                        case ABSENT:
                            grid += isDarkTheme ? "⬛" : "⬜";
                            break;
                        }
                    }
                });
                grid += "\n";
            }
        });

        var result = header + "\n\n" + grid.trimEnd();
        if (shareAdditions.afterGrid) {
            result += "\n" + shareAdditions.afterGrid.replace(/\\n/g, "\n");
        }
        return { text: result };
    }

    var statsContainerTemplate = document.getElementById("stats-container-template");
    var statisticItemTemplate = document.getElementById("statistic-item-template");
    var graphBarTemplate = document.getElementById("graph-bar-template");
    var countdownTemplate = document.getElementById("countdown-template");
    var STATISTIC_LABELS = {
        currentStreak: "Current Streak",
        maxStreak: "Max Streak",
        winPercentage: "Win %",
        gamesPlayed: "Played",
        gamesWon: "Won",
        averageGuesses: "Av. Guesses"
    };

    class GameStats extends HTMLElement {
        stats = {};
        gameApp;

        constructor() {
            super();
            this.stats = getStatistics();
        }

        connectedCallback() {
            var self = this;
            this.appendChild(statsContainerTemplate.content.cloneNode(true));
            var statisticsEl = this.querySelector("#statistics"),
                distributionEl = this.querySelector("#guess-distribution"),
                maxGuesses = Math.max.apply(Math, Array.from(Object.values(this.stats.guesses)));
            if (Object.values(this.stats.guesses).every(function(v) { return 0 === v; })) {
                var noData = document.createElement("div");
                noData.classList.add("no-data");
                noData.innerText = "No Data";
                distributionEl.appendChild(noData);
            } else
                for (var i = 1; i < Object.keys(this.stats.guesses).length; i++) {
                    var guessNum = i,
                        count = this.stats.guesses[i],
                        barFragment = graphBarTemplate.content.cloneNode(true),
                        barWidth = Math.max(7, Math.round(count / maxGuesses * 100));
                    barFragment.querySelector(".guess").textContent = guessNum;
                    var bar = barFragment.querySelector(".graph-bar");
                    bar.style.width = "".concat(barWidth, "%");
                    if ("number" == typeof count) {
                        barFragment.querySelector(".num-guesses").textContent = count;
                        count > 0 && bar.classList.add("align-right");
                        var highlightGuess = parseInt(this.getAttribute("highlight-guess"), 10);
                        highlightGuess && i === highlightGuess && bar.classList.add("highlight");
                    }
                    distributionEl.appendChild(barFragment);
                }
            ["gamesPlayed", "winPercentage", "currentStreak", "maxStreak"].forEach(function(statKey) {
                var label = STATISTIC_LABELS[statKey],
                    value = self.stats[statKey],
                    itemFragment = statisticItemTemplate.content.cloneNode(true);
                itemFragment.querySelector(".label").textContent = label;
                itemFragment.querySelector(".statistic").textContent = value;
                statisticsEl.appendChild(itemFragment);
            });
            if (this.gameApp.gameStatus !== GAME_STATUS_IN_PROGRESS) {
                var footer = this.querySelector(".stats-footer"),
                    countdownFragment = countdownTemplate.content.cloneNode(true);
                footer.appendChild(countdownFragment);
                this.querySelector("button#share-button").addEventListener("click", function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    shareOrCopy(buildShareText({
                        evaluations: self.gameApp.evaluations,
                        dayOffset: self.gameApp.dayOffset,
                        rowIndex: self.gameApp.rowIndex,
                        isHardMode: self.gameApp.hardMode,
                        isWin: self.gameApp.gameStatus === GAME_STATUS_WIN
                    }), function() {
                        self.gameApp.addToast("Copied results to clipboard", 2000, true);
                    }, function() {
                        self.gameApp.addToast("Share failed", 2000, true);
                    });
                });
            }
        }
    }
    customElements.define("game-stats", GameStats);

    class GameSwitch extends HTMLElement {
        connectedCallback() {
            var self = this;
            var container = document.createElement("div");
            container.classList.add("container");
            container.innerHTML = '<label></label><div class="switch"><span class="knob"></span></div>';
            this.appendChild(container);
            container.addEventListener("click", function(event) {
                event.stopPropagation();
                self.hasAttribute("checked") ? self.removeAttribute("checked") : self.setAttribute("checked", "");
                self.dispatchEvent(new CustomEvent("game-switch-change", {
                    bubbles: true,
                    composed: true,
                    detail: {
                        name: self.getAttribute("name"),
                        checked: self.hasAttribute("checked"),
                        disabled: self.hasAttribute("disabled")
                    }
                }));
            });
        }

        static get observedAttributes() {
            return ["checked"];
        }
    }
    customElements.define("game-switch", GameSwitch);

    var helpTemplate = document.getElementById("help-template");

    class GameHelp extends HTMLElement {
        connectedCallback() {
            this.appendChild(helpTemplate.content.cloneNode(true));
        }
    }
    customElements.define("game-help", GameHelp);

    var pageOverlayTemplate = document.getElementById("page-overlay-template");

    class GamePage extends HTMLElement {
        connectedCallback() {
            var self = this;
            this.appendChild(pageOverlayTemplate.content.cloneNode(true));
            this.$overlay = this.querySelector(".page-overlay");
            this.$content = this.querySelector(".page-content");
            this.$title = this.querySelector(".page-title");
            this.$contentContainer = this.querySelector(".page-content-container");
            this.querySelector("game-icon").addEventListener("click", function() {
                self.$overlay.classList.add("closing");
            });
            this.addEventListener("animationend", function(event) {
                "SlideOut" === event.animationName && (self.$overlay.classList.remove("closing"),
                self.$title.textContent = "",
                Array.from(self.$contentContainer.childNodes).forEach(function(node) {
                    self.$contentContainer.removeChild(node);
                }), self.removeAttribute("open"));
            });
        }

        appendChild(child) {
            if (this.$contentContainer && child !== this.$overlay) {
                if (child.nodeType === Node.TEXT_NODE) {
                    this.$title.textContent = child.textContent;
                } else {
                    this.$contentContainer.appendChild(child);
                }
            } else {
                HTMLElement.prototype.appendChild.call(this, child);
            }
            return child;
        }
    }
    customElements.define("game-page", GamePage);

    var ICON_PATHS = {
        help: "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z",
        settings: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z",
        backspace: "M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z",
        close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
        share: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
        statistics: "M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z",
        save: "M3,20.05V3.72H17.48L21,7.58V20.05ZM6.85,9.64m0-5.92V9.64h8.23V3.72m-2.76,0v4M6.85,13.11h8.23M6.85,16.46H17.13"
    };

    class GameIcon extends HTMLElement {
        connectedCallback() {
            if (!this.querySelector("svg")) {
                var iconName = this.getAttribute("icon");
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.setAttribute("height", "24");
                svg.setAttribute("viewBox", "0 0 24 24");
                svg.setAttribute("width", "24");
                var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                var fillColor = "var(--color-tone-3)";
                if (iconName === "backspace") fillColor = "var(--color-tone-1)";
                if (iconName === "share") fillColor = "var(--white)";
                path.setAttribute("fill", fillColor);
                path.setAttribute("d", ICON_PATHS[iconName]);
                svg.appendChild(path);
                this.appendChild(svg);
            }
        }
    }
    customElements.define("game-icon", GameIcon);

    var MS_PER_MINUTE = 6e4,
        MS_PER_HOUR = 36e5;

    class CountdownTimer extends HTMLElement {
        targetEpochMS;
        intervalId;
        $timer;

        constructor() {
            super();
            var tomorrow = new Date;
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            this.targetEpochMS = tomorrow.getTime();
        }

        padDigit(num) {
            return num.toString().padStart(2, "0");
        }

        updateTimer() {
            var display,
                now = (new Date).getTime(),
                remaining = Math.floor(this.targetEpochMS - now);
            if (remaining <= 0)
                display = "00:00:00";
            else {
                var hours = Math.floor(remaining % 864e5 / MS_PER_HOUR),
                    minutes = Math.floor(remaining % MS_PER_HOUR / MS_PER_MINUTE),
                    seconds = Math.floor(remaining % MS_PER_MINUTE / 1e3);
                display = "".concat(this.padDigit(hours), ":").concat(this.padDigit(minutes), ":").concat(this.padDigit(seconds));
            }
            this.$timer.textContent = display;
        }

        connectedCallback() {
            var self = this;
            var timerDiv = document.createElement("div");
            timerDiv.id = "countdown-timer-display";
            this.appendChild(timerDiv);
            this.$timer = timerDiv;
            this.intervalId = setInterval(function() {
                self.updateTimer();
            }, 200);
        }

        disconnectedCallback() {
            clearInterval(this.intervalId);
        }
    }
    customElements.define("countdown-timer", CountdownTimer);

    // Export pure functions for testing
    window.wordleTestExports = {
        PRESENT: PRESENT,
        CORRECT: CORRECT,
        ABSENT: ABSENT,
        STATE_PRECEDENCE: STATE_PRECEDENCE,
        PUZZLE_START_DATE: PUZZLE_START_DATE,
        GAME_STATUS_IN_PROGRESS: GAME_STATUS_IN_PROGRESS,
        GAME_STATUS_WIN: GAME_STATUS_WIN,
        GAME_STATUS_FAIL: GAME_STATUS_FAIL,
        FAIL_KEY: FAIL_KEY,
        DEFAULT_STATISTICS: DEFAULT_STATISTICS,
        ICON_PATHS: ICON_PATHS,
        aggregateLetterEvaluations: aggregateLetterEvaluations,
        getOrdinal: getOrdinal,
        calculateDaysBetween: calculateDaysBetween,
        getSolution: getSolution,
        getDayOffset: getDayOffset,
        encodeWord: encodeWord,
        getStatistics: getStatistics,
        updateStatistics: updateStatistics,
        evaluateGuess: evaluateGuess,
        validateHardMode: validateHardMode,
        buildShareText: buildShareText,
    };
})();
