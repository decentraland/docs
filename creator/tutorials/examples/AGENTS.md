# Example scene catalog

This directory contains the source entries for the Example Scenes catalog.

When adding, removing, or changing an example entry:

1. Keep its YAML front matter valid and complete.
2. Run `node creator/tutorials/examples/generate-catalog.mjs` from the repository root.
3. Commit the generated changes to `catalog.json`, `README.md`, and `creator/SUMMARY.md` with the entry change.

Do not add this file to `creator/SUMMARY.md`. It is contributor guidance, not a catalog entry.
