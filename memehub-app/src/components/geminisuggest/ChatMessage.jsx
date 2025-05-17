import React from "react";
import ReactMarkdown from "react-markdown";
import { Bot } from "lucide-react";

const ChatMessage = ({ message, isBot }) => {
  return (
    <div
      className={`rounded-xl p-3 ${
        isBot
          ? "bg-gray-800 shadow-sm"
          : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10"
      }`}
    >
      {/* Show bot icon in message of bot true */}
      {isBot && (
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
            <Bot size={14} />
          </div>
        </div>
      )}

      {/* Wrap Markdown with div to apply styling */}
      <div className={`overflow-hidden text-sm ${isBot ? "ml-8" : ""}`}>
        <div className="">
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
