<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    error?: string
    hint?: string
    type?: string
    autocomplete?: string
    required?: boolean
    options?: readonly { value: string; label: string }[]
    maxlength?: number
    placeholder?: string
  }>(),
  { type: 'text' },
)

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ blur: [] }>()

const id = useId()
const describedBy = computed(() =>
  [props.error ? `${id}-error` : null, props.hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <div class="field" :class="{ 'field--invalid': !!error }">
    <label class="field__label" :for="id">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
      <span v-else class="field__optional">optional</span>
    </label>
    <select
      v-if="options"
      :id="id"
      v-model="model"
      class="field__control"
      :aria-invalid="!!error"
      :aria-describedby="describedBy"
      :autocomplete="autocomplete"
      @blur="emit('blur')"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <input
      v-else
      :id="id"
      v-model="model"
      class="field__control"
      :type="type"
      :autocomplete="autocomplete"
      :required="required"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :aria-invalid="!!error"
      :aria-describedby="describedBy"
      @blur="emit('blur')"
    />
    <p v-if="hint && !error" :id="`${id}-hint`" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="field__error" role="alert">{{ error }}</p>
  </div>
</template>
