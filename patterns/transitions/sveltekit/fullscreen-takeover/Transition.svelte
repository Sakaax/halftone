<script lang="ts">
  import { onMount } from "svelte";
  let el: HTMLElement;
  onMount(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el?.classList.add("ht-transition-played");
  });
</script>

<div class="ht-transition" bind:this={el} aria-hidden="true"></div>

<style>
  .ht-transition {
    position: fixed;
    inset: 0;
    background: var(--accent);
    transform: translateY(0);
    pointer-events: none;
    z-index: 9999;
  }
  .ht-transition.ht-transition-played {
    animation: ht-transition-out 800ms cubic-bezier(0.76, 0, 0.24, 1) forwards;
  }
  @keyframes ht-transition-out {
    from { transform: translateY(0); }
    to   { transform: translateY(-100%); }
  }
  @media (prefers-reduced-motion: reduce) {
    .ht-transition { display: none; }
  }
</style>
