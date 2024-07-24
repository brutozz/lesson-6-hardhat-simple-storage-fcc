const { ethers, run, network } = require ("hardhat");

async function main() {

    console.log("Deploying contract...")
    const simpleStorage = await ethers.deployContract("SimpleStorage");
    await simpleStorage.waitForDeployment();

    const contractAddress = await simpleStorage.getAddress();
    console.log(`Deployed contract to: ${contractAddress}`);

    if (network.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block txes...");
        await simpleStorage.deployTransaction.wait(6);
        await verify(simpleStorage.target, []);
    }

    const currentValue = await simpleStorage.retrieve();
    console.log(`Current value is: ${currentValue}`);

    const transactionResponse = await simpleStorage.store(666);
    await transactionResponse.wait(1);

    const updatedValue = await simpleStorage.retrieve();
    console.log(`Updated value is ${updatedValue}`);
}

async function verify(contractaddress, args) {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractaddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!");
        } else {
            console.log(`Get error: ${e}`);
        }
    }
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
