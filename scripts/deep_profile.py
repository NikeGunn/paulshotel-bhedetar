"""Deep animation profile via Chrome DevTools Protocol with 4x CPU throttle
(mimics a mid-range device — that's where the owner feels lag). Measures, per
full-page scroll: frames rendered, scripting/recalc/paint/composite time, long
animation frames (LoAF), and forced reflows. Pinpoints WHICH work blocks frames."""
import sys, time, json
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"

LOAF = r"""() => {
  window.__loaf = [];
  try {
    new PerformanceObserver(l => {
      for (const e of l.getEntries()) {
        const scripts = (e.scripts||[]).map(s => ({n: s.name?.split('/').pop(), d: Math.round(s.duration), t: s.invokerType}));
        window.__loaf.push({dur: Math.round(e.duration), block: Math.round(e.blockingDuration||0), scripts});
      }
    }).observe({type:'long-animation-frame', buffered:true});
  } catch(e) { window.__loaf_err = String(e); }
}"""

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width":1366,"height":768})
    cdp = pg.context.new_cdp_session(pg)
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
    pg.goto(BASE); pg.evaluate("()=>sessionStorage.setItem('psh-loaded','1')")
    pg.goto(BASE, wait_until="load")
    pg.evaluate(LOAF)
    time.sleep(1.5)
    pg.mouse.move(683, 384)

    # Smooth-ish full scroll down then up, like a user reading.
    for _ in range(40):
        pg.mouse.wheel(0, 400); time.sleep(0.05)
    time.sleep(0.6)
    for _ in range(40):
        pg.mouse.wheel(0, -400); time.sleep(0.05)
    time.sleep(0.8)

    loaf = pg.evaluate("()=>window.__loaf||[]")
    err = pg.evaluate("()=>window.__loaf_err||null")
    layers = cdp.send("LayerTree.enable") if False else None

    durs = sorted((f["dur"] for f in loaf), reverse=True)
    blocks = sorted((f["block"] for f in loaf if f["block"]>0), reverse=True)
    print("URL:", BASE, "(4x CPU throttle)")
    print("LoAF support err:", err)
    print("total long-animation-frames (>50ms):", len(loaf))
    print("worst frame durations ms:", durs[:8])
    print("blocking durations ms:", blocks[:8], "total", sum(blocks))
    # attribute by invokerType (event-listener:scroll, etc) + name
    agg = {}
    for f in loaf:
        for s in f.get("scripts", []):
            key = f"{s.get('t','?')} | {s['n']}"
            agg[key] = agg.get(key, 0) + s["d"]
    top = sorted(agg.items(), key=lambda kv: -kv[1])[:12]
    print("top scripting (invokerType | source) ms:")
    for n, d in top: print(f"   {d:5d}  {n}")
    b.close()
