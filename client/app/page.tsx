"use client";
import Image from "next/image";
import FileUploadComponent from "./components/file-upload";

export default function Home() {
  const handleFileUploadButtonClick = () => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", "application/pdf");
    el.click();
    el.addEventListener("change", async (ev) => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if (file) {
          const formData = new FormData();
          formData.append("pdf", file);
          await fetch('http://localhost:8000/upload/pdf', {
            method: "POST",
            body: formData,
          })
        }
      }
    });
  };

  return (
    <div>
      <div className="min-h-scrren w-screen flex ">
        <div
          onClick={handleFileUploadButtonClick}
          className="w-[30vw] min-h-screen p-4 flex justify-center items-center"
        >
          <FileUploadComponent />
        </div>
        <div className="w-[70vw] min-h-screen border-l-2">2</div>
      </div>
    </div>
  );
}
