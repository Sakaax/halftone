<script lang="ts">
  // Brutalist hero — huge mono headline with accent underline.
</script>

<section class="ht-hero-brutalist">
  <h1>HALFTONE</h1>
  <p class="sub">{{tokens.motion.language}}</p>
</section>

<style>
  .ht-hero-brutalist {
    min-height: 100vh;
    padding: 4rem;
    background: var(--bg);
    color: var(--fg);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border-bottom: 2px solid var(--accent);
  }
  .ht-hero-brutalist h1 {
    font-family: var(--font-mono);
    font-size: clamp(4rem, 16vw, 16rem);
    line-height: 0.85;
    letter-spacing: -0.05em;
    margin: 0;
  }
  .ht-hero-brutalist .sub {
    margin-top: 2rem;
    font-family: var(--font-mono);
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
</style>
