"use client";
import { Upload } from "lucide-react";

interface FileUploadProps {
  fileName?: string | null;
  isUploading?: boolean;
}

const FileUploadComponent: React.FC<FileUploadProps> = ({
  fileName,
  isUploading,
}) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white shadow-md flex justify-center items-center p-6 border-2 border-slate-300 dark:border-white/20 rounded-xl cursor-pointer hover:border-purple-600 transition-colors w-full max-w-xs">
      <div className="flex justify-center items-center flex-col gap-2 text-center">
        <h3 className="font-medium text-sm truncate max-w-[200px]">
          {isUploading ? "Uploading..." : fileName ? fileName : "Upload pdf file"}
        </h3>
        <Upload className="w-5 h-5" />
      </div>
    </div>
  );
};

export default FileUploadComponent;
