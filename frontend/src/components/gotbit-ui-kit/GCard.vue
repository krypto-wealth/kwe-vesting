<script setup lang="ts">
import { ref, onMounted } from 'vue'

export interface CardProps {
  color?: string
  radius?: string

  width?: string
  height?: string

  shadow?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {})
const card = ref<HTMLDivElement>()

onMounted(() => {
  try {
    const tag = card.value
    if (!tag) return

    tag.style.borderRadius = props.radius ?? tag.style.borderRadius
    tag.style.backgroundColor = props.color ?? tag.style.backgroundColor
    tag.style.width = props.width ?? tag.style.width
    tag.style.height = props.height ?? tag.style.height
    tag.style.boxShadow = props.shadow ? '0px 4px 24px rgba(0, 0, 0, 0.07)' : 'none'
  } catch (e) {
    console.error(e)
  }
})
</script>
<template>
  <div class="card" ref="card">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
@import '@/assets/config.scss';

.card {
  background: linear-gradient(
    170.16deg,
    rgba(0, 16, 24, 0.5328) 6.14%,
    rgba(0, 14, 22, 0.2368) 92.61%
  );

  border-radius: 16px;
  border: 0.75px solid rgba(255, 255, 255, 0.3);
  padding: 16px;
  @include for-size(sm) {
    border-radius: 24px;
  }
}
</style>
