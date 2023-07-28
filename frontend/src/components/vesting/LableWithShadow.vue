<template>
  <div class="flex flex-col justify-center md:items-start card">
    <div class="flex card__title w-full justify-between">
      {{ props.title }}
      <GTooltip v-if="props.hint" class="ml-[14px]" position="right" :hint="props.hint" />
    </div>
    <div class="card__info">
      {{ props.info }}
    </div>
  </div>
</template>

<script setup lang="ts">
import GTooltip from '../gotbit-ui-kit/GTooltip.vue'

interface ILable {
  title: string
  info: string
  hint?: string
}

const props = defineProps<ILable>()
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';
@import '@/assets/config.scss';
.card {
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.06) !important;
  padding: 20px 16px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  @include for-size(md) {
    max-width: 314px;
  }
  width: 100%;
  height: 100px;

  &__title {
    color: rgba(148, 148, 148, 1);

    font-weight: 400;
    font-size: 15px;
    line-height: 28px;
    width: 100%;
    @include for-size(md) {
      align-self: flex-start;
    }
  }
  &__info {
    margin-top: 6px;
    color: $black-color;
    font-weight: 400;
    color: white;
    align-self: start;
    @include for-size(md) {
      align-self: flex-start;
    }
  }
}
</style>
