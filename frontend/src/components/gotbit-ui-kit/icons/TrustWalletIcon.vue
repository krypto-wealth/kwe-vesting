<script setup lang="ts">
import type { IconProps } from '@/components/gotbit-ui-kit/GIcon.vue'
import GIcon from '@/components/gotbit-ui-kit/GIcon.vue'

interface TrustWalletIconProps extends IconProps {}

const props = defineProps<TrustWalletIconProps>()
</script>

<template>
  <GIcon v-bind="props">
    <svg
      width="27"
      height="28"
      viewBox="0 0 27 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.5 27.5C20.9558 27.5 27 21.4558 27 14C27 6.54416 20.9558 0.5 13.5 0.5C6.04416 0.5 0 6.54416 0 14C0 21.4558 6.04416 27.5 13.5 27.5Z"
        fill="#3375BB"
      />
      <path
        d="M13.5624 6.28564C16.1893 8.47954 19.2017 8.34425 20.0624 8.34425C19.8741 20.8215 18.4397 18.3473 13.5624 21.846C8.6851 18.3473 7.25958 20.8215 7.07129 8.34425C7.92304 8.34425 10.9354 8.47954 13.5624 6.28564Z"
        stroke="white"
        stroke-width="1.28571"
        stroke-miterlimit="10"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </GIcon>
</template>
