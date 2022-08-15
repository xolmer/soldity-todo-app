import { ethers } from "hardhat";
import fs from "fs";

async function main() {
  const TaskContract = await ethers.getContractFactory("TaskContract");
  const task = await TaskContract.deploy();

  await task.deployed();

  console.log("task deployed to:", task.address);

  fs.writeFileSync(
    "./config.ts",
    `export const contractAddress = "${task.address}"
  export const ownerAddress:any = "${(await task.signer.getAddress()).toString()}"
  `
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
