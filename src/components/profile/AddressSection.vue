<script setup lang="ts">
import { countryName, type Address, type FieldPath } from '@/domain'
import SectionCard from '@/components/ui/SectionCard.vue'

defineProps<{ address: Address; recipient: string }>()
defineEmits<{ edit: [focus: FieldPath] }>()
</script>

<template>
  <SectionCard heading-id="sec-address" eyebrow="Post der Hochschule" title="Anschrift">
    <template #actions>
      <button type="button" class="btn btn--secondary btn--sm" @click="$emit('edit', 'address.street')">Bearbeiten</button>
    </template>
    <div class="envelope">
      <span class="envelope__stamp" aria-hidden="true"><span>HTW</span></span>
      <address class="envelope__address">
        <span class="envelope__recipient">{{ recipient }}</span>
        <span>{{ address.street }} {{ address.houseNumber }}</span>
        <span v-if="address.addressSupplement">{{ address.addressSupplement }}</span>
        <span>{{ address.postalCode }} {{ address.city }}</span>
        <span>{{ countryName(address.country) }}</span>
      </address>
    </div>
    <p class="card__footnote">Umgezogen? Aktualisiere deine Adresse, damit Rückmeldebescheinigungen und Bescheide ankommen.</p>
  </SectionCard>
</template>
