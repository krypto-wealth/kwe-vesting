<script setup lang="ts">
import type { IconProps } from '@/components/gotbit-ui-kit/GIcon.vue'
import GIcon from '@/components/gotbit-ui-kit/GIcon.vue'

interface WalletconnectIconProps extends IconProps {}

const props = defineProps<WalletconnectIconProps>()
</script>

<template>
  <GIcon v-bind="props">
    <svg
      width="23"
      height="23"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="11.5" cy="11.5" r="11" stroke="#DE2366" />
      <path
        d="M12.2337 7.72727L12.1165 12.8622H10.973L10.8594 7.72727H12.2337ZM11.5447 15.0781C11.3293 15.0781 11.1446 15.0024 10.9908 14.8509C10.8393 14.6993 10.7635 14.5147 10.7635 14.2969C10.7635 14.0838 10.8393 13.9015 10.9908 13.75C11.1446 13.5985 11.3293 13.5227 11.5447 13.5227C11.7554 13.5227 11.9377 13.5985 12.0916 13.75C12.2479 13.9015 12.326 14.0838 12.326 14.2969C12.326 14.4413 12.2893 14.5727 12.2159 14.6911C12.1449 14.8094 12.0502 14.9041 11.9318 14.9751C11.8158 15.0438 11.6868 15.0781 11.5447 15.0781Z"
        fill="#DE2366"
      />
    </svg>
  </GIcon>
</template>
