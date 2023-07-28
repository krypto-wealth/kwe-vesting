<script setup lang="ts">
import GIcon from '@/components/gotbit-ui-kit/GIcon.vue'

interface CopyIconProps {
  size?: string
  color?: string
  stroke?: string
  transform?: string
}
const props = defineProps<CopyIconProps>()
</script>

<template>
  <GIcon v-bind="props">
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <svg
        :width="props.size"
        :height="props.size"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.9333 13.3333H6.4C6.29391 13.3333 6.19217 13.2912 6.11716 13.2162C6.04214 13.1412 6 13.0394 6 12.9333V6.4C6 6.29391 6.04214 6.19217 6.11716 6.11716C6.19217 6.04214 6.29391 6 6.4 6H12.9333C13.0394 6 13.1412 6.04214 13.2162 6.11716C13.2912 6.19217 13.3333 6.29391 13.3333 6.4V12.9333C13.3333 13.0394 13.2912 13.1412 13.2162 13.2162C13.1412 13.2912 13.0394 13.3333 12.9333 13.3333Z"
          stroke="#03E287"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.0001 5.99984V3.0665C10.0001 2.96042 9.95794 2.85868 9.88292 2.78366C9.80791 2.70865 9.70617 2.6665 9.60008 2.6665H3.06675C2.96066 2.6665 2.85892 2.70865 2.78391 2.78366C2.70889 2.85868 2.66675 2.96042 2.66675 3.0665V9.59984C2.66675 9.70592 2.70889 9.80767 2.78391 9.88268C2.85892 9.9577 2.96066 9.99984 3.06675 9.99984H6.00008"
          stroke="#03E287"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </svg>
  </GIcon>
</template>
