import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { TutorMessage } from "./AITutor";

type ChatPanelProps = {
  messages: TutorMessage[];
  isVisible: boolean;
};

export default function ChatPanel({ messages, isVisible }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-20 right-4 w-80 h-[calc(100vh-120px)] bg-white/95 backdrop-blur-sm border-4 border-black rounded-lg shadow-2xl z-40 flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b-4 border-black bg-primary">
        <h3 className="font-mono text-lg font-bold text-white">Chat History</h3>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      >
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 font-mono text-sm mt-8">
            No messages yet...
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg font-mono text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-white border-2 border-primary"
                    : "bg-gray-100 text-black border-2 border-gray-300"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
}