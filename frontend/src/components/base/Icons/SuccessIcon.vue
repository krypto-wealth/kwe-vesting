<template>
  <GIcon v-bind="props">
    <svg
      width="49"
      height="48"
      viewBox="0 0 49 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_197_943)">
        <path
          d="M47 24C47 36.4264 36.9264 46.5 24.5 46.5C12.0736 46.5 2 36.4264 2 24C2 11.5736 12.0736 1.5 24.5 1.5C36.9264 1.5 47 11.5736 47 24Z"
          stroke="#26CE87"
          stroke-width="3"
        />
        <path
          d="M36.98 14.4L21.62 31.68L12.02 24"
          stroke="#26CE87"
          stroke-width="3"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_197_943">
          <rect width="48" height="48" fill="white" transform="translate(0.5)" />
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
