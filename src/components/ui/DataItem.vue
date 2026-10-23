<script setup lang="ts">
defineProps<{ label: string; value: string; muted?: boolean }>()
</script>

<template>
  <div class="data-item">
    <dt class="data-item__label">{{ label }}</dt>
    <dd class="data-item__value" :class="{ 'is-muted': muted }"><slot>{{ value }}</slot></dd>
  </div>
</template>
