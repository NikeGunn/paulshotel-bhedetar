from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent.parent / ".shots"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1200, "height": 900})
    page = ctx.new_page()
    page.goto("http://localhost:3000/", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(3800)  # preloader done
    canvas = page.locator("canvas").first
    canvas.scroll_into_view_if_needed()
    page.wait_for_timeout(1800)
    # clip a region around the globe parent
    parent = page.locator("canvas").first
    box = parent.bounding_box()
    if box:
        pad = 90
        clip = {
            "x": max(0, box["x"] - pad),
            "y": max(0, box["y"] - pad),
            "width": box["width"] + pad * 2,
            "height": box["height"] + pad * 2,
        }
        page.screenshot(path=str(OUT / "globe-a.png"), clip=clip)
        page.wait_for_timeout(1400)
        page.screenshot(path=str(OUT / "globe-b.png"), clip=clip)
        print("globe clipped frames captured", box)
    else:
        print("no canvas box")
    b.close()
