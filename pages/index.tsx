import type { NextPage } from "next";
import { useState, useEffect } from "react";
import WrongNetworkMessage from "@components/WrongNetworkMessage";
import ConnectWalletButton from "@components/ConnectWalletButton";
import TodoList from "@components/TodoList";
import TaskContract from "@artifacts/contracts/TaskContract.sol/TaskContract.json";
import { ethers } from "ethers";
import { contractAddress } from "config";

const Home: NextPage = () => {
  //Todo Functions
  const [correctNetwork, setCorrectNetwork] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<Object[]>([]);

  useEffect(() => {
    connectWallet();
    getAllTasks();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        throw new Error("Ethereum is not available");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain: ", chainId);
      const rinkebyChainId = "0x4";
      const mumbaiChainId = "0x13881";
      const localChainId = "0x539";
      if (chainId !== rinkebyChainId && chainId !== mumbaiChainId && chainId !== localChainId) {
        alert("Please connect to Mumbai network");
        setCorrectNetwork(false);
        throw new Error("Wrong network");
        return;
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
      const { ethereum } = window as any;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TaskContract.abi, signer);
        let tasks = await contract.getTasks();
        setTasks(tasks);
      } else {
        throw new Error("Ethereum object is not available");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let task = {
      taskDescription: input,
      isDeleted: false,
    };
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TaskContract.abi, signer);

        contract.addTask(task.taskDescription, task.isDeleted).then(() => {
          setTasks([...tasks, task]);
          console.log("Task Added");
        });
      } else {
        throw new Error("Ethereum object is not available");
      }
    } catch (err) {
      console.log(err);
    }
    setInput("");
  };

  const deleteTask = (key: string) => async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TaskContract.abi, signer);
        contract.deleteTask(key, true).then(() => {
          console.log("Task Deleted");
        });
        let tasks = await contract.getTasks();
        setTasks(tasks);
        getAllTasks();
      } else {
        throw new Error("Ethereum object is not available");
      }
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
