<template>
  <BaseIcon v-bind="props">
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.5"
        d="M16 0.81002C15.3036 1.2994 14.5324 1.67369 13.7164 1.91849C13.2784 1.41679 12.6962 1.06119 12.0488 0.899803C11.4013 0.738411 10.7196 0.779008 10.0961 1.0161C9.47248 1.2532 8.93705 1.67535 8.56217 2.22547C8.18729 2.77558 7.99105 3.42712 8 4.09195V4.81644C6.72192 4.84946 5.45547 4.56708 4.31346 3.99447C3.17145 3.42186 2.18932 2.57678 1.45455 1.53451C1.45455 1.53451 -1.45455 8.05491 5.09091 10.9529C3.59311 11.9657 1.80884 12.4735 0 12.4018C6.54545 16.0243 14.5455 12.4018 14.5455 4.07022C14.5448 3.86842 14.5253 3.66711 14.4873 3.46889C15.2295 2.73969 15.7533 1.81902 16 0.81002Z"
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
