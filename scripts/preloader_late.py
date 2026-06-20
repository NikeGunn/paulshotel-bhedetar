from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent.parent / ".shots"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 800})
    page = ctx.new_page()
    # load fully so JS executes, but screenshot fast after to catch loader
    page.goto("http://localhost:3000/", wait_until="load", timeout=60000)
    page.wait_for_timeout(900)
    page.screenshot(path=str(OUT / "pre-late.png"))
    # also check: is the counter > 0 and canvas present?
    info = page.evaluate("""() => {
      const c = document.querySelector('canvas');
      const nums = [...document.querySelectorAll('span')].map(s=>s.textContent).filter(t=>/^\\d+$/.test(t||''));
      return { hasCanvas: !!c, canvasOpacity: c ? getComputedStyle(c).opacity : null, nums };
    }""")
    print("info:", info)
    b.close()
