import { ethers, network, time } from 'hardhat'
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

describe('Vesting Unit Test', () => {
    const parsedAlloc = allocations as string[][][]
    const leaves = toLeaves(allocations as User[])
    const root = calculateRoot(leaves)

    beforeEach(async () => {
        await deploy()
    })

    describe('constructor', () => {
        it('creates new Vesting contract', async () => {
            const [owner] = await ethers.getSigners()
            const factory = await ethers.getContractFactory('Vesting')
            const { token } = await useContracts()

            const vesting = await factory.deploy(token.address, owner.address)

            await vesting.deployed()

            expect(vesting.address).to.not.eq(ethers.constants.AddressZero)
        })
    })

    describe('init', () => {
        let vesting: Contract
        let startTimestamp: number
        let dateRounds: Round[]
        let owner: SignerWithAddress
        let vestingFactory: Vesting__factory
        let token: Token

        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()

            const { vestingFactory: vestingFactory_ } =
                await useContractsFactory()
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
        })
        it('initializes startTimestamp, rool, leaves, rounds and periods and emits InitializedVesting event', async () => {
            await expect(
                vesting
                    .connect(owner)
                    .init(startTimestamp, 'leaves', root, dateRounds)
            ).to.emit(vesting, 'InitializedVesting')

            expect(
                await vesting.startTimestamp(),
                'Expected started timestamp to be correct'
            ).eq(startTimestamp)
            expect(await vesting.ROOT(), 'Expected root to be correct').eq(root)
            expect(
                await vesting.getAllocations(),
                'Expect link to be correct'
            ).eq('leaves')

            const rounds: Round[] = await vesting.getRounds()

            for (let id = 0; id < rounds.length; ++id) {
                expect(rounds[id].name).eq(dateRounds[id].name)
                for (let i = 0; i < dateRounds[id].periods.length; i++) {
                    expect(rounds[id].name).to.eq(dateRounds[id].name)
                    for (let j = 0; j < rounds[id].periods.length; ++j) {
                        expect(rounds[id].periods[j].startTimestamp).to.deep.eq(
                            dateRounds[id].periods[j].startTimestamp
                        )
                        expect(rounds[id].periods[j].duration).to.deep.eq(
                            dateRounds[id].periods[j].duration
                        )
                        expect(rounds[id].periods[j].linearUnits).to.deep.eq(
                            dateRounds[id].periods[j].linearUnits
                        )
                        expect(rounds[id].periods[j].percentageD).to.deep.eq(
                            dateRounds[id].periods[j].percentageD
                        )
                    }
                }
            }
        })

        describe('access control', () => {
            it('allowed: only owner', async () => {
                await expect(
                    vesting
                        .connect(owner)
                        .init(startTimestamp, 'leaves', root, dateRounds)
                ).to.not.be.reverted
            })

            it(`not allowed: any other address. reverts with '${ERROR.NOT_OWNER}'`, async () => {
                await useSigner(randomAddress(), async (signer) => {
                    await expect(
                        vesting
                            .connect(signer)
                            .init(startTimestamp, 'leaves', root, dateRounds)
                    ).to.be.revertedWith(ERROR.NOT_OWNER)
                })
            })
        })

        describe('edge cases', () => {
            describe('when contract already initialized', () => {
                it(`reverts with '${ERROR.ALREADY_INITIALIZED}'`, async () => {
                    await expect(
                        vesting
                            .connect(owner)
                            .init(startTimestamp, 'leaves', root, dateRounds)
                    ).to.not.be.reverted

                    await expect(
                        vesting
                            .connect(owner)
                            .init(startTimestamp, 'leaves', root, dateRounds)
                    ).to.be.revertedWith(ERROR.ALREADY_INITIALIZED)
                })
            })

            describe('when startTimestamp == 0 or startTimestamp < block.timestamp', () => {
                it(`reverts with '${ERROR.INVALID_VALUE}'`, async () => {
                    const startTimestampTooEaerly =
                        (
                            await ethers.provider.getBlock(
                                await ethers.provider.getBlockNumber()
                            )
                        ).timestamp - MINUTE

                    const startTimestampZero = 0

                    await expect(
                        vesting
                            .connect(owner)
                            .init(startTimestampZero, 'leaves', root, [])
                    ).to.be.revertedWith(ERROR.INVALID_VALUE)

                    await expect(
                        vesting
                            .connect(owner)
                            .init(startTimestampTooEaerly, 'leaves', root, [])
                    ).to.be.revertedWith(ERROR.INVALID_VALUE)
                })
            })

            describe('when rounds is an empty array', () => {
                it(`reverts with '${ERROR.INVALID_LENGTH}'`, async () => {
                    await expect(
                        vesting
                            .connect(owner)
                            .init(startTimestamp, 'leaves', root, [])
                    ).to.be.revertedWith(ERROR.INVALID_LENGTH)
                })
            })

            describe('when a round includes 0 periods', () => {
                it(`reverts with '${ERROR.INVALID_LENGTH}'`, async () => {
                    let dateRoundsWithEmptyPeriod = createDateRounds(
                        roundsNames,
                        startTimestamp
                    )

                    dateRoundsWithEmptyPeriod[
                        dateRoundsWithEmptyPeriod.length / 2
                    ].periods = []

                    await expect(
                        vesting
                            .connect(owner)
                            .init(
                                startTimestamp,
                                'leaves',
                                root,
                                dateRoundsWithEmptyPeriod
                            )
                    ).to.be.revertedWith(ERROR.INVALID_LENGTH)
                })
            })

            describe('when a next period start < previous period end (periods intersection)', () => {
                it(`reverts with '${ERROR.INVALID_VALUE}'`, async () => {
                    let dateRoundsWithPeriodsIntersection = createDateRounds(
                        roundsNames,
                        startTimestamp
                    )

                    const prevEnd = BigNumber.from(
                        dateRoundsWithPeriodsIntersection[0].periods[0]
                            .startTimestamp
                    ).add(
                        dateRoundsWithPeriodsIntersection[0].periods[0].duration
                    )

                    dateRoundsWithPeriodsIntersection[0].periods[1].startTimestamp =
                        prevEnd.sub(1)

                    await expect(
                        vesting
                            .connect(owner)
                            .init(
                                startTimestamp,
                                'leaves',
                                root,
                                dateRoundsWithPeriodsIntersection
                            )
                    ).to.be.revertedWith(ERROR.INVALID_VALUE)
                })
            })

            describe.skip('when percentage sum from all periods in a single round != 100', () => {
                it(`reverts with '${ERROR.INVALID_VALUE}'`, async () => {
                    let dateRoundsWithIncorrectPercentageSum = createDateRounds(
                        roundsNames,
                        startTimestamp
                    )

                    dateRoundsWithIncorrectPercentageSum[0].periods[0].percentageD =
                        BigNumber.from(
                            dateRoundsWithIncorrectPercentageSum[0].periods[0]
                                .percentageD
                        ).add(1)

                    await expect(
                        vesting
                            .connect(owner)
                            .init(
                                startTimestamp,
                                'leaves',
                                root,
                                dateRoundsWithIncorrectPercentageSum
                            )
                    ).to.be.revertedWith(ERROR.INVALID_VALUE)
                })
            })

            describe('when period unlocks > duration (duration > 0)', () => {
                it(`reverts with '${ERROR.INVALID_VALUE}'`, async () => {
                    let dateRoundsWithInvalidUnlocks = createDateRounds(
                        roundsNames,
                        startTimestamp
                    )

                    dateRoundsWithInvalidUnlocks[0].periods[1].duration =
                        BigNumber.from(
                            dateRoundsWithInvalidUnlocks[0].periods[1].duration
                        ).add(1)
                    dateRoundsWithInvalidUnlocks[0].periods[1].linearUnits =
                        BigNumber.from(
                            dateRoundsWithInvalidUnlocks[0].periods[1].duration
                        ).add(1)

                    await expect(
                        vesting
                            .connect(owner)
                            .init(
                                startTimestamp,
                                'leaves',
                                root,
                                dateRoundsWithInvalidUnlocks
                            )
                    ).to.be.revertedWith(ERROR.INVALID_VALUE)
                })
            })
        })
    })

    describe('getAllocations', () => {
        let vesting: Contract
        let startTimestamp: number
        let dateRounds: Round[]
        let owner: SignerWithAddress
        let vestingFactory: Vesting__factory
        let token: Token

        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()

            const { vestingFactory: vestingFactory_ } =
                await useContractsFactory()
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

            await vesting
                .connect(owner)
                .init(startTimestamp, 'leaves', root, dateRounds)
        })
        it('returns leaves of merkle tree (users` allocations)', async () => {
            expect(
                await vesting.getAllocations(),
                'Expect link to be correct'
            ).eq('leaves')
        })

        describe('access control', () => {
            it('allowed: any address', async () => {
                await useSigner(randomAddress(), async (s) => {
                    await expect(vesting.connect(s).getAllocations()).to.not.be
                        .reverted
                })
            })
        })

        describe('edge cases', () => {
            describe('if vesting is not initialized', () => {
                it('returns an empty string', async () => {
                    const vestingNotInit = await vestingFactory.deploy(
                        token.address,
                        owner.address
                    )
                    await vestingNotInit.deployed()

                    expect(await vestingNotInit.getAllocations()).to.equal('')
                })
            })
        })
    })

    describe('resetROOT', () => {
        let vesting: Contract
        let startTimestamp: number
        let dateRounds: Round[]
        let owner: SignerWithAddress
        let vestingFactory: Vesting__factory
        let token: Token
        let newRoot: string
        let newLeaves: string[]

        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()

            const { vestingFactory: vestingFactory_ } =
                await useContractsFactory()
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

            await vesting
                .connect(owner)
                .init(startTimestamp, 'leaves', root, dateRounds)

            newLeaves = toLeaves([
                allocations[allocations.length - 1],
            ] as User[])
            newRoot = calculateRoot(newLeaves)
        })
        it('resets merkle tree if allocations have changed', async () => {
            await expect(vesting.connect(owner).resetROOT(newRoot, 'newLeaves'))
                .to.not.be.reverted

            expect(await vesting.ROOT()).to.equal(newRoot)
            expect(await vesting.getAllocations()).to.equal('newLeaves')
        })

        describe('access control', () => {
            it('allowed: only owner', async () => {
                await expect(
                    vesting.connect(owner).resetROOT(newRoot, 'newLeaves')
                ).to.not.be.reverted
            })

            it(`not allowed: any address, reverts with '${ERROR.NOT_OWNER}'`, async () => {
                await useSigner(randomAddress(), async (s) => {
                    await expect(
                        vesting.connect(s).resetROOT(newRoot, 'newLeaves')
                    ).to.be.revertedWith(ERROR.NOT_OWNER)
                })
            })
        })
    })

    describe('withdraw', () => {
        let vesting: Contract
        let startTimestamp: number
        let dateRounds: Round[]
        let owner: SignerWithAddress
        let vestingFactory: Vesting__factory
        let token: Token
        let balanceTreasury: BigNumber

        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()

            const { vestingFactory: vestingFactory_ } =
                await useContractsFactory()
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

            await vesting
                .connect(owner)
                .init(startTimestamp, 'leaves', root, dateRounds)

            balanceTreasury = await token.balanceOf(vesting.address)
        })
        it('pulls tokens from vesting to the recipient', async () => {
            const user = randomAddress()
            const balanceBefore = await token.balanceOf(user)
            await expect(
                vesting
                    .connect(owner)
                    .withdraw(user, BigNumber.from(balanceTreasury))
            ).to.not.be.reverted

            const balanceAfter = await token.balanceOf(user)
            expect(balanceAfter.sub(balanceBefore)).to.equal(balanceTreasury)
        })

        describe('access control', () => {
            it('allowed: only owner', async () => {
                await expect(
                    vesting
                        .connect(owner)
                        .withdraw(randomAddress(), balanceTreasury)
                ).to.not.be.reverted
            })

            it(`not allowed: any other address, reverts with '${ERROR.NOT_OWNER}'`, async () => {
                await useSigner(randomAddress(), async (s) => {
                    await expect(
                        vesting
                            .connect(s)
                            .withdraw(randomAddress(), balanceTreasury)
                    ).to.be.revertedWith(ERROR.NOT_OWNER)
                })
            })
        })

        describe('edge cases', () => {
            describe('when required amount is greater than vesting contract balance', () => {
                it(`reverts with '${ERROR.ERC20_BALANCE}'`, async () => {
                    await expect(
                        vesting
                            .connect(owner)
                            .withdraw(randomAddress(), balanceTreasury.add(1))
                    ).to.be.revertedWith(ERROR.ERC20_BALANCE)
                })
            })

            describe('when recipient address is not valid', () => {
                it(`reverts with '${ERROR.ERC20_ADDRESS}'`, async () => {
                    await expect(
                        vesting
                            .connect(owner)
                            .withdraw(
                                ethers.constants.AddressZero,
                                balanceTreasury.add(1)
                            )
                    ).to.be.revertedWith(ERROR.ERC20_ADDRESS)
                })
            })
        })
    })

    describe('unlocked', () => {
        let vesting: Contract
        let startTimestamp: number
        let dateRounds: Round[]
        let owner: SignerWithAddress
        let vestingFactory: Vesting__factory
        let token: Token
        let users: SignerWithAddress[]

        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()
            users = await ethers.getSigners()

            const { vestingFactory: vestingFactory_ } =
                await useContractsFactory()
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

            await vesting
                .connect(owner)
                .init(startTimestamp, 'leaves', root, dateRounds)
        })

        it('shows the token amount which is free to be claimed by the user at the current moment', async () => {
            let roundId = 1
            let userId = 2
            let midIndex = 6
            let index_3_4 = 9
            let allocation = parsedAlloc[userId][0][roundId]

            let startTimestampMid = BigNumber.from(
                dateRounds[roundId].periods[midIndex].startTimestamp
            )
            let durationMid = BigNumber.from(
                dateRounds[roundId].periods[midIndex].duration
            )

            let startTimestampIndex = BigNumber.from(
                dateRounds[roundId].periods[index_3_4].startTimestamp
            )
            let durationIndex = BigNumber.from(
                dateRounds[roundId].periods[index_3_4].duration
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

            await sleepTo(dateRounds[roundId].periods[0].startTimestamp)
            expect(await vesting.unlocked(roundId, allocation)).to.be.eq(0)

            await sleepTo(startTimestampMid.add(durationMid).add(1))
            let realAmount = await vesting.unlocked(roundId, allocation)
            let expectedAmount = BigNumber.from(allocation).div(2)
            // realAmount ~ expectedAmount (abs diff < 10**-4)
            expect(epsEqual(realAmount, expectedAmount)).to.be.true

            await sleepTo(startTimestampIndex.add(durationIndex).add(1))
            realAmount = await vesting.unlocked(roundId, allocation)
            expectedAmount = BigNumber.from(allocation).mul(3).div(4)
            // realAmount ~ expectedAmount (abs diff < 10**-4)
            expect(epsEqual(realAmount, expectedAmount)).to.be.true

            await sleepTo(startTimestampLast.add(durationLast).add(1))
            expect(await vesting.unlocked(roundId, allocation)).to.be.eq(
                BigNumber.from(allocation)
            )
        })

        it('shows partial unlocked amount if a period has linUnlocks > 1 and period has not fully passed', async () => {
            let roundId = 1
            let userId = 2
            let periodId = 1
            const dateRoundsCustom = dateRounds
            dateRoundsCustom[roundId].periods[periodId].duration =
                BigNumber.from(19)
            dateRoundsCustom[roundId].periods[periodId].linearUnits =
                BigNumber.from(3)
            let allocation = allocations[userId][0][roundId]

            for (let i = 2; i < 12; ++i) {
                dateRoundsCustom[roundId].periods[i].startTimestamp =
                    BigNumber.from(
                        dateRoundsCustom[roundId].periods[i].startTimestamp
                    ).add(BigNumber.from(100))
            }

            const { vesting: newVesting } = await getNewSetupedVesting(
                startTimestamp,
                root,
                dateRoundsCustom
            )

            await sleepTo(
                dateRoundsCustom[roundId].periods[periodId].startTimestamp
            )

            expect(
                await newVesting
                    .connect(users[userId])
                    .unlocked(roundId, allocation)
            ).to.be.eq(
                BigNumber.from(allocation)
                    .mul(dateRoundsCustom[roundId].periods[0].percentageD)
                    .div(BigNumber.from(10).pow(20))
            )

            await sleepTo(
                BigNumber.from(
                    dateRoundsCustom[roundId].periods[periodId].startTimestamp
                ).add(
                    BigNumber.from(
                        dateRoundsCustom[roundId].periods[periodId].duration
                    ).div(3)
                )
            )
            expect(
                await newVesting
                    .connect(users[userId])
                    .unlocked(roundId, allocation)
            ).to.be.eq(
                BigNumber.from(allocation)
                    .mul(
                        BigNumber.from(
                            dateRoundsCustom[roundId].periods[0].percentageD
                        ).add(0)
                    )
                    .div(BigNumber.from(10).pow(20))
            )

            await sleepTo(
                BigNumber.from(
                    dateRoundsCustom[roundId].periods[periodId].startTimestamp
                ).add(
                    BigNumber.from(
                        dateRoundsCustom[roundId].periods[periodId].duration
                    )
                        .div(3)
                        .add(1)
                )
            )

            let expectedAmount = BigNumber.from(allocation)
                .mul(
                    BigNumber.from(
                        dateRoundsCustom[roundId].periods[0].percentageD
                    ).add(
                        BigNumber.from(
                            dateRoundsCustom[roundId].periods[1].percentageD
                        ).div(3)
                    )
                )
                .div(BigNumber.from(10).pow(20))
            expect(
                epsEqual(
                    await newVesting
                        .connect(users[userId])
                        .unlocked(roundId, allocation),
                    expectedAmount
                )
            ).to.be.true

            await sleepTo(
                BigNumber.from(
                    dateRoundsCustom[roundId].periods[periodId].startTimestamp
                )
                    .add(dateRoundsCustom[roundId].periods[periodId].duration)
                    .add(1)
            )

            expect(
                await newVesting
                    .connect(users[userId])
                    .unlocked(roundId, allocation)
            ).to.be.eq(
                BigNumber.from(allocation)
                    .mul(
                        BigNumber.from(
                            dateRoundsCustom[roundId].periods[0].percentageD
                        ).add(dateRoundsCustom[roundId].periods[1].percentageD)
                    )
                    .div(BigNumber.from(10).pow(20))
            )
        })

        describe('access control', () => {
            it('allowed: any address', async () => {
                await useSigner(randomAddress(), async (s) => {
                    let allocation = parsedAlloc[0][0][0]
                    await expect(vesting.connect(s).unlocked(0, allocation)).to
                        .not.be.reverted
                })
            })
        })
    })

    describe('claimSingle', () => {
        let startTimestamp: number
        let dateRounds: Round[]
        let owner: SignerWithAddress
        let users: SignerWithAddress[]
        let vestingAllocations: BigNumberish[]
        let roundId = 1
        let userId = 2
        let amount = parsedAlloc[userId][0][roundId]
        const proof = generateProof(leaves, leaves[userId])

        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()
            users = await ethers.getSigners()

            startTimestamp =
                (
                    await ethers.provider.getBlock(
                        await ethers.provider.getBlockNumber()
                    )
                ).timestamp + 1000

            dateRounds = createDateRounds(roundsNames, startTimestamp)

            vestingAllocations = parsedAlloc[userId][0].map((x: string) =>
                BigNumber.from(x)
            )
        })

        it('claims user`s tokens from a single vesting round and emits Claim event', async () => {
            let user = users[userId]
            const { vesting, token } = await getNewSetupedVesting(
                startTimestamp,
                root,
                dateRounds
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

            let balanceBeforeClaim = await token.balanceOf(user.address)
            await sleepTo(startTimestampLast.add(durationLast).add(1))
            await expect(
                vesting
                    .connect(user)
                    .claimSingle(roundId, vestingAllocations, proof, amount)
            ).to.emit(vesting, 'Claim')

            let balanceAfterClaim = await token.balanceOf(user.address)

            expect(balanceAfterClaim.sub(balanceBeforeClaim)).to.be.equal(
                amount
            )
        })

        describe('access control', () => {
            it('allowed: for users-leaves approved in merkle tree', async () => {
                const { vesting } = await getNewSetupedVesting(
                    startTimestamp,
                    root,
                    dateRounds
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

                await sleepTo(startTimestampLast.add(durationLast).add(1))

                await expect(
                    vesting
                        .connect(users[userId])
                        .claimSingle(roundId, vestingAllocations, proof, amount)
                ).to.not.be.reverted
            })

            it(`not allowed: any other address, reverts with ${ERROR.WRONG_PROOF}`, async () => {
                const { vesting } = await getNewSetupedVesting(
                    startTimestamp,
                    root,
                    dateRounds
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

                await sleepTo(startTimestampLast.add(durationLast).add(1))

                await useSigner(randomAddress(), async (s) => {
                    await expect(
                        vesting
                            .connect(s)
                            .claimSingle(
                                roundId,
                                vestingAllocations,
                                proof,
                                amount
                            )
                    ).to.be.revertedWith(ERROR.WRONG_PROOF)
                })
            })
        })

        describe('edge cases', () => {
            describe('when proof is wrong', () => {
                it(`reverts with '${ERROR.WRONG_PROOF}'`, async () => {
                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
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

                    await sleepTo(startTimestampLast.add(durationLast).add(1))
                    await expect(
                        vesting
                            .connect(users[userId])
                            .claimSingle(
                                roundId,
                                vestingAllocations,
                                generateProof(leaves, leaves[userId - 1]),
                                amount
                            )
                    ).to.be.revertedWith(ERROR.WRONG_PROOF)
                })
            })

            describe('when allocations array is incorect', () => {
                it(`reverts with '${ERROR.WRONG_PROOF}'`, async () => {
                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
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

                    let newVestingAllocations = parsedAlloc[userId - 1][0].map(
                        (x: string) => BigNumber.from(x)
                    )

                    await sleepTo(startTimestampLast.add(durationLast).add(1))
                    await expect(
                        vesting
                            .connect(users[userId])
                            .claimSingle(
                                roundId,
                                newVestingAllocations,
                                proof,
                                amount
                            )
                    ).to.be.revertedWith(ERROR.WRONG_PROOF)
                })
            })

            describe('when vesting has not started', () => {
                it(`reverts with '${ERROR.NOT_STARTED}'`, async () => {
                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
                    )

                    await expect(
                        vesting
                            .connect(users[0])
                            .claimSingle(
                                roundId,
                                vestingAllocations,
                                generateProof(leaves, leaves[1]),
                                amount
                            )
                    ).to.be.revertedWith(ERROR.NOT_STARTED)
                })
            })

            describe('when claim amount == 0', () => {
                it(`reverts with '${ERROR.ZERO_CLAIM}'`, async () => {
                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
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

                    await sleepTo(startTimestampLast.add(durationLast).add(1))
                    await expect(
                        vesting
                            .connect(users[userId])
                            .claimSingle(roundId, vestingAllocations, proof, 0)
                    ).to.be.revertedWith(ERROR.ZERO_CLAIM)
                })
            })
        })
    })

    describe('claimAll', () => {
        let startTimestamp: number
        let dateRounds: Round[]
        let owner: SignerWithAddress
        let users: SignerWithAddress[]
        let vestingAllocations: BigNumberish[]
        let userId = 1
        const proof = generateProof(leaves, leaves[userId])
        let timestampLatestEnd = BigNumber.from(0)
        let amount = BigNumber.from(0)

        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()
            users = await ethers.getSigners()

            startTimestamp =
                (
                    await ethers.provider.getBlock(
                        await ethers.provider.getBlockNumber()
                    )
                ).timestamp + 1000

            dateRounds = createDateRounds(roundsNames, startTimestamp)

            vestingAllocations = parsedAlloc[userId][0].map((x: string) =>
                BigNumber.from(x)
            )

            for (
                let roundId = 0;
                roundId < parsedAlloc[userId].length;
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

                amount = amount.add(parsedAlloc[userId][0][roundId])
            }
        })

        it('claims tokens from all user`s rounds and emits Claim event', async () => {
            const { token, vesting } = await getNewSetupedVesting(
                startTimestamp,
                root,
                dateRounds
            )
            await sleepTo(timestampLatestEnd.add(1))
            let userBalanceBefore = await token.balanceOf(users[userId].address)

            await vesting
                .connect(users[userId])
                .claimSingle(
                    0,
                    vestingAllocations,
                    proof,
                    ethers.constants.MaxUint256
                )

            await expect(
                vesting
                    .connect(users[userId])
                    .claimAll(
                        vestingAllocations,
                        proof,
                        ethers.constants.MaxUint256
                    )
            ).to.emit(vesting, 'Claim')

            let userBalanceAfter = await token.balanceOf(users[userId].address)

            let totalClaim = BigNumber.from(0)

            for (let i = 0; i < vestingAllocations.length; i++)
                totalClaim = totalClaim.add(vestingAllocations[i])
            expect(userBalanceAfter.sub(userBalanceBefore)).to.equal(totalClaim)
        })

        it('claims tokens from all user`s rounds and not reverts if one of rounds already claimed', async () => {
            const { token, vesting } = await getNewSetupedVesting(
                startTimestamp,
                root,
                dateRounds
            )
            await sleepTo(timestampLatestEnd.add(1))
            let userBalanceBefore = await token.balanceOf(users[userId].address)

            await vesting
                .connect(users[userId])
                .claimSingle(
                    0,
                    vestingAllocations,
                    proof,
                    ethers.constants.MaxUint256
                )

            await expect(
                vesting
                    .connect(users[userId])
                    .claimAll(
                        vestingAllocations,
                        proof,
                        ethers.constants.MaxUint256
                    )
            ).to.be.not.reverted

            let userBalanceAfter = await token.balanceOf(users[userId].address)

            let totalClaim = BigNumber.from(0)

            for (let i = 0; i < vestingAllocations.length; i++)
                totalClaim = totalClaim.add(vestingAllocations[i])

            expect(userBalanceAfter.sub(userBalanceBefore)).to.equal(totalClaim)
        })

        describe('access control', () => {
            it('allowed: for users-leaves approved in merkle tree', async () => {
                const { vesting } = await getNewSetupedVesting(
                    startTimestamp,
                    root,
                    dateRounds
                )

                await sleepTo(timestampLatestEnd.add(1))

                await expect(
                    vesting
                        .connect(users[userId])
                        .claimAll(vestingAllocations, proof, amount)
                ).to.not.be.reverted
            })

            it(`not allowed: any other address, reverts with ${ERROR.WRONG_PROOF}`, async () => {
                const { vesting } = await getNewSetupedVesting(
                    startTimestamp,
                    root,
                    dateRounds
                )

                await sleepTo(timestampLatestEnd.add(1))

                await useSigner(randomAddress(), async (s) => {
                    await expect(
                        vesting
                            .connect(s)
                            .claimAll(vestingAllocations, proof, amount)
                    ).to.be.revertedWith(ERROR.WRONG_PROOF)
                })
            })
        })

        describe('edge cases', () => {
            describe('when vesting has not started', () => {
                it(`reverts with '${ERROR.NOT_STARTED}'`, async () => {
                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
                    )

                    await expect(
                        vesting
                            .connect(users[userId])
                            .claimAll(vestingAllocations, proof, amount)
                    ).to.be.revertedWith(ERROR.NOT_STARTED)
                })
            })

            describe('when user does not participate in several rounds (allocation[roundId] = 0)', () => {
                it('does not revert', async () => {
                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
                    )

                    await sleepTo(timestampLatestEnd.add(1))
                    await expect(
                        vesting
                            .connect(users[userId])
                            .claimAll(
                                vestingAllocations,
                                generateProof(leaves, leaves[userId]),
                                amount
                            )
                    ).to.not.be.reverted
                })
            })

            describe('when allocations array is incorrect', () => {
                it(`reverts with '${ERROR.WRONG_PROOF}'`, async () => {
                    let newAllocations = parsedAlloc[userId - 1][0].map(
                        (x: string) => BigNumber.from(x)
                    )

                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
                    )

                    await sleepTo(timestampLatestEnd.add(1))
                    await expect(
                        vesting
                            .connect(users[2])
                            .claimAll(newAllocations, proof, amount)
                    ).to.be.revertedWith(ERROR.WRONG_PROOF)
                })
            })

            describe('when proof is incorrect', () => {
                it(`reverts with '${ERROR.WRONG_PROOF}'`, async () => {
                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
                    )

                    await sleepTo(timestampLatestEnd.add(1))
                    await expect(
                        vesting
                            .connect(users[2])
                            .claimAll(
                                vestingAllocations,
                                generateProof(leaves, leaves[userId - 1]),
                                amount
                            )
                    ).to.be.revertedWith(ERROR.WRONG_PROOF)
                })
            })

            describe('when claiming more than is unlocked', () => {
                it(`does not revert`, async () => {
                    const { vesting } = await getNewSetupedVesting(
                        startTimestamp,
                        root,
                        dateRounds
                    )

                    await sleepTo(timestampLatestEnd.add(1))
                    await expect(
                        vesting
                            .connect(users[userId])
                            .claimAll(
                                vestingAllocations,
                                proof,
                                BigNumber.from(2).pow(256).sub(1)
                            )
                    ).to.not.be.reverted
                })
            })
        })
    })

    describe('getRound', () => {
        let vesting: Contract
        let startTimestamp: number
        let dateRounds: Round[]
        let owner: SignerWithAddress
        let vestingFactory: Vesting__factory
        let token: Token

        beforeEach(async () => {
            ;[owner] = await ethers.getSigners()

            const { vestingFactory: vestingFactory_ } =
                await useContractsFactory()
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
        })

        it('return a single round info', async () => {
            await vesting
                .connect(owner)
                .init(startTimestamp, 'leaves', root, dateRounds)

            let roundId = 1
            let round = await vesting.getRound(roundId)

            expect(round.name).to.eq(dateRounds[roundId].name)
            for (let i = 0; i < round.periods.length; ++i) {
                expect(round.periods[i].startTimestamp).to.eq(
                    dateRounds[roundId].periods[i].startTimestamp
                )
                expect(round.periods[i].duration).to.eq(
                    dateRounds[roundId].periods[i].duration
                )
                expect(round.periods[i].linearUnits).to.eq(
                    dateRounds[roundId].periods[i].linearUnits
                )
                expect(round.periods[i].percentageD).to.eq(
                    dateRounds[roundId].periods[i].percentageD
                )
            }
        })
    })
    it.only('claim all 100% test', async function () {
        const { vesting, token } = await useContracts()
        const [deployer, user0, user1, user2] = await ethers.getSigners()

        // const proofd = generateProof(leaves, leaves[0]) // deployer
        // const proof0 = generateProof(leaves, leaves[1]) // user0
        // const proof1 = generateProof(leaves, leaves[2]) // user1
        // const proof2 = generateProof(leaves, leaves[3]) // user2

        // // deployer
        // let vestingAllocationsd = parsedAlloc[0][0].map((x: string) =>
        //     BigNumber.from(x)
        // )

        // // user0
        // let vestingAllocations0 = parsedAlloc[1][0].map((x: string) =>
        //     BigNumber.from(x)
        // )
        // // user1
        // let vestingAllocations1 = parsedAlloc[2][0].map((x: string) =>
        //     BigNumber.from(x)
        // )

        // // user2
        // let vestingAllocations2 = parsedAlloc[3][0].map((x: string) =>
        //     BigNumber.from(x)
        // )

        // await network.provider.send('evm_increaseTime', [3600 * 50])

        // const bbDeployer = await token.balanceOf(deployer.address)
        // const bbUser0 = await token.balanceOf(user0.address)
        // const bbUser1 = await token.balanceOf(user1.address)
        // const bbUser2 = await token.balanceOf(user2.address)

        // await vesting.claimSingle(
        //     0,
        //     vestingAllocationsd,
        //     proofd,
        //     '5000000000000000000000000'
        // )

        // await vesting
        //     .connect(user0)
        //     .claimSingle(
        //         0,
        //         vestingAllocations0,
        //         proof0,
        //         '7000000000000000000000000'
        //     )

        // await vesting
        //     .connect(user1)
        //     .claimSingle(
        //         0,
        //         vestingAllocations1,
        //         proof1,
        //         '8000000000000000000000000'
        //     )

        // await vesting
        //     .connect(user2)
        //     .claimSingle(
        //         0,
        //         vestingAllocations2,
        //         proof2,
        //         '12000000000000000000000000'
        //     )

        // const baDeployer = await token.balanceOf(deployer.address)
        // const baUser0 = await token.balanceOf(user0.address)
        // const baUser1 = await token.balanceOf(user1.address)
        // const baUser2 = await token.balanceOf(user2.address)

        // console.log(baDeployer.sub(bbDeployer).toString())
        // console.log(baUser0.sub(bbUser0).toString())
        // console.log(baUser1.sub(bbUser1).toString())
        // console.log(baUser2.sub(bbUser2).toString())
    })
})
