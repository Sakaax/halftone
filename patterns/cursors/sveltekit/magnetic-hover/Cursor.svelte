<script lang="ts">
  import { onMount } from "svelte";
  onMount(() => {
    if (matchMedia("(pointer: coarse)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cursor = document.querySelector<HTMLElement>(".ht-cursor");
    if (!cursor) return;

    let x = 0, y = 0, tx = 0, ty = 0;

    function move(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
    }
    function tick() {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      cursor!.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(tick);
    }
    window.addEventListener("mousemove", move);
    tick();
  });
</script>

<div class="ht-cursor" aria-hidden="true"></div>

<style>
  .ht-cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    border: 1px solid var(--accent);
    border-radius: 50%;
    pointer-events: none;
    mix-blend-mode: difference;
    z-index: 9998;
    transform: translate(-100vw, -100vh);
    will-change: transform;
  }
  @media (pointer: coarse), (prefers-reduced-motion: reduce) {
    .ht-cursor { display: none; }
  }
</style>
