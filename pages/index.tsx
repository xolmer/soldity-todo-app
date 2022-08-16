import type { NextPage } from "next";
import { useState, useEffect } from "react";
import WrongNetworkMessage from "@components/WrongNetworkMessage";
import ConnectWalletButton from "@components/ConnectWalletButton";
import TodoList from "@components/TodoList";
import TaskContract from "@artifacts/contracts/TaskContract.sol/TaskContract.json";
import { ethers } from "ethers";
import { contractAddress } from "config";
import { Task } from "../types.d";
import { getAllTaksUtils, setTaskUtils, deleteTaskUtils } from "../utils/ContractUtility";

const transformTasks = (input: any): Task[] => {
  return input
    .map((task: any) => {
      return {
        taskId: ethers.BigNumber.from(task[0]).toString(),
        taskDescription: task[1],
        isDeleted: task[2],
      };
    })
    .reverse();
};

const Home: NextPage = () => {
  //Todo Functions
  const [correctNetwork, setCorrectNetwork] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    connectWallet();
    getAllTasks();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        throw new Error("Ethereum is not available");
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain: ", chainId);

      const mumbaiChainId = "0x13881";

      if (chainId !== mumbaiChainId) {
        alert("Please connect to Mumbai network");
        setCorrectNetwork(false);
        throw new Error("Wrong network");
      } else {
        setCorrectNetwork(true);
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected to accounts: ", accounts[0]);
      setIsUserLoggedIn(true);
      setCurrentAccount(accounts[0]);
      getAllTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const getAllTasks = async () => {
    try {
      let tasks = await getAllTaksUtils(contractAddress, TaskContract);
      setTasks(transformTasks(tasks));
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async (e: React.MouseEvent<SVGElement> | React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const addedTask = await setTaskUtils(contractAddress, TaskContract, input);
      setTasks([...tasks, addedTask]);
    } catch (err) {
      console.log(err);
    }
    setInput("");
    getAllTasks();
  };

  const deleteTask = (key: string) => async () => {
    try {
      const deleteTask = await deleteTaskUtils(contractAddress, TaskContract, key);
      setTasks(transformTasks(deleteTask));
    } catch {
      console.log("Error");
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-screen w-screen flex justify-center py-6 items-center">
      {!isUserLoggedIn ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : correctNetwork ? (
        <TodoList
          setInput={setInput}
          addTask={addTask}
          input={input}
          account={currentAccount}
          tasks={tasks}
          deleteTask={deleteTask}
        />
      ) : (
        <WrongNetworkMessage />
      )}
    </div>
  );
};

export default Home;
