import Typewriter from "./Typewriter";
import { useLocation } from "wouter";
import { eips } from "@/data/eips";

export default function Hero() {
  const [, navigate] = useLocation();

  const handleRandomEIP = () => {
    const eipIds = Object.keys(eips);
    if (!eipIds.length) return;
    const randomId = eipIds[Math.floor(Math.random() * eipIds.length)];
    navigate(`/eip/${randomId}`);
  };
  const typewriterTexts = [
    "What do you wanna learn today?",
    "What can I help you with?",
    "Start with EIP-1559?",
    "Or ... ERC-8004?",
    "Let's GO 🚀🚀🚀 ! ~",
  ];

  return (
    <section
      className="relative w-full pt-20 pb-12 md:pt-24 md:pb-24 lg:pt-28 lg:pb-32 overflow-hidden"
    >
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Slogan & CTA */}
        <div className="flex flex-col gap-8 z-10">
          <div className="space-y-4 max-w-2xl lg:max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight text-shadow-pixel">
              LEARN 
              {/* <span className="text-primary">ERC</span>& */}
              <span className="text-accent">EIP</span>
              <br />
              THE FUN WAY!
            </h1>
            <p
              className="font-mono text-base sm:text-lg md:text-xl text-gray-300 bg-black/50 p-4 border-l-4 border-primary"
            >
              Your Web3 odyssey starts here!~ Level up your skills through play
              and visual storytelling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 mt-2">
            {/* Play Games Button */}
            <button
              onClick={handleRandomEIP}
              className="btn-pixel btn-pixel-danger text-base sm:text-lg group relative pl-14 sm:pl-16 pr-6 sm:pr-8 h-14 sm:h-16 overflow-visible"
            >
              <div className="absolute -left-4 -top-4 sm:-left-6 sm:-top-6 w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-200 group-hover:-rotate-12 z-20">
                <img
                  src="/images/icons/pixel-gamepad.png"
                  alt="Gamepad"
                  className="w-full h-full object-contain drop-shadow-lg transform -rotate-1"
                />
              </div>
              <span className="relative z-10">Play Games</span>
            </button>

            {/* Read Comics Button */}
            <button
              onClick={() => navigate("/comics")}
              className="btn-pixel btn-pixel-primary text-base sm:text-lg group relative pl-14 sm:pl-16 pr-6 sm:pr-8 h-14 sm:h-16 overflow-visible"
              style={{ borderColor: "#ffffff" }}
            >
              <div className="absolute -left-4 -top-4 sm:-left-6 sm:-top-6 w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-200 group-hover:rotate-12 z-20">
                <img
                  src="/images/icons/pixel-comic-book.png"
                  alt="Comic Book"
                  className="w-full h-full object-contain drop-shadow-lg transform rotate-6"
                />
              </div>
              <span className="relative z-10">Read Comics</span>
            </button>

            {/* Ask AI Tutor Button */}
            <button
              className="btn-pixel btn-pixel-accent text-base sm:text-lg group relative pl-14 sm:pl-16 pr-6 sm:pr-8 h-14 sm:h-16 overflow-visible"
              style={{ borderColor: "#ffffff" }}
            >
              <div className="absolute -left-4 -top-4 sm:-left-6 sm:-top-6 w-16 h-16 sm:w-20 sm:h-20 transition-transform duration-300 group-hover:scale-160 group-hover:rotate-10 z-20">
                <img
                  src="/images/icons/pixel-panda-phd-red.png"
                  alt="Panda PhD"
                  className="w-full h-full object-contain drop-shadow-lg transform -rotate-16"
                />
              </div>
              <span className="relative z-10">Ask AI Tutor</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm sm:text-base md:text-lg font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-primary">+</span> Practice with ERC/EIP
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">+</span> Learn through stories
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">+</span> Ask Dr.Panda anytime
            </div>
          </div>
        </div>

        {/* Right: Mascot Animation */}
        <div className="relative flex justify-center items-center z-10 w-full mx-auto lg:mx-0 lg:h-full lg:items-stretch">
          {/* Speech Bubble */}
          <div
            className="absolute top-0 right-10 bg-white text-black p-4 font-mono text-sm border-4 border-black animate-float z-20 hidden md:block max-w-[230px]"
            style={{ width: "230px" }}
          >
            <div style={{ fontSize: "16px", minHeight: "48px" }}>
              <Typewriter texts={typewriterTexts} />
            </div>
            {/* Speech Bubble Arrow */}
            <div className="absolute bottom-[-10px] left-[-10px] w-0 h-0 border-t-[10px] border-t-transparent border-r-[20px] border-r-black border-b-[10px] border-b-transparent transform rotate-45"></div>
            <div className="absolute bottom-[-6px] left-[-6px] w-0 h-0 border-t-[8px] border-t-transparent border-r-[16px] border-r-white border-b-[8px] border-b-transparent transform rotate-45 z-10"></div>
          </div>

          {/* Mascot with Glow and Hover Bounce */}
          <div className="relative group cursor-pointer flex items-center justify-center lg:h-full lg:w-full">
            {/* Yellow Glow Background */}
            <div className="absolute inset-0 bg-yellow-400/30 blur-[50px] rounded-full scale-75 group-hover:scale-90 transition-transform duration-500"></div>

            <img
              src="/images/hero_right.png"
              alt="AI Tutor Mascot"
              className="relative z-10 w-full max-w-[520px] sm:max-w-[600px] lg:max-w-none lg:w-full lg:h-full object-contain drop-shadow-[0_0_15px_rgba(0,255,255,0.3)] transition-transform duration-300 group-hover:-translate-y-4 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
