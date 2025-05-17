import React from "react";
import ReactMarkdown from "react-markdown";
import { Bot } from "lucide-react";

const ChatMessage = ({ message, isBot }) => {
  return (
    <div
      className={`rounded-xl p-3 ${
        isBot
          ? "bg-gray-800 shadow-sm text-white"
          : "bg-white bg-opacity-20 border border-white/20 text-black" // lighter bg, black text for user
      }`}
    >
      {/* Show bot icon if bot */}
      {isBot && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
            <Bot size={14} />
          </div>
        </div>
      )}

      {/* Markdown content */}
      <div className={`overflow-hidden text-sm ${isBot ? "ml-8" : ""}`}>
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ChatMessage;
