import React from "react";
import ChatBot from "./components/Chat/ChatBot";

export default function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#8b5cf6] text-white">
      <main className="w-full h-screen p-6 pt-6">
        <div className="max-w-5xl mx-auto h-full">
          <ChatBot />
        </div>
      </main>
    </div>
  );
}
