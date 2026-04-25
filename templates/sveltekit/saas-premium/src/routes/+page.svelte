<script lang="ts">
  import "$lib/tokens.css";
</script>

<svelte:head>
  <title>Halftone site</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</svelte:head>

<section data-slot="hero"></section>

<main id="main-content">
  <section class="manifesto">
    <!-- user content -->
  </section>

  <section class="features">
    <!-- features grid -->
  </section>

  <section data-slot="primary-motion"></section>
</main>

<section data-slot="footer"></section>
