<script setup lang="ts">
defineProps<{ title: string; description?: string; headingId: string }>()
</script>

<template>
  <section class="card" :aria-labelledby="headingId">
    <header class="card__header">
      <div>
        <h2 :id="headingId" class="card__title">{{ title }}</h2>
        <p v-if="description" class="card__description">{{ description }}</p>
      </div>
      <div v-if="$slots.actions" class="card__actions"><slot name="actions" /></div>
    </header>
    <slot />
  </section>
</template>
