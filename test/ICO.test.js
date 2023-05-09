const { expect } = require("chai");

describe("ICO", function () {
  let owner;
  let buyer1;
  let buyer2;
  let token;
  let ico;

  const startTime = Math.floor(Date.now() / 1000) + 60; // Start in 1 minute
  const endTime = Math.floor(Date.now() / 1000) + 3600; // End in 1 hour

  beforeEach(async function () {
    [owner, buyer1, buyer2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("XXXToken");
    token = await Token.deploy();

    const ICO = await ethers.getContractFactory("ICO");
    ico = await ICO.deploy(token.address, startTime, endTime);

    await token.transfer(ico.address, ethers.utils.parseEther("1000"));
  });

  it("should allow deposits during ICO", async function () {
    const depositAmount = ethers.utils.parseEther("0.02");

    await ico.connect(buyer1).deposit({ value: depositAmount, gasLimit: 3000000 });

    expect(await ico.deposits(buyer1.address)).to.equal(depositAmount);
    expect(await ico.totalDeposit()).to.equal(depositAmount);
  });

  it("should not allow deposits before ICO start time", async function () {
    const depositAmount = ethers.utils.parseEther("0.02");

    await expect(ico.connect(buyer1).deposit({ value: depositAmount })).to.be.revertedWith("ICO has not started yet");
  });

  it("should not allow deposits after ICO end time", async function () {
    const depositAmount = ethers.utils.parseEther("0.02");

    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 1]);
    await ethers.provider.send("evm_mine");

    await expect(ico.connect(buyer1).deposit({ value: depositAmount })).to.be.revertedWith("ICO has ended");
  });

  it("should not allow deposits below minimum purchase amount", async function () {
    const depositAmount = ethers.utils.parseEther("0.005");

    await expect(ico.connect(buyer1).deposit({ value: depositAmount })).to.be.revertedWith("Amount is less than minimum purchase amount");
  });

  it("should not allow deposits above maximum purchase amount", async function () {
    const depositAmount = ethers.utils.parseEther("0.06");

    await expect(ico.connect(buyer1).deposit({ value: depositAmount })).to.be.revertedWith("Amount is more than maximum purchase amount");
  });

  it("should not allow deposits if hard cap is reached", async function () {
    const depositAmount = ethers.utils.parseEther("0.5");

    await ico.connect(buyer1).deposit({ value: depositAmount });
    await expect(ico.connect(buyer2).deposit({ value: depositAmount })).to.be.revertedWith("Hard cap reached");
  });

  it("should allow withdrawals if soft cap is not reached", async function () {
    const depositAmount = ethers.utils.parseEther("0.02");

    await ico.connect(buyer1).deposit({ value: depositAmount });

    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 1]);
    await ethers.provider.send("evm_mine");

    const balanceBefore = await ethers.provider.getBalance(buyer1.address);

    await ico.connect(buyer1).withdraw();

    const balanceAfter = await ethers.provider.getBalance(buyer1.address);

    expect(await ico.deposits(buyer1.address)).to.equal(0);
    expect(await ico.totalDeposit()).to.equal(0);
    expect(balanceAfter.sub(balanceBefore)).to.equal(depositAmount);
  });

  it("should not allow withdrawals if soft cap is reached", async function () {
    const depositAmount = ethers.utils.parseEther("0.1");

    await ico.connect(buyer1).deposit({ value: depositAmount });

    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 1]);
    await ethers.provider.send("evm_mine");

    await expect(ico.connect(buyer1).withdraw()).to.be.revertedWith("Soft cap reached");
  });

  it("should not allow claims before ICO has ended", async function () {
    const depositAmount = ethers.utils.parseEther("0.1");
  
    await ico.connect(buyer1).deposit({ value: depositAmount });
  
    await expect(ico.connect(buyer1).claim()).to.be.revertedWith("ICO has not ended yet");
  });
  
  it("should allow claims if soft cap is reached", async function () {
    const depositAmount = ethers.utils.parseEther("0.1");
  
    await ico.connect(buyer1).deposit({ value: depositAmount });
  
    await ethers.provider.send("evm_setNextBlockTimestamp", [endTime + 1]);
    await ethers.provider.send("evm_mine");
  
    const balanceBefore = await token.balanceOf(buyer1.address);
  
    await ico.connect(buyer1).claim();
  
    const balanceAfter = await token.balanceOf(buyer1.address);
  
    expect(balanceAfter.sub(balanceBefore)).to.equal(depositAmount.mul(rate));
  });

});