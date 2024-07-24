const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
describe("SimpleStorage", () => {
  let simpleStorageFactory, simpleStorage;
  beforeEach(async () => {
    simpleStorage = await ethers.deployContract("SimpleStorage");
  });

  it("Should start with a favorite number of 0", async () => {
    const currentValue = await simpleStorage.retrieve();
    const expectedValue = "0";
    assert.equal(currentValue.toString(), expectedValue);
  })

  it("Should update when we call store", async () => {
    const expectedValue = "7";
    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);
    const currentValue = await simpleStorage.retrieve();
    assert.equal(currentValue.toString(), expectedValue);
  })
})