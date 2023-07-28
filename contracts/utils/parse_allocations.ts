import { ethers } from 'ethers'

export type User = [string[], string]

export const toLeaves = (users: User[]) =>
  users.map((u) =>
    ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(['uint[]', 'address'], u))
  )
