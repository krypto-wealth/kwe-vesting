import { ethers, time } from 'hardhat'
import { BigNumber, BigNumberish, Contract } from 'ethers'

import {
    createDateRounds,
    createRounds,
    createAdvancedRounds,
    DAY,
    deploy,
    FractionJS,
    getNewSetupedVesting,
    now,
    Round,
    useContracts,
    useContractsFactory,
    WEEK,
    MINUTE,
} from '@/test'
import { expect } from 'chai'
import { toLeaves, User } from '@/utils/parse_allocations'
import { calculateRoot, generateProof } from '@/utils/merkle'
import allocations from '@/configs/allocations.json'
import {
    addSigner,
    randomAddress,
    removeSigner,
    useSigner,
    sleep,
    sleepTo,
    epsEqual,
} from '@/utils/helper'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Token, Vesting__factory } from '@/typechain'
import { aleaRNGFactory } from 'number-generator'
import { keccak256 } from '@ethersproject/keccak256'
import { toUtf8Bytes } from '@ethersproject/strings'

const roundsNames = [
    'Play and Earn',
    'Staking Rewards',
    'Advisors',
    'Affiliates & referrals',
]

const ERROR = {
    NOT_OWNER: 'Ownable: caller is not the owner',
    NOT_STARTED: 'NotStarted()',
    INITIALIZED: 'AlreadyInitialized()',
    ZERO_CLAIM: 'ZeroClaim()',
    WRONG_PROOF: 'WrongProof()',
    INVALID_VALUE: 'InvalidValue()',
    INVALID_STATE: 'InvalidState()',
    INVALID_LENGTH: 'InvalidLength()',
    ALREADY_STARTED: 'AlreadyStarted()',
    ALREADY_INITIALIZED: 'Initializable: contract is already initialized',
    ERC20_BALANCE: 'ERC20: transfer amount exceeds balance',
    ERC20_ADDRESS: 'ERC20: transfer to the zero address',
}

const seed = 2023
const { uInt32 } = aleaRNGFactory(2023)

const seedNumber = (min: number, max: number) => {
    return (min + uInt32()) % max
}

const seedUint4 = () => {
    return seedNumber(0, 2 ** 4 - 1)
}

const seedAddress = () => {
    let addr = '0x'
    for (let i = 0; i < 40; ++i) {
        addr += seedUint4().toString(16) // hex value of uint8
    }
    return addr
}

const generateAllocations = () => {
    const usersLen = seedNumber(1, 10)
    let users = []
    let allocations: BigNumberish[][] = []
    let roundsLen = 4
    for (let i = 0; i < usersLen; ++i) {
        users.push(seedAddress())
        let roundAllocations: BigNumberish[] = []
        for (let j = 0; j < roundsLen; ++j) {
            roundAllocations.push(
                BigNumber.from(seedNumber(0, 10 ** 10)).mul(10 ** 14)
            )
        }
        allocations.push(roundAllocations)
    }

    return { allocations, users }
}

describe('Vesting Property Test', () => {
    let vesting: Contract
    let startTimestamp: number
    let dateRounds: Round[]
    let owner: SignerWithAddress
    let vestingFactory: Vesting__factory
    let token: Token
    let root: any
    let leaves: any
    let usersArray: string[]
    let allocations: User[]

    beforeEach(async () => {
        await deploy()
        ;[owner] = await ethers.getSigners()

        const { vestingFactory: vestingFactory_ } = await useContractsFactory()
        vestingFactory = vestingFactory_

        const { token: token_ } = await useContracts()
        token = token_

        vesting = await vestingFactory.deploy(token.address, owner.address)
        await vesting.deployed()

        startTimestamp =
            (
                await ethers.provider.getBlock(
                    await ethers.provider.getBlockNumber()
                )
            ).timestamp + 1000

        dateRounds = createDateRounds(roundsNames, startTimestamp)

        let res = generateAllocations()
        allocations = []
        usersArray = res.users
        for (let k = 0; k < res.allocations.length; ++k) {
            let newUser: User = [res.allocations[k] as string[], usersArray[k]]
            allocations.push(newUser)
        }
        leaves = toLeaves(allocations as User[])
        root = calculateRoot(leaves)
    })
    describe('initialization with randomised allocations', () => {
        it('should init correctly', async () => {
            await expect(
                vesting
                    .connect(owner)
                    .init(startTimestamp, 'leaves', root, dateRounds)
            ).to.not.be.reverted
        })
    })

    describe('claimSingle with randomised allocations', () => {
        it('should let claim tokens from each single round (no token tx fee)', async () => {
            let userId = seedNumber(0, usersArray.length)
            let roundId = seedNumber(0, roundsNames.length)
            let amount = allocations[userId][0][roundId]
            const proof = generateProof(leaves, leaves[userId])

            const { vesting: newVesting, token: newToken } =
                await getNewSetupedVesting(startTimestamp, root, dateRounds)

            // supply more than enough tokens to vesting contract
            await newToken.transfer(
                newVesting.address,
                BigNumber.from(10).pow(30)
            )

            let startTimestampLast = BigNumber.from(
                dateRounds[roundId].periods[
                    dateRounds[roundId].periods.length - 1
                ].startTimestamp
            )
            let durationLast = BigNumber.from(
                dateRounds[roundId].periods[
                    dateRounds[roundId].periods.length - 1
                ].duration
            )

            let vestingAllocations = allocations[userId][0].map((x: string) =>
                BigNumber.from(x)
            )

            await sleepTo(startTimestampLast.add(durationLast).add(1))
            let balanceBefore = await newToken.balanceOf(usersArray[userId])
            await useSigner(usersArray[userId], async (s) => {
                await expect(
                    newVesting
                        .connect(s)
                        .claimSingle(roundId, vestingAllocations, proof, amount)
                ).to.emit(newVesting, 'Claim')
            })
            let balanceAfter = await newToken.balanceOf(usersArray[userId])

            expect(balanceAfter.sub(balanceBefore)).to.eq(amount)
        })

        it('should let claim tokens partially if round has hot finished', async () => {
            let userId = seedNumber(0, usersArray.length)
            let roundId = seedNumber(0, roundsNames.length)
            let amount = allocations[userId][0][roundId]
            const proof = generateProof(leaves, leaves[userId])

            const { vesting: newVesting, token: newToken } =
                await getNewSetupedVesting(startTimestamp, root, dateRounds)

            // supply more than enough tokens to vesting contract
            await newToken.transfer(
                newVesting.address,
                BigNumber.from(10).pow(30)
            )

            let index = seedNumber(0, dateRounds[roundId].periods.length)
            let startTimestampCur = BigNumber.from(
                dateRounds[roundId].periods[index].startTimestamp
            )
            let durationCur = BigNumber.from(
                dateRounds[roundId].periods[index].duration
            )

            let sumWeight = BigNumber.from(0)
            for (let i = 0; i < index + 1; ++i) {
                sumWeight = sumWeight.add(
                    dateRounds[roundId].periods[i].percentageD
                )
            }

            let vestingAllocations = allocations[userId][0].map((x: string) =>
                BigNumber.from(x)
            )

            await sleepTo(startTimestampCur.add(durationCur).add(1))

            let balanceBefore = await newToken.balanceOf(usersArray[userId])
            await useSigner(usersArray[userId], async (s) => {
                await expect(
                    newVesting
                        .connect(s)
                        .claimSingle(
                            roundId,
                            vestingAllocations,
                            proof,
                            BigNumber.from(2).pow(256).sub(1)
                        )
                ).to.emit(newVesting, 'Claim')
            })
            let balanceAfter = await newToken.balanceOf(usersArray[userId])

            expect(
                epsEqual(
                    balanceAfter.sub(balanceBefore),
                    sumWeight.mul(amount).div(BigNumber.from(10).pow(20))
                )
            ).to.be.true
        })
    })

    describe('claimAll with randomised allocations', () => {
        it('should let claim tokens from all rounds (no token tx fee)', async () => {
            let userId = seedNumber(0, usersArray.length)
            let amounts = allocations[userId][0]
            const proof = generateProof(leaves, leaves[userId])

            const { vesting: newVesting, token: newToken } =
                await getNewSetupedVesting(startTimestamp, root, dateRounds)

            // supply more than enough tokens to vesting contract
            await newToken.transfer(
                newVesting.address,
                BigNumber.from(10).pow(30)
            )

            let amount = BigNumber.from(0)
            let timestampLatestEnd = BigNumber.from(0)

            for (
                let roundId = 0;
                roundId < allocations[userId][0].length;
                ++roundId
            ) {
                let startTimestampLast = BigNumber.from(
                    dateRounds[roundId].periods[
                        dateRounds[roundId].periods.length - 1
                    ].startTimestamp
                )
                let durationLast = BigNumber.from(
                    dateRounds[roundId].periods[
                        dateRounds[roundId].periods.length - 1
                    ].duration
                )
                let timestampLatestEndCurrent =
                    startTimestampLast.add(durationLast)

                if (timestampLatestEndCurrent.gt(timestampLatestEnd)) {
                    timestampLatestEnd = timestampLatestEndCurrent
                }

                amount = amount.add(amounts[roundId])
            }

            let vestingAllocations = allocations[userId][0].map((x: string) =>
                BigNumber.from(x)
            )

            await sleepTo(timestampLatestEnd.add(1))
            let balanceBefore = await newToken.balanceOf(usersArray[userId])
            await useSigner(usersArray[userId], async (s) => {
                await expect(
                    newVesting
                        .connect(s)
                        .claimAll(vestingAllocations, proof, amount)
                ).to.emit(newVesting, 'Claim')
            })
            let balanceAfter = await newToken.balanceOf(usersArray[userId])

            expect(balanceAfter.sub(balanceBefore)).to.eq(amount)
        })
    })
})
