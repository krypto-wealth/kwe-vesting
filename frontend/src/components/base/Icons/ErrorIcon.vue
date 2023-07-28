<template>
  <GIcon v-bind="props">
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_197_1003)">
        <path
          d="M46.5 24C46.5 36.4264 36.4264 46.5 24 46.5C11.5736 46.5 1.5 36.4264 1.5 24C1.5 11.5736 11.5736 1.5 24 1.5C36.4264 1.5 46.5 11.5736 46.5 24Z"
          stroke="#EE5A51"
          stroke-width="3"
        />
        <path
          d="M15.3601 32.64L24.0001 24L32.6401 15.36"
          stroke="#EE5A51"
          stroke-width="3"
          stroke-miterlimit="10"
          stroke-linecap="round"
        />
        <path
          d="M15.3601 15.36L24.0001 24L32.6401 32.64"
          stroke="#EE5A51"
          stroke-width="3"
          stroke-miterlimit="10"
          stroke-linecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_197_1003">
          <rect width="48" height="48" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </GIcon>
</template>

<script setup lang="ts">
import GIcon from '@/components/gotbit-ui-kit/GIcon.vue'
import type { IconProps } from '@/components/gotbit-ui-kit/GIcon.vue'
interface CopyIconProps extends IconProps {}
const props = defineProps<CopyIconProps>()
</script>
