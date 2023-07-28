<template>
  <footer
    class="footer flex-col md:flex-row md:h-[120px] h-185px"
    :class="{ 'bg-color border-b': isColor }"
  >
    <div class="footer_logo">
      <img src="../../assets/img/logo.svg" alt="" />
      <p class="text-[#949494] text-[13px] leading-[19px]">
        © 2023 KWE Network. All Rights Reserved.
      </p>
    </div>
    <nav class="flex flex-col items-center">
      <p class="text-white text-[15px]">Join the Community</p>
      <p class="max-w-[335px] text-center text-[12px] text-[#FFFFFFCC] block md:hidden">
        Become a part of the KWE community and contribute towards a greener, cleaner,
        better future for all.
      </p>
      <div class="flex w-[202px] justify-between mt-[28px] md:mt-2">
        <a href="https://www.facebook.com/KryptoWealthPlatform" target="_blank">
          <Facebook
        /></a>
        <a href="https://twitter.com/kryptostokz" target="_blank"> <Twitter /></a>
        <a
          href="https://www.youtube.com/channel/UCcZg-y8Rq0gyiBcNw-kzBEQ"
          target="_blank"
        >
          <YouTube
        /></a>
        <a href="https://www.instagram.com/krypto_wealthy/" target="_blank">
          <Instagram
        /></a>
        <a href="https://t.me/+561qZ6x2mqg1NGYx" target="_blank"> <Telegram /></a>
      </div>
    </nav>
    <p class="text-[#949494] text-[13px] leading-[19px] block md:hidden mt-7">
      © 2023 KWE Network. All Rights Reserved.
    </p>
    <p class="max-w-[261px] text-right text-[14px] text-[#FFFFFFCC] hidden md:block">
      Become a part of the KWE community and contribute towards a greener, cleaner, better
      future for all.
    </p>
  </footer>
</template>

<script setup lang="ts">
import Facebook from '@/components/gotbit-ui-kit/icons/Facebook.vue'
import Twitter from '@/components/gotbit-ui-kit/icons/Twitter.vue'
import YouTube from '@/components/gotbit-ui-kit/icons/YouTube.vue'
import Instagram from '@/components/gotbit-ui-kit/icons/Instagram.vue'
import Telegram from '@/components/gotbit-ui-kit/icons/Telegram.vue'

import { ref } from 'vue'
const isColor = ref(false)
</script>

<style lang="scss" scoped>
@import '@/assets/config.scss';

.bg-color {
  background-color: #fff !important;
}
.footer {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  z-index: 10;
  box-sizing: border-box;
  @include py(12px);
  @include for-size(lg) {
    @include py(20px);
  }
  @include px(24px);
  @include for-size(md) {
    @include px(32px);
  }
  @include for-size(xl) {
    @include px(98px);
  }
  &_logo {
    @media only screen and (max-width: 768px) {
      display: none;
    }

    &__image {
      width: 46px;
      @include for-size(lg) {
        width: 65px;
        margin-right: 16px;
      }
    }
    &__title {
      font-size: 28px;
      color: $black-color;
      margin-left: 8px;
    }
  }
}
</style>
