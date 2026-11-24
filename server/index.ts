import dotenv, { config } from "dotenv";
dotenv.config();
import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { Queue } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { GoogleGenAI } from "@google/genai";

const llm = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const app = express();
app.use(cors());

// 2. Ensure the "uploads" folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const queue = new Queue("file-upload-queue", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

app.get("/", (req, res) => {
  res.send("All good");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/upload/pdf", upload.single("pdf"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  await queue.add("file-ready", {
    filename: req.file.originalname,
    destination: req.file.destination,
    path: req.file.path,
  });
  return res.json({ message: "uploaded" });
});

app.get("/chat", async (req, res) => {
  const userQuery = req.query.message as string;
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-embedding-001",
  });
  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embeddings,
    {
      url: process.env.QDRANT_URL,
      collectionName: "pdf-documents",
    },
  );

  const retriever = vectorStore.asRetriever({
    k: 2,
  });
  const result = await retriever.invoke(userQuery);
  // return res.json({ result });

  const SYSTEM_PROMPT = `You are a helpfull ai assistant who answers the user query based on the avialble context from the PDF file.
  Context:
  ${JSON.stringify(result)}`;

  const chstResult = await llm.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: [
      {
        role: "user",
        parts: [{ text: userQuery }],
      },
    ],
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  });
  return res.json({ message: chstResult.text, docs: result });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
