<template>
  <div class="flex flex-col relative" :class="{ activeDrop: active }">
    <div class="flex flex-col select-none main-body">
      <div class="flex self-start md:self-end cursor-pointer items-center" ref="dropdown">
        <GTooltip
          v-if="hints.pool"
          class="ml-[14px] mr-3"
          position="right"
          position-mob="right"
          :hint="hints.pool"
        />
        <span @click="active = !active" class="label whitespace-nowrap">{{
          mainLabel
        }}</span>
        <ArrowUp v-if="active" class="ml-2" stroke="#03E287" />
        <ArrowDown v-else class="ml-2" stroke="#03E287" />
      </div>
    </div>
    <div
      class="absolute top-[35px] left-[50px] dropdown-body z-[1] rounded-[10px]"
      v-if="active"
    >
      <div
        class="cursor-pointer whitespace-nowrap text-[15px] text-left justify-start text-[#03e287] rounded-md py-[7px]"
        :class="{
          '!text-[#E0E0E0] not-active hover:shadow-lg': mainLabel !== option.label,
          'cursor-not-allowed': mainLabel === option.label,
        }"
        v-for="option of props.options"
        :key="option.value"
        @click="() => onSelect(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

import GTooltip from '../gotbit-ui-kit/GTooltip.vue'
import ArrowDown from '@/components/gotbit-ui-kit/icons/ArrowDownIcon.vue'
import ArrowUp from '@/components/gotbit-ui-kit/icons/ArrowUpIcon.vue'

const hints = {
  pool: 'The information related to the selected round will be displayed. Notice: Claim function represent the total claimable amount of the token from all rounds',
}

interface ISelectorOptions {
  value: string | number
  label: string
}

interface SelectorProps {
  options: ISelectorOptions[]
  modelValue?: string | number
  dropdownWidth?: string
}

const emit = defineEmits(['update:modelValue', 'press'])
const props = defineProps<SelectorProps>()

const active = ref(false)
const dropdown = ref<HTMLElement>()
const mainLabel = ref('')

onClickOutside(dropdown, () => {
  active.value = false
})

onMounted(() => {
  mainLabel.value = props.options.filter(
    (option) => option.value === props.modelValue,
  )[0].label
})

function onSelect(value: string | number) {
  emit('update:modelValue', value)
  emit('press')
  mainLabel.value = props.options.filter((option) => option.value === value)[0].label
}
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';

.label {
  color: $primary-color;
  font-size: 15px;
}
.main-body {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.5px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.06);
}

.dropdown-body {
  width: fit-content;
  padding: 24px;
  font-weight: 400;
  font-size: 14px;
  letter-spacing: -0.5px;
  box-shadow: 0px 20px 30px rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px);
  -webkit-backdrop-filter: blur(40px);
}

.not-active {
  color: black;
  transition: 0.5s;
}
</style>
