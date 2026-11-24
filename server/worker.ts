import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { QdrantClient } from "@qdrant/js-client-rest";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    console.log("Worker received job:", job.id, job.data);
    // job.data is already an object in BullMQ
    const data = typeof job.data === "string" ? JSON.parse(job.data) : job.data;

    const loader = new PDFLoader(data.path);
    const documents = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 50,
    });

    const chunks = await textSplitter.splitDocuments(documents);

    const client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: "gemini-embedding-001",
    });

    const vectorStore = await QdrantVectorStore.fromDocuments(
      chunks,
      embeddings,
      {
        client,
        collectionName: "pdf-documents",
      },
    );
  },
  { connection, concurrency: 3 },
);

worker.on("ready", () => {
  console.log("Worker connected to Redis and ready for jobs!");
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error:`, err);
});

worker.on("error", (err) => {
  console.error("Worker error:", err);
});
