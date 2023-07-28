//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Token
 * @author kotsmile
 */

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {
    constructor() ERC20('MOCK TOKEN', 'MTKN') {
        _mint(msg.sender, 1_000_000_000 ether);
    }
}
