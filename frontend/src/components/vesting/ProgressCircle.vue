<template>
  <div class="container">
    <div class="container__center-text">{{ props.info }}</div>
    <svg class="progress-ring" height="95" width="165">
      <circle
        class="progress-ring__circle"
        :id="props.barId"
        stroke-width="18"
        :stroke="props.color"
        fill="transparent"
        :r="props.radius"
        cx="82.5"
        cy="12.5"
      />
    </svg>
    <div class="flex container__lower-text">
      <span> 0% </span>
      <span>{{ props.title }}</span>
      <span>100%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from 'vue'

interface ICircleProgressProps {
  radius: number
  progressPercent: number
  color: string
  title?: string
  info?: string
  barId: string
}

const props = withDefaults(defineProps<ICircleProgressProps>(), {
  radius: 72.5,
})

// const setProgress = (percent: number) => {
//   const circle = document.querySelector('.progress-ring__circle') as HTMLElement
//   if (!circle) return
//   const offset = circumference - (percent / 200) * circumference
//   console.log(circumference)
//   circle.style.strokeDashoffset = offset.toString()
// }

onMounted(() => {
  const circumference = props.radius * 2 * Math.PI

  const circle = document.querySelector(`#${props.barId}`) as HTMLElement
  if (!circle) return
  circle.style.strokeDasharray = `${circumference} ${circumference}`
  circle.style.strokeDashoffset = (
    circumference -
    (props.progressPercent / 200) * circumference
  ).toString()
})
onUpdated(() => {
  const circumference = props.radius * 2 * Math.PI

  const circle = document.querySelector(`#${props.color}`) as HTMLElement
  if (!circle) return
  circle.style.strokeDashoffset = (
    circumference -
    (props.progressPercent / 200) * circumference
  ).toString()
})
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';
.container {
  position: relative;
  display: flex;
  justify-content: center;
  &__center-text {
    position: absolute;
    top: 50px;
    width: 100%;
    text-align: center;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
  }
  &__lower-text {
    position: absolute;
    top: 84px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-left: 22px;
    padding-right: 10px;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: $gray-color;
  }
}
.progress-ring__circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(180deg);
  transform-origin: 50% 50%;
}
</style>
