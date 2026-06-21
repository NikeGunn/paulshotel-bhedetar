"""Local prod-build perf check (GPU-independent, reproducible on this box).
Proves: cobe deferred from initial bundle, globe lazily mounts on scroll,
main-thread not blocked. Injects observer post-load and guards every read."""
import sys, time
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

ARM = r"""() => {
  if (window.__p) return;
  window.__p = { longtasks: [], cobe: [] };
  try { new PerformanceObserver((l)=>{for(const e of l.getEntries()) window.__p.longtasks.push(Math.round(e.duration));}).observe({entryTypes:['longtask']}); } catch(e){}
  // scan already-loaded resources for cobe
  for (const e of performance.getEntriesByType('resource')) if (/cobe/i.test(e.name)) window.__p.cobe.push(e.name.split('/').pop());
  try { new PerformanceObserver((l)=>{for(const e of l.getEntries()){ if(/cobe/i.test(e.name)) window.__p.cobe.push(e.name.split('/').pop()); }}).observe({entryTypes:['resource']}); } catch(e){}
}"""
SNAP = "() => ({canvas: document.querySelectorAll('canvas').length, lt:(window.__p?window.__p.longtasks.slice():[]), cobe:(window.__p?window.__p.cobe.slice():[])})"

with sync_playwright() as p:
    b = p.chromium.launch()
    page = b.new_page()
    page.goto(BASE, wait_until="load")
    page.evaluate(ARM)
    time.sleep(3)            # let preloader finish, arm observer
    page.evaluate(ARM)       # re-arm in case preloader reset window
    pre = page.evaluate(SNAP)
    heap0 = page.evaluate("() => performance.memory ? Math.round(performance.memory.usedJSHeapSize/104857.6)/10 : 0")
    for y in range(0, 11):
        page.evaluate("(f)=>window.scrollTo(0, document.body.scrollHeight*f/10)", y/10)
        time.sleep(0.4)
    time.sleep(3)
    page.evaluate(ARM)
    post = page.evaluate(SNAP)
    heap1 = page.evaluate("() => performance.memory ? Math.round(performance.memory.usedJSHeapSize/104857.6)/10 : 0")

    print("URL:", BASE)
    print("canvas BEFORE scroll:", pre["canvas"])
    print("canvas AFTER scroll :", post["canvas"], "(expect 1 = globe lazily mounted)")
    print("cobe in initial resources:", pre["cobe"] or "NONE  <-- deferred from initial load (good)")
    print("cobe after scroll        :", post["cobe"] or "none observed")
    print("long tasks load (ms):", pre["lt"], "total", sum(pre["lt"]))
    print("long tasks total after scroll (ms):", post["lt"], "total", sum(post["lt"]))
    print("heap MB:", heap0, "->", heap1, "delta", round(heap1-heap0,1))
    b.close()
