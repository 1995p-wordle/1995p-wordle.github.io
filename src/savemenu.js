(function() {
    "use strict";

    var HISTORY_KEY = "history";
    var LEGACY_STATS_KEY = "legacy_stats";
    var STATISTICS_KEY = "statistics";
    var DEVICE_ID_KEY = "device_id";
    var PUZZLE_START_DATE = new Date(2021, 5, 19); // June 19, 2021 local
    var HISTORY_BASE_FIELDS = [
        "puzzle_num",
        "date",
        "result",
        "answer",
        "mode",
        "starter",
        "completed_at",
        "updated_at",
        "device_id"
    ];

    function toDefaultStats() {
        return {
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
    }

    function formatLocalDate(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var day = String(date.getDate()).padStart(2, "0");
        return "".concat(year, "-").concat(month, "-").concat(day);
    }

    function parseLocalDate(dateStr) {
        if (typeof dateStr !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
        var parts = dateStr.split("-");
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10);
        var day = parseInt(parts[2], 10);
        if (!year || !month || !day) return null;
        return new Date(year, month - 1, day);
    }

    function isDateOnOrBefore(leftDateStr, rightDateStr) {
        var left = parseLocalDate(leftDateStr);
        var right = parseLocalDate(rightDateStr);
        if (!left || !right) return false;
        return left.getTime() <= right.getTime();
    }

    function puzzleNumToDate(puzzleNum) {
        var d = new Date(PUZZLE_START_DATE);
        d.setDate(d.getDate() + puzzleNum);
        return formatLocalDate(d);
    }

    function safeParseJSON(str, fallback) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return fallback;
        }
    }

    function getHistoryObject() {
        var raw = window.localStorage.getItem(HISTORY_KEY);
        if (!raw) return {};
        var parsed = safeParseJSON(raw, {});
        if (!parsed || typeof parsed !== "object") return {};

        if (Array.isArray(parsed)) {
            var mapped = {};
            parsed.forEach(function(entry) {
                if (entry && entry.puzzle_num !== undefined && entry.puzzle_num !== null) {
                    mapped[String(entry.puzzle_num)] = entry;
                }
            });
            return mapped;
        }
        return parsed;
    }

    function setHistoryObject(history) {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history || {}));
    }

    function getLegacyStatsObject() {
        var raw = window.localStorage.getItem(LEGACY_STATS_KEY);
        if (!raw) return {};
        var parsed = safeParseJSON(raw, {});
        return parsed && typeof parsed === "object" ? parsed : {};
    }

    function setLegacyStatsObject(legacy) {
        window.localStorage.setItem(LEGACY_STATS_KEY, JSON.stringify(legacy || {}));
    }

    function showStatus(element, message, isError) {
        if (!element) return;
        element.textContent = message;
        element.style.color = isError ? "#d64242" : "";
    }

    function flashElement(element) {
        if (!element) return;
        element.classList.add("flash");
        setTimeout(function() {
            element.classList.remove("flash");
        }, 200);
    }

    function createDownload(filename, content, mimeType) {
        var file = new Blob([content], { type: mimeType || "text/plain" });
        var link = document.createElement("a");
        var url = URL.createObjectURL(file);
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(function() {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    function normalizeText(value) {
        if (value === undefined || value === null) return null;
        var str = String(value).trim();
        if (!str) return null;
        return str;
    }

    function normalizeLowerText(value) {
        var text = normalizeText(value);
        return text ? text.toLowerCase() : null;
    }

    function normalizeMode(value, hardModeValue) {
        var mode = normalizeLowerText(value);
        if (mode) {
            if (mode === "normal" || mode === "standard" || mode === "classic") return "regular";
            return mode;
        }

        if (hardModeValue === true || String(hardModeValue).toLowerCase() === "true") return "hard";
        if (hardModeValue === false || String(hardModeValue).toLowerCase() === "false") return "regular";
        return null;
    }

    function normalizeResult(value) {
        if (value === undefined || value === null || value === "") return null;
        if (typeof value === "number") {
            if (value >= 1 && value <= 6) return value;
            if (value === 7) return 7;
            return null;
        }

        var str = String(value).trim().toLowerCase();
        if (!str) return null;
        if (str === "x" || str === "fail" || str === "failed" || str === "loss" || str === "lost") return 7;

        var parsed = parseInt(str, 10);
        if (!Number.isFinite(parsed)) return null;
        if (parsed >= 1 && parsed <= 6) return parsed;
        if (parsed === 7) return 7;
        return null;
    }

    function normalizePuzzleNum(entry) {
        var raw = entry.puzzle_num;
        if (raw === undefined || raw === null) raw = entry.puzzleNum;
        if (raw === undefined || raw === null) raw = entry.puzzle;
        if (raw === undefined || raw === null) raw = entry.dayOffset;
        if (raw === undefined || raw === null) raw = entry.day_offset;

        var puzzleNum = Number(raw);
        if (!Number.isFinite(puzzleNum)) return null;
        puzzleNum = Math.floor(puzzleNum);
        if (puzzleNum < 0) return null;
        return puzzleNum;
    }

    function normalizeDate(value, puzzleNum) {
        if (typeof value === "string") {
            var trimmed = value.trim();
            var directDateMatch = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);
            if (directDateMatch) return trimmed;
            var parsedMs = Date.parse(trimmed);
            if (!Number.isNaN(parsedMs)) {
                return formatLocalDate(new Date(parsedMs));
            }
        }

        if (value instanceof Date && !Number.isNaN(value.getTime())) {
            return formatLocalDate(value);
        }

        if (typeof value === "number" && Number.isFinite(value)) {
            var ms = value > 1e12 ? value : value * 1000;
            return formatLocalDate(new Date(ms));
        }

        return Number.isFinite(puzzleNum) ? puzzleNumToDate(puzzleNum) : null;
    }

    function toMs(value) {
        if (value === undefined || value === null || value === "") return 0;
        if (typeof value === "number") {
            if (!Number.isFinite(value)) return 0;
            return value > 1e12 ? value : value * 1000;
        }
        var parsed = Date.parse(String(value));
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    function defaultCompletedAt(dateStr, puzzleNum, rowIndex) {
        if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            var ts = Date.parse("".concat(dateStr, "T12:00:00.000Z"));
            if (!Number.isNaN(ts)) return ts + (rowIndex || 0);
        }
        if (Number.isFinite(puzzleNum)) {
            var guessedDate = puzzleNumToDate(puzzleNum);
            var guessedTs = Date.parse("".concat(guessedDate, "T12:00:00.000Z"));
            if (!Number.isNaN(guessedTs)) return guessedTs + (rowIndex || 0);
        }
        return Date.now() + (rowIndex || 0);
    }

    function normalizeTimestamp(value, fallbackDate, puzzleNum, rowIndex) {
        var ms = toMs(value);
        if (ms > 0) return ms;
        return defaultCompletedAt(fallbackDate, puzzleNum, rowIndex);
    }

    function parseCsvLine(line) {
        var result = [];
        var current = "";
        var inQuotes = false;

        for (var i = 0; i < line.length; i++) {
            var ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i += 1;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === "," && !inQuotes) {
                result.push(current);
                current = "";
            } else {
                current += ch;
            }
        }
        result.push(current);
        return result;
    }

    function parseCsvRecords(text) {
        var cleaned = text.replace(/^\uFEFF/, "").trim();
        if (!cleaned) return [];

        var lines = cleaned.split(/\r?\n/).filter(function(line) {
            return line.trim().length > 0;
        });
        if (lines.length < 2) return [];

        var headers = parseCsvLine(lines[0]).map(function(header) {
            return String(header || "")
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_+|_+$/g, "");
        });

        var rows = [];
        for (var i = 1; i < lines.length; i++) {
            var values = parseCsvLine(lines[i]);
            var row = {};
            headers.forEach(function(header, idx) {
                row[header] = idx < values.length ? values[idx] : "";
            });
            rows.push(row);
        }

        return rows;
    }

    function parseJsonRecords(payload) {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (payload && typeof payload === "object" && payload.puzzle_num !== undefined) return [payload];
        if (payload && typeof payload === "object" && payload.puzzleNum !== undefined) return [payload];

        if (payload.history) {
            if (Array.isArray(payload.history)) return payload.history;
            if (payload.history && typeof payload.history === "object") {
                return Object.values(payload.history);
            }
        }

        if (payload.games && Array.isArray(payload.games)) return payload.games;

        if (typeof payload === "object") {
            var values = Object.values(payload);
            var maybeEntries = values.filter(function(v) {
                return v && typeof v === "object";
            });
            if (maybeEntries.length) return maybeEntries;
        }

        return [];
    }

    function parseImportRecords(text, filename) {
        var lower = (filename || "").toLowerCase();
        var firstNonWhitespace = (text.match(/\S/) || [""])[0];

        if (lower.endsWith(".csv")) {
            return parseCsvRecords(text);
        }

        if (lower.endsWith(".json") || firstNonWhitespace === "{" || firstNonWhitespace === "[") {
            var parsed = safeParseJSON(text, null);
            if (!parsed) throw new Error("Invalid JSON file");
            return parseJsonRecords(parsed);
        }

        // fallback: try CSV first, then JSON
        var csvRows = parseCsvRecords(text);
        if (csvRows.length) return csvRows;

        var jsonFallback = safeParseJSON(text, null);
        if (jsonFallback) return parseJsonRecords(jsonFallback);

        throw new Error("Unsupported file format. Use .csv or .json");
    }

    function normalizeImportedEntry(raw, index) {
        if (!raw || typeof raw !== "object") return null;

        var puzzleNum = normalizePuzzleNum(raw);
        if (!Number.isFinite(puzzleNum)) return null;

        var result = normalizeResult(
            raw.result !== undefined ? raw.result :
            raw.guesses !== undefined ? raw.guesses :
            raw.num_guesses !== undefined ? raw.num_guesses :
            raw.numGuesses !== undefined ? raw.numGuesses :
            raw.outcome
        );
        if (!Number.isFinite(result)) return null;

        var date = normalizeDate(
            raw.date !== undefined ? raw.date :
            raw.played_on !== undefined ? raw.played_on :
            raw.playedOn,
            puzzleNum
        );

        var completedAt = normalizeTimestamp(
            raw.completed_at !== undefined ? raw.completed_at :
            raw.completedAt !== undefined ? raw.completedAt :
            raw.timestamp,
            date,
            puzzleNum,
            index
        );

        var updatedAt = normalizeTimestamp(
            raw.updated_at !== undefined ? raw.updated_at :
            raw.updatedAt,
            date,
            puzzleNum,
            index + 1
        );

        return {
            puzzle_num: puzzleNum,
            date: date,
            result: result,
            answer: normalizeLowerText(raw.answer),
            mode: normalizeMode(raw.mode, raw.hardMode !== undefined ? raw.hardMode : raw.hard_mode),
            starter: normalizeLowerText(raw.starter),
            completed_at: completedAt,
            updated_at: updatedAt,
            device_id: normalizeText(raw.device_id || raw.deviceId) || window.localStorage.getItem(DEVICE_ID_KEY) || null
        };
    }

    function getCutoffDateFromLegacy(legacy) {
        return legacy && typeof legacy.cutoff_date === "string" ? legacy.cutoff_date : null;
    }

    function normalizeStatsTotals(stats) {
        stats = stats || {};
        var guesses = stats.guesses || {};
        return {
            gamesPlayed: Number(stats.gamesPlayed) || 0,
            gamesWon: Number(stats.gamesWon) || 0,
            guesses: {
                1: Number(guesses[1]) || 0,
                2: Number(guesses[2]) || 0,
                3: Number(guesses[3]) || 0,
                4: Number(guesses[4]) || 0,
                5: Number(guesses[5]) || 0,
                6: Number(guesses[6]) || 0,
                fail: Number(guesses.fail) || 0
            }
        };
    }

    function computePostCutoffTotals(history, cutoffDate) {
        var totals = {
            gamesPlayed: 0,
            gamesWon: 0,
            guesses: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 }
        };

        Object.values(history || {}).forEach(function(entry) {
            if (!entry) return;
            var result = Number(entry.result);
            if (!Number.isFinite(result)) return;
            var date = entry.date || puzzleNumToDate(Number(entry.puzzle_num));
            if (cutoffDate && isDateOnOrBefore(date, cutoffDate)) return;

            totals.gamesPlayed += 1;
            if (result >= 1 && result <= 6) {
                totals.gamesWon += 1;
                totals.guesses[result] += 1;
            } else {
                totals.guesses.fail += 1;
            }
        });

        return totals;
    }

    function computeDerivedFromTotals(totals) {
        var guessSum = 0;
        for (var i = 1; i <= 6; i += 1) {
            guessSum += i * (totals.guesses[i] || 0);
        }
        return {
            winPercentage: totals.gamesPlayed ? Math.round(totals.gamesWon / totals.gamesPlayed * 100) : 0,
            averageGuesses: totals.gamesWon ? Math.round(guessSum / totals.gamesWon) : 0
        };
    }

    function applyLegacySyncChangeNotification() {
        if (!window.wordleSync || !window.wordleSync.enabled || typeof window.wordleSync.onDataChanged !== "function") {
            return;
        }
        window.wordleSync.onDataChanged("legacy", {});
    }

    function getHistoryExportShape(historyEntries) {
        var fieldSet = Object.create(null);
        HISTORY_BASE_FIELDS.forEach(function(field) {
            fieldSet[field] = true;
        });

        historyEntries.forEach(function(entry) {
            Object.keys(entry || {}).forEach(function(field) {
                fieldSet[field] = true;
            });
        });

        var extraFields = Object.keys(fieldSet).filter(function(field) {
            return !HISTORY_BASE_FIELDS.includes(field);
        }).sort();

        return HISTORY_BASE_FIELDS.concat(extraFields);
    }

    function normalizeEntryForExport(entry, fields) {
        var row = {};
        fields.forEach(function(field) {
            row[field] = entry[field] === undefined ? null : entry[field];
        });
        return row;
    }

    function exportHistoryAsJson() {
        var history = getHistoryObject();
        var entries = Object.values(history).filter(Boolean).sort(function(a, b) {
            return (Number(a.puzzle_num) || 0) - (Number(b.puzzle_num) || 0);
        });
        var fields = getHistoryExportShape(entries);
        var rows = entries.map(function(entry) {
            return normalizeEntryForExport(entry, fields);
        });

        createDownload(
            "wordle_history_" + formatLocalDate(new Date()) + ".json",
            JSON.stringify(rows, null, 2),
            "application/json"
        );
    }

    function escapeCsvValue(value) {
        if (value === undefined || value === null) return "";
        var str = String(value);
        if (str.includes('"') || str.includes(",") || str.includes("\n")) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    }

    function exportHistoryAsCsv() {
        var history = getHistoryObject();
        var entries = Object.values(history).filter(Boolean).sort(function(a, b) {
            return (Number(a.puzzle_num) || 0) - (Number(b.puzzle_num) || 0);
        });
        var fields = getHistoryExportShape(entries);

        var lines = [];
        lines.push(fields.join(","));

        entries.forEach(function(entry) {
            var normalized = normalizeEntryForExport(entry, fields);
            var row = fields.map(function(field) {
                return escapeCsvValue(normalized[field]);
            });
            lines.push(row.join(","));
        });

        createDownload(
            "wordle_history_" + formatLocalDate(new Date()) + ".csv",
            lines.join("\n"),
            "text/csv"
        );
    }

    function notifyHistoryChanged(puzzleNums) {
        if (!window.wordleSync || !window.wordleSync.enabled || typeof window.wordleSync.onDataChanged !== "function") {
            return;
        }

        var seen = Object.create(null);
        puzzleNums.forEach(function(puzzleNum) {
            if (seen[puzzleNum]) return;
            seen[puzzleNum] = true;
            window.wordleSync.onDataChanged("history", { puzzleNum: puzzleNum });
        });
    }

    function recomputeStatisticsAfterHistoryImport() {
        if (window.wordleStats && typeof window.wordleStats.recompute === "function") {
            window.wordleStats.recompute();
            return;
        }
        window.wordleSyncNeedsStatsRefresh = true;
    }

    function openStatsModalFromSaveMenu() {
        var app = document.querySelector("game-app");
        if (app && typeof app.showStatsModal === "function") {
            app.showStatsModal();
        }
    }

    function setImportSummaryLine(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function openHistoryImportSummaryModal(summary) {
        var modal = document.getElementById("history-import-summary-modal");
        if (!modal) return;

        setImportSummaryLine("history-import-summary-line1", summary.processed + " games were processed from your file.");
        setImportSummaryLine("history-import-summary-line2", summary.newGames + " of those games were not previously recorded in your history.");
        if (summary.cutoffDate) {
            setImportSummaryLine("history-import-summary-line3", summary.preCutoff + " of the new games were before cutoff (" + summary.cutoffDate + ") and did not change stats.");
        } else {
            setImportSummaryLine("history-import-summary-line3", "No cutoff date is set, so all new games were eligible to affect stats.");
        }
        setImportSummaryLine("history-import-summary-line4", summary.postCutoff + " of the new games were counted toward stats.");

        modal.classList.remove("hidden");
    }

    function closeHistoryImportSummaryModal(showStats) {
        var modal = document.getElementById("history-import-summary-modal");
        if (!modal) return;
        modal.classList.add("hidden");
        if (showStats) openStatsModalFromSaveMenu();
    }

    function wireHistoryImportSummaryModal() {
        var closeButton = document.getElementById("history-import-summary-close");
        var viewStatsButton = document.getElementById("history-import-summary-view-stats");
        if (closeButton) {
            closeButton.addEventListener("click", function() {
                closeHistoryImportSummaryModal(true);
            });
        }
        if (viewStatsButton) {
            viewStatsButton.addEventListener("click", function() {
                closeHistoryImportSummaryModal(true);
            });
        }
    }

    async function handleHistoryImportFile(file, statusElement, loadButtonElement) {
        if (!file) return;

        showStatus(statusElement, "Importing history...", false);
        flashElement(loadButtonElement);

        try {
            var text = await file.text();
            var rawRecords = parseImportRecords(text, file.name);
            if (!rawRecords.length) {
                showStatus(statusElement, "No history rows found in file", true);
                return;
            }

            var localHistory = getHistoryObject();
            var changedPuzzleNums = [];
            var invalidCount = 0;
            var validCount = 0;
            var addedCount = 0;
            var preCutoffCount = 0;
            var postCutoffCount = 0;
            var legacy = getLegacyStatsObject();
            var cutoffDate = getCutoffDateFromLegacy(legacy);
            var stagedByPuzzle = {};

            rawRecords.forEach(function(raw, index) {
                var entry = normalizeImportedEntry(raw, index);
                if (!entry) {
                    invalidCount += 1;
                    return;
                }
                validCount += 1;

                var key = String(entry.puzzle_num);
                if (localHistory[key]) return;
                if (stagedByPuzzle[key]) return;

                stagedByPuzzle[key] = entry;
                localHistory[key] = entry;
                changedPuzzleNums.push(entry.puzzle_num);
                addedCount += 1;

                if (cutoffDate && isDateOnOrBefore(entry.date, cutoffDate)) {
                    preCutoffCount += 1;
                } else {
                    postCutoffCount += 1;
                }
            });

            if (!changedPuzzleNums.length) {
                var noChangeMessage = "Import complete: no new games added";
                if (invalidCount) {
                    noChangeMessage += " (" + invalidCount + " invalid rows skipped)";
                }
                showStatus(statusElement, noChangeMessage, false);
                return;
            }

            setHistoryObject(localHistory);
            notifyHistoryChanged(changedPuzzleNums);
            recomputeStatisticsAfterHistoryImport();

            var statusMessage = "Import complete: " + addedCount + " new games added";
            if (invalidCount) statusMessage += ", " + invalidCount + " skipped";
            showStatus(statusElement, statusMessage, false);

            openHistoryImportSummaryModal({
                processed: validCount,
                newGames: addedCount,
                preCutoff: preCutoffCount,
                postCutoff: postCutoffCount,
                cutoffDate: cutoffDate
            });
        } catch (err) {
            console.error("History import failed", err);
            showStatus(statusElement, "History import failed: " + (err && err.message ? err.message : "unknown error"), true);
        }
    }

    function setButtonsDisabled(buttons, disabled) {
        buttons.forEach(function(button) {
            if (!button) return;
            button.disabled = !!disabled;
        });
    }

    function getCurrentStatsForAdjustment() {
        if (window.wordleStats && typeof window.wordleStats.compute === "function") {
            return normalizeStatsTotals(window.wordleStats.compute());
        }
        var raw = safeParseJSON(window.localStorage.getItem(STATISTICS_KEY), toDefaultStats());
        return normalizeStatsTotals(raw);
    }

    function getAdjustTotalsFromInputs(inputs) {
        function parseField(input) {
            if (!input) return NaN;
            var value = String(input.value || "").trim();
            if (!/^\d+$/.test(value)) return NaN;
            return parseInt(value, 10);
        }

        return {
            gamesPlayed: parseField(inputs.gamesPlayed),
            gamesWon: parseField(inputs.gamesWon),
            guesses: {
                1: parseField(inputs.g1),
                2: parseField(inputs.g2),
                3: parseField(inputs.g3),
                4: parseField(inputs.g4),
                5: parseField(inputs.g5),
                6: parseField(inputs.g6),
                fail: parseField(inputs.gfail)
            }
        };
    }

    function validateAdjustTotals(targetTotals) {
        if (!Number.isFinite(targetTotals.gamesPlayed) || !Number.isFinite(targetTotals.gamesWon)) {
            return "Use whole numbers 0 or greater.";
        }
        for (var i = 1; i <= 6; i += 1) {
            if (!Number.isFinite(targetTotals.guesses[i])) return "Use whole numbers 0 or greater.";
        }
        if (!Number.isFinite(targetTotals.guesses.fail)) return "Use whole numbers 0 or greater.";

        if (targetTotals.gamesWon > targetTotals.gamesPlayed) {
            return "Games Won cannot be greater than Games Played.";
        }

        var winsByGuess = 0;
        for (var j = 1; j <= 6; j += 1) {
            winsByGuess += targetTotals.guesses[j];
        }
        var totalByGuess = winsByGuess + targetTotals.guesses.fail;

        if (totalByGuess !== targetTotals.gamesPlayed) {
            return "Guess totals (1-6 + Failed) must equal Games Played.";
        }
        if (winsByGuess !== targetTotals.gamesWon) {
            return "Winning guess totals (1-6) must equal Games Won.";
        }

        return null;
    }

    function updateAdjustStatsPreview(inputs, preview) {
        var totals = getAdjustTotalsFromInputs(inputs);
        var validationError = validateAdjustTotals(totals);
        var winPct = 0;
        var avgGuesses = 0;

        if (!validationError) {
            var derived = computeDerivedFromTotals(totals);
            winPct = derived.winPercentage;
            avgGuesses = derived.averageGuesses;
        }

        if (preview.winPercentage) preview.winPercentage.textContent = String(winPct);
        if (preview.averageGuesses) preview.averageGuesses.textContent = String(avgGuesses);
    }

    function openAdjustStatsModal(statusElement) {
        var modal = document.getElementById("adjust-stats-modal");
        if (!modal) return;

        var inputs = {
            gamesPlayed: document.getElementById("adjust-gamesPlayed"),
            gamesWon: document.getElementById("adjust-gamesWon"),
            g1: document.getElementById("adjust-g1"),
            g2: document.getElementById("adjust-g2"),
            g3: document.getElementById("adjust-g3"),
            g4: document.getElementById("adjust-g4"),
            g5: document.getElementById("adjust-g5"),
            g6: document.getElementById("adjust-g6"),
            gfail: document.getElementById("adjust-gfail")
        };
        var preview = {
            winPercentage: document.getElementById("adjust-preview-winPercentage"),
            averageGuesses: document.getElementById("adjust-preview-averageGuesses"),
            currentStreak: document.getElementById("adjust-preview-currentStreak"),
            maxStreak: document.getElementById("adjust-preview-maxStreak")
        };
        var errorEl = document.getElementById("adjust-stats-error");

        var stats = getCurrentStatsForAdjustment();
        inputs.gamesPlayed.value = stats.gamesPlayed;
        inputs.gamesWon.value = stats.gamesWon;
        for (var i = 1; i <= 6; i += 1) {
            inputs["g" + i].value = stats.guesses[i];
        }
        inputs.gfail.value = stats.guesses.fail;

        var liveStats = safeParseJSON(window.localStorage.getItem(STATISTICS_KEY), toDefaultStats());
        if (preview.currentStreak) preview.currentStreak.textContent = String(Number(liveStats.currentStreak) || 0);
        if (preview.maxStreak) preview.maxStreak.textContent = String(Number(liveStats.maxStreak) || 0);
        if (errorEl) errorEl.textContent = "";

        updateAdjustStatsPreview(inputs, preview);
        modal.classList.remove("hidden");
        showStatus(statusElement, "Adjusting stats totals...", false);
    }

    function closeAdjustStatsModal() {
        var modal = document.getElementById("adjust-stats-modal");
        if (!modal) return;
        modal.classList.add("hidden");
    }

    function wireAdjustStatsModal(statusElement) {
        var openButton = document.getElementById("adjustStatsButton");
        var applyButton = document.getElementById("adjust-stats-apply");
        var cancelButton = document.getElementById("adjust-stats-cancel");
        var errorEl = document.getElementById("adjust-stats-error");

        var inputs = {
            gamesPlayed: document.getElementById("adjust-gamesPlayed"),
            gamesWon: document.getElementById("adjust-gamesWon"),
            g1: document.getElementById("adjust-g1"),
            g2: document.getElementById("adjust-g2"),
            g3: document.getElementById("adjust-g3"),
            g4: document.getElementById("adjust-g4"),
            g5: document.getElementById("adjust-g5"),
            g6: document.getElementById("adjust-g6"),
            gfail: document.getElementById("adjust-gfail")
        };
        var preview = {
            winPercentage: document.getElementById("adjust-preview-winPercentage"),
            averageGuesses: document.getElementById("adjust-preview-averageGuesses")
        };

        function setError(message) {
            if (!errorEl) return;
            errorEl.textContent = message || "";
        }

        var inputList = Object.values(inputs).filter(Boolean);
        inputList.forEach(function(input) {
            input.addEventListener("input", function() {
                updateAdjustStatsPreview(inputs, preview);
                setError("");
            });
        });

        if (openButton) {
            openButton.addEventListener("click", function() {
                flashElement(openButton);
                openAdjustStatsModal(statusElement);
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener("click", function() {
                closeAdjustStatsModal();
                showStatus(statusElement, "Adjustment cancelled", false);
            });
        }

        if (applyButton) {
            applyButton.addEventListener("click", function() {
                var targetTotals = getAdjustTotalsFromInputs(inputs);
                var validationError = validateAdjustTotals(targetTotals);
                if (validationError) {
                    setError(validationError);
                    return;
                }

                var history = getHistoryObject();
                var legacy = getLegacyStatsObject();
                var cutoffDate = getCutoffDateFromLegacy(legacy);
                var postCutoff = computePostCutoffTotals(history, cutoffDate);

                var nextLegacyGuesses = {
                    1: targetTotals.guesses[1] - postCutoff.guesses[1],
                    2: targetTotals.guesses[2] - postCutoff.guesses[2],
                    3: targetTotals.guesses[3] - postCutoff.guesses[3],
                    4: targetTotals.guesses[4] - postCutoff.guesses[4],
                    5: targetTotals.guesses[5] - postCutoff.guesses[5],
                    6: targetTotals.guesses[6] - postCutoff.guesses[6],
                    7: targetTotals.guesses.fail - postCutoff.guesses.fail
                };
                var nextLegacyGamesPlayed = targetTotals.gamesPlayed - postCutoff.gamesPlayed;
                var nextLegacyGamesWon = targetTotals.gamesWon - postCutoff.gamesWon;

                var hasNegative = nextLegacyGamesPlayed < 0 || nextLegacyGamesWon < 0;
                for (var i = 1; i <= 7; i += 1) {
                    if ((nextLegacyGuesses[i] || 0) < 0) {
                        hasNegative = true;
                        break;
                    }
                }
                if (hasNegative) {
                    setError("These totals are lower than your post-cutoff recorded history and cannot be applied.");
                    return;
                }

                var nextLegacy = Object.assign({}, legacy);
                nextLegacy.gamesPlayed = nextLegacyGamesPlayed;
                nextLegacy.gamesWon = nextLegacyGamesWon;
                nextLegacy.guesses = nextLegacyGuesses;
                nextLegacy.recorded_on = formatLocalDate(new Date());
                if (!("maxStreak" in nextLegacy)) nextLegacy.maxStreak = 0;
                if (!("current_streak_length" in nextLegacy)) nextLegacy.current_streak_length = 0;
                if (!("current_streak_end_date" in nextLegacy)) nextLegacy.current_streak_end_date = null;

                setLegacyStatsObject(nextLegacy);
                applyLegacySyncChangeNotification();
                recomputeStatisticsAfterHistoryImport();
                closeAdjustStatsModal();
                showStatus(statusElement, "Stats adjustment applied", false);
                openStatsModalFromSaveMenu();
            });
        }
    }

    async function refreshSyncStatus(statusElement, emailInput, syncButtons) {
        var sync = window.wordleSync;
        if (!sync || !sync.enabled) {
            setButtonsDisabled(syncButtons, true);
            showStatus(statusElement, "Cloud sync is not configured in this build", false);
            return;
        }

        setButtonsDisabled(syncButtons, false);
        try {
            var signedIn = await sync.isSignedIn();
            if (!signedIn) {
                showStatus(statusElement, "Not signed in", false);
                return;
            }
            var email = await sync.getUserEmail();
            if (emailInput && !emailInput.value) {
                emailInput.value = email || "";
            }
            showStatus(statusElement, "Signed in" + (email ? " as " + email : ""), false);
        } catch (err) {
            showStatus(statusElement, "Unable to check sync status", true);
        }
    }

    async function sendMagicLink(statusElement, emailInput, syncButtons) {
        var sync = window.wordleSync;
        if (!sync || !sync.enabled) {
            showStatus(statusElement, "Cloud sync is not configured in this build", true);
            return;
        }

        var email = emailInput && emailInput.value ? emailInput.value.trim() : "";
        if (!email) {
            showStatus(statusElement, "Enter an email address", true);
            return;
        }

        setButtonsDisabled(syncButtons, true);
        showStatus(statusElement, "Sending magic link...", false);

        try {
            var result = await sync.signInWithMagicLink(email);
            if (result && result.error) {
                showStatus(statusElement, "Magic link failed: " + result.error.message, true);
            } else {
                showStatus(statusElement, "Magic link sent. Check your email.", false);
            }
        } catch (err) {
            showStatus(statusElement, "Magic link failed", true);
        } finally {
            setButtonsDisabled(syncButtons, false);
        }
    }

    async function runManualSync(statusElement, syncButtons) {
        var sync = window.wordleSync;
        if (!sync || !sync.enabled) {
            showStatus(statusElement, "Cloud sync is not configured in this build", true);
            return;
        }

        setButtonsDisabled(syncButtons, true);
        showStatus(statusElement, "Syncing...", false);

        try {
            await sync.performSync({ mode: "full" });
            showStatus(statusElement, "Sync complete", false);
        } catch (err) {
            showStatus(statusElement, "Sync failed", true);
        } finally {
            setButtonsDisabled(syncButtons, false);
        }
    }

    async function runSignOut(statusElement, emailInput, syncButtons) {
        var sync = window.wordleSync;
        if (!sync || !sync.enabled) {
            showStatus(statusElement, "Cloud sync is not configured in this build", true);
            return;
        }

        setButtonsDisabled(syncButtons, true);

        try {
            await sync.signOut();
            if (emailInput) emailInput.value = "";
            showStatus(statusElement, "Signed out", false);
        } catch (err) {
            showStatus(statusElement, "Sign out failed", true);
        } finally {
            setButtonsDisabled(syncButtons, false);
        }
    }

    function wireStatsImportExport(statusElement) {
        var saveButton = document.getElementById("saveButton");
        var loadInput = document.getElementById("inputload");

        if (saveButton) {
            saveButton.addEventListener("click", function() {
                flashElement(saveButton);
                var stats = window.localStorage.getItem("statistics") || JSON.stringify(toDefaultStats());
                createDownload(
                    "wordle_stats_" + formatLocalDate(new Date()) + ".json",
                    stats,
                    "application/json"
                );
                showStatus(statusElement, "Statistics exported", false);
            });
        }

        if (loadInput) {
            loadInput.addEventListener("change", function() {
                var file = loadInput.files && loadInput.files[0];
                if (!file) return;

                file.text().then(function(text) {
                    var json = safeParseJSON(text, null);
                    if (!json) throw new Error("Invalid JSON");
                    window.localStorage.setItem("statistics", JSON.stringify(json));
                    showStatus(statusElement, "Statistics loaded. Reloading...", false);
                    window.location.reload();
                }).catch(function(err) {
                    console.error("Could not load stats", err);
                    showStatus(statusElement, "Could not load stats", true);
                }).finally(function() {
                    loadInput.value = "";
                });
            });
        }
    }

    function wireHistoryImportExport(statusElement) {
        var exportJsonButton = document.getElementById("exportHistoryJsonButton");
        var exportCsvButton = document.getElementById("exportHistoryCsvButton");
        var loadHistoryButton = document.getElementById("loadHistoryButton");
        var loadHistoryInput = document.getElementById("inputHistoryLoad");

        if (exportJsonButton) {
            exportJsonButton.addEventListener("click", function() {
                flashElement(exportJsonButton);
                exportHistoryAsJson();
                showStatus(statusElement, "History exported (JSON)", false);
            });
        }

        if (exportCsvButton) {
            exportCsvButton.addEventListener("click", function() {
                flashElement(exportCsvButton);
                exportHistoryAsCsv();
                showStatus(statusElement, "History exported (CSV)", false);
            });
        }

        if (loadHistoryInput) {
            loadHistoryInput.addEventListener("change", function() {
                var file = loadHistoryInput.files && loadHistoryInput.files[0];
                if (!file) return;
                handleHistoryImportFile(file, statusElement, loadHistoryButton).finally(function() {
                    loadHistoryInput.value = "";
                });
            });
        }
    }

    function wireSyncUi(statusElement) {
        var emailInput = document.getElementById("sync-email-input");
        var signinButton = document.getElementById("sync-signin-button");
        var syncNowButton = document.getElementById("sync-now-button");
        var signoutButton = document.getElementById("sync-signout-button");

        var syncButtons = [signinButton, syncNowButton, signoutButton];

        if (signinButton) {
            signinButton.addEventListener("click", function() {
                sendMagicLink(statusElement, emailInput, syncButtons);
            });
        }

        if (syncNowButton) {
            syncNowButton.addEventListener("click", function() {
                runManualSync(statusElement, syncButtons);
            });
        }

        if (signoutButton) {
            signoutButton.addEventListener("click", function() {
                runSignOut(statusElement, emailInput, syncButtons);
            });
        }

        refreshSyncStatus(statusElement, emailInput, syncButtons);
    }

    function init() {
        var closeButton = document.getElementById("save-close");
        var saveModal = document.querySelector("#save");
        var statusElement = document.getElementById("sync-status");

        if (closeButton && saveModal) {
            closeButton.addEventListener("click", function() {
                saveModal.classList.toggle("hidden");
            });
        }

        wireStatsImportExport(statusElement);
        wireHistoryImportExport(statusElement);
        wireHistoryImportSummaryModal();
        wireAdjustStatsModal(statusElement);
        wireSyncUi(statusElement);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
