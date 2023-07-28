<template>
  <button
    @click="emit('click')"
    v-bind="props"
    class="h-10 px-3 text-white rounded-lg shadow-sm bg-lime-500"
    :class="{
      'opacity-70': props.disabled,
    }"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ButtonHTMLAttributes } from 'vue'

interface ButtonProps extends ButtonHTMLAttributes {
  disabled?: boolean
}

const props = defineProps<ButtonProps>()
const emit = defineEmits(['click'])
</script>
