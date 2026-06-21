"""Practical perf probe: measure what actually causes lag on the live site.
Captures: long tasks (main-thread blocks), FPS over time, WebGL context count,
JS heap growth (memory-leak signal), and # of rAF-driven canvases."""
import sys, time
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "https://paulshotel-bhedetar.vercel.app"

INSTRUMENT = r"""
() => {
  window.__perf = { longtasks: [], frames: [], heap: [], webgl: 0 };
  // Long tasks = main-thread blocks > 50ms (jank source)
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__perf.longtasks.push(Math.round(e.duration));
    }).observe({ entryTypes: ['longtask'] });
  } catch(e) {}
  // FPS sampler
  let last = performance.now(), frames = 0;
  function tick(now){
    frames++;
    if (now - last >= 1000){ window.__perf.frames.push(frames); frames = 0; last = now; }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  // Count WebGL contexts created
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(type, ...a){
    if (String(type).includes('webgl')) window.__perf.webgl++;
    return orig.call(this, type, ...a);
  };
}
"""

with sync_playwright() as p:
    # Headed + real GPU so cobe's WebGL globe actually renders (headless has no
    # GPU -> globe never inits -> can't reproduce the real device lag).
    b = p.chromium.launch(
        headless=False,
        args=[
            "--enable-gpu",
            "--use-gl=angle",
            "--ignore-gpu-blocklist",
            "--enable-webgl",
        ],
    )
    page = b.new_page(viewport={"width": 1366, "height": 768})
    page.add_init_script(INSTRUMENT)
    t0 = time.time()
    page.goto(BASE, wait_until="domcontentloaded")
    dcl = round((time.time()-t0)*1000)
    # sample heap each second for 16s while page is interactive
    heap = []
    for _ in range(16):
        time.sleep(1)
        try:
            h = page.evaluate("() => (performance.memory ? performance.memory.usedJSHeapSize : 0)")
            heap.append(round(h/1048576, 1))
        except Exception:
            heap.append(None)
    SAFE = "() => (window.__perf || {longtasks:[],frames:[],webgl:0})"
    data = page.evaluate(SAFE)
    canvases = page.evaluate("() => document.querySelectorAll('canvas').length")
    # scroll to bottom (mount below-fold globe) then sample again
    page.evaluate("() => window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(5)
    after = page.evaluate(SAFE)
    webgl_after_scroll = after["webgl"]
    fps_after = after["frames"]
    canvases = page.evaluate("() => document.querySelectorAll('canvas').length")
    print("URL:", BASE)
    print("DOMContentLoaded ms:", dcl)
    print("canvas elements:", canvases)
    print("webgl contexts (initial):", data["webgl"])
    print("webgl contexts (after scroll):", webgl_after_scroll)
    print("long tasks (>50ms):", data["longtasks"])
    print("  total block ms:", sum(data["longtasks"]))
    print("FPS/sec:", fps_after)
    print("heap MB/sec:", heap)
    if len([h for h in heap if h]) >= 2:
        valid = [h for h in heap if h]
        print("heap delta MB:", round(valid[-1]-valid[0], 1), "(leak signal if steadily climbing)")
    b.close()
