import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

EMAIL = os.environ.get("SMOKE_ADMIN_EMAIL")
PASSWORD = os.environ.get("SMOKE_ADMIN_PASSWORD")
if not EMAIL or not PASSWORD:
    sys.exit("Set SMOKE_ADMIN_EMAIL and SMOKE_ADMIN_PASSWORD env vars to run this test.")

OUT = Path(__file__).parent.parent / ".shots"
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    page = ctx.new_page()
    page.goto("http://localhost:3000/admin/login", wait_until="networkidle", timeout=60000)
    page.fill('input[name="email"]', EMAIL)
    page.fill('input[name="password"]', PASSWORD)
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
