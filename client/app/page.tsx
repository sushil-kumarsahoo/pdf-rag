"use client";

import { useState } from "react";
import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat-page";

export default function Home() {
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileUploadButtonClick = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.click();
    el.addEventListener("change", async () => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          setIsUploading(true);
          setUploadedFileName(file.name);
          try {
            const formData = new FormData();
            formData.append("pdf", file);
            await fetch("http://localhost:8000/upload/pdf", {
              method: "POST",
              body: formData,
            });
          } catch (err) {
            console.error("Upload error:", err);
          } finally {
            setIsUploading(false);
          }
        }
      }
    });
  };

  return (
    <div className="h-full w-full flex overflow-hidden">
      <div
        onClick={handleFileUploadButtonClick}
        className="w-[30vw] h-full p-4 border-r flex justify-center items-center"
      >
        <FileUploadComponent
          fileName={uploadedFileName}
          isUploading={isUploading}
        />
      </div>
      <div className="w-[70vw] h-full flex flex-col">
        <ChatComponent />
      </div>
    </div>
  );
}
