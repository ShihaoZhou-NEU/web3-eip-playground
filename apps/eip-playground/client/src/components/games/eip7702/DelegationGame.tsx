import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getEip7702TutorMessage } from "@/data/tutorScripts";
import { trackEvent } from "@/lib/analytics";

// Comic panels data
const PANELS = [
  {
    id: 1,
    image: "/images/eip7702/delegation-1-panda-cliff.png",
    status: "EOA",
    story:
      "As an EOA panda villager, you can only run on flat ground. Suddenly, you encounter a massive cliff that seems impossible to cross!",
  },
  {
    id: 2,
    image: "/images/eip7702/delegation-2-transformation.png",
    status: "TRANSFORMING",
    story:
      "You pull out the EIP-7702 transformation device! The device emits powerful energy, preparing to inject smart contract code into your EOA address.",
  },
  {
    id: 3,
    image: "/images/eip7702/delegation-3-flying.png",
    status: "SMART CONTRACT",
    story:
      "Transformation complete! You've become Panda Superman with flying abilities! You soar across the impossible abyss with ease.",
  },
  {
    id: 4,
    image: "/images/eip7702/delegation-4-landing.png",
    status: "EOA",
    story:
      "Mission accomplished! The transformation timer expires, and you safely return to your normal panda villager form. EIP-7702 lets you become a superhero when needed, then return to simplicity.",
  },
];

type DelegationGameProps = {
  // Forward tutor messages to the page-level tutor.
  onTutorSpeak?: (message: string) => void;
};

const DelegationGame: React.FC<DelegationGameProps> = ({ onTutorSpeak }) => {
  const gameContext = { eip_id: "eip-7702", game_id: "delegation" };
  const [currentPanel, setCurrentPanel] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);

  // Preload all images
  useEffect(() => {
    const imagePromises = PANELS.map(panel => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = panel.image;
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(err => {
        console.error("Failed to preload images:", err);
        setImagesLoaded(true); // Still show UI even if preload fails
      });
  }, []);

  const nextPanel = () => {
    if (currentPanel < PANELS.length - 1) {
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        trackEvent("game_start", gameContext);
      }
      setDirection("forward");
      setCurrentPanel(currentPanel + 1);
    }
  };

  const prevPanel = () => {
    if (currentPanel > 0) {
      setDirection("backward");
      setCurrentPanel(currentPanel - 1);
    }
  };

  const reset = () => {
    setDirection("backward");
    setCurrentPanel(0);
    hasStartedRef.current = false;
    hasCompletedRef.current = false;
  };

  const panel = PANELS[currentPanel];

  useEffect(() => {
    // Speak when the panel changes so the tutor narrates the story.
    const key = `panel_${panel.id}` as const;
    onTutorSpeak?.(getEip7702TutorMessage(key));
  }, [panel.id, onTutorSpeak]);

  useEffect(() => {
    if (currentPanel !== PANELS.length - 1) return;
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    trackEvent("game_complete", { ...gameContext, success: true });
  }, [currentPanel]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 bg-gray-900 border-4 border-white font-pixel text-white relative overflow-hidden mt-6 sm:mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <h2 className="text-base sm:text-xl text-yellow-400 mb-2 text-shadow-pixel">
          LEVEL 3: THE GREAT LEAP
        </h2>
        <p
          className="text-[10px] sm:text-xs text-gray-400 font-sans"
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          MISSION: CROSS THE IMPOSSIBLE ABYSS
        </p>
      </div>

      {/* Status Display - Above Comic */}
      <div className="flex justify-center mb-3 sm:mb-4">
        <div
          className={`px-4 sm:px-6 py-2 sm:py-3 border-4 ${panel.status === "SMART CONTRACT" ? "bg-blue-600 border-blue-400" : panel.status === "TRANSFORMING" ? "bg-yellow-600 border-yellow-400" : "bg-gray-700 border-gray-500"} font-sans font-bold text-sm sm:text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]`}
          style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
        >
          {panel.status === "SMART CONTRACT"
            ? "🚀 SMART CONTRACT"
            : panel.status === "TRANSFORMING"
              ? "⚡ TRANSFORMING"
              : "🦖 EOA MODE"}
        </div>
      </div>

      {/* Comic Panel */}
      <div className="relative min-h-[260px] sm:min-h-[400px] flex flex-col items-center justify-center bg-black/30 border-2 border-white/10 p-3 sm:p-4">
        <motion.img
          key={panel.id}
          src={panel.image}
          alt={`Panel ${panel.id}`}
          className="w-full max-w-3xl h-auto border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, x: direction === "forward" ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction === "forward" ? -100 : 100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />

        {/* Panel Counter */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-black/70 px-2 sm:px-3 py-1 border-2 border-white">
          <span className="text-[10px] sm:text-xs font-sans font-bold">
            {currentPanel + 1} / {PANELS.length}
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
        <button
          onClick={prevPanel}
          disabled={currentPanel === 0}
          className={`px-5 sm:px-6 py-2 border-2 border-white font-bold text-[10px] sm:text-sm ${currentPanel === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white hover:text-black"} transition-colors`}
        >
          ← PREV
        </button>

        {currentPanel === PANELS.length - 1 ? (
          <button
            onClick={reset}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-yellow-600 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all text-[10px] sm:text-sm font-bold"
          >
            REPLAY
          </button>
        ) : (
          <button
            onClick={nextPanel}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all text-[10px] sm:text-sm font-bold"
          >
            NEXT →
          </button>
        )}
      </div>

      {/* Story Message Box */}
      <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-black/70 border-2 border-white/30">
        <motion.p
          key={panel.id}
          className="text-xs sm:text-sm text-gray-200 leading-relaxed font-pixel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {panel.story}
        </motion.p>
      </div>
    </div>
  );
};

export default DelegationGame;
