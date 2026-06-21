"""Measure scroll jank down vs up + confirm globe lazy-mounts and freezes
during scroll. Uses real mouse wheel so the app's scroll listeners fire."""
import sys, time
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
ARM = r"""() => { if(window.__j)return; window.__j={lt:[]};
  try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__j.lt.push(Math.round(e.duration));}).observe({entryTypes:['longtask']});}catch(e){}
}"""

def wheel(page, dy, steps=20, pause=0.05):
    for _ in range(steps):
        page.mouse.wheel(0, dy)
        time.sleep(pause)

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1366,"height":768})
    pg.goto(BASE); pg.evaluate("()=>sessionStorage.setItem('psh-loaded','1')")
    pg.goto(BASE, wait_until="load"); time.sleep(1)
    pg.evaluate(ARM)
    pg.mouse.move(683, 384)

    # ---- scroll DOWN to bottom ----
    start = len(pg.evaluate("()=>window.__j?window.__j.lt:[]"))
    wheel(pg, 600, steps=30)
    time.sleep(1)
    down_lt = pg.evaluate("()=>window.__j.lt.slice()")[start:]
    canvas = pg.evaluate("()=>document.querySelectorAll('canvas').length")
    cobe = pg.evaluate("()=>performance.getEntriesByType('resource').some(e=>/cobe/i.test(e.name))")

    # ---- scroll UP to top ----
    mark = len(pg.evaluate("()=>window.__j.lt"))
    wheel(pg, -600, steps=30)
    time.sleep(1)
    up_lt = pg.evaluate("()=>window.__j.lt.slice()")[mark:]

    print("URL:", BASE)
    print("globe mounted (canvas):", canvas, "| cobe chunk loaded:", cobe)
    print("DOWN-scroll long tasks (ms):", down_lt, "=> total", sum(down_lt), "max", max(down_lt or [0]))
    print("UP-scroll   long tasks (ms):", up_lt, "=> total", sum(up_lt), "max", max(up_lt or [0]))
    b.close()
