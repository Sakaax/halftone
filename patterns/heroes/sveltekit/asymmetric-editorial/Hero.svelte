<script lang="ts">
  // Asymmetric editorial hero. Massive display type, off-center, scroll-pinned.
</script>

<section class="ht-hero">
  <h1>{{tokens.motion.language}}</h1>
</section>

<style>
  .ht-hero {
    min-height: 100vh;
    padding: clamp(4rem, 10vw, 12rem) clamp(2rem, 6vw, 8rem);
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: clamp(2rem, 4vw, 6rem);
  }
  .ht-hero h1 {
    font-family: var(--font-display);
    font-size: clamp(3rem, 12vw, 12rem);
    line-height: 0.9;
    color: var(--fg);
  }
</style>
