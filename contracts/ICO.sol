pragma solidity ^0.8.0;

import "./XXXToken.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract ICO {
    using SafeMath for uint256;

    address public owner;
    XXXToken public token;
    mapping(address => uint256) public deposits;
    uint256 public softCap = 0.1 * 10 ** 18;
    uint256 public hardCap = 1 * 10 ** 18; //0.11 * 10 ** 18;//
    uint256 public minPurchaseAmount = 0.01 * 10 ** 18;
    uint256 public maxPurchaseAmount = 0.05 * 10 ** 18;
    uint256 public totalDeposit = 0;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public rate = 1000;

    bool public active;

    event Deposit(address indexed buyer, uint256 amount);
    event Withdraw(address indexed buyer, uint256 amount);
    event Claim(address indexed buyer, uint256 amount);

    constructor(
        address _token,
        uint256 _startTime,   //Number(new Date(2023,month-1,6,16,50))/1000
        uint256 _endTime
    ) {
        owner = msg.sender;
        token = XXXToken(_token);

        startTime = _startTime;
        endTime = _endTime;
        
        active = true; // On Remix, during test
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function deposit() payable public  {
        // require(active, "ICO is not active");

        require(msg.value >= minPurchaseAmount, "Amount is less than minimum purchase amount");
        require(msg.value <= maxPurchaseAmount, "Amount is more than maximum purchase amount");
        require(msg.sender.balance > msg.value, "Insufficient balance");
        require(block.timestamp >= startTime, "ICO has not started yet");
        require(block.timestamp <= endTime, "ICO has ended");

        require(totalDeposit.add(msg.value) <= hardCap, "Hard cap reached");

        deposits[msg.sender] = deposits[msg.sender].add(msg.value);
        totalDeposit = totalDeposit.add(msg.value);

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() public payable{
        // require(active == false, "ICO is still active");

        require(block.timestamp >= endTime, "ICO has not ended yet");
        require(totalDeposit < softCap, "Soft cap reached");

        uint256 amount = deposits[msg.sender];
        deposits[msg.sender] = 0;
        payable(address(msg.sender)).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    function claim() public payable {
        // require(active == false, "ICO is still active");

        require(block.timestamp >= endTime, "ICO has not ended yet");
        require(totalDeposit >= softCap, "Soft cap not reached");

        uint256 amount = deposits[msg.sender].mul(rate);
        payable(address(owner)).transfer(deposits[msg.sender]);
        deposits[msg.sender] = 0;
        
        token.transferFrom(owner, msg.sender, amount);

        emit Claim(msg.sender, amount);
    }

    function endICO() public onlyOwner {
        active = false;
    }

}