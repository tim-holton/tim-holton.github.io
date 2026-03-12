# tim-holton.github.io

Static site switchboard for GitHub Pages.

## Structure

- `sites/<slug>/site.json` stores metadata for a saved site object
- `sites/<slug>/public/` stores deployable files for that site
- the repo root always contains the currently deployed site
- `.site-deploy.json` records which saved site is active

## Commands

```bash
python3 manage_site.py list
python3 manage_site.py current
python3 manage_site.py deploy brutalist-motion
python3 manage_site.py ship holler-arcade
```

`deploy` swaps the root to a saved site object.
`ship` deploys the site, commits it, and pushes it to `origin/main`.

## Saved sites

- `brutalist-motion`
- `holler-arcade`

The current root is `holler-arcade`.
