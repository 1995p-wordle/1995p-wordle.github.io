# Sync merge strategy

## Data model
- `history` (localStorage): object keyed by `puzzle_num`.
- `legacy_stats` (localStorage): pre-history aggregate stats snapshot plus `cutoff_date`.
- `statistics` (localStorage): computed display stats.
- `sync_meta` (localStorage): sync watermark + dirty puzzle list.
- `pre_merge_stats` / `pre_merge_history` / `pre_merge_legacy_stats`: one-time local backups before first cloud merge.

## Rule summary
- History identity: `user_id + puzzle_num`.
- Conflict winner: earliest `completed_at` wins.
- Metadata enrichment: if winner row lacks `answer`/`mode`/`starter`, fill from losing row when available.
- Failed games use `result = 7`.

## Double-count prevention
- `legacy_stats.cutoff_date` defines historical boundary.
- During recompute, only history entries with date after `cutoff_date` are counted.
- This avoids counting games already represented by legacy aggregate stats.

## First-sync behavior
- On first sync, save `pre_merge_*` backups.
- Mark all local history puzzle numbers as dirty.
- Pull remote updates and merge locally.
- Push dirty local rows that still win conflict comparison.

## Trigger points
- Push debounce on local change events (`history`, `legacy`, `preference`).
- Full pull on sign-in/startup session.
- Full pull when player enters the first letter of first guess.
