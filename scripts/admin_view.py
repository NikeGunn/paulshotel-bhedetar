from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent.parent / ".shots"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    page = ctx.new_page()
    page.goto("http://localhost:3000/admin/login", wait_until="networkidle", timeout=60000)
    page.fill('input[name="email"]', "paulshotelbhedetar@gmail.com")
    page.fill('input[name="password"]', "PaulsHotel@9c010633")
    page.click('button[type="submit"]')
    page.wait_for_url("**/admin", timeout=30000)
    page.wait_for_timeout(1200)
    page.screenshot(path=str(OUT / "admin-dashboard.png"), full_page=True)
    page.goto("http://localhost:3000/admin/leads", wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.screenshot(path=str(OUT / "admin-leads.png"), full_page=True)
    page.goto("http://localhost:3000/admin/gallery", wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.screenshot(path=str(OUT / "admin-gallery.png"), full_page=True)
    print("admin views captured")
    b.close()
