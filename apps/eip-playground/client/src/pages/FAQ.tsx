import { useState, useEffect } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Streamdown } from "streamdown";
import PageBanner from "@/components/PageBanner";
import { Link } from "wouter";

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
          const answer = lines
            .slice(1)
            .join("\n")
            .trim()
            .replace(/^---+$/gm, "");

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

      {/* Banner */}
      <PageBanner title="FAQ" subtitle="Frequently Asked Questions" />

      <div className="container max-w-4xl mx-auto py-10 sm:py-14 md:py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <div className="flex items-center justify-center gap-4 mb-4">
            <HelpCircle className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-pixel text-primary pixel-text-shadow">
              FAQ
            </h1>
          </div> */}
          {/* <p className="text-2xl text-muted-foreground font-mono">
            Frequently Asked Questions
          </p> */}
        </div>

        {/* FAQ List */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map(faq => (
            <Card
              key={faq.id}
              className="border-2 border-primary/30 hover:border-primary transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full p-4 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-primary/5 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <span className="text-primary font-pixel text-lg sm:text-xl shrink-0">
                      Q:
                      {/* {faq.id + 1} */}
                    </span>
                    <h3 className="text-base sm:text-xl font-bold text-foreground">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0 transition-transform duration-300 ${
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
                  <div className="px-4 sm:px-6 pb-6 pt-2">
                    <div className="flex items-start gap-3 pl-4 sm:pl-6">
                      <span className="text-accent font-pixel text-lg sm:text-xl shrink-0">
                        A:
                      </span>
                      <div className="markdown-content flex-1 min-w-0">
                        <Streamdown>{faq.answer}</Streamdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <Card className="p-5 sm:p-8 border-2 border-accent/30 bg-accent/5">
            <h2 className="text-xl sm:text-2xl font-pixel text-accent mb-4">
              More questions?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6">
              Didn't find what you need? Head over to the Team page and say
              hello!
            </p>
            <Link
              href="/team"
              className="inline-block px-5 py-3 bg-accent hover:bg-accent/80 text-accent-foreground font-pixel rounded transition-colors text-sm sm:text-base"
            >
              CONTACT TEAM
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
