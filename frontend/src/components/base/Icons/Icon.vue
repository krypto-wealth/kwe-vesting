<template>
  <div v-html="path" ref="icon" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import icons from '@/misc/svgs'

export type Icon = keyof typeof icons

export interface IconProps {
  name: Icon
  size?: string
  color?: string
}

const props = defineProps<IconProps>()

const error = `<span style="color: red"> Not Found "${props.name}" </span>`
const path = ref(icons.hasOwnProperty(props.name) ? icons[props.name] : error)
const icon = ref<HTMLDivElement | null>(null)

onMounted(() => {
  try {
    const div = icon.value as any
    if (div) {
      const firstChild = div.firstChild
      if (props.size) {
        firstChild.setAttribute('width', props.size)
        firstChild.setAttribute('height', props.size)
      }
      if (props.color)
        Array.from(firstChild.children).forEach((c: any) => {
          c.setAttribute('fill', props.color)
          c.setAttribute('stroke', props.color)
        })
    }
  } catch (e) {
    console.error(e)
    console.warn(`Cannot modify, props:\n${JSON.stringify(props, undefined, 2)}`)
  }
})
</script>
