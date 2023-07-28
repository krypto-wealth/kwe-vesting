<template>
  <div class="flex flex-col">
    <input
      type="text"
      v-bind="props"
      v-model="value"
      class="input"
      :class="{ invalid: !isValid }"
      :placeholder="placeholder"
      :disabled="disabled"
    />
    <span :class="{ invalid: !isValid }">{{ errorMessage }}</span>
  </div>
  <GButton
    class="input-button absolute top-[46px] right-4"
    ghost
    :disabled="props.disabled"
    @click="value = props.maxValue"
  >
    MAX
  </GButton>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { InputHTMLAttributes } from 'vue'

import GButton from '@/components/gotbit-ui-kit/GButton.vue'

export interface InputProps extends Omit<InputHTMLAttributes, 'type'> {
  modelValue?: string
  placeholder?: string
  isValid?: boolean
  errorMessage?: string
  disabled?: boolean
  maxValue?: string
  validate?: string
}

const props = defineProps<InputProps>()
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get: () => props.modelValue,
  set: (text) => emit('update:modelValue', text),
})

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    if (newValue && props.validate === 'number')
      if (newValue.match(/^[0-9]*$/)) value.value = newValue
      else value.value = oldValue
  },
)
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';

.input {
  height: 56px;
  padding: 1rem;
  padding-right: 56px;
  margin-bottom: 4px;
  border: 2px solid $primary-disabled-color;
  border-radius: 0.5rem;
  font-size: 20px;
  font-feature-settings:
    'pnum' on,
    'lnum' on;
  color: $black-color;
  outline: none;

  &::placeholder {
    color: $gray-color;
  }

  &.invalid {
    border-color: $error-color;
  }
}
.input-button {
  font-weight: 700 !important;
  font-size: 16px;
  font-feature-settings:
    'pnum' on,
    'lnum' on;
  color: $primary-color !important;
}

span {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  font-feature-settings:
    'pnum' on,
    'lnum' on;
  color: $error-color;
  display: none;

  &.invalid {
    display: inline;
  }
}
</style>
