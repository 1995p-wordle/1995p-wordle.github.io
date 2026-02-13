(function() {
    "use strict";

    var HISTORY_KEY = "history";
    var GAME_STATE_KEY = "gameState";
    var LEGACY_STATS_KEY = "legacy_stats";
    var SYNC_META_KEY = "sync_meta";
    var PRE_MERGE_STATS_KEY = "pre_merge_stats";
    var PRE_MERGE_HISTORY_KEY = "pre_merge_history";
    var PRE_MERGE_LEGACY_KEY = "pre_merge_legacy_stats";

    var DARK_THEME_KEY = "darkTheme";
    var COLOR_BLIND_THEME_KEY = "colorBlindTheme";
    var SHOW_HELP_ON_LOAD_KEY = "showHelpOnLoad";
    var SHARE_TEXT_ADDITIONS_KEY = "shareTextAdditions";
    var PROFILE_GAME_STATE_KEY = "__sync_game_state";

    var GAMES_TABLE = "games";
    var PROFILES_TABLE = "profiles";

    var DEBOUNCE_MS = 1000;
    var pushTimer = null;

    function disabledApi() {
        window.wordleSync = {
            enabled: false,
            onDataChanged: function() {},
            performSync: function() { return Promise.resolve(); },
            isSignedIn: function() { return Promise.resolve(false); },
            getUserEmail: function() { return Promise.resolve(null); },
            signInWithMagicLink: function() { return Promise.resolve({ error: { message: "Sync disabled" } }); },
            signOut: function() { return Promise.resolve(); }
        };
    }

    if (!window.SUPABASE_SYNC_ENABLED ||
        typeof window.supabase === "undefined" ||
        !window.SUPABASE_URL || window.SUPABASE_URL === "YOUR_SUPABASE_URL" ||
        !window.SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY") {
        disabledApi();
        return;
    }

    var client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

    function safeParseJSON(str, fallback) {
        if (str === null || str === undefined) return fallback;
        try {
            return JSON.parse(str);
        } catch (e) {
            return fallback;
        }
    }

    function toMs(value) {
        if (!value) return 0;
        if (typeof value === "number") return value;
        var parsed = Date.parse(value);
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    function toIso(ms) {
        if (!ms) return null;
        return new Date(ms).toISOString();
    }

    function formatLocalDate(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, "0");
        var day = String(date.getDate()).padStart(2, "0");
        return "".concat(year, "-").concat(month, "-").concat(day);
    }

    function getTodayDateString() {
        return formatLocalDate(new Date());
    }

    function getSyncMeta() {
        var stored = window.localStorage.getItem(SYNC_META_KEY);
        var meta = stored ? safeParseJSON(stored, null) : null;
        if (!meta) {
            meta = {
                history_dirty: [],
                history_last_pulled_at: 0,
                preferences_updated_at: 0,
                legacy_updated_at: 0,
                premerge_complete: false
            };
        }
        if (!Array.isArray(meta.history_dirty)) meta.history_dirty = [];
        if (!meta.history_last_pulled_at) meta.history_last_pulled_at = 0;
        if (!meta.preferences_updated_at) meta.preferences_updated_at = 0;
        if (!meta.legacy_updated_at) meta.legacy_updated_at = 0;
        if (meta.premerge_complete !== true) meta.premerge_complete = false;
        return meta;
    }

    function setSyncMeta(meta) {
        window.localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta));
    }

    function updateSyncMeta(patch) {
        var current = getSyncMeta();
        Object.keys(patch).forEach(function(key) {
            current[key] = patch[key];
        });
        setSyncMeta(current);
        return current;
    }

    function normalizeHistory(history) {
        if (!history) return {};
        if (Array.isArray(history)) {
            return history.reduce(function(acc, entry) {
                if (entry && entry.puzzle_num !== undefined && entry.puzzle_num !== null) {
                    acc[String(entry.puzzle_num)] = entry;
                }
                return acc;
            }, {});
        }
        if (typeof history === "object") return history;
        return {};
    }

    function getLocalHistory() {
        var stored = window.localStorage.getItem(HISTORY_KEY);
        var parsed = stored ? safeParseJSON(stored, {}) : {};
        return normalizeHistory(parsed);
    }

    function setLocalHistory(history) {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history || {}));
    }

    function getLocalGameState() {
        return safeParseJSON(window.localStorage.getItem(GAME_STATE_KEY), {}) || {};
    }

    function normalizeGameStateForSync(state) {
        if (!state || typeof state !== "object") return null;
        var puzzleNumRaw = state.puzzleNum;
        if (puzzleNumRaw === undefined || puzzleNumRaw === null) puzzleNumRaw = state.puzzle_num;
        var puzzleNum = Number(puzzleNumRaw);
        if (!Number.isFinite(puzzleNum)) return null;

        var date = typeof state.date === "string" ? state.date : null;
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;

        return {
            puzzleNum: puzzleNum,
            date: date,
            rowIndex: Number.isFinite(Number(state.rowIndex)) ? Number(state.rowIndex) : 0,
            boardState: Array.isArray(state.boardState) ? state.boardState : [],
            evaluations: Array.isArray(state.evaluations) ? state.evaluations : [],
            solution: state.solution || null,
            gameStatus: state.gameStatus || null,
            hardMode: state.hardMode === true,
            lastPlayedTs: toMs(state.lastPlayedTs),
            lastCompletedTs: toMs(state.lastCompletedTs),
            updatedAt: toMs(state.updatedAt || state.updated_at || Date.now())
        };
    }

    function getLocalGameStateForProfile() {
        var normalized = normalizeGameStateForSync(getLocalGameState());
        if (!normalized) return null;
        if (normalized.date !== getTodayDateString()) return null;
        return normalized;
    }

    function setLocalGameState(state) {
        if (!state || typeof state !== "object") return;
        window.localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
    }

    function parseStoredBool(key, fallback) {
        var stored = window.localStorage.getItem(key);
        if (stored === null || stored === undefined) return fallback;
        var parsed = safeParseJSON(stored, fallback);
        return parsed;
    }

    function getLocalPreferences() {
        return {
            darkTheme: parseStoredBool(DARK_THEME_KEY, null),
            colorBlindTheme: parseStoredBool(COLOR_BLIND_THEME_KEY, null),
            showHelpOnLoad: parseStoredBool(SHOW_HELP_ON_LOAD_KEY, true),
            shareTextAdditions: safeParseJSON(window.localStorage.getItem(SHARE_TEXT_ADDITIONS_KEY), {
                header: "(Left Wordle)",
                afterGrid: ""
            })
        };
    }

    function buildProfilePreferences(uiPrefs) {
        var profilePrefs = Object.assign({}, uiPrefs || {});
        var gameState = getLocalGameStateForProfile();
        if (gameState) {
            profilePrefs[PROFILE_GAME_STATE_KEY] = gameState;
        } else {
            delete profilePrefs[PROFILE_GAME_STATE_KEY];
        }
        return profilePrefs;
    }

    function applyRemoteUiPreferences(remotePrefs) {
        remotePrefs = remotePrefs || {};
        var before = getLocalPreferences();
        setLocalPreferences(remotePrefs);
        var after = getLocalPreferences();
        return (
            JSON.stringify(before.darkTheme) !== JSON.stringify(after.darkTheme) ||
            JSON.stringify(before.colorBlindTheme) !== JSON.stringify(after.colorBlindTheme) ||
            JSON.stringify(before.showHelpOnLoad) !== JSON.stringify(after.showHelpOnLoad) ||
            JSON.stringify(before.shareTextAdditions) !== JSON.stringify(after.shareTextAdditions)
        );
    }

    function isCompletedStatus(status) {
        return status === "WIN" || status === "FAIL";
    }

    function getActiveRowLength(state) {
        if (!state || !Array.isArray(state.boardState)) return 0;
        var rowIndex = Number(state.rowIndex);
        if (!Number.isFinite(rowIndex)) return 0;
        if (rowIndex < 0 || rowIndex >= state.boardState.length) return 0;
        var row = state.boardState[rowIndex];
        return typeof row === "string" ? row.length : 0;
    }

    function shouldApplyRemoteGameState(localState, remoteState) {
        if (!localState) return true;

        var today = getTodayDateString();
        if (localState.date !== remoteState.date) {
            if (remoteState.date === today && localState.date !== today) return true;
            return false;
        }

        if (localState.puzzleNum !== remoteState.puzzleNum) {
            var localInProgress = localState.gameStatus === "IN_PROGRESS";
            var remoteInProgress = remoteState.gameStatus === "IN_PROGRESS";
            if (remoteInProgress && localInProgress) {
                return (Number(remoteState.rowIndex) || 0) > (Number(localState.rowIndex) || 0);
            }
            return isCompletedStatus(remoteState.gameStatus) && !isCompletedStatus(localState.gameStatus);
        }

        var localCompleted = isCompletedStatus(localState.gameStatus);
        var remoteCompleted = isCompletedStatus(remoteState.gameStatus);
        if (remoteCompleted && !localCompleted) return true;
        if (localCompleted && !remoteCompleted) return false;

        var localRows = Number(localState.rowIndex) || 0;
        var remoteRows = Number(remoteState.rowIndex) || 0;
        if (remoteRows !== localRows) return remoteRows > localRows;

        var localRowLength = getActiveRowLength(localState);
        var remoteRowLength = getActiveRowLength(remoteState);
        if (remoteRowLength !== localRowLength) return remoteRowLength > localRowLength;

        var localUpdatedAt = toMs(localState.updatedAt);
        var remoteUpdatedAt = toMs(remoteState.updatedAt);
        return remoteUpdatedAt > localUpdatedAt;
    }

    function applyRemoteGameState(remoteState) {
        var normalizedRemote = normalizeGameStateForSync(remoteState);
        if (!normalizedRemote) return false;
        if (normalizedRemote.date !== getTodayDateString()) return false;

        var localState = normalizeGameStateForSync(getLocalGameState());
        if (!shouldApplyRemoteGameState(localState, normalizedRemote)) return false;

        setLocalGameState({
            boardState: normalizedRemote.boardState,
            evaluations: normalizedRemote.evaluations,
            rowIndex: normalizedRemote.rowIndex,
            solution: normalizedRemote.solution,
            gameStatus: normalizedRemote.gameStatus,
            lastPlayedTs: normalizedRemote.lastPlayedTs || null,
            lastCompletedTs: normalizedRemote.lastCompletedTs || null,
            restoringFromLocalStorage: null,
            hardMode: normalizedRemote.hardMode === true,
            puzzleNum: normalizedRemote.puzzleNum,
            date: normalizedRemote.date,
            updatedAt: normalizedRemote.updatedAt || Date.now()
        });
        return true;
    }

    function setLocalPreferences(prefs) {
        prefs = prefs || {};
        if (prefs.darkTheme !== undefined) {
            window.localStorage.setItem(DARK_THEME_KEY, JSON.stringify(prefs.darkTheme));
        }
        if (prefs.colorBlindTheme !== undefined) {
            window.localStorage.setItem(COLOR_BLIND_THEME_KEY, JSON.stringify(prefs.colorBlindTheme));
        }
        if (prefs.showHelpOnLoad !== undefined) {
            window.localStorage.setItem(SHOW_HELP_ON_LOAD_KEY, JSON.stringify(prefs.showHelpOnLoad));
        }
        if (prefs.shareTextAdditions !== undefined) {
            window.localStorage.setItem(SHARE_TEXT_ADDITIONS_KEY, JSON.stringify(prefs.shareTextAdditions || { header: "", afterGrid: "" }));
        }
    }

    function getLocalLegacyStats() {
        return safeParseJSON(window.localStorage.getItem(LEGACY_STATS_KEY), {}) || {};
    }

    function setLocalLegacyStats(stats) {
        window.localStorage.setItem(LEGACY_STATS_KEY, JSON.stringify(stats || {}));
    }

    function hasNonEmptyObject(value) {
        return !!value && typeof value === "object" && Object.keys(value).length > 0;
    }

    function requestStatsRefresh() {
        window.wordleSyncNeedsStatsRefresh = true;
        if (window.wordleStats && typeof window.wordleStats.recompute === "function") {
            window.wordleStats.recompute();
            window.wordleSyncNeedsStatsRefresh = false;
        }
    }

    function ensurePreMergeBackup(syncMeta) {
        if (syncMeta.premerge_complete) return syncMeta;
        var stats = window.localStorage.getItem("statistics");
        var history = window.localStorage.getItem(HISTORY_KEY);
        var legacy = window.localStorage.getItem(LEGACY_STATS_KEY);

        if (stats !== null && window.localStorage.getItem(PRE_MERGE_STATS_KEY) === null) {
            window.localStorage.setItem(PRE_MERGE_STATS_KEY, stats);
        }
        if (history !== null && window.localStorage.getItem(PRE_MERGE_HISTORY_KEY) === null) {
            window.localStorage.setItem(PRE_MERGE_HISTORY_KEY, history);
        }
        if (legacy !== null && window.localStorage.getItem(PRE_MERGE_LEGACY_KEY) === null) {
            window.localStorage.setItem(PRE_MERGE_LEGACY_KEY, legacy);
        }

        syncMeta.premerge_complete = true;
        setSyncMeta(syncMeta);
        return syncMeta;
    }

    function rowToHistoryEntry(row) {
        return {
            puzzle_num: row.puzzle_num,
            date: row.date,
            result: row.result,
            answer: row.answer || null,
            mode: row.mode || null,
            starter: row.starter || null,
            completed_at: toMs(row.completed_at),
            updated_at: toMs(row.updated_at),
            device_id: row.device_id || null
        };
    }

    function historyEntryToRow(entry, userId) {
        var updatedAt = toMs(entry.updated_at) || Date.now();
        var completedAt = toMs(entry.completed_at) || updatedAt;
        return {
            user_id: userId,
            puzzle_num: entry.puzzle_num,
            date: entry.date,
            result: entry.result,
            answer: entry.answer || null,
            mode: entry.mode || null,
            starter: entry.starter || null,
            completed_at: toIso(completedAt),
            updated_at: toIso(updatedAt),
            device_id: entry.device_id || null
        };
    }

    function fillMissingHistoryMetadata(baseEntry, otherEntry) {
        var entry = Object.assign({}, baseEntry || {});
        var updated = false;
        if (!entry.answer && otherEntry && otherEntry.answer) {
            entry.answer = otherEntry.answer;
            updated = true;
        }
        if (!entry.mode && otherEntry && otherEntry.mode) {
            entry.mode = otherEntry.mode;
            updated = true;
        }
        if (!entry.starter && otherEntry && otherEntry.starter) {
            entry.starter = otherEntry.starter;
            updated = true;
        }
        if (updated) {
            entry.updated_at = Date.now();
        }
        return { entry: entry, updated: updated };
    }

    function mergeRemoteHistory(localHistory, remoteRows) {
        var history = Object.assign({}, localHistory);
        var changed = false;

        remoteRows.forEach(function(row) {
            var remoteEntry = rowToHistoryEntry(row);
            var key = String(remoteEntry.puzzle_num);
            var existing = history[key];
            if (!existing) {
                history[key] = remoteEntry;
                changed = true;
                return;
            }

            var localCompleted = toMs(existing.completed_at);
            var remoteCompleted = toMs(remoteEntry.completed_at);

            if (remoteCompleted && (!localCompleted || remoteCompleted < localCompleted)) {
                var mergedFromLocal = fillMissingHistoryMetadata(remoteEntry, existing);
                history[key] = mergedFromLocal.entry;
                changed = true;
                return;
            }

            if (localCompleted && (!remoteCompleted || localCompleted <= remoteCompleted)) {
                var mergedFromRemote = fillMissingHistoryMetadata(existing, remoteEntry);
                if (mergedFromRemote.updated) {
                    history[key] = mergedFromRemote.entry;
                    changed = true;
                }
            }
        });

        return { history: history, changed: changed };
    }

    async function getSession() {
        var result = await client.auth.getSession();
        return result && result.data ? result.data.session : null;
    }

    async function fetchProfile(userId) {
        var result = await client.from(PROFILES_TABLE).select("*").eq("user_id", userId).maybeSingle();
        if (result.error) {
            console.error("Sync: profile fetch error", result.error);
            return null;
        }
        return result.data;
    }

    async function upsertProfile(userId, prefs, legacy, prefsUpdatedAt, legacyUpdatedAt) {
        var row = {
            user_id: userId,
            preferences: prefs || {},
            legacy_stats: legacy || {},
            preferences_updated_at: prefsUpdatedAt ? toIso(prefsUpdatedAt) : null,
            legacy_updated_at: legacyUpdatedAt ? toIso(legacyUpdatedAt) : null
        };
        var result = await client.from(PROFILES_TABLE).upsert(row, { onConflict: "user_id" });
        if (result.error) {
            console.error("Sync: profile upsert error", result.error);
            return false;
        }
        return true;
    }

    async function fetchHistorySince(userId, sinceTs) {
        var query = client.from(GAMES_TABLE).select("*").eq("user_id", userId);
        if (sinceTs > 0) {
            query = query.gt("updated_at", toIso(sinceTs));
        }
        var result = await query;
        if (result.error) {
            console.error("Sync: history fetch error", result.error);
            return null;
        }
        return result.data || [];
    }

    async function fetchHistoryByPuzzleNums(userId, puzzleNums) {
        if (!puzzleNums.length) return [];
        var parsed = puzzleNums.map(function(v) { return parseInt(v, 10); })
            .filter(function(v) { return Number.isFinite(v); });
        if (!parsed.length) return [];

        var result = await client.from(GAMES_TABLE)
            .select("*")
            .eq("user_id", userId)
            .in("puzzle_num", parsed);

        if (result.error) {
            console.error("Sync: history fetch (dirty) error", result.error);
            return null;
        }
        return result.data || [];
    }

    async function upsertHistoryRows(userId, entries) {
        if (!entries.length) return true;
        var rows = entries.map(function(entry) {
            return historyEntryToRow(entry, userId);
        });

        var result = await client.from(GAMES_TABLE).upsert(rows, { onConflict: "user_id,puzzle_num" });
        if (result.error) {
            console.error("Sync: history upsert error", result.error);
            return false;
        }
        return true;
    }

    async function performSync(options) {
        options = options || {};
        var mode = options.mode || "full";

        var session = await getSession();
        if (!session) return;
        var userId = session.user.id;

        var syncMeta = getSyncMeta();
        syncMeta = ensurePreMergeBackup(syncMeta);

        var localHistory = getLocalHistory();
        var localPrefs = getLocalPreferences();
        var localProfilePrefs = buildProfilePreferences(localPrefs);
        var localLegacy = getLocalLegacyStats();

        var prefsUpdatedAt = syncMeta.preferences_updated_at || 0;
        var legacyUpdatedAt = syncMeta.legacy_updated_at || 0;

        // First sync bootstrap: reconcile all known local history rows.
        if ((syncMeta.history_last_pulled_at || 0) === 0 && (!syncMeta.history_dirty || syncMeta.history_dirty.length === 0)) {
            var localPuzzleNums = Object.keys(localHistory);
            if (localPuzzleNums.length) {
                syncMeta.history_dirty = localPuzzleNums;
            }
        }

        var remoteProfile = await fetchProfile(userId);
        var profileNeedsPush = false;
        var legacyChanged = false;
        var prefsChanged = false;
        var gameStateChanged = false;

        if (remoteProfile) {
            var remotePrefsUpdatedAt = toMs(remoteProfile.preferences_updated_at);
            var remoteLegacyUpdatedAt = toMs(remoteProfile.legacy_updated_at);
            var remoteProfilePrefs = remoteProfile.preferences || {};

            // Always reconcile remote game-state snapshot for today's puzzle.
            // This is merged independently from preference timestamp comparisons.
            gameStateChanged = applyRemoteGameState(remoteProfilePrefs[PROFILE_GAME_STATE_KEY]) || gameStateChanged;

            if (remotePrefsUpdatedAt > prefsUpdatedAt) {
                localPrefs = {
                    darkTheme: remoteProfilePrefs.darkTheme,
                    colorBlindTheme: remoteProfilePrefs.colorBlindTheme,
                    showHelpOnLoad: remoteProfilePrefs.showHelpOnLoad,
                    shareTextAdditions: remoteProfilePrefs.shareTextAdditions
                };
                prefsChanged = applyRemoteUiPreferences(localPrefs);
                gameStateChanged = applyRemoteGameState(remoteProfilePrefs[PROFILE_GAME_STATE_KEY]) || gameStateChanged;
                localProfilePrefs = buildProfilePreferences(getLocalPreferences());
                prefsUpdatedAt = remotePrefsUpdatedAt;
            } else if (prefsUpdatedAt > remotePrefsUpdatedAt) {
                profileNeedsPush = true;
            }

            if (remoteLegacyUpdatedAt > legacyUpdatedAt) {
                localLegacy = remoteProfile.legacy_stats || {};
                setLocalLegacyStats(localLegacy);
                legacyUpdatedAt = remoteLegacyUpdatedAt;
                legacyChanged = true;
            } else if (legacyUpdatedAt > remoteLegacyUpdatedAt) {
                profileNeedsPush = true;
            }
        } else {
            profileNeedsPush = true;
            if (!prefsUpdatedAt) prefsUpdatedAt = Date.now();
            if (!legacyUpdatedAt && hasNonEmptyObject(localLegacy)) legacyUpdatedAt = Date.now();
        }

        if (profileNeedsPush) {
            localProfilePrefs = buildProfilePreferences(getLocalPreferences());
            await upsertProfile(userId, localProfilePrefs, localLegacy, prefsUpdatedAt, legacyUpdatedAt);
        }

        if ((prefsChanged || gameStateChanged) && window.location && typeof window.location.reload === "function") {
            // Persist fresh timestamps before reload so first-time profile pulls do not loop reload forever.
            updateSyncMeta({
                history_dirty: syncMeta.history_dirty,
                history_last_pulled_at: syncMeta.history_last_pulled_at,
                preferences_updated_at: prefsUpdatedAt,
                legacy_updated_at: legacyUpdatedAt,
                premerge_complete: syncMeta.premerge_complete
            });
            window.location.reload();
            return;
        }

        if (legacyChanged) {
            requestStatsRefresh();
        }

        if (mode === "full") {
            var lastPulledAt = syncMeta.history_last_pulled_at || 0;
            var remoteUpdates = await fetchHistorySince(userId, lastPulledAt);
            if (remoteUpdates !== null) {
                var mergeResult = mergeRemoteHistory(localHistory, remoteUpdates);
                if (mergeResult.changed) {
                    localHistory = mergeResult.history;
                    setLocalHistory(localHistory);
                    requestStatsRefresh();
                }
                syncMeta.history_last_pulled_at = Date.now();
            }
        }

        var dirty = syncMeta.history_dirty || [];
        if (dirty.length) {
            var remoteForDirty = await fetchHistoryByPuzzleNums(userId, dirty);
            if (remoteForDirty !== null) {
                var remoteMap = {};
                remoteForDirty.forEach(function(row) {
                    remoteMap[String(row.puzzle_num)] = row;
                });

                var toUpsert = [];
                var remainingDirty = [];
                var localChanged = false;

                dirty.forEach(function(puzzleNum) {
                    var key = String(puzzleNum);
                    var localEntry = localHistory[key];
                    if (!localEntry) return;
                    var remoteRow = remoteMap[key];

                    if (!remoteRow) {
                        toUpsert.push(localEntry);
                        remainingDirty.push(key);
                        return;
                    }

                    var remoteEntry = rowToHistoryEntry(remoteRow);
                    var localCompleted = toMs(localEntry.completed_at);
                    var remoteCompleted = toMs(remoteEntry.completed_at);

                    if (localCompleted && (!remoteCompleted || localCompleted < remoteCompleted)) {
                        toUpsert.push(localEntry);
                        remainingDirty.push(key);
                        return;
                    }

                    if (remoteCompleted && (!localCompleted || remoteCompleted < localCompleted)) {
                        var mergedRemoteFirst = fillMissingHistoryMetadata(remoteEntry, localEntry);
                        localHistory[key] = mergedRemoteFirst.entry;
                        localChanged = true;
                        if (mergedRemoteFirst.updated) {
                            toUpsert.push(mergedRemoteFirst.entry);
                            remainingDirty.push(key);
                        }
                        return;
                    }

                    var mergedEqual = fillMissingHistoryMetadata(localEntry, remoteEntry);
                    if (mergedEqual.updated) {
                        localHistory[key] = mergedEqual.entry;
                        localChanged = true;
                    }
                });

                if (localChanged) {
                    setLocalHistory(localHistory);
                    requestStatsRefresh();
                }

                if (toUpsert.length) {
                    var ok = await upsertHistoryRows(userId, toUpsert);
                    syncMeta.history_dirty = ok ? [] : remainingDirty;
                } else {
                    syncMeta.history_dirty = [];
                }
            }
        }

        updateSyncMeta({
            history_dirty: syncMeta.history_dirty,
            history_last_pulled_at: syncMeta.history_last_pulled_at,
            preferences_updated_at: prefsUpdatedAt,
            legacy_updated_at: legacyUpdatedAt,
            premerge_complete: syncMeta.premerge_complete
        });
    }

    function pushToRemote() {
        if (pushTimer) clearTimeout(pushTimer);
        pushTimer = setTimeout(function() {
            performSync({ mode: "push" });
        }, DEBOUNCE_MS);
    }

    function onDataChanged(changeType, payload) {
        var syncMeta = getSyncMeta();

        if (changeType === "history") {
            var puzzleNum = payload && payload.puzzleNum !== undefined ? String(payload.puzzleNum) : null;
            if (puzzleNum && !syncMeta.history_dirty.includes(puzzleNum)) {
                syncMeta.history_dirty.push(puzzleNum);
            }
        }

        if (changeType === "legacy") {
            syncMeta.legacy_updated_at = Date.now();
        }

        if (changeType === "preference") {
            syncMeta.preferences_updated_at = Date.now();
        }

        if (changeType === "game_state") {
            syncMeta.preferences_updated_at = Date.now();
        }

        setSyncMeta(syncMeta);
        pushToRemote();
    }

    function normalizeRedirectPath(path) {
        var redirectPath = (typeof path === "string" && path.trim()) ? path.trim() : "/sync-resolve";
        return redirectPath.charAt(0) === "/" ? redirectPath : "/" + redirectPath;
    }

    function getMagicLinkRedirectPath() {
        return normalizeRedirectPath(window.SUPABASE_MAGIC_LINK_REDIRECT_PATH || "/sync-resolve");
    }

    function getMagicLinkRedirectUrl(redirectPath) {
        if (!window.location || !window.location.origin) return null;
        return window.location.origin + normalizeRedirectPath(redirectPath);
    }

    async function signInWithMagicLink(email) {
        var normalizedEmail = String(email || "").trim().toLowerCase();
        if (!normalizedEmail) {
            return { error: { message: "Email is required" } };
        }

        var redirectPath = getMagicLinkRedirectPath();
        if (window.SUPABASE_MAGIC_LINK_USE_EDGE_FUNCTION === true) {
            var fnName = window.SUPABASE_MAGIC_LINK_FUNCTION_NAME || "send-magic-link";
            var invokeResult = await client.functions.invoke(fnName, {
                body: { email: normalizedEmail, redirectPath: redirectPath }
            });
            if (invokeResult.error) {
                return { error: { message: invokeResult.error.message || "Failed to send magic link" } };
            }
            if (invokeResult.data && invokeResult.data.error) {
                return { error: { message: invokeResult.data.error } };
            }
            return { error: null };
        }

        var redirectUrl = getMagicLinkRedirectUrl(redirectPath);
        var payload = { email: normalizedEmail };
        if (redirectUrl) {
            payload.options = { emailRedirectTo: redirectUrl };
        }

        var result = await client.auth.signInWithOtp(payload);
        if (result.error) {
            return { error: { message: result.error.message || "Failed to send magic link" } };
        }
        return { error: null };
    }

    async function signOut() {
        await client.auth.signOut();
    }

    async function getUserEmail() {
        var session = await getSession();
        return session && session.user ? session.user.email : null;
    }

    client.auth.onAuthStateChange(function(event, session) {
        if (event === "SIGNED_IN" && session) {
            performSync({ mode: "full" });
        }
    });

    async function init() {
        var session = await getSession();
        if (session) {
            await performSync({ mode: "full" });
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.wordleSync = {
        enabled: true,
        onDataChanged: onDataChanged,
        performSync: performSync,
        signInWithMagicLink: signInWithMagicLink,
        signOut: signOut,
        isSignedIn: function() {
            return getSession().then(function(session) { return !!session; });
        },
        getUserEmail: getUserEmail
    };
})();
