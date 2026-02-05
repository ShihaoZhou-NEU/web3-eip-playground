import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import Header from "@/components/Header";
import "nes.css/css/nes.min.css";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  github?: string;
  twitter?: string;
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/team/members.json");
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Failed to load team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Banner Placeholder */}
      <div className="w-full h-64 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 border-y-4 border-primary relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Users className="w-32 h-32 text-primary/20" />
        </div>
        {/* Pixel grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
      </div>

      <div className="container max-w-6xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Users className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-pixel text-primary pixel-text-shadow">
              TEAM
            </h1>
          </div>
          <p className="text-lg text-muted-foreground font-mono">
            关于我们 · About Us
          </p>
        </div>

        {/* Project Introduction */}
        <Card className="mb-16 p-8 md:p-12 border-4 border-primary bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur">
          <h2 className="text-3xl md:text-4xl font-pixel text-primary mb-6 pixel-text-shadow">
            PROJECT INTRODUCTION
          </h2>
          
          <div className="space-y-4 text-lg leading-relaxed">
            <p className="text-foreground">
              <strong className="text-primary">EIP Playground</strong> 是一个创新的 Web3 学习平台，致力于通过游戏化的方式让以太坊改进提案（EIP）的学习变得有趣且易于理解。
            </p>
            
            <p className="text-muted-foreground">
              我们相信，复杂的技术概念不应该成为学习的障碍。通过像素风格的互动游戏、生动的漫画讲解和 AI 导师的实时指导，我们将枯燥的技术文档转化为引人入胜的学习体验。
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-card/50 p-6 rounded-lg border-2 border-primary/30">
                <div className="mb-4">
                  <i className="nes-icon trophy is-large"></i>
                </div>
                <h3 className="font-pixel text-xl text-primary mb-2">游戏化学习</h3>
                <p className="text-sm text-muted-foreground">
                  在玩的过程中掌握核心概念，让学习不再枯燥
                </p>
              </div>

              <div className="bg-card/50 p-6 rounded-lg border-2 border-accent/30">
                <div className="mb-4">
                  <i className="nes-icon heart is-large"></i>
                </div>
                <h3 className="font-pixel text-xl text-accent mb-2">AI 导师</h3>
                <p className="text-sm text-muted-foreground">
                  Dr. Panda 全程陪伴，提供个性化指导和即时反馈
                </p>
              </div>

              <div className="bg-card/50 p-6 rounded-lg border-2 border-green-500/30">
                <div className="mb-4">
                  <i className="nes-icon star is-large"></i>
                </div>
                <h3 className="font-pixel text-xl text-green-500 mb-2">NFT 徽章</h3>
                <p className="text-sm text-muted-foreground">
                  完成挑战获得链上成就证明，展示你的学习成果
                </p>
              </div>
            </div>

            <p className="text-muted-foreground mt-6">
              我们的使命是降低 Web3 学习门槛，让更多开发者能够轻松理解和应用以太坊生态系统中的先进技术。无论你是区块链新手还是经验丰富的开发者，EIP Playground 都能为你提供有价值的学习体验。
            </p>
          </div>
        </Card>

        {/* Team Members Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-pixel text-primary mb-8 text-center pixel-text-shadow">
            MEET THE TEAM
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-2xl font-pixel text-primary animate-pulse">
              LOADING TEAM...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <Card
                key={member.id}
                className="group overflow-hidden border-4 border-primary/30 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-card/50 backdrop-blur"
              >
                {/* Avatar */}
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  {member.avatar ? (
                    <img 
                      src={member.avatar} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-8xl font-pixel text-primary/30">
                        {member.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  {/* Pixel grid overlay */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDAgTCAyMCAwIEwgMjAgMjAgTCAwIDIwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-pixel text-foreground mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  
                  <div className="text-accent font-mono text-sm mb-4">
                    {member.role}
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">
                    {member.bio}
                  </p>

                  {/* Social Links with NES.css icons */}
                  <div className="flex gap-3">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block hover:scale-110 transition-transform"
                        aria-label="GitHub"
                      >
                        <i className="nes-icon github is-medium"></i>
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block hover:scale-110 transition-transform"
                        aria-label="Twitter"
                      >
                        <i className="nes-icon twitter is-medium"></i>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Join Us Section */}
        <Card className="mt-16 p-8 text-center border-2 border-accent/30 bg-accent/5">
          <h2 className="text-2xl font-pixel text-accent mb-4">
            JOIN US
          </h2>
          <p className="text-muted-foreground mb-6">
            我们正在寻找充满热情的开发者、设计师和内容创作者加入我们的团队！
            <br />
            如果你对 Web3 教育充满热情，欢迎通过上方团队成员的社交媒体联系我们。
          </p>
          <div className="inline-block px-6 py-3 bg-accent/20 text-accent font-pixel rounded border-2 border-accent/50">
            WE'RE HIRING!
          </div>
        </Card>
      </div>
    </div>
  );
}