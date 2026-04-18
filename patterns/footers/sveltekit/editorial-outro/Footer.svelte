<footer class="ht-footer">
  <div class="ht-footer-mark">
    <h2>{{tokens.motion.language}}</h2>
  </div>
  <div class="ht-footer-meta">
    <a href="/" class="ht-footer-link">home</a>
    <a href="#" class="ht-footer-link">work</a>
    <a href="#" class="ht-footer-link">contact</a>
  </div>
  <p class="ht-footer-credit">Crafted with Halftone</p>
</footer>

<style>
  .ht-footer {
    padding: clamp(6rem, 14vw, 14rem) clamp(2rem, 6vw, 8rem) 4rem;
    background: var(--bg);
    color: var(--fg);
    border-top: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: clamp(2rem, 5vw, 5rem);
  }
  .ht-footer-mark h2 {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 10vw, 9rem);
    line-height: 0.95;
    letter-spacing: -0.03em;
    margin: 0;
  }
  .ht-footer-meta {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .ht-footer-link {
    color: var(--fg);
    text-decoration: none;
    opacity: 0.7;
    transition: opacity 0.3s;
    min-height: 48px;
    display: inline-flex;
    align-items: center;
  }
  .ht-footer-link:hover, .ht-footer-link:focus-visible {
    opacity: 1;
  }
  .ht-footer-link:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 4px;
  }
  .ht-footer-credit {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    margin: 0;
  }
</style>
