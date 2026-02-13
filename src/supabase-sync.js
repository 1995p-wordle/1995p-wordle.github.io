(function() {
    "use strict";

    var HISTORY_KEY = "history";
    var LEGACY_STATS_KEY = "legacy_stats";
    var SYNC_META_KEY = "sync_meta";
    var PRE_MERGE_STATS_KEY = "pre_merge_stats";
    var PRE_MERGE_HISTORY_KEY = "pre_merge_history";
    var PRE_MERGE_LEGACY_KEY = "pre_merge_legacy_stats";

    var DARK_THEME_KEY = "darkTheme";
    var COLOR_BLIND_THEME_KEY = "colorBlindTheme";
    var SHOW_HELP_ON_LOAD_KEY = "showHelpOnLoad";
    var SHARE_TEXT_ADDITIONS_KEY = "shareTextAdditions";

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

        if (remoteProfile) {
            var remotePrefsUpdatedAt = toMs(remoteProfile.preferences_updated_at);
            var remoteLegacyUpdatedAt = toMs(remoteProfile.legacy_updated_at);

            if (remotePrefsUpdatedAt > prefsUpdatedAt) {
                localPrefs = remoteProfile.preferences || {};
                setLocalPreferences(localPrefs);
                prefsUpdatedAt = remotePrefsUpdatedAt;
                prefsChanged = true;
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
            await upsertProfile(userId, localPrefs, localLegacy, prefsUpdatedAt, legacyUpdatedAt);
        }

        if (prefsChanged && window.location && typeof window.location.reload === "function") {
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

        setSyncMeta(syncMeta);
        pushToRemote();
    }

    async function signInWithMagicLink(email) {
        var result = await client.auth.signInWithOtp({ email: email });
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
