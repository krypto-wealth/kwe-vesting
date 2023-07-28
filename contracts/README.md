# Whitelabel Vesting

## Getting Started

Recommended Node version is 16.0.0.

```bash
$ yarn
$ yarn compile
$ yarn testf
```

## Project Structure

This a hardhat typescript project with `hardhat-deploy` extension.
Solidity version `0.8.15`

### Tests

Tests are found in the `./test/` folder.

To run tests

```bash
$ yarn testf
```

To run coverage

```bash
$ yarn coverage
```

### Contracts

Solidity smart contracts are found in `./contracts/`.
`./contracts/mock` folder contains contracts mocks that are used for testing purposes.

### Deploy

Deploy script can be found in the `./deploy/localhost` for local testing and `./deploy/mainnet` for mainnet deploy

Generate `.env` file

```bash
$ cp .env.example .env
```

Add .env file to the project root.

To add the private key of a deployer account, assign the following variable

```
PRIVATE_TEST=
PRIVATE_MAIN=
```

To add API Keys for verifying

```
API_ETH=
API_BSC=
API_POLYGON=
API_AVAX=
API_FTM=
API_ARBITRUM=
```

To deploy contracts on `Polygon chain`

1. Input allocations info in ~/configs/allocations.json file as in example

```json
[
  [
    // first round (roundId variable)
    [
      "5000000000000000000000000", // first unlock period end amount
      "6660000000000000000000000", // second unlock period end amount
      "10000000000000000000000000", // third unlock period end amount
      "90000000000000000000000000" // fourth unlock period end amount
    ],
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" // user
  ],
  [
    // second round (roundId variable)
    [
      "5000000000000000000000000",
      "7770000000000000000000000",
      "10000000000000000000000000",
      "0"
    ],
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  ],
  [
    // third round (roundId variable)
    [
      "8000000000000000000000000",
      "7000000000000000000000000",
      "3000000000000000000000000",
      "15000000000000000000000000"
    ],
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  ],
  [
    // fourth round (roundId variable)
    [
      "12000000000000000000000000",
      "8000000000000000000000000",
      "0",
      "13000000000000000000000000"
    ],
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906"
  ]
]
```

```bash
$ yarn deploy --network polygon_mainnet
```

### Deployments

Deployments on mainnets and testnets are stored in `./deployments`

### Verify

To verify contracts on `Polygon chain`

```bash
$ yarn verify --network polygon_mainnet
```

### Setup

Setup functions list:

1. function `init`(`startTimestamp_`, `leaves_`, `root_`, `rounds_`)
   parameters:
   - `startTimestamp_` - vesting start time
   - `leaves_` - link to allocations info
   - `root_` - root hash of allocations merkle tree
   - `rounds_` - array of unlock schedule for each round, structure `VestingPeriod` on contract
2. function `resetROOT`(`root_`, `leaves_`)
   - `leaves_` - link to allocations info
   - `root_` - root hash of allocations merkle tree

## Test Coverage

```text
  Vesting Property Test
    initialization with randomised allocations
setuping "Vesting" ...

      ✔ should init correctly (274ms)
    claimSingle with randomised allocations
      ✔ should let claim tokens from each single round (no token tx fee) (369ms)
      ✔ should let claim tokens partially if round has hot finished (322ms)
    claimAll with randomised allocations
      ✔ should let claim tokens from all rounds (no token tx fee) (418ms)

  Vesting Unit Test
    constructor
      ✔ creates new Vesting contract (44ms)
    init
      ✔ initializes startTimestamp, rool, leaves, rounds and periods and emits InitializedVesting event (348ms)
      access control
        ✔ allowed: only owner (199ms)
        ✔ not allowed: any other address. reverts with 'Ownable: caller is not the owner' (60ms)
      edge cases
        when contract already initialized
          ✔ reverts with 'Initializable: contract is already initialized' (249ms)
        when startTimestamp == 0 or startTimestamp < block.timestamp
          ✔ reverts with 'InvalidValue()'
        when rounds is an empty array
          ✔ reverts with 'InvalidLength()'
        when a round includes 0 periods
          ✔ reverts with 'InvalidLength()' (122ms)
        when a next period start < previous period end (periods intersection)
          ✔ reverts with 'InvalidValue()' (50ms)
        when percentage sum from all periods in a single round != 100
          ✔ reverts with 'InvalidValue()' (86ms)
        when period unlocks > duration (duration > 0)
          ✔ reverts with 'InvalidValue()' (48ms)
    getAllocations
      ✔ returns leaves of merkle tree (users` allocations)
      access control
        ✔ allowed: any address
      edge cases
        if vesting is not initialized
          ✔ returns an empty string
    resetROOT
      ✔ resets merkle tree if allocations have changed
      access control
        ✔ allowed: only owner
        ✔ not allowed: any address, reverts with 'Ownable: caller is not the owner'
    withdraw
      ✔ pulls tokens from vesting to the recipient
      access control
        ✔ allowed: only owner
        ✔ not allowed: any other address, reverts with 'Ownable: caller is not the owner'
      edge cases
        when required amount is greater than vesting contract balance
          ✔ reverts with 'ERC20: transfer amount exceeds balance'
        when recipient address is not valid
          ✔ reverts with 'ERC20: transfer to the zero address'
    unlocked
      ✔ shows the token amount which is free to be claimed by the user at the current moment (78ms)
      ✔ shows partial unlocked amount if a period has linUnlocks > 1 and period has not fully passed (282ms)
      access control
        ✔ allowed: any address
    claimSingle
      ✔ claims user`s tokens from a single vesting round and emits Claim event (298ms)
      access control
        ✔ allowed: for users-leaves approved in merkle tree (293ms)
        ✔ not allowed: any other address, reverts with WrongProof() (265ms)
      edge cases
        when proof is wrong
          ✔ reverts with 'WrongProof()' (268ms)
        when allocations array is incorect
          ✔ reverts with 'WrongProof()' (343ms)
        when vesting has not started
          ✔ reverts with 'NotStarted()' (305ms)
        when claim amount == 0
          ✔ reverts with 'ZeroClaim()' (349ms)
    claimAll
      ✔ claims tokens from all user`s rounds and emits Claim event (387ms)
      access control
        ✔ allowed: for users-leaves approved in merkle tree (510ms)
        ✔ not allowed: any other address, reverts with WrongProof() (405ms)
      edge cases
        when vesting has not started
          ✔ reverts with 'NotStarted()' (318ms)
        when user does not participate in several rounds (allocation[roundId] = 0)
          ✔ does not revert (437ms)
        when allocations array is incorrect
          ✔ reverts with 'WrongProof()' (309ms)
        when proof is incorrect
          ✔ reverts with 'WrongProof()' (289ms)
        when claiming more than is unlocked
          ✔ does not revert (374ms)
    getRound
      ✔ return a single round info (219ms)


  45 passing (13s)

------------------|----------|----------|----------|----------|----------------|
File              |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
------------------|----------|----------|----------|----------|----------------|
 contracts/       |      100 |      100 |      100 |      100 |                |
  Vesting.sol     |      100 |      100 |      100 |      100 |                |
 contracts/mock/  |      100 |      100 |      100 |      100 |                |
  Token.sol       |      100 |      100 |      100 |      100 |                |
 contracts/utils/ |      100 |      100 |      100 |      100 |                |
  Merkle.sol      |      100 |      100 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
All files         |      100 |      100 |      100 |      100 |                |
------------------|----------|----------|----------|----------|----------------|
```

Contracts in contracts/mock/ will not be deployed to mainnet so they are not tested.

## Technical Requirements

The technical requirement document describes the product's functionality and purpose.
It can be found [here](https://example.gotbit).

## Implementation Details

### Audit scope

The following files contain code that will be deployed on mainnet and thus require a security audit:

- Vesting.sol

### Architecture

The system consists of one Vesting contract. User can claim his tokens according to schedule for all rounds at once or only for one selected round with provided merkle proofs. Admin can only once initialize vesting schedule, reset merkle root, withdraw tokens.

### Role Model

The Vesting has only one owner role:

- Owner can only once initialize vesting schedule, reset merkle root, withdraw tokens

### Backend

There is no backend

### Usage Scenarios

Below are detailed step-by-step usage scenarios. They may duplicate the ones described in the technical requirement document, but they are written with much more detail, i.e. who calls what function with what parameters, and where do these parameters come from.

#### Scenario 1

1. User waits until his tokens unlock.
2. User calls claimSingle(`roundId`, `allocations`, `proof`, `targetAmount`) for claiming his selected round tokens

- `roundId` - uint of needed round, is got on the frontend
- `allocations` - array of unlock tokens amount on each unlock period end timestamp, are got on the frontend
- `proof` - array of hashed of merkle tree leaves, are calculated on the frontend
- `targetAmount` - is amount user wants to withdraw

#### Scenario 2

1. User waits until his tokens unlock according to settuped by owner schedule.
2. User calls claimAll(`allocations`, `proof`, `targetAmount`) for claiming tokens from all rounds he participate

- `allocations` - array of unlock tokens amount on each unlock period end timestamp, are got on the frontend
- `proof` - array of hashed of merkle tree leaves, are calculated on the frontend
- `targetAmount` is amount user wants to withdraw
