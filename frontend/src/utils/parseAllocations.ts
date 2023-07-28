import { safeRead, useWeb3 } from '@/gotbit-tools/vue'
import axios from 'axios'
import { ethers } from 'ethers'

export type User = [string[], string]

export const toLeaves = (users: User[]) =>
  users.map((u) =>
    ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['uint[]', 'address'], u)),
  )

export const getLeaves = async (leavesUrl: string) => {
  const web3 = useWeb3()

  const leavesRaw: User[] | null = (await safeRead(axios.get(leavesUrl), null))?.data

  if (!leavesRaw) return null

  const userIndex = leavesRaw.map((leaf) => leaf[1]).indexOf(web3.wallet)

  const leaves = toLeaves(leavesRaw)

  if (userIndex === -1) return null

  return {
    leavesRaw, // data leaves
    leaves, // hashed leaves
    userIndex, // index in leaves
  }
}
