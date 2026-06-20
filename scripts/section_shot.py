import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent.parent / ".shots"
text = sys.argv[1] if len(sys.argv) > 1 else "Food worth"
name = sys.argv[2] if len(sys.argv) > 2 else "section"

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.goto("http://localhost:3000/", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(3800)
    page.get_by_text(text, exact=False).first.scroll_into_view_if_needed()
    page.wait_for_timeout(1200)
    page.screenshot(path=str(OUT / f"{name}.png"))
    print(f"{name} captured")
    b.close()
