<template>
  <div>
    <div class="flex justify-between">
      <div class="flex flex-col first-lable">
        <div
          class="flex mt-1 text-white"
          :class="{
            label_info: symbolsAmount === 'sm',
            label_info_md: symbolsAmount === 'md',
            label_info_xl: symbolsAmount === 'xl',
          }"
        >
          {{ props.firstAmount }} {{ symbol }}
        </div>
      </div>
      <div class="flex flex-col second-lable">
        <div
          class="flex mt-1 text-white"
          :class="{
            label_info: symbolsAmount === 'sm',
            label_info_md: symbolsAmount === 'md',
            label_info_xl: symbolsAmount === 'xl',
          }"
        >
          {{ props.secondAmount }} {{ symbol }}
        </div>
      </div>
      <div class="flex flex-col third-lable">
        <div
          class="flex mt-1 text-white"
          :class="{
            label_info: symbolsAmount === 'sm',
            label_info_md: symbolsAmount === 'md',
            label_info_xl: symbolsAmount === 'xl',
          }"
        >
          {{ props.thirdAmount }} {{ symbol }}
        </div>
      </div>
    </div>
    <div class="flex justify-start progress-bar rounded-full mt-[13px]">
      <span class="flex progress-bar__first" />
      <span class="flex progress-bar__second" />
      <span class="flex progress-bar__third" />
    </div>
    <div class="flex justify-between mt-[14px] mb-[30px]">
      <div class="label_title">
        Locked {{ (progressParts.firstPart * 100).toFixed(1) + '%' }}
      </div>
      <div class="label_title">
        Claimable {{ (progressParts.secondPart * 100).toFixed(1) + '%' }}
      </div>
      <div class="label_title">
        Claimed {{ (progressParts.thirdPart * 100).toFixed(1) + '%' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onMounted, onUpdated, reactive } from 'vue'
import { useTokenData } from '@/store/data/token'

const symbol = computed(() => useTokenData().symbol())

interface ProgressParts {
  firstPart: number
  secondPart: number
  thirdPart: number
}

interface ProgressBarProps {
  firstColor: string
  secondColor: string
  thirdColor: string

  firstAmount: number
  secondAmount: number
  thirdAmount: number
}

const props = defineProps<ProgressBarProps>()

const symbolsAmount = computed(() => {
  const numbersLenght = (
    props.firstAmount.toString() +
    props.secondAmount.toString() +
    props.thirdAmount.toString()
  ).length
  if (numbersLenght > 29) {
    return 'xl'
  } else if (numbersLenght < 29 && numbersLenght > 16) {
    return 'md'
  } else return 'sm'
})

const progressParts = reactive<ProgressParts>({
  firstPart: 0,
  secondPart: 0,
  thirdPart: 0,
})

const setStyle = () => {
  const firstBar = document.querySelector('.progress-bar__first') as HTMLElement
  const secondBar = document.querySelector('.progress-bar__second') as HTMLElement
  const thirdBar = document.querySelector('.progress-bar__third') as HTMLElement

  if (!firstBar || !secondBar || !thirdBar) return

  firstBar.style.setProperty('background-color', `${props.firstColor}`)
  secondBar.style.setProperty('background-color', `${props.secondColor}`)
  thirdBar.style.setProperty('background-color', `${props.thirdColor}`)
}

const setProgress = () => {
  const firstBar = document.querySelector('.progress-bar__first') as HTMLElement
  const secondBar = document.querySelector('.progress-bar__second') as HTMLElement
  const thirdBar = document.querySelector('.progress-bar__third') as HTMLElement

  if (!firstBar || !secondBar || !thirdBar) return

  const sumAmount = props.firstAmount + props.secondAmount + props.thirdAmount
  props.firstAmount
    ? (progressParts.firstPart = props.firstAmount / sumAmount)
    : (progressParts.firstPart = 0)
  props.secondAmount
    ? (progressParts.secondPart = props.secondAmount / sumAmount)
    : (progressParts.secondPart = 0)
  props.thirdAmount
    ? (progressParts.thirdPart = props.thirdAmount / sumAmount)
    : (progressParts.thirdPart = 0)

  firstBar.style.setProperty('width', `${progressParts.firstPart * 100}%`)
  secondBar.style.setProperty('width', `${progressParts.secondPart * 100}%`)
  thirdBar.style.setProperty('width', `${progressParts.thirdPart * 100}%`)
}

onMounted(() => {
  setStyle()
  setProgress()
})
onUpdated(() => setProgress())
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';
.progress-bar {
  width: 100%;
  height: 4px;
  overflow: hidden;
  &__first {
    transition: width 0.35s;
  }
  &__second {
    transition: width 0.35s;
  }
  &__third {
    transition: width 0.35s;
  }
}

.label_title {
  @include for-size(md) {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: $gray-color;
    text-align: center;
  }
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  color: $gray-color;
}
.label_info {
  @include for-size(md) {
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
  }
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
}

.label_info_md {
  @include for-size(md) {
    font-weight: 400;
    font-size: 16px;
    line-height: 22px;
  }
  font-weight: 400;
  font-size: 10px;
  line-height: 17px;
}

.label_info_xl {
  @include for-size(md) {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
  }
  font-weight: 600;
  font-size: 10px;
  line-height: 17px;
}
</style>
