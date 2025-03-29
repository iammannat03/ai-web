import React from "react";
import { Button } from "../ui/button";
import GoToHomePage from "../common/GoToHomePage";

type Props = {
  setMessages: (messages: Message[]) => void;
};

const Sidebar = ({ setMessages }: Props) => {
  return (
    <div className="w-[280px] bg-black p-4 py-10 flex flex-col max-lg:hidden border-r border-white/10">
      <GoToHomePage />
      <div className="flex items-center w-full justify-center mb-6">
        <h1 className="text-4xl text-white font-extrabold">
          VIT.AI
        </h1>
      </div>

      {/* New Chat Button */}
      <div className="flex gap-2 mb-6">
        {/* <button
          
          className="flex items-center justify-center gap-2 bg-[#4E44FF] button-clear text-white px-4 py-2 rounded-sm border-2 border-black flex-grow"
        >
          <span className="">Clear Chat</span>
        </button> */}
        <Button
          onClick={() => setMessages([])}
          className="bg-white text-black w-full cursor-pointer hover:bg-white/90 active:bg-white/80"
        >
          Clear Chat
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
