(function() {
    "use strict";

    var HISTORY_KEY = "history";
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

    function mergeMetadata(winner, loser) {
        var out = Object.assign({}, winner);
        var changed = false;

        if (!out.answer && loser && loser.answer) {
            out.answer = loser.answer;
            changed = true;
        }
        if (!out.mode && loser && loser.mode) {
            out.mode = loser.mode;
            changed = true;
        }
        if (!out.starter && loser && loser.starter) {
            out.starter = loser.starter;
            changed = true;
        }
        if (!out.date && loser && loser.date) {
            out.date = loser.date;
            changed = true;
        }

        if (changed) {
            out.updated_at = Date.now();
        }
        return { entry: out, changed: changed };
    }

    function mergeHistoryEntry(existing, incoming) {
        if (!existing) return { entry: incoming, changed: true };

        var existingCompleted = toMs(existing.completed_at);
        var incomingCompleted = toMs(incoming.completed_at);

        if (incomingCompleted && (!existingCompleted || incomingCompleted < existingCompleted)) {
            var incomingWinner = mergeMetadata(incoming, existing);
            return { entry: incomingWinner.entry, changed: true };
        }

        if (existingCompleted && (!incomingCompleted || existingCompleted <= incomingCompleted)) {
            var existingWinner = mergeMetadata(existing, incoming);
            return { entry: existingWinner.entry, changed: existingWinner.changed };
        }

        return { entry: existing, changed: false };
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
            var addedCount = 0;
            var updatedCount = 0;

            rawRecords.forEach(function(raw, index) {
                var entry = normalizeImportedEntry(raw, index);
                if (!entry) {
                    invalidCount += 1;
                    return;
                }

                var key = String(entry.puzzle_num);
                var existing = localHistory[key];
                var merged = mergeHistoryEntry(existing, entry);
                if (!merged.changed) return;

                localHistory[key] = merged.entry;
                changedPuzzleNums.push(entry.puzzle_num);
                if (existing) {
                    updatedCount += 1;
                } else {
                    addedCount += 1;
                }
            });

            if (!changedPuzzleNums.length) {
                showStatus(statusElement, "Import complete: no new changes" + (invalidCount ? " (" + invalidCount + " invalid rows skipped)" : ""), false);
                return;
            }

            setHistoryObject(localHistory);
            notifyHistoryChanged(changedPuzzleNums);
            recomputeStatisticsAfterHistoryImport();

            var statusMessage = "Import complete: " + addedCount + " added, " + updatedCount + " updated";
            if (invalidCount) statusMessage += ", " + invalidCount + " skipped";
            showStatus(statusElement, statusMessage, false);
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
        wireSyncUi(statusElement);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
