// Layout C (mock): type the headline into its text frame with a named cursor, hold, erase, repeat.
// The full headline is in the HTML, so it reads fine without JS or with reduced motion.
(() => {
  const h = document.querySelector('[data-type]');
  if (!h || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const full = h.textContent, box = h.parentElement;
  h.setAttribute('aria-label', full);
  const txt = document.createElement('span'); txt.setAttribute('aria-hidden', 'true');
  const caret = document.createElement('span'); caret.className = 'caret'; caret.setAttribute('aria-hidden', 'true');
  const ghost = document.createElement('span'); ghost.className = 'ghost'; ghost.textContent = full; ghost.setAttribute('aria-hidden', 'true');
  const live = document.createElement('span'); live.className = 'live'; live.append(txt, caret);
  h.textContent = ''; h.append(ghost, live);
  const tag = document.createElement('span'); tag.className = 'mp-cur'; tag.setAttribute('aria-hidden', 'true');
  tag.innerHTML = '<svg viewBox="0 0 16 18"><path d="M1 1l13 7.5-6 1.5-3 6z"/></svg><b>Agnes</b>';
  box.append(tag);
  const place = () => {
    const c = caret.getBoundingClientRect(), b = box.getBoundingClientRect();
    tag.style.left = (c.right - b.left + 6) + 'px'; tag.style.top = (c.bottom - b.top - 6) + 'px';
  };
  const wait = ms => new Promise(r => setTimeout(r, ms));
  (async function loop() {
    for (;;) {
      for (let i = 1; i <= full.length; i++) { txt.textContent = full.slice(0, i); place(); await wait(full[i - 1] === ' ' ? 90 : 55 + Math.random() * 45); }
      await wait(6000);
      for (let i = full.length; i >= 0; i--) { txt.textContent = full.slice(0, i); place(); await wait(18); }
      await wait(500);
    }
  })();
  addEventListener('resize', place);
})();
