<script lang="ts">
  import "$lib/tokens.css";
</script>

<svelte:head>
  <title>Halftone site</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</svelte:head>

<div data-slot="transition" aria-hidden="true"></div>

<section data-slot="hero"></section>

<main id="main-content">
  <section class="manifesto">
    <!-- user content -->
  </section>

  <section class="projects">
    <!-- project grid -->
  </section>

  <section data-slot="primary-motion"></section>
</main>

<section data-slot="footer"></section>
