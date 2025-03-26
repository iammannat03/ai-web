"use client";

import { getResponse } from "@/actions/rag-chatbot.action";
import React, { useEffect, useState } from "react";

type Props = {};

const RagChatbot = (props: Props) => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getResponse();
      console.log(data);
      setData(data.message);
    };
    fetchData();
  }, []);
  return <div>{data}</div>;
};

export default RagChatbot;
