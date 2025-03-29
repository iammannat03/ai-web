"use server";

import Error, { ErrorProps } from "next/error";

interface Message {
  message: string;
  output_type: string;
  input_type: string;
}

export const sendMessageAction = async (
  message: Message
) => {
  try {
    console.log(`Sending message: ${message}`);
    const response = await fetch(
      `${process.env.API_BASE}/rag-chatbot/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.message,
          output_type: "chat",
          input_type: "chat",
        }),
      }
    );
    console.log(`Sending message: ${message}`);

    if (!response.ok) {
      return {
        error: true,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    const messageRes =
      data.outputs[0].outputs[0].results.message.data;
    console.log(`Received response:`, data);

    return messageRes;
  } catch (error) {
    console.error("Error in sendMessageAction:", error);
    return {
      error: true,
      message: "Failed to send message",
    };
  }
};
