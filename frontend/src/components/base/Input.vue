<template>
  <input
    type="text"
    v-bind="props"
    v-model="value"
    class="px-2 border border-orange-400 rounded-md"
  />
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import type { InputHTMLAttributes } from 'vue'

export interface InputProps extends Omit<InputHTMLAttributes, 'type'> {
  modelValue?: string
}

const props = defineProps<InputProps>()
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (text) => emit('update:modelValue', text),
})
</script>
