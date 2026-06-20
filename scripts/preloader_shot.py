from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent.parent / ".shots"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    page.goto("http://localhost:3000/", wait_until="commit")
    for ms, name in [(700, "pre1"), (1500, "pre2"), (2300, "pre3")]:
        page.wait_for_timeout(ms if name == "pre1" else 800)
        page.screenshot(path=str(OUT / f"{name}.png"))
    print("preloader frames captured")
    b.close()
