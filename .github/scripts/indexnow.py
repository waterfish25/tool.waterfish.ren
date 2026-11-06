import json
import subprocess
import urllib.request
from pathlib import Path

HOST = "tool.waterfish.ren"
KEY = "f491f480bf6b43cdbe9dd6b5435b5f1f"
BASE = f"https://{HOST}"
KEY_LOCATION = f"{BASE}/{KEY}.txt"
ENDPOINT = "https://www.bing.com/indexnow"
ROOT = Path(__file__).resolve().parents[2]
SKIP = {
    "node_modules",
    ".git",
    ".github",
    ".vercel",
    ".uploads",
    ".well-known",
    "assets",
    "api",
    "md",
    "scripts",
}


def all_urls():
    pages = []
    for path in ROOT.rglob("*.html"):
        parts = path.relative_to(ROOT).parts
        if parts[0] in SKIP:
            continue
        if len(parts) == 1 and parts[0] == "api-docs.html":
            continue
        clean = "/".join(parts)[:-5]
        pages.append(f"{BASE}/" if clean == "index" else f"{BASE}/{clean}")
    return sorted(pages)


def changed_files():
    result = subprocess.run(
        ["git", "log", "--since=24 hours ago", "--name-only", "--pretty=format:"],
        capture_output=True,
        text=True,
        check=True,
    )
    return {line.strip() for line in result.stdout.splitlines() if line.strip()}


def page_url(path):
    if path == "index.html":
        return f"{BASE}/"
    if path.startswith(("Image/", "JSON/", "Dev/")) and path.endswith(".html"):
        return f"{BASE}/{path[:-5]}"
    return None


def main():
    files = changed_files()
    if not files:
        print("No changes in the last 24 hours")
        return
    if any(path.startswith("assets/") or path == "vercel.json" for path in files):
        urls = all_urls()
    else:
        urls = sorted({url for url in (page_url(path) for path in files) if url})
    if not urls:
        print("No tool pages changed")
        return
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": urls,
    }
    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(payload).encode(),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        print(f"IndexNow submitted {len(urls)} urls, status {response.status}")
        body = response.read().decode()
        if body:
            print(body[:300])


if __name__ == "__main__":
    main()
