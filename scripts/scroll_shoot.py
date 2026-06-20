"""Scroll through page in viewport steps so whileInView reveals trigger, shoot each."""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = Path(__file__).parent.parent / ".shots"
OUT.mkdir(exist_ok=True)

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1440, "height": 900})
    page = ctx.new_page()
    page.goto(BASE + "/", wait_until="networkidle", timeout=60000)
    height = page.evaluate("document.body.scrollHeight")
    step = 760
    i = 0
    y = 0
    while y < height:
        page.evaluate(f"window.scrollTo(0, {y})")
        page.wait_for_timeout(1100)  # let reveal animate
        page.screenshot(path=str(OUT / f"scroll-{i:02d}.png"))
        i += 1
        y += step
    b.close()
print(f"captured {i} viewport shots")
