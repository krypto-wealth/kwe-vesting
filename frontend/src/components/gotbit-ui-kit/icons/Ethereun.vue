<script setup lang="ts">
import type { IconProps } from '@/components/gotbit-ui-kit/GIcon.vue'
import GIcon from '@/components/gotbit-ui-kit/GIcon.vue'

interface CloseIconProps extends IconProps {}

const props = defineProps<CloseIconProps>()
</script>

<template>
  <GIcon v-bind="props">
    <svg
      width="14"
      height="24"
      viewBox="0 0 14 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.99769 0L6.84473 0.546942V16.4165L6.99769 16.5772L13.9953 12.2229L6.99769 0Z"
        fill="#454545"
      />
      <path d="M6.99781 0L0 12.2229L6.99781 16.5772V8.87451V0Z" fill="#8C8C8C" />
      <path
        d="M6.99832 17.9712L6.91211 18.0819V23.7348L6.99832 23.9998L14.0002 13.6191L6.99832 17.9712Z"
        fill="#3C3C3B"
      />
      <path d="M6.99781 23.9998V17.9712L0 13.6191L6.99781 23.9998Z" fill="#8C8C8C" />
      <path
        d="M6.99707 16.5767L13.9947 12.2224L6.99707 8.87402V16.5767Z"
        fill="#141414"
      />
      <path d="M0 12.2224L6.99781 16.5767V8.87402L0 12.2224Z" fill="#393939" />
    </svg>
  </GIcon>
</template>
