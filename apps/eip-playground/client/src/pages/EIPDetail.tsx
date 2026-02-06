import { useRoute, useLocation } from "wouter";
import { eips } from "@/data/eips";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Streamdown } from "streamdown";
import NotFound from "./NotFound";
import GasWarGame from "@/components/games/eip1559/GasWarGame";
import BurnerGame from "@/components/games/eip1559/BurnerGame";
import { BatchingGame } from "@/components/games/eip7702/BatchingGame";
import { SponsorshipGame } from "@/components/games/eip7702/SponsorshipGame";
import DelegationGame from "@/components/games/eip7702/DelegationGame";
import AgentAcademyGame from "@/components/games/erc8004/AgentAcademyGame";
import ComicReader from "@/components/ComicReader";
import { ChevronLeft, ChevronUp } from "lucide-react";
import AITutor, { TutorPose, TutorMessage } from "@/components/AITutor";
import { getTutorPageGreeting } from "@/lib/tutorScripts";
import { useState, useEffect, useCallback, useRef } from "react";

export default function EIPDetail() {
  const [match, params] = useRoute("/eip/:id");
  const [, navigate] = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tutorPose, setTutorPose] = useState<TutorPose>("standing");
  const [tutorMessage, setTutorMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<TutorMessage[]>([]);
  const greetedEipRef = useRef<string | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate("/");
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tutorSpeak = useCallback(
    (message: string, pose: TutorPose = "standing") => {
      setTutorPose(pose);
      setTutorMessage(message);
      setChatHistory(prev => [
        ...prev,
        {
          id: `tutor-${Date.now()}-${Math.random()}`,
          role: "tutor",
          content: message,
          timestamp: Date.now(),
        },
      ]);
    },
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const eip = params?.id ? eips[params.id] : undefined;

  useEffect(() => {
    if (!eip) return;
    if (greetedEipRef.current === eip.id) return;
    greetedEipRef.current = eip.id;
    tutorSpeak(getTutorPageGreeting({ eipId: eip.id }), "standing");
  }, [eip, tutorSpeak]);

  if (!match || !params?.id || !eip) return <NotFound />;

  return (
    <div
      className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground"
      style={{
        animation: "zoomIn 0.5s ease-out",
      }}
    >
      <style>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <Header />

      {/* Fixed Back Button */}
      <button
        onClick={handleBack}
        className="fixed top-25 left-10 z-50 p-3 bg-black/80 hover:bg-black text-white border-4 border-white/40 hover:border-white transition-all shadow-lg hidden xl:flex items-center justify-center group"
        aria-label="Go back"
        style={{ imageRendering: "pixelated" }}
      >
        <ChevronLeft
          size={32}
          className="group-hover:-translate-x-1 transition-transform"
        />
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary/80 hover:bg-primary text-white border-4 border-primary-foreground/40 hover:border-primary-foreground transition-all shadow-lg flex items-center justify-center group"
          aria-label="Scroll to top"
          style={{ imageRendering: "pixelated" }}
        >
          <ChevronUp
            size={32}
            className="group-hover:-translate-y-1 transition-transform"
          />
        </button>
      )}

      <main className="flex-1 container py-8 sm:py-10 md:py-12">
        <AITutor
          pose={tutorPose}
          message={tutorMessage}
          onMessageComplete={() => {}}
          chatHistory={chatHistory}
        />
        {/* Hero Section */}
        <div
          className={`relative rounded-xl overflow-hidden p-5 sm:p-8 md:p-12 mb-10 md:mb-12 border-4 border-white/20 ${eip.gradient}`}
        >
          <div className="absolute inset-0 bg-[url('/images/pixel-space-bg.png')] opacity-20 mix-blend-overlay bg-cover bg-center" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="bg-black/40 p-4 rounded-xl border-2 border-white/20 backdrop-blur-sm shrink-0">
              <img
                src={eip.image}
                alt={eip.title}
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain pixelated"
              />
            </div>

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-pixel text-white text-shadow-pixel">
                  {eip.title}
                </h1>
                {/* <span className="text-4xl">{eip.icon}</span> */}
              </div>
              <p className="text-lg sm:text-2xl md:text-3xl font-mono font-bold text-white/90 mb-3 md:mb-4">
                {eip.subtitle}
              </p>
              <p className="text-sm sm:text-base text-white/80 max-w-3xl font-pixel mx-auto md:mx-0">
                {eip.description}
              </p>
            </div>
          </div>
        </div>

        {/* Comic Reader Section */}
        {eip.comic && (
          <div className="mb-7">
            <ComicReader
              eipId={eip.id}
              pageCount={eip.comic.pageCount}
              title={eip.comic.title}
            />
          </div>
        )}

        {/* Interactive Games for EIP-1559 */}
        {eip.id === "eip-1559" && (
          <div className="mb-10 md:mb-12 space-y-6 md:space-y-8">
            <div className="bg-card border-4 border-border rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-pixel text-center mb-6 md:mb-8 text-primary text-shadow-pixel">
                Interactive Demo: Before vs After
              </h2>

              <div className="space-y-10 md:space-y-12">
                <div>
                  <h3 className="text-lg sm:text-xl font-mono font-bold text-center mb-4 text-gray-400">
                    PART 1: THE OLD WAY (First-Price Auction)
                  </h3>
                  <p className="text-center font-pixel text-gray-500 mb-6 max-w-3xl mx-auto text-sm sm:text-base">
                    Before EIP-1559, you had to guess the gas price. Bid too
                    low? You wait forever. Bid too high? You overpay. Try to
                    beat the NPCs!
                  </p>
                  <GasWarGame />
                </div>

                <div className="border-t border-gray-800 pt-12">
                  <h3 className="text-lg sm:text-xl font-mono font-bold text-center mb-4 text-gray-400">
                    PART 2: THE NEW WAY (EIP-1559 Mechanism)
                  </h3>
                  <p className="text-center text-gray-500 mb-6 max-w-3xl font-pixel mx-auto text-sm sm:text-base">
                    EIP-1559 introduced a predictable base fee that burns, plus
                    a tip to miners. No more guessing games!
                  </p>
                  <BurnerGame onTutorSpeak={tutorSpeak} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Games for EIP-7702 */}
        {eip.id === "eip-7702" && (
          <div className="mb-10 md:mb-12 space-y-6 md:space-y-8">
            <div className="bg-card border-4 border-border rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-pixel text-center mb-6 md:mb-8 text-primary text-shadow-pixel">
                Game Start: The Power of Set Code
              </h2>

              <div className="space-y-8 md:space-y-12">
                <BatchingGame onTutorSpeak={tutorSpeak} />
                <SponsorshipGame />
                <DelegationGame />
              </div>
            </div>
          </div>
        )}

        {/* Interactive Games for ERC-8004 */}
        {eip.id === "erc-8004" && (
          <div className="mb-10 md:mb-12 space-y-6 md:space-y-8">
            <div className="bg-card border-4 border-border rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
              <h2 className="text-2xl sm:text-3xl font-pixel text-center mb-6 md:mb-8 text-primary text-shadow-pixel">
                Agent Academy: Trustless AI
              </h2>

              <div className="space-y-10 md:space-y-12">
                <div className="text-center mb-6 md:mb-8">
                  <p className="font-pixel text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                    Welcome to the Agent Academy! Your goal is to train an AI
                    agent that can be trusted by the blockchain. Navigate
                    through the three pillars of ERC-8004: Identity, Reputation,
                    and Validation.
                  </p>
                </div>
                <AgentAcademyGame onTutorSpeak={tutorSpeak} />
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        {eip.content && (
          <div className="bg-card font-pixel border-4 border-border rounded-xl p-4 sm:p-6 md:p-8 shadow-lg prose prose-invert max-w-none">
            <Streamdown>{eip.content}</Streamdown>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
