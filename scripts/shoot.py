"""Visual dev loop: screenshot given routes at desktop + mobile widths."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = Path(__file__).parent.parent / ".shots"
OUT.mkdir(exist_ok=True)

routes = sys.argv[1:] or ["/"]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    for route in routes:
        name = route.strip("/").replace("/", "_") or "home"
        # desktop
        ctx = browser.new_context(viewport={"width": 1440, "height": 900},
                                  device_scale_factor=1)
        page = ctx.new_page()
        errs = []
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        page.goto(BASE + route, wait_until="networkidle", timeout=60000)
        page.wait_for_timeout(1500)  # let reveals settle
        page.screenshot(path=str(OUT / f"{name}-desktop.png"), full_page=True)
        ctx.close()
        # mobile
        ctx2 = browser.new_context(viewport={"width": 390, "height": 844},
                                   device_scale_factor=2, is_mobile=True)
        page2 = ctx2.new_page()
        page2.goto(BASE + route, wait_until="networkidle", timeout=60000)
        page2.wait_for_timeout(1200)
        page2.screenshot(path=str(OUT / f"{name}-mobile.png"), full_page=True)
        ctx2.close()
        status = "OK" if not errs else f"{len(errs)} console errors"
        print(f"[{route}] shot -> {name}-desktop.png / {name}-mobile.png  ({status})")
        for e in errs[:5]:
            print("   console:", e)
    browser.close()
print("done")
