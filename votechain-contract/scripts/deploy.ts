import { ethers, run, network } from "hardhat";

async function main() {
  const VoteChaninFactory = await ethers.getContractFactory("VoteChain");
  const voteChain = await VoteChaninFactory.deploy();
  await voteChain.deployed();
  if(network.config.chainId === 4 && process.env.ETHERSCAN_API_KEY) {
    await voteChain.deployTransaction.wait(5)
    await verify(voteChain.address, [])
  }
}

async function verify(contractAddress: string, args: any) {
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (ex: any) {
    if(ex.message.toLowerCase().includes("already verified")){
      console.log("Already Verified")
    } else {
      console.log(ex)
    }
  }
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
