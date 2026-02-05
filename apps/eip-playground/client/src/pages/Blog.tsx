import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, User, BookOpen, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { Link } from "wouter";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  cover?: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Fetch blog manifest (list of slugs)
        const manifestResponse = await fetch("/blog/blog-manifest.json");
        const slugs: string[] = await manifestResponse.json();

        // Fetch metadata for each post
        const postsData = await Promise.all(
          slugs.map(async (slug) => {
            try {
              const response = await fetch(`/blog/${slug}/index.md`);
              const content = await response.text();

              // Parse YAML front matter
              const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
              if (frontMatterMatch) {
                const frontMatter = frontMatterMatch[1];
                const metadata: any = {};
                
                frontMatter.split("\n").forEach((line) => {
                  const [key, ...valueParts] = line.split(":");
                  if (key && valueParts.length) {
                    const value = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
                    metadata[key.trim()] = value;
                  }
                });

                return {
                  slug,
                  title: metadata.title || slug,
                  date: metadata.date || "",
                  author: metadata.author || "Anonymous",
                  summary: metadata.summary || "",
                  cover: metadata.cover,
                } as BlogPost;
              }

              return {
                slug,
                title: slug,
                date: "",
                author: "Anonymous",
                summary: "",
              } as BlogPost;
            } catch (error) {
              console.error(`Failed to load post ${slug}:`, error);
              return null;
            }
          })
        );

         // Filter out failed posts and sort by date
        const validPosts = postsData.filter((post): post is BlogPost => post !== null);
        validPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setPosts(validPosts);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-2xl font-pixel text-primary animate-pulse">
            LOADING BLOG...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Banner Placeholder */}
      <div className="w-full h-64 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-y-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-32 h-32 text-primary/20" />
        </div>
        {/* Pixel grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
      </div>

      <div className="container max-w-6xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <BookOpen className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-pixel text-primary pixel-text-shadow">
              BLOG
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-mono">
            技术文章 · Technical Articles
          </p>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground font-pixel">
              NO POSTS YET
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              敬请期待更多精彩内容！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card className="group h-full overflow-hidden border-4 border-primary/30 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-card/50 backdrop-blur cursor-pointer">
                  {/* Cover Image */}
                  {post.cover ? (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                      <img
                        src={post.cover}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-primary/30" />
                      </div>
                      {/* Pixel grid overlay */}
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="text-2xl font-pixel text-foreground mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-mono">{post.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span className="font-mono">{post.author}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.summary}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-primary font-pixel group-hover:gap-4 transition-all">
                      <span>READ MORE</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}