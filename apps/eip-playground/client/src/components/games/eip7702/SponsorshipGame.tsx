import React, { useState } from "react";
import { motion } from "framer-motion";
import { getEip7702TutorMessage } from "@/data/tutorScripts";

type SponsorshipGameProps = {
  // Forward tutor messages to the page-level tutor.
  onTutorSpeak?: (message: string) => void;
};

export const SponsorshipGame: React.FC<SponsorshipGameProps> = ({
  onTutorSpeak,
}) => {
  const [gasBalance, setGasBalance] = useState(0);
  const [hasApple, setHasApple] = useState(false);
  const [showPaymaster, setShowPaymaster] = useState(false);
  const [message, setMessage] = useState("YOU FOUND A LEGENDARY GOLDEN APPLE!");
  const [processing, setProcessing] = useState(false);

  const resetGame = () => {
    setGasBalance(0);
    setHasApple(false);
    setShowPaymaster(false);
    setMessage("YOU FOUND A LEGENDARY GOLDEN APPLE!");
    setProcessing(false);
  };

  const tryClaim = () => {
    if (gasBalance === 0) {
      setMessage("ERROR: INSUFFICIENT GAS! CANNOT CLAIM.");
      onTutorSpeak?.(getEip7702TutorMessage("sponsor_blocked"));
      setTimeout(() => {
        setShowPaymaster(true);
        setMessage("WAIT! A SPONSOR APPEARED!");
        onTutorSpeak?.(getEip7702TutorMessage("sponsor_appears"));
      }, 1500);
    }
  };

  const handleSponsorSign = () => {
    setProcessing(true);
    setMessage("SIGNING SPONSORSHIP REQUEST...");
    onTutorSpeak?.(getEip7702TutorMessage("sponsor_signing"));
    setTimeout(() => {
      setProcessing(false);
      setHasApple(true);
      setMessage("SUCCESS! GAS PAID BY SPONSOR!");
      onTutorSpeak?.(getEip7702TutorMessage("sponsor_success"));
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-8 bg-gray-900 border-4 border-white font-pixel text-white relative overflow-hidden mt-6 sm:mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 sm:mb-8">
        <div>
          <h2 className="text-base sm:text-xl text-yellow-400 mb-2 text-shadow-pixel">
            LEVEL 2: GAS CRISIS
          </h2>
          <p
            className="text-[10px] sm:text-xs text-gray-400 font-pixel"
            style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
          >
            MISSION: CLAIM THE GOLDEN APPLE
          </p>
        </div>
        <div className="text-left sm:text-right">
          <div
            className={`text-[10px] sm:text-sm ${gasBalance === 0 ? "text-red-500" : "text-green-400"} font-pixel font-bold`}
            style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
          >
            GAS: {gasBalance.toFixed(4)} ETH
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative min-h-[240px] sm:min-h-[300px] flex flex-col items-center justify-center gap-6 sm:gap-8 bg-black/30 border-2 border-white/10 p-3 sm:p-4">
        {/* Item Display */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: hasApple ? 1.2 : 1,
          }}
          transition={{
            y: { repeat: Infinity, duration: 2 },
            scale: { duration: 0.5 },
          }}
          className="text-6xl filter drop-shadow-lg"
        >
          <motion.img
            key={hasApple ? "triumph" : "apple"}
            src={
              hasApple
                ? "/images/eip7702/sponsorship-2-warrior-triumph.png"
                : "/images/eip7702/sponsorship-1-golden-apple.png"
            }
            alt={
              hasApple
                ? "Warrior holding golden apple"
                : "Golden apple on pedestal"
            }
            className="w-full rounded-xl max-w-[240px] sm:max-w-sm h-auto border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        {/* Controls */}
        {!hasApple && !showPaymaster && (
          <button
            onClick={tryClaim}
            className="px-5 sm:px-8 py-3 sm:py-4 bg-yellow-600 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all text-[10px] sm:text-sm font-bold"
          >
            CLAIM REWARD
          </button>
        )}

        {/* Paymaster UI */}
        {showPaymaster && !hasApple && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 bg-gray-800 p-4 border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-xs z-10"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎩</span>
              <h3 className="text-green-400 text-[10px] sm:text-xs text-shadow-pixel">
                PAYMASTER
              </h3>
            </div>
            <p className="text-[10px] text-gray-300 mb-4 leading-relaxed font-pixel">
              "I'll cover the gas fees for you. Just sign here."
            </p>
            {processing ? (
              <div className="text-[10px] sm:text-xs text-green-400 animate-pulse font-pixel">
                PROCESSING...
              </div>
            ) : (
              <button
                onClick={handleSponsorSign}
                className="w-full py-2 bg-green-600 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all text-[10px] sm:text-xs font-bold"
              >
                ACCEPT SPONSORSHIP
              </button>
            )}
          </motion.div>
        )}

        {/* Success State */}
        {hasApple && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <h3 className="text-base sm:text-xl text-green-400 mb-2 text-shadow-pixel">
              ITEM CLAIMED!
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-400 mb-4 sm:mb-6 font-pixel">
              Gas Paid: 0.00 ETH (User) / 0.005 ETH (Sponsor)
            </p>
            <button
              onClick={resetGame}
              className="px-5 sm:px-6 py-2 border-2 border-white hover:bg-white hover:text-black transition-colors text-[10px] sm:text-xs font-bold"
            >
              REPLAY
            </button>
          </motion.div>
        )}

        {/* Message Toast */}
        <div className="flex flex-col items-center">
          {message && (
            <div
              className={`mt-3 sm:mt-4 bg-gray-800 px-3 sm:px-4 py-2 border-2 border-white text-[10px] sm:text-xs ${
                message.includes("ERROR") ? "text-red-400" : "text-yellow-300"
              } font-pixel font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
              style={{ fontFamily: '"Press Start 2P", system-ui, sans-serif' }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
