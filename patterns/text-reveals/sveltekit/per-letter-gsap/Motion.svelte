<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";

  let el: HTMLElement;

  onMount(() => {
    if (typeof matchMedia !== "undefined" &&
        matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = el.querySelectorAll<HTMLSpanElement>(".ht-letter");
    gsap.from(letters, {
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: "cubic-bezier(0.76, 0, 0.24, 1)",
    });
  });
</script>

<div class="ht-text-reveal" bind:this={el}>
  <h2>
    {#each "{{tokens.motion.language}}".split("") as ch, i (i)}
      <span class="ht-letter">{ch === " " ? "\u00A0" : ch}</span>
    {/each}
  </h2>
</div>

<style>
  .ht-text-reveal h2 {
    font-family: var(--font-display);
    font-size: clamp(2rem, 8vw, 6rem);
    line-height: 1.1;
    color: var(--fg);
    overflow: hidden;
  }
  .ht-text-reveal .ht-letter {
    display: inline-block;
    will-change: transform, opacity;
  }
</style>
