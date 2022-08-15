import Navbar from "./Navbar";
import { IoMdAddCircle } from "react-icons/io";
import Task from "./Task";

const TodoList = ({ setInput, addTask, input, account, tasks, deleteTask }: any) => (
  <div className="w-[70%] bg-transparent py-4 px-9 rounded-[30px] ">
    <Navbar />
    <h2 className="text-4xl bolder text-white pb-8">What&apos;s up: {account}</h2>
    <div className="py-3 text-[#d8e1fa]">TODAY&apos;S TASKS</div>
    <form className="flex items-center justify-center">
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
      {tasks.map((task: any) => (
        <Task
          key={task.taskId.toString()}
          task={task}
          deleteTask={deleteTask(task.taskId.toString())}
        />
      ))}
    </ul>
  </div>
);

export default TodoList;
