//-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

contract XXXToken is ERC20 {//, Ownable {
    constructor() ERC20("XXX", "XXX") { // (Name, Symbol)
        // _setupDecimals(18);
        _mint(msg.sender, 500000 * 10 ** decimals());
    }  
}