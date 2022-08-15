import React from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";

const Navbar = ({ account }) => {
  return (
    <div className="w-[full] flex px-2 py-8 justify-between">
      <div className="flex-1 flex place-content-end gap-[30px]">
        <div className="text-[#ffffff] text-xl cursor-pointer"></div>
      </div>
    </div>
  );
};

export default Navbar;
