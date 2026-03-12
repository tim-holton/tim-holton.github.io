#!/usr/bin/env python3

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent
SITES_DIR = REPO_ROOT / "sites"
STATE_FILE = REPO_ROOT / ".site-deploy.json"


def load_manifest(slug: str) -> tuple[Path, dict]:
    site_dir = SITES_DIR / slug
    manifest_path = site_dir / "site.json"
    if not manifest_path.exists():
        raise SystemExit(f"Unknown site '{slug}'. Run 'python3 manage_site.py list'.")

    with manifest_path.open() as handle:
        manifest = json.load(handle)

    public_dir = site_dir / "public"
    if not public_dir.exists():
        raise SystemExit(f"Site '{slug}' is missing a public/ directory.")

    return public_dir, manifest


def iter_public_paths(public_dir: Path) -> list[str]:
    paths: list[str] = []
    for path in sorted(public_dir.rglob("*")):
        if path.is_file():
            paths.append(path.relative_to(public_dir).as_posix())
    return paths


def remove_previously_managed() -> None:
    if not STATE_FILE.exists():
        return

    with STATE_FILE.open() as handle:
        state = json.load(handle)

    for relative_path in sorted(state.get("managed_paths", []), key=len, reverse=True):
        target = REPO_ROOT / relative_path
        if not target.exists():
            continue
        if target.is_dir():
            shutil.rmtree(target)
        else:
            target.unlink()


def copy_tree(public_dir: Path) -> list[str]:
    managed_paths = iter_public_paths(public_dir)
    for relative_path in managed_paths:
        source = public_dir / relative_path
        destination = REPO_ROOT / relative_path
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, destination)
    return managed_paths


def write_state(slug: str, manifest: dict, managed_paths: list[str]) -> None:
    payload = {
        "active_site": slug,
        "name": manifest.get("name", slug),
        "managed_paths": managed_paths,
    }
    STATE_FILE.write_text(json.dumps(payload, indent=2) + "\n")


def deploy(slug: str) -> None:
    public_dir, manifest = load_manifest(slug)
    remove_previously_managed()
    managed_paths = copy_tree(public_dir)
    write_state(slug, manifest, managed_paths)
    print(f"Deployed '{slug}' into the repo root.")


def list_sites() -> None:
    for manifest_path in sorted(SITES_DIR.glob("*/site.json")):
        slug = manifest_path.parent.name
        with manifest_path.open() as handle:
            manifest = json.load(handle)
        tags = ", ".join(manifest.get("tags", []))
        print(f"{slug}: {manifest.get('name', slug)}")
        if manifest.get("description"):
            print(f"  {manifest['description']}")
        if tags:
            print(f"  tags: {tags}")


def run_git(*args: str) -> None:
    subprocess.run(["git", *args], cwd=REPO_ROOT, check=True)


def ship(slug: str, message: str | None) -> None:
    deploy(slug)
    run_git("add", "-A")

    status = subprocess.run(
        ["git", "status", "--short"],
        cwd=REPO_ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    if not status.stdout.strip():
        print("No changes to commit.")
        return

    run_git("commit", "-m", message or f"Deploy {slug}")
    run_git("push", "origin", "main")
    print(f"Shipped '{slug}' to origin/main.")


def current_site() -> None:
    if not STATE_FILE.exists():
        raise SystemExit("No deployed site metadata found yet.")
    with STATE_FILE.open() as handle:
        state = json.load(handle)
    print(f"{state['active_site']}: {state.get('name', state['active_site'])}")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Manage reusable static site objects for GitHub Pages."
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    subparsers.add_parser("list", help="List all saved site objects.")
    subparsers.add_parser("current", help="Show the active site in the repo root.")

    deploy_parser = subparsers.add_parser(
        "deploy", help="Copy a site object into the repo root."
    )
    deploy_parser.add_argument("slug")

    ship_parser = subparsers.add_parser(
        "ship",
        help="Deploy a site object, commit it, and push it to origin/main.",
    )
    ship_parser.add_argument("slug")
    ship_parser.add_argument(
        "-m",
        "--message",
        help="Commit message to use. Defaults to 'Deploy <slug>'.",
    )

    args = parser.parse_args()

    if args.command == "list":
        list_sites()
    elif args.command == "current":
        current_site()
    elif args.command == "deploy":
        deploy(args.slug)
    elif args.command == "ship":
        ship(args.slug, args.message)
    else:
        raise SystemExit(f"Unsupported command: {args.command}")


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as error:
        print(error, file=sys.stderr)
        raise SystemExit(error.returncode) from error
