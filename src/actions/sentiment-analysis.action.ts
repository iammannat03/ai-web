"use server";

interface SentimentRequest {
  text: string;
}

export const predictSentiment = async (text: string) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE}/predict`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
        }),
      }
    );

    if (!response.ok) {
      return {
        error: true,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    console.log(`Received response:`, data);

    return data;
  } catch (error) {
    console.error("Error in predictSentiment:", error);
    return {
      error: true,
      message: "Failed to predict sentiment",
    };
  }
};
