import Navbar from "./Navbar";
import { IoMdAddCircle } from "react-icons/io";
import TaskComponent from "./Task";
import { FC } from "react";
import { Task } from "../types.d";

interface TaskProps {
  setInput: (input: string) => void;
  addTask: (e: React.MouseEvent<SVGElement> | React.FormEvent<HTMLFormElement>) => void;
  input: string;
  account: string;
  tasks: Array<Task>;
  deleteTask: any;
}

const TodoList: FC<TaskProps> = ({ setInput, addTask, input, account, tasks, deleteTask }) => (
  <div className="w-[70%] bg-transparent py-4 px-9 rounded-[30px] ">
    <Navbar />
    <h2 className="text-4xl bolder text-white pb-8">What&apos;s up: {account}</h2>
    <div className="py-3 text-[#d8e1fa]">TODAY&apos;S TASKS</div>
    <form className="flex items-center justify-center" onSubmit={addTask}>
      <input
        className="rounded-[10px] w-full p-[10px] border-none outline-none bg-[#031956] text-white mb-[10px]"
        placeholder="Add a task for today..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <IoMdAddCircle
        onClick={addTask}
        className="text-[#fbcfff] text-[50px] cursor-pointer ml-[20px] mb-[10px]"
      />
    </form>
    <ul>
      {tasks.map((task: any, index) => (
        <TaskComponent
          key={task.taskId}
          counter={index}
          task={task}
          deleteTask={deleteTask(task.taskId)}
        />
      ))}
    </ul>
  </div>
);

export default TodoList;
