import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Star, ShieldCheck, RefreshCw, CheckCircle, Lock, ArrowRight, Terminal } from "lucide-react";
import AITutor, { TutorPose, TutorMessage } from "@/components/AITutor";

type Stage = 'IDENTITY' | 'REPUTATION' | 'VALIDATION';
type TaskType = 'BOX' | 'DELIVERY' | 'CODING';

interface TaskLog {
  id: number;
  type: TaskType;
  reward: number;
  timestamp: string;
}

export default function AgentAcademyGame() {
  const [stage, setStage] = useState<Stage>('IDENTITY');
  const [agentId, setAgentId] = useState<string | null>(null);
  const [reputation, setReputation] = useState(0);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [isTaskAnimating, setIsTaskAnimating] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
  const [validationStep, setValidationStep] = useState<'IDLE' | 'SUBMITTING' | 'STAMPING' | 'VERIFIED'>('IDLE');
  const [isVerified, setIsVerified] = useState(false);
  const [gameMessage, setGameMessage] = useState<string | null>(null);

  // Tutor states
  const [tutorPose, setTutorPose] = useState<TutorPose>("standing");
  const [tutorMessage, setTutorMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<TutorMessage[]>([]);
  const [hasGreeted, setHasGreeted] = useState(false);

  // Helper to show in-game messages
  const showMessage = (msg: string, duration = 3000) => {
    setGameMessage(msg);
    const id = setTimeout(() => setGameMessage(null), duration);
    return () => clearTimeout(id);
  };

  // Helper to make tutor speak
  const tutorSpeak = (message: string, pose: TutorPose = "standing") => {
    setTutorPose(pose);
    setTutorMessage(message);
    
    // Add to chat history
    const newMessage: TutorMessage = {
      id: Date.now().toString(),
      role: "tutor",
      content: message,
      timestamp: Date.now(),
    };
    setChatHistory(prev => [...prev, newMessage]);
  };

  // Initial greeting - only once on mount
  useEffect(() => {
    if (!hasGreeted) {
      tutorSpeak(
        "Hello! I'm Dr. Panda, your AI tutor. I'll guide you through the ERC-8004 Agent Academy. Let's create your first agent identity!",
        "standing"
      );
      setHasGreeted(true);
    }
  }, [hasGreeted]);

  // Stage 1: Identity
  const mintIdentity = () => {
    const newId = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
    setAgentId(newId);
    showMessage(`Identity Minted: ${newId}`);
    
    tutorSpeak(
      `Welcome! I see you've minted a new agent identity: ${newId}. This is your unique on-chain identifier. Let's start building your reputation!`,
      "praising"
    );
    
    setTimeout(() => setStage('REPUTATION'), 1500);
  };

  // Stage 2: Reputation
  const performTask = (type: TaskType, difficulty: 'EASY' | 'MEDIUM' | 'HARD') => {
    if (difficulty === 'HARD' && !isVerified) {
      showMessage("Access Denied: Hard tasks require Verified status!");
      tutorSpeak(
        "Hold on! Hard tasks require validation first. You need to prove your reliability through the validation process.",
        "teaching"
      );
      return;
    }

    setIsTaskAnimating(true);
    setCurrentTask(type);
    showMessage("Executing task...");
    
    tutorSpeak(
      "I'm monitoring your task execution. Let's see how you perform!",
      "working"
    );

    setTimeout(() => {
      let reward = 0;
      switch(difficulty) {
        case 'EASY': reward = 10; break;
        case 'MEDIUM': reward = 20; break;
        case 'HARD': reward = 50; break;
      }

      const newRep = Math.min(reputation + reward, 50);
      setReputation(newRep);
      
      const newLog: TaskLog = {
        id: Date.now(),
        type,
        reward,
        timestamp: new Date().toLocaleTimeString([], { hour12: false })
      };
      setTaskLogs(prev => [newLog, ...prev].slice(0, 5));

      showMessage(`Task Complete! +${reward} Rep`);
      setIsTaskAnimating(false);
      setCurrentTask(null);

      tutorSpeak(
        `Excellent work! You earned ${reward} reputation points. Your total is now ${newRep}.`,
        "praising"
      );

      if (newRep >= 50 && !isVerified && stage === 'REPUTATION') {
        setTimeout(() => {
          showMessage("Reputation Maxed! Validation Layer Unlocked.");
          tutorSpeak(
            "Congratulations! You've reached 50 reputation. You're now eligible for validation. Click the button to proceed!",
            "teaching"
          );
        }, 1000);
      }
    }, 3000);
  };

  // Stage 3: Validation
  const startValidation = () => {
    setStage('VALIDATION');
    setValidationStep('SUBMITTING');
    showMessage("Submitting proof to registry...");
    
    tutorSpeak(
      "I'm submitting your reputation proof to the validation registry. This is a critical step!",
      "working"
    );
    
    setTimeout(() => {
      setValidationStep('STAMPING');
      showMessage("Validator checking proof...");
      
      tutorSpeak(
        "The validator is now reviewing your proof. This ensures your reputation is legitimate.",
        "thinking"
      );
      
      setTimeout(() => {
        setValidationStep('VERIFIED');
        showMessage("Proof Verified!");
        
        tutorSpeak(
          "Amazing! Your agent is now verified. You can now access high-value tasks!",
          "praising"
        );
        
        setTimeout(() => {
          setIsVerified(true);
          setStage('REPUTATION');
          setValidationStep('IDLE');
          showMessage("Agent Verified! Hard tasks unlocked.");
        }, 1500);
      }, 3000);
    }, 2000);
  };

  const resetGame = () => {
    setStage('IDENTITY');
    setAgentId(null);
    setReputation(0);
    setTaskLogs([]);
    setValidationStep('IDLE');
    setIsVerified(false);
    setGameMessage(null);
    setChatHistory([]);
    
    tutorSpeak(
      "Ready to deploy a new agent? Let's start fresh!",
      "standing"
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* AI Tutor */}
      <AITutor
        pose={tutorPose}
        message={tutorMessage}
        onMessageComplete={() => {}}
        chatHistory={chatHistory}
      />
      
      {/* Left Column: Game Area (8 cols) */}
      <div className="lg:col-span-8 space-y-8">
        {/* Progress Header */}
        <div className="flex justify-between items-center bg-black/60 p-4 rounded-xl border-2 border-white/20 backdrop-blur-sm">
          <div className={`flex items-center gap-2 ${stage === 'IDENTITY' ? 'text-green-400 animate-pulse' : 'text-gray-500'}`}>
            <User /> <span className="font-pixel text-sm md:text-base">IDENTITY</span>
          </div>
          <ArrowRight className="text-gray-600" />
          <div className={`flex items-center gap-2 ${stage === 'REPUTATION' ? 'text-yellow-400 animate-pulse' : 'text-gray-500'}`}>
            <Star /> <span className="font-pixel text-sm md:text-base">REPUTATION</span>
          </div>
          <ArrowRight className="text-gray-600" />
          <div className={`flex items-center gap-2 ${stage === 'VALIDATION' ? 'text-blue-400 animate-pulse' : isVerified ? 'text-green-400' : 'text-gray-500'}`}>
            <ShieldCheck /> <span className="font-pixel text-sm md:text-base">{isVerified ? 'VERIFIED' : 'VALIDATION'}</span>
          </div>
        </div>

        {/* Main Game Card */}
        <Card className="p-8 bg-gray-900 border-4 border-primary min-h-[500px] flex flex-col relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          
          {/* Background Grid Animation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Content Container */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
            
            {/* Stage 1: Identity */}
            {stage === 'IDENTITY' && (
              <div className="text-center space-y-8 animate-in fade-in zoom-in">
                <div className="space-y-2">
                  <h2 className="text-4xl font-pixel text-green-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">MINT AGENT IDENTITY</h2>
                  <p className="text-gray-400 text-lg">Create a verifiable on-chain identity for your AI agent.</p>
                </div>
                <div className="relative group inline-block">
                  <div className="absolute inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <Button size="lg" onClick={mintIdentity} className="relative text-xl px-12 py-8 bg-green-600 hover:bg-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all font-pixel">
                    <User className="mr-3 w-6 h-6" /> MINT NFT
                  </Button>
                </div>
              </div>
            )}

            {/* Stage 2: Reputation */}
            {stage === 'REPUTATION' && (
              <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-right">
                {!isTaskAnimating ? (
                  <>
                    <div className="text-center space-y-2">
                      <h2 className="text-3xl font-pixel text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">
                        {isVerified ? "AGENT OPERATIONS" : "BUILD REPUTATION"}
                      </h2>
                      <p className="text-gray-400">
                        {isVerified 
                          ? "Agent verified. High-value tasks unlocked." 
                          : "Complete tasks to prove reliability. Goal: 50 Rep."}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Task 1: Box */}
                      <Button 
                        variant="outline" 
                        onClick={() => performTask('BOX', 'EASY')} 
                        className="h-auto py-6 flex flex-col gap-4 bg-gray-800/50 border-2 border-green-500/50 hover:bg-green-900/20 hover:border-green-400 hover:-translate-y-1 transition-all"
                      >
                        <div className="w-16 h-16 bg-green-900/30 rounded-lg flex items-center justify-center border border-green-500/30">
                          <img src="/images/erc8004/task-box.png" alt="Box Task" className="w-12 h-12 object-contain pixelated" />
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-bold font-pixel text-lg">LOGISTICS</div>
                          <div className="text-xs text-gray-400 mt-1">Reward: +10 Rep</div>
                        </div>
                      </Button>

                      {/* Task 2: Delivery */}
                      <Button 
                        variant="outline" 
                        onClick={() => performTask('DELIVERY', 'MEDIUM')} 
                        className="h-auto py-6 flex flex-col gap-4 bg-gray-800/50 border-2 border-yellow-500/50 hover:bg-yellow-900/20 hover:border-yellow-400 hover:-translate-y-1 transition-all"
                      >
                        <div className="w-16 h-16 bg-yellow-900/30 rounded-lg flex items-center justify-center border border-yellow-500/30">
                          <img src="/images/erc8004/task-delivery.png" alt="Delivery Task" className="w-12 h-12 object-contain pixelated" />
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold font-pixel text-lg">DELIVERY</div>
                          <div className="text-xs text-gray-400 mt-1">Reward: +20 Rep</div>
                        </div>
                      </Button>

                      {/* Task 3: Coding */}
                      <Button 
                        variant="outline" 
                        onClick={() => performTask('CODING', 'HARD')} 
                        className={`h-auto py-6 flex flex-col gap-4 bg-gray-800/50 border-2 transition-all ${
                          isVerified 
                            ? "border-red-500/50 hover:bg-red-900/20 hover:border-red-400 hover:-translate-y-1 cursor-pointer" 
                            : "border-gray-700 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center border relative ${
                          isVerified ? "bg-red-900/30 border-red-500/30" : "bg-gray-800 border-gray-600"
                        }`}>
                          <img src="/images/erc8004/task-coding.png" alt="Coding Task" className={`w-12 h-12 object-contain pixelated ${!isVerified && "grayscale"}`} />
                          {!isVerified && <Lock className="absolute inset-0 m-auto w-8 h-8 text-gray-400 drop-shadow-lg" />}
                        </div>
                        <div className="text-center">
                          <div className={`${isVerified ? "text-red-400" : "text-gray-500"} font-bold font-pixel text-lg`}>CODING</div>
                          <div className="text-xs text-gray-400 mt-1">{isVerified ? "Reward: +50 Rep" : "Requires Validation"}</div>
                        </div>
                      </Button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                      {reputation >= 50 && !isVerified && (
                        <Button 
                          onClick={startValidation} 
                          className="animate-bounce bg-blue-600 hover:bg-blue-500 text-white font-pixel px-8 py-6 text-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                        >
                          <ShieldCheck className="mr-2" /> PROCEED TO VALIDATION
                        </Button>
                      )}

                      {isVerified && (
                        <Button 
                          onClick={resetGame} 
                          className="bg-purple-600 hover:bg-purple-500 text-white font-pixel px-8 py-6 text-lg border-b-4 border-purple-800 active:border-b-0 active:translate-y-1"
                        >
                          <RefreshCw className="mr-2" /> DEPLOY NEW AGENT
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="relative w-64 h-64 mx-auto">
                      <img 
                        src={`/images/erc8004/task-${currentTask?.toLowerCase()}.png`} 
                        alt="Task Animation" 
                        className="w-full h-full object-contain animate-pulse pixelated"
                      />
                    </div>
                    <p className="text-2xl font-pixel text-yellow-400 animate-pulse">EXECUTING TASK...</p>
                  </div>
                )}
              </div>
            )}

            {/* Stage 3: Validation */}
            {stage === 'VALIDATION' && (
              <div className="text-center space-y-8 animate-in fade-in zoom-in">
                <h2 className="text-3xl font-pixel text-blue-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">VALIDATION CHECK</h2>
                
                {validationStep === 'SUBMITTING' && (
                  <div className="space-y-4">
                    <img src="/images/erc8004/validation-submit.png" alt="Submit" className="w-64 h-64 mx-auto object-contain pixelated" />
                    <p className="text-gray-300 font-mono text-lg">Submitting proof to registry...</p>
                    <Progress value={33} className="w-64 mx-auto h-3" />
                  </div>
                )}

                {validationStep === 'STAMPING' && (
                  <div className="space-y-4">
                    <img src="/images/erc8004/validation-stamp.png" alt="Stamp" className="w-64 h-64 mx-auto object-contain pixelated" />
                    <p className="text-gray-300 font-mono text-lg">Validator verifying proof...</p>
                    <Progress value={66} className="w-64 mx-auto h-3" />
                  </div>
                )}

                {validationStep === 'VERIFIED' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <img src="/images/erc8004/task-coding.png" alt="Verified" className="w-64 h-64 mx-auto object-contain pixelated" />
                      <div className="absolute top-0 right-1/4 bg-green-500 text-white rounded-full p-3 border-4 border-white animate-bounce">
                        <ShieldCheck size={32} />
                      </div>
                    </div>
                    <p className="text-green-400 font-pixel text-2xl">AGENT VERIFIED!</p>
                    <Progress value={100} className="w-64 mx-auto h-3" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* In-Game Message Console */}
          {gameMessage && (
            <div className="mt-auto relative z-10">
              <div className="bg-black/80 border-2 border-green-400 rounded-lg p-3 text-center backdrop-blur-sm">
                <p className="text-green-400 font-mono text-sm flex items-center justify-center gap-2">
                  <Terminal size={16} />
                  <span>&gt; {gameMessage}</span>
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Right Column: Dashboard (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Identity Scroll */}
        <Card className="bg-gradient-to-br from-amber-900/40 to-amber-700/40 border-4 border-amber-600 p-4 shadow-xl">
          <h3 className="text-xl font-pixel text-amber-300 mb-3 text-center flex items-center justify-center gap-2">
            <User size={20} />
            IDENTITY SCROLL
          </h3>
          <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-800 min-h-[120px] flex flex-col justify-center">
            {agentId ? (
              <div className="space-y-3">
                <div className="text-xs font-mono text-amber-900 break-all bg-amber-100 p-2 rounded border border-amber-300">
                  <strong>Agent ID:</strong><br/>{agentId}
                </div>
                <div className="flex items-center justify-between text-amber-900 bg-amber-100 p-2 rounded border border-amber-300">
                  <span className="text-xs font-mono font-bold">Status:</span>
                  <Badge variant={isVerified ? "default" : "secondary"} className="font-pixel text-xs">
                    {isVerified ? (
                      <><CheckCircle size={12} className="mr-1" /> VERIFIED</>
                    ) : (
                      'UNVERIFIED'
                    )}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-xs text-amber-900/60 font-mono text-center italic">
                No identity minted yet
              </p>
            )}
          </div>
        </Card>

        {/* Reputation Registry */}
        <Card className="bg-gradient-to-br from-blue-900/40 to-blue-700/40 border-4 border-blue-600 p-4 shadow-xl">
          <h3 className="text-xl font-pixel text-blue-300 mb-3 text-center flex items-center justify-center gap-2">
            <Star size={20} />
            REPUTATION REGISTRY
          </h3>
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-800 space-y-3">
            <div className="text-center">
              <p className="text-4xl font-pixel text-blue-900">{reputation}</p>
              <p className="text-xs text-blue-900/60 font-mono">Total Reputation</p>
            </div>
            <Progress value={(reputation / 50) * 100} className="h-3" />
            
            {taskLogs.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-mono text-blue-900 font-bold border-b border-blue-300 pb-1">Recent Tasks:</p>
                {taskLogs.map(log => (
                  <div key={log.id} className="text-xs font-mono text-blue-900 flex justify-between items-center bg-blue-100 p-2 rounded border border-blue-200">
                    <span className="font-bold">{log.type}</span>
                    <span className="text-green-700 font-bold">+{log.reward}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}