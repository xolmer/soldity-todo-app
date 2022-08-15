import { BsFillTrashFill } from "react-icons/bs";

const Task = ({ task, deleteTask }: any) => {
  return (
    <div className="flex items-center text-white">
      <div className=" bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 text-[#b6c7db] flex w-[70%] rounded-[15px] mb-[10px] flex-1">
        <div className="flex items-center justify-between w-full p-[20px] text-xl">
          {task.taskId} : {task.taskDescription}
        </div>
      </div>
      <BsFillTrashFill className="text-2xl cursor-pointer ml-10" onClick={deleteTask} />
    </div>
  );
};

export default Task;
