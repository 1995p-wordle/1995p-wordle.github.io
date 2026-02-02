# Wordle.js Refactoring Guide

This guide explains how to rename obfuscated variables and functions in `src/wordle.js` to meaningful names while ensuring the code still works correctly.

## Prerequisites

1. Install dependencies: `npm install`
2. Run tests to verify everything works: `npm test`

## How the Tests Work

The test file (`src/__tests__/game-logic.test.js`) uses **aliases** to reference obfuscated names:

```javascript
// Current state - obfuscated name
const getOrdinal = testExports.$a;

// After refactoring - meaningful name
const getOrdinal = testExports.getOrdinal;
```

This approach means:
- Tests always use the meaningful name (`getOrdinal`)
- You only need to update the alias assignment when you rename something

## Step-by-Step Refactoring Process

### 1. Choose a Variable/Function to Rename

Start with constants and simple functions. The test file documents what each obfuscated name should become:

| Obfuscated | Meaningful Name | Type | Description | Status |
|------------|-----------------|------|-------------|--------|
| `Ia` | `PRESENT` | constant | "present" string |✅|
| `Ma` | `CORRECT` | constant | "correct" string |✅|
| `Oa` | `ABSENT` | constant | "absent" string |✅|
| `Ra` | `STATE_PRECEDENCE` | object | Letter state priority |✅|
| `Ha` | `PUZZLE_START_DATE` | Date | June 19, 2021 |✅|
| `Za` | `GAME_STATUS_IN_PROGRESS` | constant | "IN_PROGRESS" |✅|
| `es` | `GAME_STATUS_WIN` | constant | "WIN" |✅|
| `as` | `GAME_STATUS_FAIL` | constant | "FAIL" |✅|
| `Ja` | `FAIL_KEY` | constant | "fail" |✅|
| `Ua` | `DEFAULT_STATISTICS` | object | Default stats structure |
| `Pa` | `aggregateLetterEvaluations` | function | Combines letter states for keyboard |
| `$a` | `getOrdinal` | function | Returns "1st", "2nd", etc. |
| `Na` | `calculateDaysBetween` | function | Days between two dates |
| `Da` | `getSolution` | function | Gets solution for a date |
| `Ga` | `getDayOffset` | function | Days since puzzle start |
| `Wa` | `encodeWord` | function | ROT13-like encoding |

### 2. Find All Occurrences

Use your editor's find feature to locate all uses of the obfuscated name in `src/wordle.js`.

Example for `$a` (getOrdinal):
```bash
grep -n '\$a' src/wordle.js
```

### 3. Rename in wordle.js

Replace all occurrences of the obfuscated name with the meaningful name.

**Important:** Also update the `_testExports` object at the end of wordle.js:

```javascript
// Before
e._testExports = {
    $a: $a,  // getOrdinal(n)
    // ...
};

// After
e._testExports = {
    getOrdinal: getOrdinal,  // getOrdinal(n)
    // ...
};
```

### 4. Update the Test Alias

In `src/__tests__/game-logic.test.js`, update the alias:

```javascript
// Before
const getOrdinal = testExports.$a;

// After
const getOrdinal = testExports.getOrdinal;
```

### 5. Run Tests

```bash
npm test
```

All tests should pass. If they fail, you likely:
- Missed renaming an occurrence in wordle.js
- Forgot to update the `_testExports` object
- Made a typo

### 6. Test in Browser

Open `index.html` in a browser and play a game to verify everything works.

### 7. Commit

Once tests pass and the game works, commit your changes:
```bash
git add src/wordle.js src/__tests__/game-logic.test.js
git commit -m "Rename $a to getOrdinal"
```

## Recommended Refactoring Order

Start with isolated items that have fewer dependencies:

### Phase 1: Constants
1. `Ia` → `PRESENT`✅
2. `Ma` → `CORRECT`✅
3. `Oa` → `ABSENT`✅
4. `Za` → `GAME_STATUS_IN_PROGRESS`✅
5. `es` → `GAME_STATUS_WIN`✅
6. `as` → `GAME_STATUS_FAIL`✅
7. `Ja` → `FAIL_KEY`✅

### Phase 2: Simple Functions
1. `$a` → `getOrdinal`
2. `Na` → `calculateDaysBetween`
3. `Ga` → `getDayOffset`
4. `Wa` → `encodeWord`

### Phase 3: Data Structures
1. `Ra` → `STATE_PRECEDENCE`
2. `Ha` → `PUZZLE_START_DATE`
3. `Ua` → `DEFAULT_STATISTICS`

### Phase 4: Complex Functions
1. `Da` → `getSolution`
2. `Pa` → `aggregateLetterEvaluations`

## Functions Not Yet Exported for Testing

The following functions are inline/anonymous and would need to be extracted before they can be tested:

| Location | Description | Suggested Name |
|----------|-------------|----------------|
| ~line 1338 | Evaluates a guess against solution | `evaluateGuess` |
| ~line 1312 | Validates hard mode constraints | `validateHardMode` |
| ~line 1256 | Updates statistics | `updateStatistics` |
| ~line 1251 | Gets statistics from localStorage | `getStatistics` |

To add tests for these:
1. Extract the inline function to a named function
2. Add it to `_testExports`
3. Add an alias and tests in the test file

## Other Obfuscated Names to Investigate

The following are used throughout wordle.js but aren't yet in the test exports:

- `ts` - GameApp class
- `us` - GameKeyboard class
- `x` - GameRow class
- `v` - GameTile class
- Various single-letter helper functions (`a`, `s`, `t`, `o`, `n`, `r`, etc.)

## Tips

- **One rename at a time**: Don't try to rename multiple things at once
- **Test after each change**: Run `npm test` after every rename
- **Browser test periodically**: The tests cover logic but not UI
- **Commit frequently**: Small commits make it easy to revert if something breaks
- **Use find-and-replace carefully**: Some short names like `e` and `a` are used as function parameters throughout - be careful not to rename those

## Future: Traditional HTML/CSS/JS Rewrite

This refactoring work prepares the codebase for a potential rewrite to traditional HTML/CSS/JS (removing Shadow DOM/Web Components). The tests will help ensure the game logic remains correct during that larger refactor.

See the `old-school-html` branch (when created) for that work.
