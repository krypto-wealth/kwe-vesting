<template>
  <div class="relative flex cursor-pointer flex-col" :class="{ activeDrop: active }">
    <div class="main-body flex select-none flex-col">
      <div
        class="flex items-center self-start md:self-end"
        @click="active = !active"
        ref="dropdown"
      >
        <span class="label whitespace-nowrap">{{ 'Presale' }}</span>
        <ArrowDownIcon v-if="active" class="ml-2" stroke="#ffffff" />

        <ArrowUpIcon v-else class="ml-2" stroke="#ffffff" />
      </div>
    </div>
    <div
      class="dropdown-body absolute left-[50px] top-[35px] z-[1] rounded-[10px]"
      v-if="active"
    >
      <div
        class="text-[15px] leading-[23px] cursor-pointer items-center justify-start rounded-md py-[7px] text-center"
        :class="{
          'not-active  !text-[#FFFFFFCC] hover:!text-white': mainLabel !== option.label,
          '!text-[#FFFFFFCC]': unref(router.currentRoute).fullPath == `/${option.value}`,
        }"
        v-for="option of props.options"
        :key="option.value"
        @click="() => onSelect(option.value)"
      >
        <a
          :href="`https://presale.kwe.network/${option.route || option.value}`"
          class="!text-[#FFFFFFCC] hover:!text-white"
          >{{ option.label }}</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, unref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'
import ArrowUpIcon from '@/components/gotbit-ui-kit/icons/ArrowUpIcon.vue'
import ArrowDownIcon from '@/components/gotbit-ui-kit/icons/ArrowDownIcon.vue'

const router = useRouter()

interface ISelectorOptions {
  value: string | number
  label: string
  route?: string
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

console.log(unref(router.currentRoute).fullPath, `/${props.options[0].value}`)

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
.label {
  font-size: 16px;
}
.main-body {
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: -0.5px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.06);
}

.dropdown-body {
  width: 100%;
  padding: 16px 16px 16px 16px;
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
