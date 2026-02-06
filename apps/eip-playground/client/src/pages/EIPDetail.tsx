import { useRoute, useLocation } from "wouter";
import { eips, EIPSection } from "@/data/eips";
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
import {
  getTutorGreeting,
  getTutorPageGreeting,
} from "@/data/tutorScripts";
import { useState, useEffect, useCallback, useRef, type ComponentType } from "react";

export default function EIPDetail() {
  const [match, params] = useRoute("/eip/:id");
  const [, navigate] = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [tutorPose, setTutorPose] = useState<TutorPose>("standing");
  const [tutorMessage, setTutorMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<TutorMessage[]>([]);
  const greetedEipRef = useRef<string | null>(null);
  const greetedGameRef = useRef<Record<string, boolean>>({});
  const activeGameRef = useRef<Record<string, boolean>>({});
  const gameSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const GAME_COMPONENTS: Record<
    string,
    ComponentType<{ onTutorSpeak?: (message: string, pose?: TutorPose) => void }>
  > = {
    gaswar: GasWarGame,
    burner: BurnerGame,
    batching: BatchingGame,
    sponsorship: SponsorshipGame,
    delegation: DelegationGame,
    academy: AgentAcademyGame,
  };

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

  const eip = params?.id ? eips[params.id] : undefined;

  const setGameSectionRef = useCallback(
    (gameId: string) => (el: HTMLDivElement | null) => {
      gameSectionRefs.current[gameId] = el;
    },
    []
  );

  const makeGameTutorSpeak = useCallback(
    (gameId: string) =>
      (message: string, pose: TutorPose = "standing") => {
        if (!eip?.id) return;
        const key = `${eip.id}:${gameId}`;
        if (!activeGameRef.current[key]) return;
        tutorSpeak(message, pose);
      },
    [eip?.id, tutorSpeak]
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Page-level greeting should only fire once per EIP.
    if (!eip) return;
    if (greetedEipRef.current === eip.id) return;
    greetedEipRef.current = eip.id;
    tutorSpeak(getTutorPageGreeting({ eipId: eip.id }), "standing");
  }, [eip, tutorSpeak]);

  useEffect(() => {
    if (!eip) return;
    window.scrollTo(0, 0);
  }, [eip?.id]);

  useEffect(() => {
    // Trigger game greetings when each game section is scrolled into view.
    if (!eip) return;

    const observers: IntersectionObserver[] = [];

    const observeGame = (gameId: string) => {
      const el = gameSectionRefs.current[gameId];
      if (!el) return;
      const key = `${eip.id}:${gameId}`;
      if (greetedGameRef.current[key]) return;

      const observer = new IntersectionObserver(
        entries => {
          const [entry] = entries;
          if (entry?.isIntersecting) {
            activeGameRef.current[key] = true;
            greetedGameRef.current[key] = true;
            tutorSpeak(getTutorGreeting({ eipId: eip.id, gameId }), "standing");
            observer.disconnect();
          }
        },
        { threshold: 0.35 }
      );

      observer.observe(el);
      observers.push(observer);
    };

    const gameIds =
      eip.sections
        ?.filter(section => section.type === "games")
        .flatMap(
          section => (section as Extract<EIPSection, { type: "games" }>).blocks
        )
        .map(block => block.gameId) ?? [];

    gameIds.forEach(observeGame);

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
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
        className="fixed top-24 sm:top-28 left-3 sm:left-6 z-50 p-2 sm:p-3 bg-black/80 hover:bg-black text-white border-4 border-white/40 hover:border-white transition-all shadow-lg flex items-center justify-center group"
        aria-label="Go back"
        style={{ imageRendering: "pixelated" }}
      >
        <ChevronLeft
          size={24}
          className="sm:hidden group-hover:-translate-x-1 transition-transform"
        />
        <ChevronLeft
          size={32}
          className="hidden sm:block group-hover:-translate-x-1 transition-transform"
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

        {eip.sections.map((section, index) => {
          if (section.type === "comic") {
            if (!eip.comic) return null;
            return (
              <div key={`comic-${index}`} className="mb-7">
                <ComicReader
                  eipId={eip.id}
                  pageCount={eip.comic.pageCount}
                  title={eip.comic.title}
                />
              </div>
            );
          }

          if (section.type === "games") {
            const spacingClass =
              section.spacingClass ?? "space-y-8 md:space-y-12";
            return (
              <div key={`games-${index}`} className="mb-10 md:mb-12 space-y-6 md:space-y-8">
                <div className="bg-card border-4 border-border rounded-xl p-4 sm:p-6 md:p-8 shadow-lg">
                  <h2 className="text-2xl sm:text-3xl font-pixel text-center mb-6 md:mb-8 text-primary text-shadow-pixel">
                    {section.title}
                  </h2>

                  <div className={spacingClass}>
                    {section.intro && (
                      <div className="text-center mb-6 md:mb-8">
                        <p className="font-pixel text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
                          {section.intro}
                        </p>
                      </div>
                    )}

                    {section.blocks.map((block, blockIndex) => {
                      const GameComponent = GAME_COMPONENTS[block.gameId];
                      if (!GameComponent) return null;

                      const blockContent = (
                        <div ref={setGameSectionRef(block.gameId)}>
                          <GameComponent
                            onTutorSpeak={makeGameTutorSpeak(block.gameId)}
                          />
                        </div>
                      );

                      if (!block.title && !block.description) {
                        return (
                          <div key={`${block.gameId}-${blockIndex}`}>
                            {blockContent}
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`${block.gameId}-${blockIndex}`}
                          className={`${block.dividerTop ? "border-t border-gray-800 pt-12" : ""}`}
                        >
                          {block.title && (
                            <h3 className="text-lg sm:text-xl font-mono font-bold text-center mb-4 text-gray-400">
                              {block.title}
                            </h3>
                          )}
                          {block.description && (
                            <p className="text-center text-gray-500 mb-6 max-w-3xl font-pixel mx-auto text-sm sm:text-base">
                              {block.description}
                            </p>
                          )}
                          {blockContent}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          if (section.type === "content") {
            if (!eip.content) return null;
            return (
              <div
                key={`content-${index}`}
                className="bg-card font-pixel border-4 border-border rounded-xl p-4 sm:p-6 md:p-8 shadow-lg prose prose-invert max-w-none markdown-content"
              >
                <Streamdown>{eip.content}</Streamdown>
              </div>
            );
          }

          return null;
        })}
      </main>

      <Footer />
    </div>
  );
}
