import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, Trophy, Heart, Star, Github, Twitter } from "lucide-react";
import Header from "@/components/Header";
import PageBanner from "@/components/PageBanner";

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

      {/* Banner */}
      <PageBanner
        title="TEAM"
        subtitle="Meet the Creators Behind EIP Playground"
      />

      <div className="container max-w-7xl mx-auto py-10 sm:py-14 md:py-16 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          {/* <div className="flex items-center justify-center gap-4 mb-4">
            <Users className="w-12 h-12 text-primary" />
            <h1 className="text-5xl md:text-6xl font-pixel text-primary pixel-text-shadow">
              TEAM
            </h1>
          </div> */}
          <p className="text-lg sm:text-2xl text-muted-foreground font-mono">
            About Us
          </p>
        </div>

        {/* Project Introduction */}
        <Card className="mb-12 md:mb-16 p-5 sm:p-8 md:p-12 border-4 border-primary bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur relative overflow-hidden">
          {/* 装饰用的背景文字 - 增加游戏感 */}
          <div className="absolute -right-8 -bottom-8 text-primary/5 font-pixel text-6xl sm:text-8xl md:text-9xl rotate-12 pointer-events-none select-none">
            CODE
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-pixel text-primary mb-4 sm:mb-6 pixel-text-shadow">
            PROJECT INTRODUCTION
          </h2>

          <div className="space-y-4 text-sm sm:text-base md:text-lg leading-relaxed relative z-10">
            <p className="text-foreground">
              <strong className="text-primary">EIP Playground</strong> is an
              innovative Web3 arena where we turn daunting Ethereum Improvement
              Proposals (EIPs) into epic quests that are actually fun to beat!
            </p>

            <p className="text-muted-foreground">
              We believe complex tech shouldn't feel like a final boss. With
              pixel-perfect interactive games, vibrant comics, and real-time
              guidance from our AI mentor, we transform dusty tech docs into an
              immersive learning adventure.
            </p>

            {/* 栅格展示部分保持不变... */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
              {/* ... 之前的三个 Card 内容 ... */}
            </div>

            <p className="text-muted-foreground mt-6">
              Our mission is to break down the walls of Web3, making it easy for
              every developer to grasp and deploy cutting-edge Ethereum tech.
              Whether you're a Lvl. 1 noob or a Max Lvl. veteran, EIP Playground
              has a quest waiting for you.
            </p>

            {/* --- 新增的 GitHub 链接区域 --- */}
            <div className="mt-10 pt-6 border-t-2 border-primary/20 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <a
                href="https://github.com/David-0x221Eight/web3-eip-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground font-pixel rounded-none border-b-4 border-r-4 border-black/40 hover:border-b-2 hover:border-r-2 hover:translate-x-[2px] hover:translate-y-[2px] transition-all text-sm sm:text-base"
              >
                <Github className="w-6 h-6" />
                VIEW SOURCE CODE
              </a>
              <div className="flex flex-col">
                <span className="text-xs font-pixel text-accent animate-bounce">
                  NEW QUEST!
                </span>
                <span className="text-sm font-mono text-muted-foreground">
                  Contribute to the repository and earn your contributor badge.
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* News Section */}
        <Card className="mt-12 md:mt-16 mb-8 p-5 sm:p-8 text-center border-2 border-accent/30 bg-accent/5">
          <h2 className="text-xl sm:text-2xl font-pixel text-accent mb-2">
            ACHIEVEMENT UNLOCKED! 🏆
          </h2>
          <h3 className="text-lg sm:text-xl font-pixel text-primary mb-4 sm:mb-6">
            Runner-Up SPARK-AI Hackathon
          </h3>
          <h3 className="text-lg sm:text-xl font-pixel text-primary mb-4 sm:mb-6">
            @ LXDAO X ETHPanda
          </h3>

          <div className="flex flex-col items-center gap-6">
            <img
              src="/team/panda_emoji_v2_36_spark_ai.png"
              alt="spark-ai runner-up"
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-44 md:h-44 object-cover rounded-2xl"
            />

            <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              We are beyond excited to announce that{" "}
              <strong>EIP Playground</strong> has been awarded the{" "}
              <strong>Runner-Up</strong> prize in the{" "}
              <strong>LXDAO SPARK-AI Hackathon</strong>! A massive thank you to
              the judges and the community for supporting our quest to make EIP
              learning fun and accessible. Onward to the next level! 🚀
            </p>
          </div>
        </Card>

        {/* Team Members Section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-pixel text-primary mb-6 sm:mb-8 text-center pixel-text-shadow">
            MEET THE SQUAD
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-2xl font-pixel text-primary animate-pulse">
              SUMMONING TEAM...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {members.map(member => (
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
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-pixel text-foreground mb-2 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>

                  <div className="text-accent font-mono text-xs sm:text-sm mb-4">
                    {member.role}
                  </div>

                  <p className="text-muted-foreground text-xs sm:text-sm mb-4">
                    {member.bio}
                  </p>

                  {/* Social Links with Lucide icons */}
                  <div className="flex gap-3">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary hover:scale-110 transition-all"
                        aria-label="GitHub"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent hover:scale-110 transition-all"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Join Us Section */}
        {/* <Card className="mt-16 p-8 text-center border-2 border-accent/30 bg-accent/5">
          <h2 className="text-2xl font-pixel text-accent mb-4">
            JOIN THE PARTY
          </h2>
          <p className="text-muted-foreground mb-6">
            We're scouting for passionate developers, designers, and
            storytellers to join our squad!
            <br />
            If you're hyped about Web3 education, ping us through our social
            links above.
          </p>
          <div className="inline-block px-6 py-3 bg-accent/20 text-accent font-pixel rounded border-2 border-accent/50">
            WE'RE HIRING!
          </div>
        </Card> */}
      </div>
    </div>
  );
}
