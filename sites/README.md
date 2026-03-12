# Saved Sites

Each site lives in its own folder under `sites/<slug>/`.

Required files:

- `site.json` for metadata
- `public/` for deployable assets

Use the manager from the repo root:

```bash
python3 manage_site.py list
python3 manage_site.py deploy brutalist-motion
python3 manage_site.py ship holler-arcade
```

`deploy` swaps the repo root to that site.
`ship` deploys, commits, and pushes in one command.
