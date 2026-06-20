from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent.parent / ".shots"
EMAIL = "paulshotelbhedetar@gmail.com"
PASSWORD = "PaulsHotel@9c010633"

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    page = ctx.new_page()
    errs = []
    page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)

    # 1. Login
    page.goto("http://localhost:3000/admin/login", wait_until="networkidle", timeout=60000)
    page.fill('input[name="email"]', EMAIL)
    page.fill('input[name="password"]', PASSWORD)
    page.click('button[type="submit"]')
    page.wait_for_url("**/admin", timeout=30000)
    page.wait_for_timeout(1500)
    page.screenshot(path=str(OUT / "admin-dashboard.png"), full_page=True)
    print("login OK -> dashboard")

    # 2. New post
    page.goto("http://localhost:3000/admin/blog/new", wait_until="networkidle")
    page.wait_for_timeout(1000)
    page.fill('input[name="title"]', "Sunrise over Bhedetar: the morning that hooks you")
    # type into the tiptap editor
    editor = page.locator(".prose-hotel").first
    editor.click()
    editor.type("Bhedetar mornings are unreal. The mist lifts off the valley and the whole horizon turns gold. This is why guests keep coming back to Paul's Hotel.")
    page.fill('textarea[name="excerpt"]', "Why a Bhedetar sunrise is worth setting an early alarm for.")
    page.select_option('select[name="status"]', "published")
    page.screenshot(path=str(OUT / "admin-editor.png"), full_page=True)
    page.click('button:has-text("Save post")')
    page.wait_for_url("**/admin/blog", timeout=30000)
    page.wait_for_timeout(1500)
    page.screenshot(path=str(OUT / "admin-bloglist.png"), full_page=True)
    print("post created + published")

    # 3. Verify on public blog
    page.goto("http://localhost:3000/blog", wait_until="networkidle")
    page.wait_for_timeout(1500)
    page.screenshot(path=str(OUT / "public-blog.png"), full_page=True)
    has = page.get_by_text("Sunrise over Bhedetar", exact=False).count()
    print("public /blog shows post:", has > 0)

    print("console errors:", len(errs))
    for e in errs[:6]:
        print("  ", e)
    b.close()
