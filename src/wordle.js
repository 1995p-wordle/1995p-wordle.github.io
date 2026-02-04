(function() {
    "use strict";
    function a(e) {
        return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        })(e)
    }
    function s(e, a) {
        if (!(e instanceof a))
            throw new TypeError("Cannot call a class as a function")
    }
    function t(e, a) {
        for (var s = 0; s < a.length; s++) {
            var t = a[s];
            t.enumerable = t.enumerable || !1, t.configurable = !0, "value" in t && (t.writable = !0), Object.defineProperty(e, t.key, t)
        }
    }
    function o(e, a, s) {
        return a && t(e.prototype, a), s && t(e, s), e
    }
    function n(e, a, s) {
        return a in e ? Object.defineProperty(e, a, {
                value: s,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[a] = s, e
    }
    function r(e, a) {
        if ("function" != typeof a && null !== a)
            throw new TypeError("Super expression must either be null or a function");
        e.prototype = Object.create(a && a.prototype, {
            constructor: {
                value: e,
                writable: !0,
                configurable: !0
            }
        }), a && l(e, a)
    }
    function i(e) {
        return (i = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
            return e.__proto__ || Object.getPrototypeOf(e)
        })(e)
    }
    function l(e, a) {
        return (l = Object.setPrototypeOf || function(e, a) {
            return e.__proto__ = a, e
        })(e, a)
    }
    function d() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
        } catch ( e ) {
            return !1
        }
    }
    function u(e, a, s) {
        return (u = d() ? Reflect.construct : function(e, a, s) {
            var t = [null];
            t.push.apply(t, a);
            var o = new (Function.bind.apply(e, t));
            return s && l(o, s.prototype), o
        }).apply(null, arguments)
    }
    function c(e) {
        var a = "function" == typeof Map ? new Map : void 0;
        return (c = function(e) {
            if (null === e || (s = e, -1 === Function.toString.call(s).indexOf("[native code]"))) return e;
            var s;
            if ("function" != typeof e)
                throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== a) {
                if (a.has(e)) return a.get(e);
                a.set(e, t)
            }
            function t() {
                return u(e, arguments, i(this).constructor)
            }
            return t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), l(t, e)
        })(e)
    }
    function p(e) {
        if (void 0 === e)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
    }
    function m(e, a) {
        return !a || "object" != typeof a && "function" != typeof a ? p(e) : a
    }
    function h(e) {
        var a = d();
        return function() {
            var s,
                t = i(e);
            if (a) {
                var o = i(this).constructor;
                s = Reflect.construct(t, arguments, o)
            } else
                s = t.apply(this, arguments);
            return m(this, s)
        }
    }
    function y(e, a) {
        return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, a) {
                var s = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == s) return;
                var t,
                    o,
                    n = [],
                    r = !0,
                    i = !1;
                try {
                    for (s = s.call(e); !(r = (t = s.next()).done) && (n.push(t.value), !a || n.length !== a); r = !0) ;
                } catch ( e ) {
                    i = !0, o = e
                } finally {
                    try {
                        r || null == s.return || s.return()
                    } finally {
                        if (i)
                            throw o
                    }
                }
                return n
            }(e, a) || b(e, a) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
    }
    function g(e) {
        return function(e) {
                if (Array.isArray(e)) return f(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || b(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
    }
    function b(e, a) {
        if (e) {
            if ("string" == typeof e) return f(e, a);
            var s = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === s && e.constructor && (s = e.constructor.name), "Map" === s || "Set" === s ? Array.from(e) : "Arguments" === s || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s) ? f(e, a) : void 0
        }
    }
    function f(e, a) {
        (null == a || a > e.length) && (a = e.length);
        for (var s = 0, t = new Array(a); s < a; s++) t[s] = e[s];
        return t
    }
    var GameTile = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), n(p(e = a.call(this)), "_letter", ""), n(p(e), "_state", "empty"), n(p(e), "_animation", "idle"), n(p(e), "_last", !1), n(p(e), "_reveal", !1), e
        }
        return o(t, [{
                key: "last",
                set: function(e) {
                    this._last = e
                }
            }, {
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    if (!this.$tile) {
                        var tileDiv = document.createElement("div");
                        tileDiv.classList.add("tile");
                        tileDiv.dataset.state = "empty";
                        tileDiv.dataset.animation = "idle";
                        this.appendChild(tileDiv);
                        this.$tile = tileDiv;
                        this.$tile.addEventListener("animationend", (function(a) {
                            "PopIn" === a.animationName && (e._animation = "idle"), "FlipIn" === a.animationName && (e.$tile.dataset.state = e._state, e._animation = "flip-out"), "FlipOut" === a.animationName && (e._animation = "idle", e._last && e.dispatchEvent(new CustomEvent("game-last-tile-revealed-in-row", {
                                bubbles: !0
                            }))), e._render()
                        }));
                    }
                    this._render()
                }
            }, {
                key: "attributeChangedCallback",
                value: function(e, a, s) {
                    switch (e) {
                    case "letter":
                        if (s === a) break;
                        var t = "null" === s ? "" : s;
                        this._letter = t, this._state = t ? "tbd" : "empty", this._animation = t ? "pop" : "idle";
                        break;case "evaluation":
                        if (!s) break;
                        this._state = s;
                        break;case "reveal":
                        this._animation = "flip-in", this._reveal = !0
                    }
                    this._render()
                }
            }, {
                key: "_render",
                value: function() {
                    this.$tile && (this.$tile.textContent = this._letter, ["empty", "tbd"].includes(this._state) && (this.$tile.dataset.state = this._state), (["empty", "tbd"].includes(this._state) || this._reveal) && this.$tile.dataset.animation != this._animation && (this.$tile.dataset.animation = this._animation))
                }
            }], [{
                key: "observedAttributes",
                get: function() {
                    return ["letter", "evaluation", "reveal"]
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-tile", GameTile);
    var GameRow = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), (e = a.call(this))._letters = "", e._evaluation = [], e._length, e
        }
        return o(t, [{
                key: "evaluation",
                get: function() {
                    return this._evaluation
                },
                set: function(e) {
                    var a = this;
                    this._evaluation = e, this.$tiles && this.$tiles.forEach((function(e, s) {
                        e.setAttribute("evaluation", a._evaluation[s]), setTimeout((function() {
                            e.setAttribute("reveal", "")
                        }), 300 * s)
                    }))
                }
            }, {
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    var rowDiv = document.createElement("div");
                    rowDiv.classList.add("row");
                    this.appendChild(rowDiv);
                    this.$row = rowDiv;
                    for (var a = function(a) {
                                var s = document.createElement("game-tile"),
                                    t = e._letters[a];
                                (t && s.setAttribute("letter", t), e._evaluation[a]) && (s.setAttribute("evaluation", e._evaluation[a]), setTimeout((function() {
                                    s.setAttribute("reveal", "")
                                }), 100 * a));a === e._length - 1 && (s.last = !0), e.$row.appendChild(s)
                            }, s = 0;s < this._length; s++) a(s);
                    this.$tiles = this.querySelectorAll("game-tile"), this.addEventListener("animationend", (function(a) {
                        "Shake" === a.animationName && e.removeAttribute("invalid")
                    }))
                }
            }, {
                key: "attributeChangedCallback",
                value: function(e, a, s) {
                    switch (e) {
                    case "letters":
                        this._letters = s || "";
                        break;case "length":
                        this._length = parseInt(s, 10);
                        break;case "win":
                        if (null === s) {
                            this.$tiles.forEach((function(e) {
                                e.classList.remove("win")
                            }));
                            break
                        }
                        this.$tiles.forEach((function(e, a) {
                            e.classList.add("win"), e.style.animationDelay = "".concat(100 * a, "ms")
                        }))
                    }
                    this._render()
                }
            }, {
                key: "_render",
                value: function() {
                    var e = this;
                    this.$row && this.$tiles.forEach((function(a, s) {
                        var t = e._letters[s];
                        t ? a.setAttribute("letter", t) : a.removeAttribute("letter")
                    }))
                }
            }], [{
                key: "observedAttributes",
                get: function() {
                    return ["letters", "length", "invalid", "win"]
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-row", GameRow);
    var DARK_THEME_KEY = "darkTheme",
        COLOR_BLIND_THEME_KEY = "colorBlindTheme",
        GameThemeManager = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                s(this, t), n(p(e = a.call(this)), "isDarkTheme", !1), n(p(e), "isColorBlindTheme", !1);
                var o = JSON.parse(window.localStorage.getItem(DARK_THEME_KEY)),
                    r = window.matchMedia("(prefers-color-scheme: dark)").matches,
                    i = JSON.parse(window.localStorage.getItem(COLOR_BLIND_THEME_KEY));
                return !0 === o || !1 === o ? e.setDarkTheme(o) : r && e.setDarkTheme(!0), !0 !== i && !1 !== i || e.setColorBlindTheme(i), e
            }
            return o(t, [{
                    key: "setDarkTheme",
                    value: function(e) {
                        var a = document.querySelector("body");
                        e && !a.classList.contains("nightmode") ? a.classList.add("nightmode") : a.classList.remove("nightmode"), this.isDarkTheme = e, window.localStorage.setItem(DARK_THEME_KEY, JSON.stringify(e))
                    }
                }, {
                    key: "setColorBlindTheme",
                    value: function(e) {
                        var a = document.querySelector("body");
                        e && !a.classList.contains("colorblind") ? a.classList.add("colorblind") : a.classList.remove("colorblind"), this.isColorBlindTheme = e, window.localStorage.setItem(COLOR_BLIND_THEME_KEY, JSON.stringify(e))
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.addEventListener("game-setting-change", (function(a) {
                            var s = a.detail,
                                t = s.name,
                                o = s.checked;
                            switch (t) {
                            case "dark-theme":
                                return void e.setDarkTheme(o);case "color-blind-theme":
                                return void e.setColorBlindTheme(o)
                            }
                        }))
                    }
                }]), t
        }(c(HTMLElement));
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
            hardMode: !1
        };
    function getGameState() {
        var e = window.localStorage.getItem(GAME_STATE_KEY) || JSON.stringify(DEFAULT_GAME_STATE);
        return JSON.parse(e)
    }
    function saveGameState(e) {
        var current = getGameState();
        var merged = deepMerge(current, e);
        window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(merged));
    }
    var gameSettingsTemplate = document.createElement("template");
    gameSettingsTemplate.innerHTML = `
  <div class="sections">
    <section>
      <div class="setting">
        <div class="text">
          <div class="title">Hard Mode</div>
          <div class="description">Any revealed hints must be used in subsequent guesses</div>
        </div>
        <div class="control">
          <game-switch id="hard-mode" name="hard-mode"></game-switch>
        </div>
      </div>
      <div class="setting">
        <div class="text">
          <div class="title">Dark Theme</div>
        </div>
        <div class="control">
          <game-switch id="dark-theme" name="dark-theme"></game-switch>
        </div>
      </div>
      <div class="setting">
        <div class="text">
          <div class="title">Color Blind Mode</div>
          <div class="description">High contrast colors</div>
        </div>
        <div class="control">
          <game-switch id="color-blind-theme" name="color-blind-theme"></game-switch>
        </div>
      </div>
    </section>
  </div>

  <div id="footnote">
    <div>
      <div id="privacy-policy"><a href="https://www.powerlanguage.co.uk/privacy-policy.html" target="_blank">Privacy Policy</a></div>
      <div id="copyright">Copyright 2021-2022. All Rights Reserved.</div>
    </div>
    <div>
      <div id="puzzle-number"></div>
      <div id="hash"></div>
    </div>
  </div>
`;
    var GameSettings = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), n(p(e = a.call(this)), "gameApp", void 0), e
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    var e,
                        a = this;
                    this.appendChild(gameSettingsTemplate.content.cloneNode(!0)), this.querySelector("#hash").textContent = null === (e = window.wordle) || void 0 === e ? void 0 : e.hash, this.querySelector("#puzzle-number").textContent = "#".concat(this.gameApp.dayOffset), this.addEventListener("game-switch-change", (function(e) {
                        e.stopPropagation();
                        var s = e.detail,
                            t = s.name,
                            o = s.checked,
                            n = s.disabled;
                        a.dispatchEvent(new CustomEvent("game-setting-change", {
                            bubbles: !0,
                            detail: {
                                name: t,
                                checked: o,
                                disabled: n
                            }
                        })), a.render()
                    })), this.render()
                }
            }, {
                key: "render",
                value: function() {
                    var e = document.querySelector("body");
                    e.classList.contains("nightmode") && this.querySelector("#dark-theme").setAttribute("checked", ""), e.classList.contains("colorblind") && this.querySelector("#color-blind-theme").setAttribute("checked", "");
                    var a = getGameState();
                    a.hardMode && this.querySelector("#hard-mode").setAttribute("checked", ""), a.hardMode || "IN_PROGRESS" !== a.gameStatus || 0 === a.rowIndex || (this.querySelector("#hard-mode").removeAttribute("checked"), this.querySelector("#hard-mode").setAttribute("disabled", ""))
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-settings", GameSettings);
    var Ea,
        GameToast = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                return s(this, t), n(p(e = a.call(this)), "_duration", void 0), e
            }
            return o(t, [{
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        var a = document.createElement("div");
                        a.classList.add("toast");
                        this.appendChild(a);
                        a.textContent = this.getAttribute("text"), this._duration = this.getAttribute("duration") || 1e3, "Infinity" !== this._duration && setTimeout((function() {
                            a.classList.add("fade")
                        }), this._duration), a.addEventListener("transitionend", (function(a) {
                            e.parentNode.removeChild(e)
                        }))
                    }
                }]), t
        }(c(HTMLElement));
    function gtag() {
        dataLayer.push(arguments)
    }
    customElements.define("game-toast", GameToast), window.dataLayer = window.dataLayer || [], gtag("js", new Date);gtag("config", "G-2SSGMHY3NP", {
        app_version: null === (Ea = window.wordle) || void 0 === Ea ? void 0 : Ea.hash,
        debug_mode: !1
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
    function aggregateLetterEvaluations(e, a) {
        var s = {};
        return e.forEach((function(e, t) {
                if (a[t])
                    for (var o = 0; o < e.length; o++) {
                        var n = e[o],
                            r = a[t][o],
                            i = s[n] || "unknown";
                        STATE_PRECEDENCE[r] > STATE_PRECEDENCE[i] && (s[n] = r)
                }
            })), s
    }
    function getOrdinal(e) {
        var a = ["th", "st", "nd", "rd"],
            s = e % 100;
        return e + (a[(s - 20) % 10] || a[s] || a[0])
    }
    const PUZZLE_START_DATE = new Date(2021, 5, 19, 0, 0, 0, 0);
    function calculateDaysBetween(e, a) {
        var s = new Date(e),
            t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
        return Math.round(t / 864e5)
    }
    function getSolution(e) {
        var a,
            s = getDayOffset(e);
        return a = s % answer_list.length, answer_list[a]
    }
    function getDayOffset(e) {
        return calculateDaysBetween(PUZZLE_START_DATE, e)
    }
    var ALPHABET = "abcdefghijklmnopqrstuvwxyz",
        ROT13_MAP = [].concat(g(ALPHABET.split("").slice(13)), g(ALPHABET.split("").slice(0, 13)));
    function encodeWord(e) {
        console.debug('parsing stats', e);
        for (var a = "", s = 0; s < e.length; s++) {
            var t = ALPHABET.indexOf(e[s]);
            a += t >= 0 ? ROT13_MAP[t] : "_"
        }
        return a
    }
    const FAIL_KEY = "fail";
    const   DEFAULT_STATISTICS = {
            currentStreak: 0,
            maxStreak: 0,
            guesses: n({
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0
            }, FAIL_KEY, 0),
            winPercentage: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            averageGuesses: 0
        };
    function getStatistics() {
        var storedStats = window.localStorage.getItem("statistics") || JSON.stringify(DEFAULT_STATISTICS);
        console.debug('loaded stats', storedStats);
        return JSON.parse(storedStats)
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
    const WIN_COMMENTS = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew"];
    var GameApp = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                s(this, t), n(p(e = a.call(this)), "tileIndex", 0), n(p(e), "rowIndex", 0), n(p(e), "solution", void 0), n(p(e), "boardState", void 0), n(p(e), "evaluations", void 0), n(p(e), "canInput", !0), n(p(e), "gameStatus", GAME_STATUS_IN_PROGRESS), n(p(e), "letterEvaluations", {}), n(p(e), "$board", void 0), n(p(e), "$keyboard", void 0), n(p(e), "$game", void 0), n(p(e), "today", void 0), n(p(e), "lastPlayedTs", void 0), n(p(e), "lastCompletedTs", void 0), n(p(e), "hardMode", void 0), n(p(e), "dayOffset", void 0), e.today = new Date;var o = getGameState();
                return e.lastPlayedTs = o.lastPlayedTs, !e.lastPlayedTs || calculateDaysBetween(new Date(e.lastPlayedTs), e.today) >= 1 ? (e.boardState = new Array(6).fill(""), e.evaluations = new Array(6).fill(null), e.solution = getSolution(e.today), e.dayOffset = getDayOffset(e.today), e.lastCompletedTs = o.lastCompletedTs, e.hardMode = o.hardMode, e.restoringFromLocalStorage = !1, saveGameState({
                        rowIndex: e.rowIndex,
                        boardState: e.boardState,
                        evaluations: e.evaluations,
                        solution: e.solution,
                        gameStatus: e.gameStatus
                    }), gtag("event", "level_start", {
                        level_name: encodeWord(e.solution)
                    })) : (e.boardState = o.boardState, e.evaluations = o.evaluations, e.rowIndex = o.rowIndex, e.solution = o.solution, e.dayOffset = getDayOffset(e.today), e.letterEvaluations = aggregateLetterEvaluations(e.boardState, e.evaluations), e.gameStatus = o.gameStatus, e.lastCompletedTs = o.lastCompletedTs, e.hardMode = o.hardMode, e.gameStatus !== GAME_STATUS_IN_PROGRESS && (e.canInput = !1), e.restoringFromLocalStorage = !0), e
            }
            return o(t, [{
                    key: "evaluateRow",
                    value: function() {
                        if (5 === this.tileIndex && !(this.rowIndex >= 6)) {
                            var e,
                                a = this.$board.querySelectorAll("game-row")[this.rowIndex],
                                s = this.boardState[this.rowIndex];
                            if (e = s, !valid_guesses.includes(e) && !answer_list.includes(e)) return a.setAttribute("invalid", ""), void this.addToast("Not in word list");
                            if (this.hardMode) {
                                var t = validateHardMode(s, this.boardState[this.rowIndex - 1], this.evaluations[this.rowIndex - 1]),
                                    o = t.validGuess,
                                    n = t.errorMessage;
                                if (!o) return a.setAttribute("invalid", ""), void this.addToast(n || "Not valid in hard mode")
                            }
                            var r = evaluateGuess(s, this.solution);
                            this.evaluations[this.rowIndex] = r, this.letterEvaluations = aggregateLetterEvaluations(this.boardState, this.evaluations), a.evaluation = this.evaluations[this.rowIndex], this.rowIndex += 1;
                            var i = this.rowIndex >= 6,
                                l = r.every((function(e) {
                                    return "correct" === e
                                }));
                            if (i || l) updateStatistics({
                                    isWin: l,
                                    isStreak: !!this.lastCompletedTs && 1 === calculateDaysBetween(new Date(this.lastCompletedTs), new Date),
                                    numGuesses: this.rowIndex
                                }), saveGameState({
                                    lastCompletedTs: Date.now()
                                }), this.gameStatus = l ? GAME_STATUS_WIN : GAME_STATUS_FAIL, gtag("event", "level_end", {
                                    level_name: encodeWord(this.solution),
                                    num_guesses: this.rowIndex,
                                    success: l
                                });
                            this.tileIndex = 0, this.canInput = !1, saveGameState({
                                rowIndex: this.rowIndex,
                                boardState: this.boardState,
                                evaluations: this.evaluations,
                                solution: this.solution,
                                gameStatus: this.gameStatus,
                                lastPlayedTs: Date.now()
                            })
                        }
                    }
                }, {
                    key: "addLetter",
                    value: function(e) {
                        this.gameStatus === GAME_STATUS_IN_PROGRESS && (this.canInput && (this.tileIndex >= 5 || (this.boardState[this.rowIndex] += e, this.$board.querySelectorAll("game-row")[this.rowIndex].setAttribute("letters", this.boardState[this.rowIndex]), this.tileIndex += 1)))
                    }
                }, {
                    key: "removeLetter",
                    value: function() {
                        if (this.gameStatus === GAME_STATUS_IN_PROGRESS && this.canInput && !(this.tileIndex <= 0)) {
                            this.boardState[this.rowIndex] = this.boardState[this.rowIndex].slice(0, this.boardState[this.rowIndex].length - 1);
                            var e = this.$board.querySelectorAll("game-row")[this.rowIndex];
                            this.boardState[this.rowIndex] ? e.setAttribute("letters", this.boardState[this.rowIndex]) : e.removeAttribute("letters"), e.removeAttribute("invalid"), this.tileIndex -= 1
                        }
                    }
                }, {
                    key: "submitGuess",
                    value: function() {
                        if (this.gameStatus === GAME_STATUS_IN_PROGRESS && this.canInput) {
                            if (5 !== this.tileIndex) return this.$board.querySelectorAll("game-row")[this.rowIndex].setAttribute("invalid", ""), void this.addToast("Not enough letters");
                            this.evaluateRow()
                        }
                    }
                }, {
                    key: "addToast",
                    value: function(e, a) {
                        var s = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            t = document.createElement("game-toast");
                        t.setAttribute("text", e), a && t.setAttribute("duration", a), s ? this.querySelector("#system-toaster").prepend(t) : this.querySelector("#game-toaster").prepend(t)
                    }
                }, {
                    key: "sizeBoard",
                    value: function() {
                        var e = this.querySelector("#board-container"),
                            maxBoardWidth = window.innerWidth < 331 ? 268 : window.innerWidth < 560 ? 315 : 350,
                            a = Math.min(Math.floor(e.clientHeight * (5 / 6)), maxBoardWidth),
                            s = 6 * Math.floor(a / 5);
                        this.$board.style.width = "".concat(a, "px"), this.$board.style.height = "".concat(s, "px")
                    }
                }, {
                    key: "showStatsModal",
                    value: function() {
                        var e = this.$game.querySelector("game-modal"),
                            a = document.createElement("game-stats");
                        this.gameStatus === GAME_STATUS_WIN && this.rowIndex <= 6 && a.setAttribute("highlight-guess", this.rowIndex), a.gameApp = this, e.appendChild(a), e.setAttribute("open", "")
                    }
                }, {
                    key: "showHelpModal",
                    value: function() {
                        var e = this.$game.querySelector("game-modal");
                        e.appendChild(document.createElement("game-help")), e.setAttribute("open", "")
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.appendChild(gameAppTemplate.content.cloneNode(!0)), this.$game = this.querySelector("#game"), this.$board = this.querySelector("#board"), this.$keyboard = this.querySelector("game-keyboard"), this.sizeBoard(), this.lastPlayedTs || setTimeout((function() {
                            return e.showHelpModal()
                        }), 100);
                        for (var a = 0; a < 6; a++) {
                            var s = document.createElement("game-row");
                            s.setAttribute("letters", this.boardState[a]), s.setAttribute("length", 5), this.evaluations[a] && (s.evaluation = this.evaluations[a]), this.$board.appendChild(s)
                        }
                        this.$game.addEventListener("game-key-press", (function(a) {
                            var s = a.detail.key;
                            "←" === s || "Backspace" === s ? e.removeLetter() : "↵" === s || "Enter" === s ? e.submitGuess() : ALPHABET.includes(s.toLowerCase()) && e.addLetter(s.toLowerCase())
                        })), this.$game.addEventListener("game-last-tile-revealed-in-row", (function(a) {
                            e.$keyboard.letterEvaluations = e.letterEvaluations, e.rowIndex < 6 && (e.canInput = !0);
                            var s = e.$board.querySelectorAll("game-row")[e.rowIndex - 1];
                            (a.path || a.composedPath && a.composedPath()).includes(s) && ([GAME_STATUS_WIN, GAME_STATUS_FAIL].includes(e.gameStatus) && (e.restoringFromLocalStorage ? e.showStatsModal() : (e.gameStatus === GAME_STATUS_WIN && (s.setAttribute("win", ""), e.addToast(WIN_COMMENTS[e.rowIndex - 1], 2e3)), e.gameStatus === GAME_STATUS_FAIL && e.addToast(e.solution.toUpperCase(), 1 / 0), setTimeout((function() {
                                e.showStatsModal()
                            }), 2500))), e.restoringFromLocalStorage = !1)
                        })), this.addEventListener("game-setting-change", (function(a) {
                            var s = a.detail,
                                t = s.name,
                                o = s.checked,
                                n = s.disabled;
                            switch (t) {
                            case "hard-mode":
                                return void (n ? e.addToast("Hard mode can only be enabled at the start of a round", 1500, !0) : (e.hardMode = o, saveGameState({
                                    hardMode: o
                                })))
                            }
                        })), this.querySelector("#settings-button").addEventListener("click", (function(a) {
                            var s = e.$game.querySelector("game-page"),
                                t = document.createTextNode("Settings");
                            s.appendChild(t);
                            var o = document.createElement("game-settings");
                            o.setAttribute("slot", "content"), o.gameApp = e, s.appendChild(o), s.setAttribute("open", "")
                        })), this.querySelector("#help-button").addEventListener("click", (function(a) {
                            var s = e.$game.querySelector("game-page"),
                                t = document.createTextNode("How to play");
                            s.appendChild(t);
                            var o = document.createElement("game-help");
                            o.setAttribute("page", ""), o.setAttribute("slot", "content"), s.appendChild(o), s.setAttribute("open", "")
                        })), this.querySelector("#statistics-button").addEventListener("click", (function(a) {
                            e.showStatsModal()
                        })), this.querySelector("#save-button").addEventListener("click", (function(a) {
                            var s = document.querySelector('#save');
                            s.classList.toggle('hidden');

                        })), window.addEventListener("resize", this.sizeBoard.bind(this))
                    }
                }, {
                    key: "disconnectedCallback",
                    value: function() {}
                }, {
                    key: "debugTools",
                    value: function() {
                        var e = this;
                        this.querySelector("#debug-tools").appendChild(qaButtons.content.cloneNode(!0)), this.querySelector("#toast").addEventListener("click", (function(a) {
                            e.addToast("hello world")
                        })), this.querySelector("#modal").addEventListener("click", (function(a) {
                            var s = e.$game.querySelector("game-modal");
                            s.textContent = "hello plz", s.setAttribute("open", "")
                        })), this.querySelector("#reveal").addEventListener("click", (function() {
                            e.evaluateRow()
                        })), this.querySelector("#shake").addEventListener("click", (function() {
                            e.$board.querySelectorAll("game-row")[e.rowIndex].setAttribute("invalid", "")
                        })), this.querySelector("#bounce").addEventListener("click", (function() {
                            var a = e.$board.querySelectorAll("game-row")[e.rowIndex - 1];
                            "" === a.getAttribute("win") ? a.removeAttribute("win") : a.setAttribute("win", "")
                        }))
                    }
                }]), t
        }(c(HTMLElement));
    customElements.define("game-app", GameApp);
    var modalOverlayTemplate = document.createElement("template");
    modalOverlayTemplate.innerHTML = `
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="close-icon">
        <game-icon icon="close"></game-icon>
      </div>
    </div>
  </div>
`;
    var GameModal = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            return s(this, t), a.call(this)
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    this.appendChild(modalOverlayTemplate.content.cloneNode(!0));
                    this.$overlay = this.querySelector(".modal-overlay");
                    this.$content = this.querySelector(".modal-content");
                    this.addEventListener("click", (function(a) {
                        e.$content.classList.add("closing")
                    })), this.addEventListener("animationend", (function(a) {
                        "SlideOut" === a.animationName && (e.$content.classList.remove("closing"), e.removeAttribute("open"),
                        Array.from(e.$content.childNodes).forEach((function(node) {
                            if (!node.classList || !node.classList.contains("close-icon")) {
                                e.$content.removeChild(node)
                            }
                        })))
                    }))
                }
            }, {
                key: "appendChild",
                value: function(child) {
                    if (this.$content && child !== this.$overlay) {
                        var closeIcon = this.$content.querySelector(".close-icon");
                        this.$content.insertBefore(child, closeIcon);
                    } else {
                        HTMLElement.prototype.appendChild.call(this, child);
                    }
                    return child;
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-modal", GameModal);
    // keyboard template - just the container div, styles moved to header-container
    var keyButtonTemplate = document.createElement("template");
    keyButtonTemplate.innerHTML = `<button>key</button>`;
    var spacerDiv = document.createElement("template");
    spacerDiv.innerHTML = `<div class="spacer"></div>`;
    var keyLabels = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["-", "a", "s", "d", "f", "g", "h", "j", "k", "l", "-"],
        ["↵", "z", "x", "c", "v", "b", "n", "m", "←"]],
        GameKeyboard = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                return s(this, t), n(p(e = a.call(this)), "_letterEvaluations", {}), e
            }
            return o(t, [{
                    key: "letterEvaluations",
                    set: function(e) {
                        this._letterEvaluations = e, this._render()
                    }
                }, {
                    key: "dispatchKeyPressEvent",
                    value: function(e) {
                        this.dispatchEvent(new CustomEvent("game-key-press", {
                            bubbles: !0,
                            detail: {
                                key: e
                            }
                        }))
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        var kbDiv = document.createElement("div");
                        kbDiv.id = "keyboard";
                        this.appendChild(kbDiv);
                        this.$keyboard = kbDiv;
                        this.$keyboard.addEventListener("click", (function(a) {
                            var s = a.target.closest("button");
                            s && e.$keyboard.contains(s) && e.dispatchKeyPressEvent(s.dataset.key)
                        })), window.addEventListener("keydown", (function(a) {
                            if (!0 !== a.repeat) {
                                var s = a.key,
                                    t = a.metaKey,
                                    o = a.ctrlKey;
                                t || o || (ALPHABET.includes(s.toLowerCase()) || "Backspace" === s || "Enter" === s) && e.dispatchKeyPressEvent(s)
                            }
                        })), this.$keyboard.addEventListener("transitionend", (function(a) {
                            var s = a.target.closest("button");
                            s && e.$keyboard.contains(s) && s.classList.remove("fade")
                        })), keyLabels.forEach((function(a) {
                            var s = document.createElement("div");
                            s.classList.add("row"), a.forEach((function(e) {
                                var a;
                                if (e >= "a" && e <= "z" || "←" === e || "↵" === e) {
                                    if ((a = keyButtonTemplate.content.cloneNode(!0).firstElementChild).dataset.key = e, a.textContent = e, "←" === e) {
                                        var t = document.createElement("game-icon");
                                        t.setAttribute("icon", "backspace"), a.textContent = "", a.appendChild(t), a.classList.add("one-and-a-half")
                                    }
                                    "↵" == e && (a.textContent = "enter", a.classList.add("one-and-a-half"))
                                } else (a = spacerDiv.content.cloneNode(!0).firstElementChild).classList.add(1 === e.length ? "half" : "one");
                                s.appendChild(a)
                            })), e.$keyboard.appendChild(s)
                        })), this._render()
                    }
                }, {
                    key: "_render",
                    value: function() {
                        for (var e in this._letterEvaluations) {
                            var a = this.$keyboard.querySelector('[data-key="'.concat(e, '"]'));
                            a.dataset.state = this._letterEvaluations[e], a.classList.add("fade")
                        }
                    }
                }]), t
        }(c(HTMLElement));
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
            // User cancelled share or share failed - fall through to clipboard
            if (err.name === 'AbortError') {
                // User cancelled - don't show error, just return
                return;
            }
        }

        // Clipboard fallback
        try {
            await navigator.clipboard.writeText(data.text);
            onSuccess();
        } catch (err) {
            onError();
        }
    }

    function buildShareText(gameResults) {
      var evaluations = gameResults.evaluations;
      var dayOffset = gameResults.dayOffset;
      var rowIndex = gameResults.rowIndex;
      var isHardMode = gameResults.isHardMode;
      var isWin = gameResults.isWin;
      var isDarkTheme = JSON.parse(window.localStorage.getItem(DARK_THEME_KEY));
      var isColorBlind = JSON.parse(window.localStorage.getItem(COLOR_BLIND_THEME_KEY));

      // Build header line: "Wordle 123 4/6 (1995p)" or "Wordle 123 X/6* (1995p)"
      var header = "Wordle " + dayOffset.toLocaleString();
      header += " " + (isWin ? rowIndex : "X") + "/6";
      if (isHardMode) {
        header += "*";
      }
      header += " (1995p)";
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

      return { text: header + "\n\n" + grid.trimEnd() };
    }

    var statsContainerTemplate = document.createElement("template");
    statsContainerTemplate.innerHTML = `
  <div class="stats-container">
    <h1>Statistics</h1>
    <div id="statistics"></div>
    <h1>Guess Distribution</h1>
    <div id="guess-distribution"></div>
    <div class="stats-footer"></div>
  </div>
`;
    var statisticItemTemplate = document.createElement("template");
    statisticItemTemplate.innerHTML = `
  <div class="statistic-container">
    <div class="statistic"></div>
    <div class="label"></div>
  </div>
`;
    var graphBarTemplate = document.createElement("template");
    graphBarTemplate.innerHTML = `
  <div class="graph-container">
    <div class="guess"></div>
    <div class="graph">
      <div class="graph-bar">
        <div class="num-guesses"></div>
      </div>
    </div>
  </div>
`;
    var countdownTemplate = document.createElement("template");
    countdownTemplate.innerHTML = `
  <div class="countdown">
    <h1>Next WORDLE</h1>
    <div id="timer">
      <div class="statistic-container">
        <div class="statistic timer">
          <countdown-timer></countdown-timer>
        </div>
      </div>
    </div>
  </div>
  <div class="share">
    <button id="share-button">
      Share <game-icon icon="share"></game-icon>
    </button>
  </div>
`;
    var STATISTIC_LABELS = {
            currentStreak: "Current Streak",
            maxStreak: "Max Streak",
            winPercentage: "Win %",
            gamesPlayed: "Played",
            gamesWon: "Won",
            averageGuesses: "Av. Guesses"
        },
        GameStats = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                return s(this, t), n(p(e = a.call(this)), "stats", {}), n(p(e), "gameApp", void 0), e.stats = getStatistics(), e
            }
            return o(t, [{
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.appendChild(statsContainerTemplate.content.cloneNode(!0));
                        var a = this.querySelector("#statistics"),
                            s = this.querySelector("#guess-distribution"),
                            t = Math.max.apply(Math, g(Object.values(this.stats.guesses)));
                        if (Object.values(this.stats.guesses).every((function(e) {
                                    return 0 === e
                                }))) {
                            var o = document.createElement("div");
                            o.classList.add("no-data"), o.innerText = "No Data", s.appendChild(o)
                        } else
                            for (var n = 1; n < Object.keys(this.stats.guesses).length; n++) {
                                var r = n,
                                    i = this.stats.guesses[n],
                                    l = graphBarTemplate.content.cloneNode(!0),
                                    d = Math.max(7, Math.round(i / t * 100));
                                l.querySelector(".guess").textContent = r;var u = l.querySelector(".graph-bar");
                                if (u.style.width = "".concat(d, "%"), "number" == typeof i) {
                                    l.querySelector(".num-guesses").textContent = i, i > 0 && u.classList.add("align-right");
                                    var c = parseInt(this.getAttribute("highlight-guess"), 10);
                                    c && n === c && u.classList.add("highlight")
                                }
                                s.appendChild(l)
                        }
                        if (["gamesPlayed", "winPercentage", "currentStreak", "maxStreak"].forEach((function(s) {
                                    var t = STATISTIC_LABELS[s],
                                        o = e.stats[s],
                                        n = statisticItemTemplate.content.cloneNode(!0);
                                    n.querySelector(".label").textContent = t, n.querySelector(".statistic").textContent = o, a.appendChild(n)
                                })), this.gameApp.gameStatus !== GAME_STATUS_IN_PROGRESS) {
                            var p = this.querySelector(".stats-footer"),
                                m = countdownTemplate.content.cloneNode(!0);
                            p.appendChild(m), this.querySelector("button#share-button").addEventListener("click", (function(a) {
                                a.preventDefault();
                                a.stopPropagation();
                                shareOrCopy(buildShareText({
                                    evaluations: e.gameApp.evaluations,
                                    dayOffset: e.gameApp.dayOffset,
                                    rowIndex: e.gameApp.rowIndex,
                                    isHardMode: e.gameApp.hardMode,
                                    isWin: e.gameApp.gameStatus === GAME_STATUS_WIN
                                }), function() {
                                    e.gameApp.addToast("Copied results to clipboard", 2000, true);
                                }, function() {
                                    e.gameApp.addToast("Share failed", 2000, true);
                                });
                            }))
                        }
                    }
                }]), t
        }(c(HTMLElement));
    customElements.define("game-stats", GameStats);
    var GameSwitch = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            return s(this, t), a.call(this)
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    var container = document.createElement("div");
                    container.classList.add("container");
                    container.innerHTML = '<label></label><div class="switch"><span class="knob"></span></div>';
                    this.appendChild(container);
                    container.addEventListener("click", (function(a) {
                        a.stopPropagation(), e.hasAttribute("checked") ? e.removeAttribute("checked") : e.setAttribute("checked", ""), e.dispatchEvent(new CustomEvent("game-switch-change", {
                            bubbles: !0,
                            composed: !0,
                            detail: {
                                name: e.getAttribute("name"),
                                checked: e.hasAttribute("checked"),
                                disabled: e.hasAttribute("disabled")
                            }
                        }))
                    }))
                }
            }], [{
                key: "observedAttributes",
                get: function() {
                    return ["checked"]
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-switch", GameSwitch);
    var helpTemplate = document.createElement("template");
    helpTemplate.innerHTML = `
  <section>
    <div class="instructions">
      <p>Guess the <strong>WORDLE</strong> in 6 tries.</p>
      <p>Each guess must be a valid 5 letter word. Hit the enter button to submit.</p>
      <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
      <div class="examples">
        <p><strong>Examples</strong></p>
        <div class="example">
          <div class="row">
            <game-tile letter="w" evaluation="correct" reveal></game-tile>
            <game-tile letter="e"></game-tile>
            <game-tile letter="a"></game-tile>
            <game-tile letter="r"></game-tile>
            <game-tile letter="y"></game-tile>
          </div>
          <p>The letter <strong>W</strong> is in the word and in the correct spot.</p>
        </div>
        <div class="example">
          <div class="row">
            <game-tile letter="p"></game-tile>
            <game-tile letter="i" evaluation="present" reveal></game-tile>
            <game-tile letter="l"></game-tile>
            <game-tile letter="l"></game-tile>
            <game-tile letter="s"></game-tile>
          </div>
          <p>The letter <strong>I</strong> is in the word but in the wrong spot.</p>
        </div>
        <div class="example">
          <div class="row">
            <game-tile letter="v"></game-tile>
            <game-tile letter="a"></game-tile>
            <game-tile letter="g"></game-tile>
            <game-tile letter="u" evaluation="absent" reveal></game-tile>
            <game-tile letter="e"></game-tile>
          </div>
          <p>The letter <strong>U</strong> is not in the word in any spot.</p>
        </div>
      </div>
      <p><strong>A new WORDLE will be available each day!</strong></p>
    </div>
  </section>
`;
    var GameHelp = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            return s(this, t), a.call(this)
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    this.appendChild(helpTemplate.content.cloneNode(!0))
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-help", GameHelp);
    var pageOverlayTemplate = document.createElement("template");
    pageOverlayTemplate.innerHTML = `
  <div class="page-overlay">
    <div class="page-content">
      <header>
        <h1 class="page-title"></h1>
        <game-icon icon="close"></game-icon>
      </header>
      <div class="page-content-container"></div>
    </div>
  </div>
`;
    var GamePage = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            return s(this, t), a.call(this)
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    this.appendChild(pageOverlayTemplate.content.cloneNode(!0));
                    this.$overlay = this.querySelector(".page-overlay");
                    this.$content = this.querySelector(".page-content");
                    this.$title = this.querySelector(".page-title");
                    this.$contentContainer = this.querySelector(".page-content-container");
                    this.querySelector("game-icon").addEventListener("click", (function(a) {
                        e.$overlay.classList.add("closing")
                    })), this.addEventListener("animationend", (function(a) {
                        "SlideOut" === a.animationName && (e.$overlay.classList.remove("closing"),
                        e.$title.textContent = "",
                        Array.from(e.$contentContainer.childNodes).forEach((function(a) {
                            e.$contentContainer.removeChild(a)
                        })), e.removeAttribute("open"))
                    }))
                }
            }, {
                key: "appendChild",
                value: function(child) {
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
            }]), t
    }(c(HTMLElement));
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
    var GameIcon = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            return s(this, t), a.call(this)
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
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
            }]), t
    }(c(HTMLElement));
    customElements.define("game-icon", GameIcon);
    var MS_PER_MINUTE = 6e4,
        MS_PER_HOUR = 36e5,
        CountdownTimer = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                s(this, t), n(p(e = a.call(this)), "targetEpochMS", void 0), n(p(e), "intervalId", void 0), n(p(e), "$timer", void 0);
                var o = new Date;
                return o.setDate(o.getDate() + 1), o.setHours(0, 0, 0, 0), e.targetEpochMS = o.getTime(), e
            }
            return o(t, [{
                    key: "padDigit",
                    value: function(e) {
                        return e.toString().padStart(2, "0")
                    }
                }, {
                    key: "updateTimer",
                    value: function() {
                        var e,
                            a = (new Date).getTime(),
                            s = Math.floor(this.targetEpochMS - a);
                        if (s <= 0)
                            e = "00:00:00";
                        else {
                            var t = Math.floor(s % 864e5 / MS_PER_HOUR),
                                o = Math.floor(s % MS_PER_HOUR / MS_PER_MINUTE),
                                n = Math.floor(s % MS_PER_MINUTE / 1e3);
                            e = "".concat(this.padDigit(t), ":").concat(this.padDigit(o), ":").concat(this.padDigit(n))
                        }
                        this.$timer.textContent = e
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        var timerDiv = document.createElement("div");
                        timerDiv.id = "countdown-timer-display";
                        this.appendChild(timerDiv);
                        this.$timer = timerDiv;
                        this.intervalId = setInterval((function() {
                            e.updateTimer()
                        }), 200)
                    }
                }, {
                    key: "disconnectedCallback",
                    value: function() {
                        clearInterval(this.intervalId)
                    }
                }]), t
        }(c(HTMLElement));
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
