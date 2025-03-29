"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { generateImageCaption } from "@/actions/image-captioning.action";

export default function ImageCaptioning() {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState<
    string | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleImageUpload = async (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.DragEvent
  ) => {
    let file: File | null = null;

    if (event.type === "drop") {
      event.preventDefault();
      setIsDragging(false);
      file =
        (event as React.DragEvent).dataTransfer
          .files?.[0] || null;
      console.log("Dropped file:", file);
    } else {
      file =
        (event as React.ChangeEvent<HTMLInputElement>)
          .target.files?.[0] || null;
      console.log("Selected file:", file);
    }

    if (!file || !file.type.startsWith("image/")) return;

    const imageUrl = URL.createObjectURL(file);
    console.log("Created URL:", imageUrl);
    setSelectedImage(imageUrl);
  };

  const generateCaption = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    const file = fileInput.files?.[0];
    console.log("File being sent to API:", file);
    if (!file) return;

    formData.append("file", file);

    try {
      const result = await generateImageCaption(formData);

      if (result.error) {
        throw new Error(result.message);
      }

      setCaption(result.caption);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    console.log("Removing image. Current state:", {
      selectedImage,
      caption,
      inputFiles: (
        document.getElementById(
          "image-upload"
        ) as HTMLInputElement
      )?.files,
    });

    // Reset the file input
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    fileInput.value = "";

    setSelectedImage(null);
    setCaption("");

    console.log("After removal:", {
      selectedImage: null,
      caption: "",
      inputFiles: fileInput.files,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="flex flex-col items-center justify-center gap-y-5">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white">
            Image Captioning Tool
          </h1>
          <span className="text-sm text-gray-500">
            Generate captions for images using a pre-trained
            model.
          </span>
        </div>
        <div className="flex flex-col items-center justify-center text-white rounded-lg">
          <div className="w-full max-w-2xl mx-auto p-4">
            <label
              htmlFor="image-upload"
              className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all
          ${
            isDragging
              ? "border-blue-500 bg-blue-50/5"
              : "border-gray-600 hover:border-gray-400 bg-black/20"
          }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleImageUpload}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10">
                {selectedImage ? (
                  <div className="relative w-[500px] h-[250px]">
                    <Image
                      src={selectedImage}
                      alt="Selected"
                      fill
                      sizes="(max-width: 500px) 100vw, 500px"
                      priority
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mb-4 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>

            {selectedImage && (
              <div className="mt-4 flex justify-between w-full">
                <button
                  onClick={generateCaption}
                  disabled={loading}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                >
                  {loading ? (
                    <span className="loader">
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze"
                  )}
                </button>

                <Button
                  onClick={handleRemoveImage}
                  className="cursor-pointer text-white bg-black border hover:border-white/30 border-white/20 hover:bg-white/5 transition-colors"
                >
                  Remove Image
                </Button>
              </div>
            )}
          </div>
          {caption && (
            <div className="mt-4 p-4 bg-white/5 rounded-lg w-full">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">
                Generated Caption:
              </h3>
              <p className="text-white font-semibold">
                {caption.at(0)?.toUpperCase() +
                  caption.slice(1)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
