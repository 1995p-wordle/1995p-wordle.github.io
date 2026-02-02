/**
 * Tests for wordle.js game logic functions
 *
 * These tests reference the obfuscated names via aliases.
 * As you refactor, update the alias assignments to use the new names.
 *
 * Example workflow:
 *   1. const getOrdinal = testExports.$a;  // current obfuscated name
 *   2. Rename $a to getOrdinal in wordle.js
 *   3. const getOrdinal = testExports.getOrdinal;  // updated reference
 *   4. Run tests - they should still pass
 */

const fs = require('fs');
const path = require('path');

// Set up minimal browser environment for wordle.js
const { JSDOM } = require('jsdom');

// Create a DOM with the required elements
const html = `
<!DOCTYPE html>
<html>
<head></head>
<body>
  <div id="header-container">
    <div id="game"></div>
  </div>
</body>
</html>
`;

const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    url: 'http://localhost'
});

// Set up globals that wordle.js expects
global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.customElements = dom.window.customElements;
global.localStorage = {
    _data: {},
    getItem: function(key) { return this._data[key] || null; },
    setItem: function(key, value) { this._data[key] = value; },
    removeItem: function(key) { delete this._data[key]; },
    clear: function() { this._data = {}; }
};
global.window.localStorage = global.localStorage;

// Load answer_list.js and valid_guesses.js first
const answerListPath = path.join(__dirname, '../answer_list.js');
const validGuessesPath = path.join(__dirname, '../valid_guesses.js');
const wordleJsPath = path.join(__dirname, '../wordle.js');

// Execute answer_list.js to define global answer_list
const answerListCode = fs.readFileSync(answerListPath, 'utf8');
dom.window.eval(answerListCode);

// Execute valid_guesses.js to define global valid_guesses
const validGuessesCode = fs.readFileSync(validGuessesPath, 'utf8');
dom.window.eval(validGuessesCode);

// Now load wordle.js
const wordleCode = fs.readFileSync(wordleJsPath, 'utf8');
dom.window.eval(wordleCode);

// Get the test exports
const testExports = dom.window.wordle.bundle._testExports;

// ============================================================================
// ALIAS DEFINITIONS - Update these as you rename functions in wordle.js
// ============================================================================

// Constants (current obfuscated names -> meaningful names)
const PRESENT = testExports.Ia;           // Will become: testExports.PRESENT
const CORRECT = testExports.Ma;           // Will become: testExports.CORRECT
const ABSENT = testExports.Oa;            // Will become: testExports.ABSENT
const STATE_PRECEDENCE = testExports.Ra;  // Will become: testExports.STATE_PRECEDENCE
const PUZZLE_START_DATE = testExports.Ha; // Will become: testExports.PUZZLE_START_DATE
const GAME_STATUS_IN_PROGRESS = testExports.Za; // Will become: testExports.GAME_STATUS_IN_PROGRESS
const GAME_STATUS_WIN = testExports.es;   // Will become: testExports.GAME_STATUS_WIN
const GAME_STATUS_FAIL = testExports.as;  // Will become: testExports.GAME_STATUS_FAIL
const FAIL_KEY = testExports.Ja;          // Will become: testExports.FAIL_KEY
const DEFAULT_STATISTICS = testExports.Ua; // Will become: testExports.DEFAULT_STATISTICS

// Functions (current obfuscated names -> meaningful names)
const aggregateLetterEvaluations = testExports.Pa; // Will become: testExports.aggregateLetterEvaluations
const getOrdinal = testExports.$a;                 // Will become: testExports.getOrdinal
const calculateDaysBetween = testExports.Na;       // Will become: testExports.calculateDaysBetween
const getSolution = testExports.Da;                // Will become: testExports.getSolution
const getDayOffset = testExports.Ga;               // Will become: testExports.getDayOffset
const encodeWord = testExports.Wa;                 // Will become: testExports.encodeWord

// ============================================================================
// TESTS
// ============================================================================

describe('Constants', () => {
    test('letter evaluation constants are correct strings', () => {
        expect(PRESENT).toBe('present');
        expect(CORRECT).toBe('correct');
        expect(ABSENT).toBe('absent');
    });

    test('state precedence ordering is correct', () => {
        expect(STATE_PRECEDENCE.unknown).toBeLessThan(STATE_PRECEDENCE.absent);
        expect(STATE_PRECEDENCE.absent).toBeLessThan(STATE_PRECEDENCE.present);
        expect(STATE_PRECEDENCE.present).toBeLessThan(STATE_PRECEDENCE.correct);
    });

    test('game status constants are correct', () => {
        expect(GAME_STATUS_IN_PROGRESS).toBe('IN_PROGRESS');
        expect(GAME_STATUS_WIN).toBe('WIN');
        expect(GAME_STATUS_FAIL).toBe('FAIL');
    });

    test('puzzle start date is June 19, 2021', () => {
        expect(PUZZLE_START_DATE.getFullYear()).toBe(2021);
        expect(PUZZLE_START_DATE.getMonth()).toBe(5); // June (0-indexed)
        expect(PUZZLE_START_DATE.getDate()).toBe(19);
    });

    test('fail key is "fail"', () => {
        expect(FAIL_KEY).toBe('fail');
    });

    test('default statistics has correct structure', () => {
        expect(DEFAULT_STATISTICS.currentStreak).toBe(0);
        expect(DEFAULT_STATISTICS.maxStreak).toBe(0);
        expect(DEFAULT_STATISTICS.gamesPlayed).toBe(0);
        expect(DEFAULT_STATISTICS.gamesWon).toBe(0);
        expect(DEFAULT_STATISTICS.winPercentage).toBe(0);
        expect(DEFAULT_STATISTICS.averageGuesses).toBe(0);
        expect(DEFAULT_STATISTICS.guesses).toBeDefined();
        expect(DEFAULT_STATISTICS.guesses[1]).toBe(0);
        expect(DEFAULT_STATISTICS.guesses.fail).toBe(0);
    });
});

describe('getOrdinal (currently $a)', () => {
    test('1st', () => expect(getOrdinal(1)).toBe('1st'));
    test('2nd', () => expect(getOrdinal(2)).toBe('2nd'));
    test('3rd', () => expect(getOrdinal(3)).toBe('3rd'));
    test('4th', () => expect(getOrdinal(4)).toBe('4th'));
    test('5th', () => expect(getOrdinal(5)).toBe('5th'));
    test('11th (special case)', () => expect(getOrdinal(11)).toBe('11th'));
    test('12th (special case)', () => expect(getOrdinal(12)).toBe('12th'));
    test('13th (special case)', () => expect(getOrdinal(13)).toBe('13th'));
    test('21st', () => expect(getOrdinal(21)).toBe('21st'));
    test('22nd', () => expect(getOrdinal(22)).toBe('22nd'));
    test('23rd', () => expect(getOrdinal(23)).toBe('23rd'));
    test('100th', () => expect(getOrdinal(100)).toBe('100th'));
    test('101st', () => expect(getOrdinal(101)).toBe('101st'));
    test('111th (special case)', () => expect(getOrdinal(111)).toBe('111th'));
});

describe('calculateDaysBetween (currently Na)', () => {
    test('same day returns 0', () => {
        const date = new Date(2023, 5, 15);
        expect(calculateDaysBetween(date, date)).toBe(0);
    });

    test('one day apart', () => {
        const start = new Date(2023, 5, 15);
        const end = new Date(2023, 5, 16);
        expect(calculateDaysBetween(start, end)).toBe(1);
    });

    test('multiple days apart', () => {
        const start = new Date(2023, 5, 15);
        const end = new Date(2023, 5, 25);
        expect(calculateDaysBetween(start, end)).toBe(10);
    });

    test('across month boundary', () => {
        const start = new Date(2023, 5, 30);
        const end = new Date(2023, 6, 5);
        expect(calculateDaysBetween(start, end)).toBe(5);
    });

    test('ignores time of day', () => {
        const start = new Date(2023, 5, 15, 23, 59, 59);
        const end = new Date(2023, 5, 16, 0, 0, 1);
        expect(calculateDaysBetween(start, end)).toBe(1);
    });
});

describe('getDayOffset (currently Ga)', () => {
    test('puzzle start date returns 0', () => {
        expect(getDayOffset(PUZZLE_START_DATE)).toBe(0);
    });

    test('one day after start returns 1', () => {
        const date = new Date(2021, 5, 20);
        expect(getDayOffset(date)).toBe(1);
    });

    test('one year after start', () => {
        const date = new Date(2022, 5, 19);
        expect(getDayOffset(date)).toBe(365);
    });
});

describe('getSolution (currently Da)', () => {
    test('returns a 5-letter word', () => {
        const solution = getSolution(new Date(2023, 5, 15));
        expect(solution).toHaveLength(5);
    });

    test('same date returns same word', () => {
        const date1 = new Date(2023, 5, 15, 10, 30);
        const date2 = new Date(2023, 5, 15, 22, 45);
        expect(getSolution(date1)).toBe(getSolution(date2));
    });

    test('different dates return different words (usually)', () => {
        const word1 = getSolution(new Date(2023, 5, 15));
        const word2 = getSolution(new Date(2023, 5, 16));
        // They could theoretically be the same if answer_list repeats, but very unlikely
        expect(word1).not.toBe(word2);
    });

    test('puzzle start date returns first word in answer list', () => {
        const solution = getSolution(PUZZLE_START_DATE);
        expect(solution).toBe(dom.window.answer_list[0]);
    });
});

describe('aggregateLetterEvaluations (currently Pa)', () => {
    test('empty board returns empty object', () => {
        const result = aggregateLetterEvaluations(
            ['', '', '', '', '', ''],
            [null, null, null, null, null, null]
        );
        expect(result).toEqual({});
    });

    test('single guess aggregates correctly', () => {
        const boardState = ['crane', '', '', '', '', ''];
        const evaluations = [
            [CORRECT, ABSENT, PRESENT, ABSENT, ABSENT],
            null, null, null, null, null
        ];
        const result = aggregateLetterEvaluations(boardState, evaluations);
        expect(result.c).toBe(CORRECT);
        expect(result.r).toBe(ABSENT);
        expect(result.a).toBe(PRESENT);
        expect(result.n).toBe(ABSENT);
        expect(result.e).toBe(ABSENT);
    });

    test('upgrades letter state with better evaluation', () => {
        const boardState = ['crane', 'catch', '', '', '', ''];
        const evaluations = [
            [CORRECT, ABSENT, ABSENT, ABSENT, ABSENT],  // 'a' is absent
            [CORRECT, PRESENT, ABSENT, ABSENT, ABSENT], // 'a' is present (better)
            null, null, null, null
        ];
        const result = aggregateLetterEvaluations(boardState, evaluations);
        expect(result.a).toBe(PRESENT); // Upgraded from absent to present
    });

    test('does not downgrade letter state', () => {
        const boardState = ['crane', 'xxxcx', '', '', '', ''];
        const evaluations = [
            [CORRECT, ABSENT, ABSENT, ABSENT, ABSENT], // 'c' is correct
            [ABSENT, ABSENT, ABSENT, PRESENT, ABSENT], // 'c' is present (worse)
            null, null, null, null
        ];
        const result = aggregateLetterEvaluations(boardState, evaluations);
        expect(result.c).toBe(CORRECT); // Should stay correct, not downgrade
    });
});

describe('encodeWord (currently Wa)', () => {
    test('encodes alphabetic characters', () => {
        const encoded = encodeWord('abc');
        expect(encoded).toHaveLength(3);
        expect(encoded).not.toBe('abc'); // Should be different
    });

    test('replaces non-alphabetic characters with underscore', () => {
        const encoded = encodeWord('a1b');
        expect(encoded[1]).toBe('_');
    });

    test('is consistent (same input = same output)', () => {
        expect(encodeWord('crane')).toBe(encodeWord('crane'));
    });

    test('encodes all letters to letters', () => {
        const encoded = encodeWord('abcdefghijklmnopqrstuvwxyz');
        expect(encoded).toMatch(/^[a-z]+$/);
    });
});
