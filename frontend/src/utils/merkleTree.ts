import { ethers } from 'ethers'

export const defaultHash = ethers.utils.keccak256

export function pairSorted(a: string, b: string, hash = defaultHash): string {
  return hash(
    ethers.utils.defaultAbiCoder.encode(['bytes32', 'bytes32'], a < b ? [a, b] : [b, a]),
  )
}

export function calculateNewLeaves(leaves: string[], hash = defaultHash): string[] {
  leaves = evenLeaves(leaves)
  const newLeaves = [] as string[]
  for (let i = 0; i < leaves.length / 2; i++) {
    newLeaves.push(pairSorted(leaves[2 * i], leaves[2 * i + 1], hash))
  }
  return newLeaves
}

export function evenLeaves(leaves: string[]): string[] {
  if (leaves.length % 2 !== 0) return [...leaves, leaves[leaves.length - 1]]
  return leaves
}

export function calculateRoot(leaves: string[], hash = defaultHash): string {
  if (leaves.length === 1) return leaves[0]
  return calculateRoot(calculateNewLeaves(leaves))
}

export function generateProof(
  leaves: string[],
  leaf: string,
  hash = defaultHash,
): string[] {
  const proof = [] as string[]
  let index = leaves.indexOf(leaf)

  while (leaves.length > 1) {
    leaves = evenLeaves(leaves)

    if (index % 2 === 0) proof.push(leaves[index + 1])
    else proof.push(leaves[index - 1])

    leaves = calculateNewLeaves(leaves, hash)
    index = Math.floor(index / 2)
  }

  return proof
}

export function verify(
  proof: string[],
  root: string,
  leaf: string,
  hash = defaultHash,
): boolean {
  let result = leaf
  for (const proofEl of proof) result = pairSorted(result, proofEl, hash)
  return result === root
}

export function convertToLeaves(data: any[], hash = defaultHash): string[] {
  return data.map((e) => hash(e))
}

export default {
  pair: pairSorted,
  verify,
  calculateRoot,
  generateProof,
  evenLeaves,
  convertToLeaves,
}
