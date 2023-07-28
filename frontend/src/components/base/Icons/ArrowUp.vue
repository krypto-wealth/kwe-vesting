<template>
  <GIcon v-bind="props">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.28 10.0333L8.9333 5.68666C8.41997 5.17332 7.57997 5.17332 7.06664 5.68666L2.71997 10.0333"
        stroke="#9799A1"
        stroke-width="1.5"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </GIcon>
</template>

<script setup lang="ts">
import GIcon from '@/components/gotbit-ui-kit/GIcon.vue'
import type { IconProps } from '@/components/gotbit-ui-kit/GIcon.vue'
interface CopyIconProps extends IconProps {}
const props = defineProps<CopyIconProps>()
</script>
