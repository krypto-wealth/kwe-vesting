import { Metamask } from './metamask'
import { Walletconnect } from './walletconnect'
import { CoinBase } from './coinbase'
import { Native } from './native'
import { TrustWallet } from './trustwallet'

export const registerWallets = {
  metamask: Metamask,
  walletconnect: Walletconnect,
  coinbase: CoinBase,
  native: Native,
  trustwallet: TrustWallet,
}

export default { Metamask, Walletconnect, CoinBase, Native, TrustWallet }
