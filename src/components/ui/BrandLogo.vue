<script setup lang="ts">
/**
 * HTW-Berlin-Wortmarke (Nachbau als Platzhalter, CI-Farben).
 * Vor Produktivnahme durch die offiziellen Logo-Pfade aus dem CD-Portal ersetzen.
 * „BERLIN“ nutzt currentColor, damit die Marke auch im Dark Mode lesbar bleibt.
 */
withDefaults(defineProps<{ height?: number }>(), { height: 36 })
</script>

<template>
  <svg class="brand-logo" :height="height" viewBox="0 0 156 40" role="img" aria-label="HTW Berlin">
    <rect x="0" y="4" width="7" height="32" rx="1" fill="#76B900" />
    <text x="14" y="30" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="30" letter-spacing="0.5" fill="#76B900">HTW</text>
    <text x="90" y="30" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="14" letter-spacing="2" fill="currentColor">BERLIN</text>
  </svg>
</template>
