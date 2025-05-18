import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { Send, X, Minimize2, Maximize2, Loader2, Sparkles } from "lucide-react";
import ChatMessage from "./ChatMessage"; // Adjust path as needed

// ✅ Initialize GenAI
const genAI = new GoogleGenAI({
  apiKey: "AIzaSyCw6DlNHSHK0iQ6_H5tjZn-yLu1WQJyOgw",
});

const ChatWindow = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState("Guest");
  const [userInitial, setUserInitial] = useState("G");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const chatWindowRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = () => {
      const userDetails = JSON.parse(
        localStorage.getItem("userData") || '{"name": "Guest"}'
      );
      setUserName(userDetails.name || "Guest");
      setUserInitial((userDetails.name || "G").charAt(0).toUpperCase());
      setMessages([
        {
          text: `Hi ${
            userDetails.name || "Guest"
          }! I'm your AI assistant powered by JokeJunction😄. How can I help you today?`,
          isBot: true,
        },
      ]);
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isBot: false }]);
    setIsLoading(true);

    try {
      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: userMessage,
      });

      const reply = result.text;
      setMessages((prev) => [...prev, { text: reply, isBot: true }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I encountered an error. Please try again later.",
          isBot: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatWindowRef}
      className={`fixed bottom-4 right-2 w-[90vw] max-w-sm bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 
      overflow-hidden transition-all duration-300 ease-in-out 
      ${isMinimized ? "h-14" : "h-[420px]"}`}
      style={{ boxShadow: "0 4px 32px rgba(0, 0, 0, 0.6)" }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm">AI Assistant</h3>
            <p className="text-xs text-white/80">
              Welcome,{" "}
              {userName.length > 15 ? `${userName.slice(0, 15)}...` : userName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-[calc(100%-8rem)] overflow-y-auto p-3 space-y-3 bg-gray-800">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-2 text-white">
                {message.isBot ? (
                  <ChatMessage message={message.text} isBot={true} />
                ) : (
                  <div className="flex items-start gap-2 justify-end w-full">
                    <div className="flex-1">
                      <ChatMessage message={message.text} isBot={false} />
                    </div>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
                      {userInitial}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-white p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">AI is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-gray-900 border-t border-gray-700"
          >
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className={`w-full pr-10 pl-3 py-2 rounded-xl border border-gray-600 
                focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 
                resize-none text-sm bg-gray-800 text-white 
                placeholder-gray-400`}
                rows={1}
                style={{ maxHeight: "100px" }}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 top-1/2 -translate-y-1/2 
                p-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 
                text-white transition-all duration-200 
                hover:shadow-lg hover:opacity-90 
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none`}
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
