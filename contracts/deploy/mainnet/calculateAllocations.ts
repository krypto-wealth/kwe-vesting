import { BigNumberish } from 'ethers'
import type { DeployFunction } from 'hardhat-deploy/types'
import { wrapperHRE } from '@/gotbit-tools/hardhat'
import { ethers } from 'hardhat'
import { Presale } from '@/typechain'
import fs from 'fs'

const ROUNDS_LENGTH = 9
const ALLOCATIONS_PATH = '././configs/mainnet_allocations.json'
const MULTIPLIER = '1'.toBigNumber(12)
const FROM_BLOCK = 17721707 // eth mainnet contract creation block
// const PRESALE_DURATION_IN_BLOCKS = 95099 // block mined every 12 seconds
// const TO_BLOCK = FROM_BLOCK + PRESALE_DURATION_IN_BLOCKS // last supposed block

const TO_BLOCK = 17735327 // last supposed block

const func: DeployFunction = async (hre) => {
    const { deploy } = wrapperHRE(hre)
    const [deployer] = await ethers.getSigners()

    const presale = (await ethers.getContract('Presale')) as Presale

    const filter = presale.filters.Invested(null, null, null)

    let promises = []

    // packing events promises
    for (let i = 0; i < (TO_BLOCK - FROM_BLOCK) / 1000; ++i) {
        promises.push(
            presale.queryFilter(
                filter,
                FROM_BLOCK + i * 1000,
                FROM_BLOCK + (i + 1) * 1000
            )
        )
    }

    console.log('awaiting events...', promises.length)
    let allPromise = await Promise.all(promises)

    // erasing last empty elements
    for (let i = 1; i < allPromise.length; ++i) {
        if (allPromise[allPromise.length - i].length == 0) allPromise.pop()
        else break
    }

    // erasing empty elements from array
    // works only if the last element is not empty
    for (let i = 0; i < allPromise.length; ++i)
        if (allPromise[i].length == 0) {
            allPromise[i] = allPromise[allPromise.length - 1]
            allPromise.pop()
        }

    console.log(allPromise.length)

    // initializing users
    let users = []
    let userExists: { [key: string]: boolean }
    userExists = { ['init']: false }

    // packing users array only one addition for each address
    for (let i = 0; i < allPromise.length; ++i)
        for (let j = 0; j < allPromise[i].length; ++j)
            if (!userExists[allPromise[i][j].args.investor]) {
                userExists[allPromise[i][j].args.investor] = true
                users.push(allPromise[i][j].args.investor)
            }

    console.log('users', users)
    console.log('users', users.length)

    let allocsPromises = []

    // packing allocations promises
    for (let i = 0; i < users.length; ++i)
        allocsPromises.push(presale.getUserAllocations(users[i]))

    console.log('awaiting allocations promises')
    let awaitedPromises = (await Promise.all(
        allocsPromises
    )) as BigNumberish[][]

    let allocations = [] as string[][]

    // packing allocations array including empty alloc rounds and taking account of decimals multiplier
    for (let i = 0; i < awaitedPromises.length; ++i) {
        allocations.push([])
        for (let j = 0; j < ROUNDS_LENGTH; ++j) {
            if (j >= awaitedPromises[i].length - 1) allocations[i].push('0')
            else
                allocations[i].push(
                    MULTIPLIER.mul(awaitedPromises[i][j]).toString()
                )
        }
    }

    let finalAllocations = [] as [string[], string][]

    // packing final allocs to write to allocs file
    for (let i = 0; i < allocations.length; ++i)
        finalAllocations.push([allocations[i], users[i]])

    fs.writeFileSync(ALLOCATIONS_PATH, JSON.stringify(finalAllocations))
}
export default func

func.tags = ['GetAllocations']
