import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bot,User, Star, ShieldCheck, RefreshCw, CheckCircle, Lock, ArrowRight, Terminal } from "lucide-react";

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

  // Helper to show in-game messages
  const showMessage = (msg: string, duration = 3000) => {
    setGameMessage(msg);
    // Clear previous timeout if exists (simple implementation)
    const id = setTimeout(() => setGameMessage(null), duration);
    return () => clearTimeout(id);
  };

  // Stage 1: Identity
  const mintIdentity = () => {
    const newId = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
    setAgentId(newId);
    showMessage(`Identity Minted: ${newId}`);
    setTimeout(() => setStage('REPUTATION'), 1500);
  };

  // Stage 2: Reputation
  const performTask = (type: TaskType, difficulty: 'EASY' | 'MEDIUM' | 'HARD') => {
    if (difficulty === 'HARD' && !isVerified) {
      showMessage("Access Denied: Hard tasks require Verified status!");
      return;
    }

    setIsTaskAnimating(true);
    setCurrentTask(type);
    showMessage("Executing task...");

    // Animation duration
    setTimeout(() => {
      let reward = 0;
      switch(difficulty) {
        case 'EASY': reward = 10; break;
        case 'MEDIUM': reward = 20; break;
        case 'HARD': reward = 50; break;
      }

      const newRep = reputation + reward;
      setReputation(newRep);
      
      const newLog: TaskLog = {
        id: Date.now(),
        type,
        reward,
        timestamp: new Date().toLocaleTimeString([], { hour12: false })
      };
      setTaskLogs(prev => [newLog, ...prev].slice(0, 5)); // Keep last 5

      showMessage(`Task Complete! +${reward} Rep`);
      setIsTaskAnimating(false);
      setCurrentTask(null);

      if (newRep >= 50 && !isVerified && stage === 'REPUTATION') {
        // No auto jump, just notify
        setTimeout(() => {
          showMessage("Reputation Maxed! Validation Layer Unlocked.");
        }, 2000);
      }
    }, 3000); // 3s animation
  };

  // Stage 3: Validation
  const startValidation = () => {
    setValidationStep('SUBMITTING');
    showMessage("Submitting proof to registry...");
    
    setTimeout(() => {
      setValidationStep('STAMPING');
      showMessage("Validator checking proof...");
      setTimeout(() => {
        setValidationStep('VERIFIED');
        showMessage("Proof Verified!");
        setTimeout(() => {
          setIsVerified(true);
          setStage('REPUTATION'); // Go back to tasks
          setValidationStep('IDLE');
          showMessage("Agent Verified! Hard tasks unlocked.");
        }, 2000);
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
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      
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
        <Card className="p-8 bg-gray-900 border-4 border-primary min-h-[600px] flex flex-col relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          
          {/* Background Grid Animation */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Content Container - Flex Grow to push message to bottom */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 w-full">
            
            {/* Stage 1: Identity */}
            {stage === 'IDENTITY' && (
              <div className="text-center space-y-8 animate-in fade-in zoom-in">
                <div className="space-y-2">
                  <h2 className="text-4xl font-pixel text-green-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">MINT AGENT IDENTITY</h2>
                  <p className="text-gray-400 text-sm font-pixel">Create a verifiable on-chain identity for your AI agent.</p>
                </div>
                <div className="relative group inline-block">
                  {/* Compact background glow */}
                  <div className="absolute inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                  <Button size="lg" onClick={mintIdentity} className="relative text-xl px-12 py-8 bg-green-600 hover:bg-green-500 border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all font-pixel">
                    <User className="mr-3 w-6 h-6" /> MINT Identity
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
                      <p className="text-xs text-gray-400 font-pixel">
                        {isVerified 
                          ? "Agent verified. High-value tasks unlocked." 
                          : "Complete tasks to collect your reputation. Goal: 50 Rep."}
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
                          <img src="/images/erc8004/task-box.png" alt="Box Task" className="w-12 h-12 object-contain pixelated rounded-lg" />
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-bold font-pixel text-lg">LOGISTICS</div>
                          <div className="text-xs text-gray-400 mt-1 font-pixel">Reward: +10 Rep</div>
                        </div>
                      </Button>

                      {/* Task 2: Delivery */}
                      <Button 
                        variant="outline" 
                        onClick={() => performTask('DELIVERY', 'MEDIUM')} 
                        className="h-auto py-6 flex flex-col gap-4 bg-gray-800/50 border-2 border-yellow-500/50 hover:bg-yellow-900/20 hover:border-yellow-400 hover:-translate-y-1 transition-all"
                      >
                        <div className="w-16 h-16 bg-yellow-900/30 rounded-lg flex items-center justify-center border border-yellow-500/30">
                          <img src="/images/erc8004/task-delivery.png" alt="Delivery Task" className="w-12 h-12 object-contain pixelated rounded-lg" />
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold font-pixel text-lg">DELIVERY</div>
                          <div className="text-xs text-gray-400 mt-1 font-pixel">Reward: +20 Rep</div>
                        </div>
                      </Button>

                      {/* Task 3: Coding (Locked/Unlocked) */}
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
                          <img src="/images/erc8004/task-coding.png" alt="Coding Task" className={`rounded-lg w-12 h-12 object-contain pixelated ${!isVerified && "grayscale"}`} />
                          {!isVerified && <Lock className="absolute inset-0 m-auto w-8 h-8 text-gray-400 drop-shadow-lg" />}
                        </div>
                        <div className="text-center">
                          <div className={`${isVerified ? "text-red-400" : "text-gray-500"} font-bold font-pixel text-lg`}>CODING</div>
                          <div className="text-xs text-gray-400 mt-1 font-pixel">{isVerified ? "Reward: +50 Rep" : "Need Validation"}</div>
                        </div>
                      </Button>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex justify-center gap-4 mt-8">
                      {/* Validation Button - Shows when ready and not verified */}
                      {reputation >= 50 && !isVerified && (
                        <Button 
                          onClick={() => setStage('VALIDATION')} 
                          className="animate-bounce bg-blue-600 hover:bg-blue-500 text-white font-pixel px-8 py-6 text-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1"
                        >
                          <ShieldCheck className="mr-2" /> PROCEED TO VALIDATION
                        </Button>
                      )}

                      {/* Deploy New Agent - Shows when verified */}
                      {isVerified && (
                        <Button 
                          onClick={resetGame} 
                          variant="outline"
                          className="border-white/20 hover:bg-white/10 text-white font-pixel px-8 py-6 text-lg"
                        >
                          <RefreshCw className="mr-2" /> DEPLOY NEW AGENT
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in">
                    <div className="relative w-64 h-64">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                      <img
                        src={
                          currentTask === 'BOX' ? "/images/erc8004/task-box.png" :
                          currentTask === 'DELIVERY' ? "/images/erc8004/task-delivery.png" :
                          "/images/erc8004/task-coding.png"
                        } 
                        alt="Task Animation" 
                        className="w-full h-full object-contain pixelated animate-bounce rounded-lg" 
                      />
                    </div>
                    <h3 className="text-2xl font-pixel text-white animate-pulse">EXECUTING TASK...</h3>
                  </div>
                )}
              </div>
            )}

            {/* Stage 3: Validation */}
            {stage === 'VALIDATION' && (
              <div className="text-center space-y-8 animate-in fade-in zoom-in relative z-10 w-full max-w-2xl">
                {validationStep === 'IDLE' && (
                  <>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-pixel text-blue-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)]">VALIDATION REQUIRED</h2>
                      <p className="text-gray-400 text-lg font-pixel">Submit your reputation proof to the registry for verification.</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                      {/* <Button variant="ghost" onClick={() => setStage('REPUTATION')} className="text-gray-400 hover:text-white">
                        Back to Tasks
                      </Button> */}
                      <Button size="lg" onClick={startValidation} className="text-xl px-12 py-8 bg-blue-600 hover:bg-blue-500 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all font-pixel">
                        <ShieldCheck className="mr-3 w-6 h-6" /> SUBMIT PROOF
                      </Button>
                    </div>
                  </>
                )}

                {validationStep !== 'IDLE' && (
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="relative w-80 h-80 bg-white/5 rounded-xl border-2 border-white/10 p-4 flex items-center justify-center overflow-hidden">
                      {validationStep === 'SUBMITTING' && (
                        <img src="/images/erc8004/validation-submit.png" alt="Submitting" className="w-full h-full object-contain pixelated animate-in slide-in-from-left duration-1000 rounded-lg" />
                      )}
                      {validationStep === 'STAMPING' && (
                        <img src="/images/erc8004/validation-stamp.png" alt="Stamping" className="w-full h-full object-contain pixelated animate-in zoom-in duration-300 rounded-lg" />
                      )}
                      {validationStep === 'VERIFIED' && (
                        <div className="text-center space-y-4 animate-in zoom-in">
                          <CheckCircle className="w-32 h-32 text-green-400 mx-auto" />
                          <h3 className="text-2xl font-pixel text-green-400">VERIFIED!</h3>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* In-Game Message Log (Bottom) */}
          <div className="w-full mt-8 h-12 bg-black/80 border-t-2 border-white/10 flex items-center px-4 font-mono text-sm">
            <Terminal className="w-4 h-4 text-green-500 mr-2" />
            <span className="text-green-500 mr-2">{">"}</span>
            {gameMessage ? (
              <span className="text-green-400 animate-pulse">{gameMessage}</span>
            ) : (
              <span className="text-gray-600 animate-pulse">_</span>
            )}
          </div>

        </Card>
      </div>

      {/* Right Column: Persistent UI (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Identity Scroll */}
        <div className="relative w-full aspect-[3/4] group perspective-1000">
          <div className={`relative w-full h-full transition-all duration-1000 transform ${agentId ? 'rotate-y-0 opacity-100' : 'rotate-y-90 opacity-0'}`}>
            <img src="/images/erc8004/identity-scroll.png" alt="Identity Scroll" className="w-full h-full object-contain pixelated drop-shadow-2xl" />
            
            {/* Scroll Content Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-20 px-12 text-center space-y-4">
              <div className="font-pixel text-xs text-blue-900 opacity-70">ERC-8004</div>
              <div className="font-pixel text-xs text-blue-900 opacity-70">IDENTITY</div>
              <div className="w-20 h-20 bg-blue-900/20 rounded-full border-2 border-blue-800/50 flex items-center justify-center">
                <Bot className="w-10 h-10 text-blue-900" />
              </div>
              <div className="font-mono text-xs text-blue-900 break-all font-bold">
                {agentId || "PENDING..."}
              </div>
              <div className="w-full h-px bg-blue-900/30 my-2"></div>
              <div className="space-y-1">
                <div className="text-[10px] text-blue-900 uppercase tracking-widest font-pixel">Status</div>
                <Badge variant={isVerified ? 'default' : 'secondary'} className={`${isVerified ? 'bg-green-600' : 'bg-gray-600'} text-white border-none font-pixel`}>
                  {isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Placeholder when no ID */}
          {!agentId && (
            <div className="absolute inset-0 flex items-center justify-center border-4 border-dashed border-white/10 rounded-xl bg-black/20">
              <div className="text-center text-gray-500">
                <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="font-pixel text-sm">NO IDENTITY</p>
              </div>
            </div>
          )}
        </div>

        {/* Reputation Registry */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border-4 border-blue-900 shadow-lg">
          <img src="/images/erc8004/reputation-registry.png" alt="Registry" className="absolute inset-0 w-full h-full object-cover pixelated opacity-50" />
          
          <div className="absolute inset-0 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-blue-500/30 pb-2">
              <h3 className="font-pixel text-blue-400 text-sm">TASK LOG</h3>
              <div className="text-xs text-blue-300 font-mono animate-pulse">LIVE FEED</div>
            </div>
            
            <div className="flex-1 overflow-hidden space-y-2">
              {taskLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-blue-500/30 font-pixel text-xs">
                  AWAITING DATA...
                </div>
              ) : (
                taskLogs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center bg-blue-900/20 p-2 rounded border border-blue-500/20 text-xs animate-in slide-in-from-left">
                    <div className="flex items-center gap-2">
                      {log.type === 'BOX' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                      {log.type === 'DELIVERY' && <div className="w-2 h-2 bg-yellow-500 rounded-full" />}
                      {log.type === 'CODING' && <div className="w-2 h-2 bg-red-500 rounded-full" />}
                      <span className="text-blue-200 font-mono">{log.type}</span>
                    </div>
                    <span className="text-green-400 font-bold">+{log.reward}</span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 pt-2 border-t border-blue-500/30">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-300 font-pixel">TOTAL REP</span>
                <span className="text-white font-pixel">{reputation} / 50</span>
              </div>
              <Progress value={Math.min((reputation / 50) * 100, 100)} className="h-2 bg-blue-900/50" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
