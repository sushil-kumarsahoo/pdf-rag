import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "./components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PDF RAG",
  description: "Chat with your PDFs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (localStorage.getItem('theme') === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              `,
            }}
          />
        </head>
        <body className="h-full flex flex-col bg-background text-foreground overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
