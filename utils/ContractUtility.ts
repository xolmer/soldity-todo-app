import { ethers } from "ethers";
import { Task } from "../types.d";
//Check if ethereum is connected

export const contractUtils = async (contractAddress: any, TaskContract: any) => {
  const { ethereum } = window as any;
  if (!ethereum) {
    throw new Error("Ethereum is not connected");
  }
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, TaskContract.abi, signer);
  return contract;
};

export const getAllTaksUtils = async (contractAddress: any, TaskContract: any) => {
  const contract = await contractUtils(contractAddress, TaskContract);
  let allTasks = await contract.getTasks();
  // await allTasks.wait();
  return allTasks;
};

export const setTaskUtils = async (contractAddress: any, TaskContract: any, _input: any) => {
  let task: Task = {
    taskDescription: _input,
    isDeleted: false,
    taskId: "",
  };
  const contract = await contractUtils(contractAddress, TaskContract);
  await (await contract.addTask(task.taskDescription, task.isDeleted)).wait();
  console.log("Task Added");
  return task;
};

export const deleteTaskUtils = async (contractAddress: any, TaskContract: any, _taskId: any) => {
  const contract = await contractUtils(contractAddress, TaskContract);
  const deletingTask = await contract.deleteTask(ethers.BigNumber.from(_taskId), true);
  await deletingTask.wait();
  console.log("Task Deleted");
  const allTasks = await getAllTaksUtils(contractAddress, TaskContract);
  return allTasks;
};
