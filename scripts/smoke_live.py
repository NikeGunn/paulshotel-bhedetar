import sys
from playwright.sync_api import sync_playwright

BASE = "https://paulshotel-bhedetar.vercel.app"
ROUTES = ["/", "/rooms", "/dining", "/gallery", "/experiences", "/blog", "/contact",
          "/sitemap.xml", "/robots.txt", "/admin/login"]

fails = []
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={"width": 1280, "height": 900})
    for route in ROUTES:
        page = ctx.new_page()
        errs = []
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        try:
            resp = page.goto(BASE + route, wait_until="domcontentloaded", timeout=45000)
            code = resp.status if resp else 0
            page.wait_for_timeout(1500)
            ok = code == 200
            ce = [e for e in errs if "favicon" not in e.lower() and "400" not in e]
            status = "OK" if ok and not ce else "FAIL"
            if status == "FAIL":
                fails.append((route, code, ce[:2]))
            print(f"[{status}] {route}  http={code}  console_errs={len(ce)}")
        except Exception as e:
            fails.append((route, "EXC", str(e)[:120]))
            print(f"[FAIL] {route}  {e}")
        page.close()
    b.close()

print("\n=== RESULT:", "ALL PASS" if not fails else f"{len(fails)} FAILURES ===")
for f in fails:
    print("  ", f)
sys.exit(1 if fails else 0)
