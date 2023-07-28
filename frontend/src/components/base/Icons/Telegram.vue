<template>
  <BaseIcon v-bind="props">
    <svg
      width="16"
      height="15"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.5"
        d="M14.92 0.394788L0.747101 6.09689C-0.220143 6.50222 -0.214547 7.06517 0.56964 7.31621L4.2084 8.5005L12.6274 2.95852C13.0255 2.70582 13.3892 2.84176 13.0903 3.11865L6.26919 9.54134H6.26759L6.26919 9.54217L6.01818 13.4553C6.38589 13.4553 6.54817 13.2794 6.75441 13.0717L8.52182 11.2786L12.1982 14.1117C12.876 14.5012 13.3628 14.301 13.5315 13.457L15.9448 1.59075C16.1918 0.557419 15.5667 0.0895412 14.92 0.394788Z"
        fill="white"
      />
    </svg>
  </BaseIcon>
</template>

<script lang="ts" setup>
import BaseIcon from '@/components/gotbit-ui-kit/GIcon.vue'
import type { IconProps } from '@/components/gotbit-ui-kit/GIcon.vue'

export interface IIcon extends IconProps {}

const props = defineProps<IIcon>()
</script>
