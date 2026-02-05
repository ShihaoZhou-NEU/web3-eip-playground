import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComicReader from "@/components/ComicReader";
import { eips } from "@/data/eips";

const ComicsPage = () => {
  // Only show entries that have an associated comic folder with at least one page.
  const comicEips = useMemo(() => {
    return Object.values(eips).filter(
      eip => eip.comic && eip.comic.pageCount > 0
    );
  }, []);

  // Track the currently selected comic; default to the first available entry for immediate rendering.
  const [selectedEipId, setSelectedEipId] = useState<string | null>(
    comicEips[0]?.id ?? null
  );

  const pickRandomComic = useCallback(() => {
    if (!comicEips.length) return;
    const randomEip = comicEips[Math.floor(Math.random() * comicEips.length)];
    setSelectedEipId(randomEip.id);
  }, [comicEips]);

  useEffect(() => {
    pickRandomComic();
  }, [pickRandomComic]);

  const selectedEip = selectedEipId ? eips[selectedEipId] : undefined;

  return (
    <div className="min-h-screen flex flex-col relative bg-[radial-gradient(circle_at_top,_rgba(255,215,0,0.05),_transparent_60%)] text-white">
      <div className="fixed inset-0 bg-[url('/images/pixel-stars.png')] bg-cover opacity-60 pointer-events-none" />
      <Header />

      <main className="flex-1 pt-24 pb-16 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-10 px-4">
          <section className="bg-black/70 border-4 border-white/20 rounded-2xl p-10 shadow-pixel space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-primary font-mono">
                Story Studio
              </p>
              <h1 className="text-4xl md:text-5xl font-pixel text-white mt-4">
                Ethereum lore
              </h1>
            </div>
            {/* Hero CTA area with randomized and gallery shortcuts */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={pickRandomComic}
                className="btn-pixel btn-pixel-accent px-6 py-3 text-base"
              >
                Random Comic
              </button>
              <button
                onClick={() =>
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  })
                }
                className="btn-pixel btn-pixel-primary px-6 py-3 text-base border-white/60"
              >
                See the Gallery
              </button>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Reader panel */}
            <div className="bg-black/70 border-4 border-white/20 rounded-2xl shadow-pixel p-6">
              {selectedEip ? (
                <ComicReader
                  key={selectedEip.id}
                  eipId={selectedEip.id}
                  pageCount={selectedEip.comic?.pageCount ?? 0}
                  title={`COMIC: ${selectedEip.title}`}
                />
              ) : (
                <div className="h-[480px] flex items-center justify-center text-gray-300">
                  No comics available yet.
                </div>
              )}
            </div>

            {/* Gallery column */}
            <div className="bg-black/60 border-4 border-white/10 rounded-2xl shadow-pixel p-6 flex flex-col gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary font-mono">
                  Choose a story
                </p>
                <h2 className="text-2xl font-pixel mt-2 min-w-[340px]">
                  Comic Gallery
                </h2>
              </div>

              {/* List of selectable comic cards */}
              <div className="flex flex-col gap-3 overflow-hidden max-h-[560px]">
                {comicEips.map(comic => {
                  const isActive = comic.id === selectedEipId;
                  return (
                    <button
                      key={comic.id}
                      onClick={() => setSelectedEipId(comic.id)}
                      className={`relative h-20 rounded-2xl border-2 transition overflow-hidden shadow-pixel text-left px-6 py-3 flex flex-col justify-center group ${
                        isActive
                          ? "border-primary bg-white/10 shadow-[0_0_25px_rgba(255,215,0,0.35)]"
                          : "border-transparent hover:border-white/30 bg-white/5"
                      }`}
                      style={{
                        backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.85), rgba(5,5,5,0.45)), url(${comic.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* <span className="text-[0.75rem] tracking-[0.4em] uppercase text-primary font-mono mb-1">
                        {comic.id}
                      </span> */}
                      <span className="font-pixel text-xl text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.9)]">
                        {comic.id}
                      </span>
                      <span className="text-[0.65rem] uppercase tracking-[0.2em] text-primary mt-1">
                        {comic.subtitle}
                      </span>
                      <span className="absolute inset-0 border-2 border-white/0 pointer-events-none transition-all group-hover:border-white/20" />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ComicsPage;
