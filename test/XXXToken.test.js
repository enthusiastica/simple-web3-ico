const { expect } = require("chai");
// const { ethers } = require("ethers");
const BigNumber = ethers.BigNumber;


describe("XXXToken", function() {
  it("Should return the correct name and symbol", async function() {
    const XXXToken = await ethers.getContractFactory("XXXToken");
    const xxxToken = await XXXToken.deploy();

    await xxxToken.deployed();
    expect(await xxxToken.name()).to.equal("XXX");
    expect(await xxxToken.symbol()).to.equal("XXX");
  });

  it("Should have a total supply of 500000", async function() {
    const XXXToken = await ethers.getContractFactory("XXXToken");
    const xxxToken = await XXXToken.deploy();

    await xxxToken.deployed();
    expect(await xxxToken.totalSupply()).to.equal(BigNumber.from("500000000000000000000000"));
  });
});