"use server";

import Error, { ErrorProps } from "next/error";

export const getResponse = async () => {
  try {
    const response = await fetch(
      `${process.env.API_BASE}/rag-chatbot`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    return { message: "FAILED TO FETCH DATA" };
  }
};

export const sendMessageAction = async (
  message: Message
) => {
  try {
  } catch (error) {}
};
