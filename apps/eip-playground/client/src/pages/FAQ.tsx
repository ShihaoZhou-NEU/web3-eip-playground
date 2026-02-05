import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const response = await fetch("/faq/questions.md");
        const content = await response.text();
        
        // Parse markdown content
        const sections = content.split(/^##\s+/m).filter(Boolean);
        const parsedFAQs: FAQItem[] = [];
        
        sections.forEach((section, index) => {
          // Skip the first section if it's just the title
          if (section.startsWith("#")) return;
          
          const lines = section.trim().split("\n");
          const question = lines[0].trim();
          const answer = lines.slice(1).join("\n").trim().replace(/^---+$/gm, "");
          
          if (question && answer) {
            parsedFAQs.push({
              id: index,
              question,
              answer,
            });
          }
        });
        
        setFaqs(parsedFAQs);
      } catch (error) {
        console.error("Failed to load FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-2xl font-pixel text-primary animate-pulse">
            LOADING FAQ...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Banner Placeholder */}
      <div className="w-full h-64 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 border-y-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <HelpCircle className="w-32 h-32 text-primary/20" />
        </div>
        {/* Pixel grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
      </div>

      <div className="container max-w-4xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <HelpCircle className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-pixel text-primary pixel-text-shadow">
              FAQ
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-mono">
            常见问题解答 · Frequently Asked Questions
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card
              key={faq.id}
              className="border-2 border-primary/30 hover:border-primary transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-primary/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-pixel text-xl shrink-0">
                      Q{faq.id + 1}
                    </span>
                    <h3 className="text-xl font-bold text-foreground">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <ChevronDown
                  className={`w-6 h-6 text-primary shrink-0 transition-transform duration-300 ${
                    openId === faq.id ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Accordion Content */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  openId === faq.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2">
                    <div className="flex items-start gap-3 pl-10">
                      <span className="text-accent font-pixel text-xl shrink-0">
                        A
                      </span>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <Card className="p-8 border-2 border-accent/30 bg-accent/5">
            <h2 className="text-2xl font-pixel text-accent mb-4">
              还有其他问题？
            </h2>
            <p className="text-muted-foreground mb-6">
              如果你的问题没有在这里找到答案，欢迎访问 Team 页面联系我们！
            </p>
            <a
              href="/team"
              className="inline-block px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground font-pixel rounded transition-colors"
            >
              CONTACT TEAM
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}