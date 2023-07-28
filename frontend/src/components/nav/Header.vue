<template>
  <header class="py-[19px] relative z-20 w-full bg-transparent h-[100px]">
    <div
      class="2md:px-15 3lg:px-33 mx-auto flex w-full max-w-[1600px] items-center justify-between px-3 md:px-10 lg:px-24"
    >
      <RouterLink :to="{ name: 'home' }">
        <div class="header_logo">
          <img src="../../assets/img/logo.svg" alt="" />
        </div>
      </RouterLink>
      <nav v-if="!sm" class="gap-[100px] flex items-center justify-between text-white">
        <BaseInputSelect :options="rounds" v-model="model" class="w-[143px]" />
        <nuxt-link to="/vesting" class="text-[#03e287] text-[16px]">Vesting</nuxt-link>
      </nav>
      <div class="header__connect">
        <div v-if="!login && !sm">
          <GButton
            outline
            class="w-[155px] h-[49px] !rounded-[90px] !text-[14px]"
            @click="dialogs.openDialog('connectDialog', {})"
          >
            Connect wallet
          </GButton>
        </div>
        <div v-else class="flex">
          <WrongNetwork
            v-if="realChainId != chainId"
            class="mr-4 cursor-pointer"
            @mouseover="hover = true"
            @mouseleave="hover = false"
            @click="web3.switchChain(chainId)"
          />
          <div
            v-if="hover"
            class="wrong-network w-[171px] h-[50px] bg-[#DE23663D] flex items-center px-[17px] py-[13px] rounded-[8px] absolute top-[50px] -left-[150px]"
          >
            <WrongNetwork />
            <p class="text-[10px] text-[#DE2366] w-[108px] ml-[13px]">
              An unsupported network is selected
            </p>
          </div>
          <BurgerMenu
            class="cursor-pointer burger"
            v-if="sm"
            @click="logOutPopup = !logOutPopup"
          />

          <GButton
            v-else
            outline
            class="w-[174px] h-[49px] !rounded-[90px] !text-[14px]"
            @click="logOutPopup = !logOutPopup"
            @mouseover="hoverIcon = true"
            @mouseleave="hoverIcon = false"
          >
            {{ walletLabel }}
            <div v-if="logOutPopup">
              <ArrowUp v-if="hoverIcon" class="ml-2" stroke="#000000" />
              <ArrowUp v-else class="ml-2" stroke="#FFFFFF" />
            </div>
            <div v-else>
              <ArrowDown v-if="hoverIcon" class="ml-2" stroke="#000000" />
              <ArrowDown v-else class="ml-2" stroke="#FFFFFF" />
            </div>
          </GButton>
        </div>
        <AccountDropdown
          v-if="sm"
          :visible="logOutPopup"
          @updateVisible="updateVisible"
          class="top-[13px] right-[15px]"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import GButton from '@/components/gotbit-ui-kit/GButton.vue'
import AccountDropdown from '@/components/main/AccountDropDown.vue'
import ArrowDown from '@/components/gotbit-ui-kit/icons/ArrowDownIcon.vue'
import ArrowUp from '@/components/gotbit-ui-kit/icons/ArrowUpIcon.vue'
import WrongNetwork from '@/components/gotbit-ui-kit/icons/WrongNetwork.vue'
import BurgerMenu from '@/components/gotbit-ui-kit/icons/BurgerMenu.vue'
import BaseInputSelect from '@/components/base/InputSelect.vue'

import { useWallet, useWeb3 } from '@/gotbit-tools/vue'
import { useDialogs } from '@/store/ui/dialogs'
import { useMedia } from '@/composables'
import { useWindowScroll } from '@vueuse/core'

const dialogs = useDialogs()

const { walletLabel, login, chainId, realChainId } = useWallet()
const web3 = useWeb3()
const { sm } = useMedia()

const isColor = ref(false)
const logOutPopup = ref(false)
const hover = ref(false)
const hoverIcon = ref(false)
const rounds = ref([
  { value: 'seed', label: 'Seed round' },
  { value: 'private', label: 'Private round' },
  { value: 'public', label: 'Public round', route: ' ' },
])
const model = ref('public')

const { y } = useWindowScroll()

const updateVisible = (newValue: boolean) => {
  logOutPopup.value = newValue
}

watch(
  () => y.value,
  (value) => {
    if (value > 100) {
      isColor.value = true
    } else isColor.value = false
  },
)
</script>
