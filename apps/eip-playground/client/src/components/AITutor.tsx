import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

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
  chatHistory?: TutorMessage[];
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
  chatHistory = [],
}: AITutorProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Word-by-word typewriter effect
  useEffect(() => {
    if (!message) {
      // Don't clear the message - keep it persistent
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
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatOpen]);

  return (
    <>
      {/* Fixed Container for Tutor and Dialog */}
      <div className="fixed bottom-4 right-4 z-50 w-48 h-96 pointer-events-none">
        {/* Speech Bubble - Absolutely positioned above character */}
        <AnimatePresence>
          {displayedMessage && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-56 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded-lg border-4 border-black shadow-lg max-w-md pointer-events-auto"
            >
              <p className="font-mono text-sm leading-relaxed">
                {displayedMessage}
                {isTyping && (
                  <span className="inline-block w-2 h-4 ml-1 bg-black animate-pulse" />
                )}
              </p>
              {/* Speech Bubble Arrow pointing down */}
              <div className="absolute bottom-[-14px] left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[14px] border-t-black" />
                <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
              </div>

              {/* Chat History Toggle Button - Top Right of Dialog */}
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors border-2 border-black pointer-events-auto"
                aria-label="Toggle chat history"
              >
                {isChatOpen ? <X size={16} /> : <MessageCircle size={16} />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tutor Character - Fixed at bottom */}
        <motion.div
          key={pose}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 w-48 h-48 drop-shadow-2xl"
        >
          <img
            src={POSE_IMAGES[pose]}
            alt="AI Tutor"
            className="w-full h-full object-contain animate-float"
          />
        </motion.div>
      </div>

      {/* Collapsible Chat History Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 right-4 bottom-80 w-96 bg-white border-4 border-black rounded-[10px] shadow-2xl z-40 flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary text-white px-4 py-3 font-mono font-bold border-b-4 border-black rounded-t-[6px]">
              Chat History
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatHistory.length === 0 ? (
                <p className="text-gray-500 text-center font-mono text-sm mt-8">
                  No messages yet. Dr. Panda will guide you through the game!
                </p>
              ) : (
                chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "tutor" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg font-mono text-sm ${
                        msg.role === "tutor"
                          ? "bg-gray-100 border-2 border-gray-300"
                          : "bg-primary/10 border-2 border-primary/30"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}