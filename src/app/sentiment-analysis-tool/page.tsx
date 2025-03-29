"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { predictSentiment } from "@/actions/sentiment-analysis.action";

const Page = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const sentiment = await predictSentiment(text);
      setResult(sentiment);
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-white">
          Sentiment Analysis Tool
        </h1>
        <span className="text-sm text-gray-500">
          Analyze the sentiment of a comment
        </span>
      </div>

      <main className="text-white p-10 border border-white/20 rounded-lg m-8 w-full max-w-2xl">
        <div className="space-y-4">
          <p>Enter a comment to analyze the sentiment:</p>

          <div className="flex gap-4">
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here..."
              className="bg-white/10 border-white/10 text-white placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAnalyze();
              }}
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
            >
              {isAnalyzing ? (
                <span className="loader">Analyzing...</span>
              ) : (
                "Analyze"
              )}
            </button>
          </div>

          {result && (
            <div className="mt-6 p-4 bg-white/5 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Analysis Result:
              </h2>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Page;
