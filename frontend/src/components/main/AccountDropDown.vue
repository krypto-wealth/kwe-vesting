<template>
  <div
    :menu="props.menu"
    v-if="props.visible"
    class="absolute sm:top-[69px] sm:right-[82px] shadow-2xl rounded-none sm:rounded-[15px] min-h-[50px] w-[100vw] sm:w-full"
  >
    <div
      class="dropdown right-[-27px] top-[-36px] sm:top-0 sm:right-0 sm:w-[221px] p-[26px] border !border-[#03e287] sm:border-none text-white flex flex-col items-center justify-between rounded-none sm:rounded-[20px] sm:p-6 sm:pb-9"
    >
      <div class="flex w-full self-start mb-6 items-center justify-between" v-if="sm">
        <img src="../../assets/img/logo.svg" alt="" />
        <CloseIcon
          color="#ffffff"
          size="36"
          class="mb-3 flex items-center cursor-pointer"
          @click="changePropValue"
        />
      </div>
      <nav class="w-[210px] text-[20px] flex items-start justify-between text-white">
        <div>
          <p class="mb-4 sm:hidden flex items-center" @click="presale = !presale">
            <span>Presale</span>
            <IconsArrowUp v-if="presale" class="ml-2" stroke="#03e287" />
            <IconsArrowDown v-else class="ml-2" stroke="#03e287" />
          </p>

          <div
            v-if="presale"
            class="text-[15px] flex flex-col gap-4 transition duration-300"
          >
            <a
              href="https://gotbit-kwe-presale-frontend-qa.test.gotbit.app/seed"
              :class="
                unref(router.currentRoute).fullPath === '/seed'
                  ? 'text-[#03e287]'
                  : 'text-white text-opacity-60 hover:text-opacity-100'
              "
              >Seed Round</a
            >
            <a
              href="https://gotbit-kwe-presale-frontend-qa.test.gotbit.app/private"
              :class="
                unref(router.currentRoute).fullPath === '/private'
                  ? 'text-[#03e287]'
                  : 'text-white text-opacity-60 hover:text-opacity-100'
              "
              >Private Round</a
            >
            <a
              href="https://gotbit-kwe-presale-frontend-qa.test.gotbit.app/"
              :class="
                unref(router.currentRoute).fullPath === '/'
                  ? 'text-[#03e287]'
                  : 'text-white text-opacity-60 hover:text-opacity-100'
              "
              >Public Round</a
            >
          </div>
        </div>
        <router-link to="/vesting" class="sm:hidden text-[#03e287]">Vesting</router-link>
      </nav>
      <div class="w-full flex items-baseline justify-between" v-if="login">
        <div class="flex flex-col">
          <div class="flex items-center gap-[7px] mb-[8px] sm:mb-[4px]">
            <WalletType />
            <span class="text-[#949494] font-semibold text-[11px]">{{
              `${walletType?.charAt(0).toUpperCase()}${walletType?.slice(1)}`
            }}</span>
          </div>
          <span
            class="text-[15px]"
            :class="{
              'text-main-text': copyHover,
            }"
          >
            {{ walletLabel }}
          </span>
        </div>
        <div class="flex flex-col">
          <div v-if="sm" class="flex items-center gap-[4px] cursor-pointer">
            <CopyIcon :size="sm ? '24px' : '16px'" @click.stop="copyText()" />
            <span v-if="copied" v-auto-animate class="copied text-[15px] sm:text-[11px]"
              >Copy</span
            >
            <span v-if="!copied" class="text-[15px] sm:text-[11px]">Copy</span>
          </div>
          <div
            v-if="!sm"
            class="hidden sm:flex items-center gap-[4px] mt-[8px] cursor-pointer"
          >
            <CopyIcon :size="sm ? '24px' : '20px'" @click.stop="copyText()" />

            <span v-if="copied" v-auto-animate class="copied text-[15px] sm:text-[11px]"
              >Copy</span
            >
            <span v-if="!copied" class="text-[15px] sm:text-[11px]">Copy</span>
          </div>

          <div class="flex items-center gap-[4px] cursor-pointer mt-[8px]">
            <a
              :href="scannersLink.getAddress(web3.chainId, web3.wallet)"
              target="_blank"
              class="flex items-center gap-[4px]"
            >
              <ViewIcon :size="sm ? '24' : '16'" />
              <span class="text-[15px] sm:text-[11px]">View</span>
            </a>
          </div>
        </div>
      </div>
      <div class="w-full" v-if="login">
        <div class="h-[1px] w-[215px] sm:w-[112px] bg-main-text mt-[16px]"></div>
        <span
          class="w-full text-[#949494] text-main-card-text text-start mt-2 sm:mt-[16px] text-[11px]"
        >
          Your network is:
        </span>
        <div
          class="w-full bg-main p-[16px] rounded-[8px] h-[40px] sm:w-full flex items-center gap-[12px] mt-[8px] bg-[#03e28714]"
          v-if="realChainId === chainId"
        >
          <div class="text-start text-[10px] leading-[15px] w-[90%] sm:w-[60%]">
            <div>
              <div class="flex items-center mr-1">
                <!-- <EthereumIcon /> -->
                <span class="text-white text-[12px] ml-2">
                  {{ getChainDescription(realChainId).name }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          @click="web3.switchChain(chainId)"
          :class="sm ? 'border-none' : 'border'"
          class="text-[#DE2366] cursor-pointer border-[#DE2366] rounded-[12px] h-[50px] w-full sm:w-full flex items-center justify-center gap-[12px] mt-[8px]"
        >
          <div
            class="wrong-network w-full h-[50px] sm:bg-transparent bg-[#DE23663D] flex items-center px-[17px] py-[13px] rounded-[8px]"
          >
            <WrongNetwork />
            <p class="text-[10px] text-[#DE2366] w-full ml-[13px]">
              An unsupported network is selected
            </p>
          </div>
        </div>
      </div>
      <div class="w-full text-white mt-[16px]" v-if="login">
        <div class="flex justify-between w-full">
          <div
            class="text-[15px] sm:text-[12px] font-semibold flex justify-between w-full"
          >
            <p>ETH:</p>
            <p>{{ formatBigNums(+balances) }} {{ symbol }}</p>
          </div>
        </div>
      </div>
      <GButton
        primary
        @click="login ? disconnect() : dialogs.openDialog('connectDialog', {})"
        class="mt-[24px] mb-[14px] sm:mb-[0] text-[14px] sm:text-[12px] font-bold w-full h-[50px] sm:w-[171px] sm:h-[37px]"
      >
        {{ login ? 'Disconnect' : 'Connect wallet' }}
      </GButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import GButton from '@/components/gotbit-ui-kit/GButton.vue'
import CopyIcon from '@/components/gotbit-ui-kit/icons/CopyIcon.vue'
import ViewIcon from '@/components/gotbit-ui-kit/icons/ViewIcon.vue'
import EthereumIcon from '@/components/gotbit-ui-kit/icons/Ethereun.vue'
import WalletType from '@/components/base/WalletTypeIcons.vue'
import CloseIcon from '@/components//gotbit-ui-kit/icons/CloseIcon.vue'
import WrongNetwork from '@/components/gotbit-ui-kit/icons/WrongNetwork.vue'

import { useClipboard } from '@vueuse/core'
import { useWallet, useWeb3, getChainDescription } from '@/gotbit-tools/vue'
import { ref, computed, unref } from 'vue'
import { useMedia } from '@/composables'
import { formatBigNums } from '@/misc/utils'
import { scannersLink } from '@/gotbit-tools/vue'
import { useTokenData } from '@/store/data/token'
import { useRouter } from 'vue-router'
import { useDialogs } from '@/store/ui/dialogs'

const router = useRouter()

const { walletType } = useWeb3()
const { walletLabel, disconnect, realChainId, chainId } = useWallet()
const tokenData = useTokenData()
const { login } = useWallet()
const dialogs = useDialogs()

interface DropdownProps {
  visible: boolean
  menu?: boolean
}

const props = defineProps<DropdownProps>()
const web3 = useWeb3()
const clipboard = useClipboard()
const { sm } = useMedia()
const symbol = computed(() => tokenData.symbol())

const balances = computed(() => tokenData.balance())

const copied = ref(false)
const presale = ref(false)
const copyHover = ref(false)

const emit = defineEmits(['updateVisible'])

const changePropValue = () => {
  const newValue = !props.visible
  emit('updateVisible', newValue)
}

const copyText = async () => {
  copyHover.value = true
  await clipboard.copy(web3.wallet)
  copied.value = true
  copyHover.value = false
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<style scoped lang="scss">
@import '@/assets/config.scss';

.copied {
  font-weight: 600;
  z-index: 10;
  color: $primary-color;
}

.dropdown {
  background: rgba(20, 20, 20, 0.7);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  z-index: 100;
}

.dropdown-adaptive {
  position: relative;
  width: 100vw !important;
}
</style>
