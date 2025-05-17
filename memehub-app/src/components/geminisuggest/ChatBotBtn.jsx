import React from "react";
import { MessageSquare, X } from "lucide-react";
import { twMerge } from "tailwind-merge";

const ChatbotButton = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg",
        "flex items-center justify-center transition-all duration-300",
        "hover:scale-110 active:scale-95",
        isOpen
          ? "bg-gray-700 hover:bg-gray-800"
          : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
      )}
    >
      {isOpen ? (
        <X className="w-5 h-5 text-white" />
      ) : (
        <MessageSquare className="w-5 h-5 text-white" />
      )}
    </button>
  );
};

export default ChatbotButton;
