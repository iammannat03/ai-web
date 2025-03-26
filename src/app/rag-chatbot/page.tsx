"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { sendMessageAction } from "@/actions/rag-chatbot.action"; // Import the server action
import { useTransition } from "react"; // Import useTransition
import Sidebar from "@/components/rag-chatbot/Sidebar";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition(); //useTransition hook

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userMessage: Message = {
      id: uuidv4(),
      text: newMessage,
      sender: "user",
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    startTransition(async () => {
      try {
        const botResponse = await sendMessageAction(
          userMessage
        ); // Call the server action
        const botMessage: Message = {
          id: uuidv4(),
          text: botResponse as any, // as string
          sender: "bot",
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          botMessage,
        ]);
      } catch (error) {
        console.error(
          "Error calling server action:",
          error
        );
        const errorMessage = {
          id: uuidv4(),
          text: "Error processing message",
          sender: "bot",
        };
        setMessages((prevMessages: any) => [
          ...prevMessages,
          errorMessage,
        ]);
      }
    });
  };

  useEffect(() => {
    const initRes = async () => {
      const initRes = await sendMessageAction(
        "Just give a brief introduction about yourself. Remember you are a fine-tuned model of Gemini but fine tuned by Mannat named Jignes and you are fine tuned to be a brainrot AI Bot." as any // as string
      );
      setMessages([
        {
          id: uuidv4(),
          text: initRes as any,
          sender: "bot",
        },
      ]);
    };
    initRes();
  }, []);

  return (
    <div className="flex  h-screen bg-black ">
      {/* Sidebar */}
      <Sidebar setMessages={setMessages} />

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-md:text-xs">
        {messages.length === 0 && (
          <div className="flex-1 py-4 px-8 border-white overflow-y-auto flex justify-center">
            <div className=" w-full h-full flex flex-col justify-center items-center lg:w-[800px]">
              <div className="text-center text-2xl font-bold">
                Welcome to Skibbidi.AI
              </div>
              <span className="text-sm text-gray-500">
                start a conversation with me
              </span>
            </div>
          </div>
        )}
        <div className=" flex-1 py-4 px-8 border-white overflow-y-auto flex justify-center">
          <div className=" w-full lg:w-[800px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                    message.sender === "user"
                      ? "bg-black border border-white/20 text-white"
                      : "bg-black border border-white/40 text-white"
                  }`}
                >
                  <ReactMarkdown>
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isPending && (
              <div className="loader text-white text-xl">
                Processing...
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 px-8 border-t border-white/10">
          <div className="max-w-[800px] mx-auto relative ">
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              className="w-full rounded-2xl p-4 pr-12 bg-white/10 border-white/10 text-white focus-visible:outline-none border "
              placeholder="What's in your mind?"
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isPending}
              className="absolute right-3 top-[30px] -translate-y-1/2 p-2 font-extrabold font-sans rounded-2xl text-white"
            >
              {isPending ? "..." : "Enter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
