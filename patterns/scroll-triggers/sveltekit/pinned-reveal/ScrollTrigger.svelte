<script lang="ts">
  import { onMount } from "svelte";
  let wrap: HTMLElement;

  onMount(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      wrap.querySelectorAll(".ht-reveal-line").forEach((el) => el.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    wrap.querySelectorAll(".ht-reveal-line").forEach((el) => observer.observe(el));
  });
</script>

<section class="ht-scroll-trigger" bind:this={wrap}>
  <p class="ht-reveal-line">{{tokens.motion.language}}</p>
  <p class="ht-reveal-line">We design for craft, not convenience.</p>
  <p class="ht-reveal-line">No shadcn. No Inter. No purple gradients.</p>
</section>

<style>
  .ht-scroll-trigger {
    padding: clamp(6rem, 15vw, 16rem) clamp(2rem, 6vw, 8rem);
    display: flex;
    flex-direction: column;
    gap: clamp(1.5rem, 3vw, 3rem);
  }
  .ht-reveal-line {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 5vw, 3rem);
    line-height: 1.2;
    color: var(--fg);
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.76, 0, 0.24, 1), transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
  }
  .ht-reveal-line.visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .ht-reveal-line { opacity: 1; transform: none; transition: none; }
  }
</style>
