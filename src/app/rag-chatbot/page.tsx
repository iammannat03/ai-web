"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { sendMessageAction } from "@/actions/rag-chatbot.action";
import { useTransition } from "react";
import Sidebar from "@/components/rag-chatbot/Sidebar";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const formatMessage = (text: string) => {
    // First remove any quotes and trim whitespace
    const cleanText = text.replace(/^'|'$/g, "").trim();

    // Replace literal "\n" strings with actual newlines
    const withNewlines = cleanText.replace(/\\n/g, "\n");

    // Now split on actual newlines and format
    return withNewlines
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n\n");
  };

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
        const botResponse = await sendMessageAction({
          message: newMessage,
          output_type: "chat",
          input_type: "chat",
        });

        if (botResponse.error) {
          throw new Error(botResponse.message);
        }

        const botMessage: Message = {
          id: uuidv4(),
          text:
            typeof botResponse.text === "string"
              ? formatMessage(botResponse.text)
              : formatMessage(
                  JSON.stringify(botResponse.text)
                ),
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
        const errorMessage: Message = {
          id: uuidv4(),
          text: "[Error processing message]",
          sender: "bot",
        };
        setMessages((prevMessages) => [
          ...prevMessages,
          errorMessage,
        ]);
      }
    });
  };

  useEffect(() => {
    const initRes = async () => {
      const botResponse = await sendMessageAction({
        message:
          "Give a brief introduction of what you are",
        output_type: "chat",
        input_type: "chat",
      });

      if (!botResponse.error) {
        setMessages([
          {
            id: uuidv4(),
            text:
              typeof botResponse.message === "string"
                ? formatMessage(botResponse.message)
                : formatMessage(
                    JSON.stringify(botResponse.text)
                  ),
            sender: "bot",
          },
        ]);
      }
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
              <div className="text-center text-2xl font-bold text-white">
                Welcome to VIT.AI
              </div>
              <span className="text-sm text-gray-500">
                start a conversation here
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
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    message.sender === "user"
                      ? "bg-black border border-white/20 text-white"
                      : "bg-black border border-white/40 text-white"
                  }`}
                >
                  <ReactMarkdown>
                    {formatMessage(message.text)}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isPending && (
              <div className="loader font-bold text-white text-xl">
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
              className="w-full rounded-2xl p-4 pr-12 text-sm bg-white/10 border-white/10 text-white focus-visible:outline-none border "
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
