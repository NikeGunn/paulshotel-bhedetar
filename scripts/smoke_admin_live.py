from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "https://paulshotel-bhedetar.vercel.app"
OUT = Path(__file__).parent.parent / ".shots"

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    page = ctx.new_page()
    # live home hero shot (skip preloader)
    page.goto(BASE + "/", wait_until="load", timeout=60000)
    page.wait_for_timeout(4000)
    page.screenshot(path=str(OUT / "live-home.png"))
    # admin login
    page.goto(BASE + "/admin/login", wait_until="networkidle", timeout=60000)
    page.fill('input[name="email"]', "paulshotelbhedetar@gmail.com")
    page.fill('input[name="password"]', "PaulsHotel@9c010633")
    page.click('button[type="submit"]')
    try:
        page.wait_for_url("**/admin", timeout=30000)
        page.wait_for_timeout(1500)
        page.screenshot(path=str(OUT / "live-admin.png"))
        print("LIVE admin login: OK")
    except Exception as e:
        page.screenshot(path=str(OUT / "live-admin-fail.png"))
        print("LIVE admin login FAILED:", e)
    b.close()
