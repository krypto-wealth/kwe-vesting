<script setup lang="ts">
import GButton from '@/components/gotbit-ui-kit/GButton.vue'
import MetamaskIcon from '@/components/gotbit-ui-kit/icons/MetamaskIcon.vue'
import WalletconnectIcon from '@/components/gotbit-ui-kit/icons/WalletconnectIcon.vue'
import TrustWalletIcon from '@/components/gotbit-ui-kit/icons/TrustWalletIcon.vue'

import { useDialogs } from '@/store/ui/dialogs'
import { useWeb3, useWallet } from '@/gotbit-tools/vue'
import { useMedia } from '@/composables'

const web3 = useWeb3()
const { sm } = useMedia()
const dialogsStore = useDialogs()
const {
  connectTrustWallet,
  connectMetamask,
  connectWalletconnect,
  wallet,
  walletLabel,
  login,
  globalLoading,
  chainId,
} = useWallet()
console.log(
  44444,
  wallet.value,
  walletLabel.value,
  login.value,
  globalLoading.value,
  chainId.value,
)

const connect = (wallet: Parameters<typeof web3.connect>[0]) => {
  switch (wallet) {
    case 'metamask':
      connectMetamask()
      break
    case 'walletconnect':
      connectWalletconnect()
      break
    case 'trustwallet':
      connectTrustWallet()
  }

  dialogsStore.closeCurrentDialog()
}
</script>

<template>
  <div class="connect-dialog w-[311px] md:w-[450px] p-1">
    <div class="title">
      <div class="connect-title text-[27px] md:text-[32px] text-white">
        Connect wallet
      </div>
      <div class="mt-2 text-sm small-text md:text-base text-[#BDBDBD]">
        Choose your wallet provider to access more functionality
      </div>
    </div>
    <div class="connect-buttons mt-[24px] md:mt-[32px] text-[15px] font-semibold">
      <GButton
        secondary
        class="w-full md:w-[340px] h-[50px]"
        @click="connect('metamask')"
      >
        <MetamaskIcon class="mr-1" />
        MetaMask
      </GButton>
      <GButton
        secondary
        class="w-full md:w-[340px] h-[50px]"
        @click="connect('walletconnect')"
      >
        <WalletconnectIcon class="mr-1" />WalletConnect</GButton
      >
      <GButton
        v-if="!sm"
        secondary
        class="w-full md:w-[340px] h-[50px]"
        @click="connect('trustwallet')"
      >
        <TrustWalletIcon class="mr-1" />Trust Wallet</GButton
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/config.scss';

.connect-dialog {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
}

.small-text {
  font-style: normal;
  font-weight: 400;
  text-align: center;
  letter-spacing: -0.5px;
  font-feature-settings:
    'pnum' on,
    'lnum' on;
}

.connect-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.connect-title {
  font-family: 'FONTSPRING DEMO - Nekst';
}
</style>
