import type { NextPage } from "next";
import { useState, useEffect } from "react";
import WrongNetworkMessage from "@components/WrongNetworkMessage";
import ConnectWalletButton from "@components/ConnectWalletButton";
import TodoList from "@components/TodoList";
import TaskContract from "@artifacts/contracts/TaskContract.sol/TaskContract.json";
import { ethers } from "ethers";
import { contractAddress } from "config";
import { Task } from "../types.d";

const transformTasks = (input: any): Task[] => {
  return input.map((task: any) => {
    return {
      taskId: ethers.BigNumber.from(task[0]).toString(),
      taskDescription: task[1],
      isDeleted: task[2],
    };
  });
};

const Home: NextPage = () => {
  //Todo Functions
  const [correctNetwork, setCorrectNetwork] = useState<boolean>(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

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
        setTasks(transformTasks(tasks));
      } else {
        throw new Error("Ethereum object is not available");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addTask = async (e: React.MouseEvent<SVGElement> | React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let task: Task = {
      taskDescription: input,
      isDeleted: false,
      taskId: "",
    };
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TaskContract.abi, signer);

        await (await contract.addTask(task.taskDescription, task.isDeleted)).wait();

        setTasks([...tasks, task]);
        setLoaded(true);
        console.log("Task Added");
        getAllTasks();
      } else {
        throw new Error("Ethereum object is not available");
      }
    } catch (err) {
      console.log(err);
    }
    setInput("");
    getAllTasks();
  };

  const deleteTask = (key: string) => async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TaskContract.abi, signer);

        const deletingTask = await contract.deleteTask(ethers.BigNumber.from(key), true);
        await deletingTask.wait();

        console.log("task deleted");
        let tasks = await contract.getTasks();
        setTasks(transformTasks(tasks));
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
