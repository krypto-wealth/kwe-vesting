<script setup lang="ts">
import GIcon from '@/components/gotbit-ui-kit/GIcon.vue'

interface ViewwIconProps {
  size?: string
  color?: string
  stroke?: string
  transform?: string
}
const props = defineProps<ViewwIconProps>()
console.log(props, 1231231)
</script>

<template>
  <GIcon v-bind="props">
    <svg
      :width="props.size"
      :height="props.size"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 2H10M14 2L8 8M14 2V6"
        stroke="#03E287"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M13 8.55556V11.8889C13 12.1836 12.8829 12.4662 12.6746 12.6746C12.4662 12.8829 12.1836 13 11.8889 13H4.11111C3.81643 13 3.53381 12.8829 3.32544 12.6746C3.11706 12.4662 3 12.1836 3 11.8889V4.11111C3 3.81643 3.11706 3.53381 3.32544 3.32544C3.53381 3.11706 3.81643 3 4.11111 3H7.44444"
        stroke="#03E287"
        stroke-linecap="round"
      />
    </svg>
  </GIcon>
</template>
