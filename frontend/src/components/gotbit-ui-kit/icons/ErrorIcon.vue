<script setup lang="ts">
import type { IconProps } from '@/components/gotbit-ui-kit/GIcon.vue'
import GIcon from '@/components/gotbit-ui-kit/GIcon.vue'

interface ErrorIconProps extends IconProps {}

const props = defineProps<ErrorIconProps>()
</script>

<template>
  <GIcon v-bind="props">
    <svg
      :width="props.size"
      :height="props.size"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_686_43897)">
        <path
          d="M47 24C47 36.4264 36.9264 46.5 24.5 46.5C12.0736 46.5 2 36.4264 2 24C2 11.5736 12.0736 1.5 24.5 1.5C36.9264 1.5 47 11.5736 47 24Z"
          stroke="#EE5A51"
          stroke-width="3"
        />
        <path
          d="M15.8604 32.64L24.5004 24L33.1404 15.36"
          stroke="#EE5A51"
          stroke-width="3"
          stroke-miterlimit="10"
          stroke-linecap="round"
        />
        <path
          d="M15.8604 15.36L24.5004 24L33.1404 32.64"
          stroke="#EE5A51"
          stroke-width="3"
          stroke-miterlimit="10"
          stroke-linecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_686_43897">
          <rect width="48" height="48" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  </GIcon>
</template>
