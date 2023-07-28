//SPDX-License-Identifier: MIT
pragma solidity =0.8.18;

import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

error ZeroAddress();
error IncorrectStartTimestamp();
error PresaleNotActive();
error ZeroInvest();
error ZeroRounds();
error NotWhitelisted();
error HardcapAccomplished();
error IncorrectLengths();
error ZeroDuration();

/**
 * @title Presale
 * @author gotbit
 */
contract Presale is Ownable {
    using SafeERC20 for IERC20;

    struct RoundInfo {
        uint240 hardcap; // in usdt
        uint16 price; // $ price without decimals * 10_000
    }

    struct InvestInfo {
        uint8 roundId;
        uint32 timestamp;
        uint216 amount;
    }

    RoundInfo[] public rounds;

    IERC20 public immutable investToken;
    address public investTokenReceiver;

    uint32 public immutable startTimestamp;
    uint32 public immutable duration;

    uint256 public totalInvested;

    mapping(uint8 => uint256) public roundTotalInvested;
    mapping(address => InvestInfo[]) private userInvestInfo;

    event Invested(address indexed investor, uint256 amount, uint8 roundId);

    constructor(
        address investToken_,
        uint32 startTimestamp_,
        uint32 duration_,
        RoundInfo[] memory rounds_,
        address receiver_,
        address owner_
    ) {
        if (
            investToken_ == address(0) ||
            owner_ == address(0) ||
            receiver_ == address(0)
        ) revert ZeroAddress();
        if (startTimestamp_ < block.timestamp) revert IncorrectStartTimestamp();
        if (rounds_.length == 0) revert ZeroRounds();
        if (duration_ == 0) revert ZeroDuration();

        investToken = IERC20(investToken_);

        startTimestamp = startTimestamp_;
        duration = duration_;

        investTokenReceiver = receiver_;

        for (uint256 i; i < rounds_.length; ) {
            rounds.push(rounds_[i]);

            unchecked {
                ++i;
            }
        }

        _transferOwnership(owner_);
    }

    /// @notice Allows user to invest
    /// @param amount_ stable token amount to invest
    /// @param roundId_ id of round to invest
    function invest(uint256 amount_, uint8 roundId_) external {
        uint256 start = startTimestamp;

        if (block.timestamp < start || start + duration < block.timestamp)
            revert PresaleNotActive();
        if (amount_ == 0) revert ZeroInvest();

        if (roundTotalInvested[roundId_] + amount_ > rounds[roundId_].hardcap)
            revert HardcapAccomplished();

        totalInvested += amount_;
        roundTotalInvested[roundId_] += amount_;

        userInvestInfo[msg.sender].push(
            InvestInfo({
                roundId: roundId_,
                timestamp: uint32(block.timestamp),
                amount: uint216(amount_)
            })
        );

        emit Invested(msg.sender, amount_, roundId_);

        investToken.safeTransferFrom(msg.sender, investTokenReceiver, amount_);
    }

    /// @notice Allows admin to set invest token receiver
    /// @param receiver_ is address of the new receiver
    function setReceiverWallet(address receiver_) external onlyOwner {
        if (receiver_ == address(0)) revert ZeroAddress();

        investTokenReceiver = receiver_;
    }

    /// @notice Allows admin to add rounds
    /// @param rounds_ is array of new rounds
    function addRounds(RoundInfo[] calldata rounds_) external onlyOwner {
        if (rounds_.length == 0) revert ZeroRounds();

        for (uint256 i; i < rounds_.length; ) {
            rounds.push(rounds_[i]);
            unchecked {
                ++i;
            }
        }
    }

    /// @notice Allows to view user allocations
    /// @param user_ is address to view allocations for
    /// @return allocations array, where each index is user allocation for each round in tokens
    function getUserAllocations(address user_)
        external
        view
        returns (uint256[] memory allocations)
    {
        allocations = new uint256[](rounds.length);

        for (uint8 i; i < userInvestInfo[user_].length; ) {
            uint8 investRoundId = userInvestInfo[user_][i].roundId;

            allocations[investRoundId] += userInvestInfo[user_][i].amount;

            unchecked {
                ++i;
            }
        }

        for (uint8 i; i < allocations.length; ++i)
            allocations[i] = (allocations[i] * 10_000) / rounds[i].price;
    }

    /// @notice Returns array of all user investments
    function getUserInvestmentInfo(address user_)
        external
        view
        returns (InvestInfo[] memory)
    {
        return userInvestInfo[user_];
    }
}
