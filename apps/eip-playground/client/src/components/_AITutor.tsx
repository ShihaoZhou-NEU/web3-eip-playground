import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TutorPose = 
  | "standing"
  | "sitting-relaxed"
  | "working"
  | "thinking"
  | "teaching"
  | "praising";

export type TutorMessage = {
  id: string;
  role: "tutor" | "user";
  content: string;
  timestamp: number;
};

type AITutorProps = {
  pose: TutorPose;
  message?: string;
  onMessageComplete?: () => void;
  onUserMessage?: (message: string) => void;
  chatHistory?: TutorMessage[];
  showInput?: boolean;
};

const POSE_IMAGES: Record<TutorPose, string> = {
  "standing": "/images/tutor/panda-standing.png",
  "sitting-relaxed": "/images/tutor/panda-sitting-relaxed.png",
  "working": "/images/tutor/panda-working.png",
  "thinking": "/images/tutor/panda-thinking.png",
  "teaching": "/images/tutor/panda-teaching.png",
  "praising": "/images/tutor/panda-praising.png",
};

export default function AITutor({
  pose,
  message,
  onMessageComplete,
  onUserMessage,
  chatHistory = [],
  showInput = false,
}: AITutorProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Word-by-word typewriter effect
  useEffect(() => {
    if (!message) {
      setDisplayedMessage("");
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedMessage("");

    const words = message.split(" ");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedMessage((prev) => 
          prev + (prev ? " " : "") + words[currentIndex]
        );
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
        onMessageComplete?.();
      }
    }, 100); // Speed: 100ms per word

    return () => clearInterval(interval);
  }, [message, onMessageComplete]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, displayedMessage]);

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    onUserMessage?.(userInput);
    setUserInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-4"
    >
      {/* Tutor Character */}
      <motion.div
        key={pose}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-48 h-48 drop-shadow-2xl"
      >
        <img
          src={POSE_IMAGES[pose]}
          alt="AI Tutor"
          className="w-full h-full object-contain animate-float"
        />
      </motion.div>

      {/* Speech Bubble */}
      <AnimatePresence>
        {displayedMessage && (
          <motion.div
            initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white text-black p-4 rounded-lg border-4 border-black shadow-lg max-w-md"
          >
            <p className="font-mono text-sm leading-relaxed">
              {displayedMessage}
              {isTyping && (
                <span className="inline-block w-2 h-4 ml-1 bg-black animate-pulse" />
              )}
            </p>
            {/* Speech Bubble Arrow */}
            <div className="absolute bottom-[-10px] right-8 w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-black border-b-[10px] border-b-transparent transform rotate-45" />
            <div className="absolute bottom-[-6px] right-[34px] w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent transform rotate-45 z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Box */}
      {showInput && !isTyping && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border-4 border-black rounded-lg p-3 shadow-lg max-w-md w-full"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border-2 border-gray-300 rounded font-mono text-sm focus:outline-none focus:border-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userInput.trim()}
              className="px-4 py-2 bg-primary text-white font-mono text-sm rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}