---
name: changelog
description: Update CHANGELOG.md in the project root from git history. Use before merging a feature branch, or when asked to update the changelog.
---

# Changelog skill

Keep `CHANGELOG.md` (project root) up to date, grouped by date.

## Format

```markdown
# Changelog

## YYYY-MM-DD

- Short, user-facing description of a change.
- Another change.
```

- Newest date first.
- One `## YYYY-MM-DD` heading per day that has commits.
- Bullets are short and written for a reader, not copied commit hashes.
- Merge commits are skipped; their content is already covered by the branch commits.

## Steps

1. If `CHANGELOG.md` does not exist, create it with the `# Changelog` title.
2. Find the newest date already in the changelog (if any).
3. List commits since then, with dates:
   `git log --no-merges --date=short --format="%ad %s"`
4. Group the commits by date and turn each into a clear bullet.
   Combine commits that describe the same change.
5. Add new date sections at the top, below the title. Do not rewrite older sections.
6. Show the diff of `CHANGELOG.md` to the user before committing.
