<script setup lang="ts">
import { countryName, type Address } from '@/domain'
import SectionCard from '@/components/ui/SectionCard.vue'

defineProps<{ address: Address }>()
defineEmits<{ edit: [] }>()
</script>

<template>
  <SectionCard heading-id="sec-address" title="Anschrift" description="An diese Adresse senden wir Post der Hochschule.">
    <template #actions>
      <button type="button" class="btn btn--ghost btn--sm" @click="$emit('edit')">Bearbeiten</button>
    </template>
    <address class="postal">
      <span>{{ address.street }} {{ address.houseNumber }}</span>
      <span v-if="address.addressSupplement">{{ address.addressSupplement }}</span>
      <span>{{ address.postalCode }} {{ address.city }}</span>
      <span>{{ countryName(address.country) }}</span>
    </address>
  </SectionCard>
</template>
