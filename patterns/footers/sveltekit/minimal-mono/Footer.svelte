<footer class="ht-footer-min">
  <span class="ht-footer-dot">●</span>
  <span class="ht-footer-text">HALFTONE × {{tokens.motion.language}}</span>
</footer>

<style>
  .ht-footer-min {
    padding: 2rem clamp(2rem, 6vw, 8rem);
    background: var(--bg);
    color: var(--fg);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 1rem;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
  .ht-footer-dot {
    color: var(--accent);
    font-size: 1.2rem;
  }
  .ht-footer-text {
    flex: 1;
  }
</style>
