"use server";

export const generateImageCaption = async (
  formData: FormData
) => {
  try {
    const response = await fetch(
      `${process.env.API_BASE}/generate-caption`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      return {
        error: true,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      error: false,
      caption: data.caption,
    };
  } catch (error) {
    console.error("Error in generateImageCaption:", error);
    return {
      error: true,
      message: "Failed to generate caption",
    };
  }
};
