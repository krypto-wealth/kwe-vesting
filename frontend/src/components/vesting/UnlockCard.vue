<template>
  <div class="card__header text-[20px] font-bold text-white">Next Unlock</div>

  <div class="flex flex-col justify-center items-center md:items-start">
    <div
      class="flex flex-col md:flex-row space-y-[24px] md:space-y-0 md:justify-between h-full w-full"
    >
      <div class="flex card__leftInfo justify-start card">
        <div class="flex flex-col items-start justify-between">
          <span class="card__leftInfo__label">
            {{ props.leftTitle }}
          </span>
          <span class="card__leftInfo__info">
            {{ props.leftInfo }}
          </span>
        </div>
      </div>
      <div class="flex card__rightInfo pl-0 md:pl-4 lg:pl-12 justify-start card">
        <div class="flex flex-col items-center md:items-start">
          <span class="card__rightInfo__label">
            {{ props.rightTitle }}
          </span>
          <span class="card__rightInfo__info">
            {{ props.rightInfo }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GCard from '@/components/gotbit-ui-kit/GCard.vue'
import DateIcon from '@/components/base/Icons/DateIcon.vue'
import CoinWithArrowIcon from '@/components/base/Icons/CoinWithArrowIcon.vue'

interface ILableProps {
  leftInfo: string
  leftTitle: string
  rightInfo: string
  rightTitle: string
}

const props = defineProps<ILableProps>()
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';
@import '@/assets/config.scss';
.card {
  width: 311px;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.06) !important;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  border: 1.5px solid rgba(3, 226, 135, 0.6);
  @include for-size(lg) {
    width: 314px;
  }
  &__header {
    font-weight: 600;
    font-size: 20px;
    padding-bottom: 16px;
  }
  &__leftInfo {
    &__info {
      font-size: 16px;
      color: white;
      margin-top: 12px;
    }
    &__label {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  &__rightInfo {
    &__info {
      font-size: 16px;
      margin-top: 12px;

      color: white;
    }
    &__label {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}
</style>
