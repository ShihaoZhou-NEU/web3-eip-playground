import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Link } from "wouter";
import { Streamdown } from "streamdown";

interface BlogMetadata {
  title: string;
  date: string;
  author: string;
  summary: string;
  cover?: string;
}

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const [metadata, setMetadata] = useState<BlogMetadata | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/blog/${slug}/index.md`);
        if (!response.ok) {
          throw new Error("Post not found");
        }

        const rawContent = await response.text();

        // Parse YAML front matter
        // const frontMatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        const frontMatterMatch = rawContent.match(
          /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?([\s\S]*)$/
        );

        if (frontMatterMatch) {
          const frontMatter = frontMatterMatch[1];
          const markdownContent = frontMatterMatch[2];

          const meta: any = {};
          frontMatter.split("\n").forEach(line => {
            const [key, ...valueParts] = line.split(":");
            if (key && valueParts.length) {
              const value = valueParts
                .join(":")
                .trim()
                .replace(/^["']|["']$/g, "");
              meta[key.trim()] = value;
            }
          });

          setMetadata({
            title: meta.title || slug,
            date: meta.date || "",
            author: meta.author || "Anonymous",
            summary: meta.summary || "",
            cover: meta.cover,
          });

          setContent(markdownContent);
        } else {
          // No front matter, treat entire content as markdown
          setMetadata({
            title: slug,
            date: "",
            author: "Anonymous",
            summary: "",
          });
          setContent(rawContent);
        }
      } catch (err) {
        console.error("Failed to load blog post:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-2xl font-pixel text-primary animate-pulse">
            LOADING POST...
          </div>
        </div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto py-16 px-4">
          <Card className="p-12 text-center border-4 border-destructive">
            <h1 className="text-4xl font-pixel text-destructive mb-4">
              POST NOT FOUND
            </h1>
            <p className="text-muted-foreground mb-8">抱歉，找不到这篇文章。</p>
            <Link href="/blog">
              <Button
                variant="outline"
                className="font-pixel !rounded-lg border-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO BLOG
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-4xl mx-auto py-16 px-4 ">
        {/* Back Button */}
        <Link href="/blog">
          <Button
            variant="outline"
            className=" font-pixel !rounded-lg border-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO BLOG
          </Button>
        </Link>

        {/* Cover Image */}
        {metadata.cover && (
          <div className="mt-8 mb-8 rounded-lg overflow-hidden border-4 border-primary">
            <img
              src={metadata.cover}
              alt={metadata.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Article Header */}
        <Card className="p-8 mb-8 border-4 border-primary bg-gradient-to-br from-primary/10 to-accent/10">
          <h1 className="text-4xl md:text-5xl font-pixel text-primary mb-6 pixel-text-shadow">
            {metadata.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-mono">{metadata.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-mono">{metadata.author}</span>
            </div>
          </div>

          {metadata.summary && (
            <p className="mt-6 text-lg text-muted-foreground italic border-l-4 border-accent pl-4">
              {metadata.summary}
            </p>
          )}
        </Card>

        {/* Article Content */}
        <Card className="p-8 md:p-12 border-2 border-primary/30 bg-card/50 backdrop-blur">
          {/* <article className="prose prose-lg max-w-none dark:prose-invert
            prose-headings:font-pixel prose-headings:text-primary
            prose-p:text-foreground prose-p:leading-relaxed
            prose-a:text-accent prose-a:no-underline hover:prose-a:underline
            prose-code:text-accent prose-code:bg-accent/10 prose-code:px-2 prose-code:py-1 prose-code:rounded
            prose-pre:bg-muted prose-pre:border-2 prose-pre:border-primary/30
            prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:text-muted-foreground
            prose-strong:text-primary prose-strong:font-bold
            prose-ul:list-disc prose-ol:list-decimal
            prose-img:rounded-lg prose-img:border-2 prose-img:border-primary/30"> */}
          <Streamdown>{content}</Streamdown>
          {/* </article> */}
        </Card>

        {/* Back Button (Bottom) */}
        <div className="mt-12 text-center ">
          <Link href="/blog">
            <Button
              variant="outline"
              className="font-pixel !rounded-lg border-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO BLOG
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
