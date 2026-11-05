import json
import subprocess
import urllib.request

HOST = "tool.waterfish.ren"
KEY = "f491f480bf6b43cdbe9dd6b5435b5f1f"
BASE = f"https://{HOST}"
KEY_LOCATION = f"{BASE}/{KEY}.txt"
ENDPOINT = "https://www.bing.com/indexnow"

ALL_URLS = [
    f"{BASE}/",
    f"{BASE}/Image/ImageConvert",
    f"{BASE}/Image/ImageCompress",
    f"{BASE}/Image/ImageResize",
    f"{BASE}/Image/ImageBase64",
    f"{BASE}/JSON/JSONFormat",
    f"{BASE}/Dev/TimeConvert",
    f"{BASE}/Dev/ColorConvert",
    f"{BASE}/Dev/PasswordGenerator",
    f"{BASE}/Dev/UrlCodec",
]


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
        urls = ALL_URLS
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
