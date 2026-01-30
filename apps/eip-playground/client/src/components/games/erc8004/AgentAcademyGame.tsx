import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Star, ShieldCheck, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

type Stage = 'IDENTITY' | 'REPUTATION' | 'VALIDATION' | 'COMPLETE';

export default function AgentAcademyGame() {
  const [stage, setStage] = useState<Stage>('IDENTITY');
  const [agentId, setAgentId] = useState<string | null>(null);
  const [reputation, setReputation] = useState(0);
  const [validationSequence, setValidationSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isPlayingValidation, setIsPlayingValidation] = useState(false);

  // Stage 1: Identity
  const mintIdentity = () => {
    const newId = "0x" + Math.random().toString(16).slice(2, 10).toUpperCase();
    setAgentId(newId);
    toast.success(`Identity Minted: ${newId}`);
    setTimeout(() => setStage('REPUTATION'), 1500);
  };

  // Stage 2: Reputation
  const performTask = (difficulty: 'EASY' | 'MEDIUM' | 'HARD') => {
    let chance = 0;
    let reward = 0;
    
    switch(difficulty) {
      case 'EASY': chance = 0.9; reward = 10; break;
      case 'MEDIUM': chance = 0.6; reward = 20; break;
      case 'HARD': chance = 0.3; reward = 40; break;
    }

    if (Math.random() < chance) {
      const newRep = Math.min(reputation + reward, 50);
      setReputation(newRep);
      toast.success(`Task Success! +${reward} Rep`);
      if (newRep >= 50) {
        setTimeout(() => {
          toast.success("Reputation Maxed! Unlocking Validation Layer...");
          setStage('VALIDATION');
        }, 1000);
      }
    } else {
      setReputation(Math.max(reputation - 5, 0));
      toast.error("Task Failed! -5 Rep");
    }
  };

  // Stage 3: Validation (Memory Game)
  const startValidation = () => {
    setIsPlayingValidation(true);
    const seq = [1, 2, 3, 4].map(() => Math.floor(Math.random() * 4));
    setValidationSequence(seq);
    setPlayerSequence([]);
    showSequence(seq);
  };

  const showSequence = (seq: number[]) => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        return;
      }
      highlightButton(seq[i]);
      i++;
    }, 800);
  };

  const highlightButton = (index: number) => {
    const btn = document.getElementById(`val-btn-${index}`);
    if (btn) {
      btn.classList.add('ring-4', 'ring-white', 'scale-110');
      setTimeout(() => btn.classList.remove('ring-4', 'ring-white', 'scale-110'), 400);
    }
  };

  const handleValidationInput = (index: number) => {
    if (!isPlayingValidation) return;
    
    highlightButton(index);
    const newSeq = [...playerSequence, index];
    setPlayerSequence(newSeq);

    if (newSeq[newSeq.length - 1] !== validationSequence[newSeq.length - 1]) {
      toast.error("Validation Failed! Proof Rejected.");
      setIsPlayingValidation(false);
      return;
    }

    if (newSeq.length === validationSequence.length) {
      toast.success("Proof Verified! Agent is Trustless.");
      setStage('COMPLETE');
    }
  };

  const resetGame = () => {
    setStage('IDENTITY');
    setAgentId(null);
    setReputation(0);
    setValidationSequence([]);
    setPlayerSequence([]);
    setIsPlayingValidation(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/10">
        <div className={`flex items-center gap-2 ${stage === 'IDENTITY' ? 'text-green-400' : 'text-gray-500'}`}>
          <User /> <span className="font-pixel">IDENTITY</span>
        </div>
        <div className="h-1 w-12 bg-gray-700" />
        <div className={`flex items-center gap-2 ${stage === 'REPUTATION' ? 'text-yellow-400' : 'text-gray-500'}`}>
          <Star /> <span className="font-pixel">REPUTATION</span>
        </div>
        <div className="h-1 w-12 bg-gray-700" />
        <div className={`flex items-center gap-2 ${stage === 'VALIDATION' ? 'text-blue-400' : 'text-gray-500'}`}>
          <ShieldCheck /> <span className="font-pixel">VALIDATION</span>
        </div>
      </div>

      {/* Game Area */}
      <Card className="p-8 bg-gray-900 border-4 border-primary min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Stage 1: Identity */}
        {stage === 'IDENTITY' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in">
            <h2 className="text-3xl font-pixel text-green-400">STEP 1: MINT IDENTITY</h2>
            <p className="text-gray-400">Create a verifiable on-chain identity for your agent.</p>
            <Button size="lg" onClick={mintIdentity} className="text-xl px-8 py-6 bg-green-600 hover:bg-green-700">
              <User className="mr-2" /> MINT AGENT NFT
            </Button>
          </div>
        )}

        {/* Stage 2: Reputation */}
        {stage === 'REPUTATION' && (
          <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-right">
            <div className="text-center">
              <h2 className="text-3xl font-pixel text-yellow-400">STEP 2: BUILD REPUTATION</h2>
              <p className="text-gray-400">Complete tasks to prove reliability. Goal: 50 Rep.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reputation Score</span>
                <span>{reputation} / 50</span>
              </div>
              <Progress value={(reputation / 50) * 100} className="h-4 bg-gray-800" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Button variant="outline" onClick={() => performTask('EASY')} className="h-24 flex flex-col gap-2 border-green-500/50 hover:bg-green-900/20">
                <span className="text-green-400 font-bold">EASY</span>
                <span className="text-xs text-gray-400">90% Chance</span>
                <span className="text-xs text-green-400">+10 Rep</span>
              </Button>
              <Button variant="outline" onClick={() => performTask('MEDIUM')} className="h-24 flex flex-col gap-2 border-yellow-500/50 hover:bg-yellow-900/20">
                <span className="text-yellow-400 font-bold">MEDIUM</span>
                <span className="text-xs text-gray-400">60% Chance</span>
                <span className="text-xs text-yellow-400">+20 Rep</span>
              </Button>
              <Button variant="outline" onClick={() => performTask('HARD')} className="h-24 flex flex-col gap-2 border-red-500/50 hover:bg-red-900/20">
                <span className="text-red-400 font-bold">HARD</span>
                <span className="text-xs text-gray-400">30% Chance</span>
                <span className="text-xs text-red-400">+40 Rep</span>
              </Button>
            </div>
          </div>
        )}

        {/* Stage 3: Validation */}
        {stage === 'VALIDATION' && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in">
            <div>
              <h2 className="text-3xl font-pixel text-blue-400">STEP 3: VALIDATION CHECK</h2>
              <p className="text-gray-400">Prove your agent's logic by replicating the sequence.</p>
            </div>

            {!isPlayingValidation ? (
              <Button size="lg" onClick={startValidation} className="text-xl px-8 py-6 bg-blue-600 hover:bg-blue-700">
                START CHALLENGE
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-4 w-64 mx-auto">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    id={`val-btn-${i}`}
                    onClick={() => handleValidationInput(i)}
                    className={`h-24 w-24 rounded-xl transition-all duration-200 ${
                      i === 0 ? 'bg-red-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-green-500' : 'bg-yellow-500'
                    } opacity-80 hover:opacity-100 active:scale-95`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Complete */}
        {stage === 'COMPLETE' && (
          <div className="text-center space-y-6 animate-in fade-in zoom-in">
            <CheckCircle className="w-24 h-24 text-green-400 mx-auto" />
            <h2 className="text-4xl font-pixel text-white">AGENT VERIFIED</h2>
            <div className="bg-black/50 p-6 rounded-xl border border-white/20 text-left space-y-2 font-mono">
              <p>ID: <span className="text-green-400">{agentId}</span></p>
              <p>REP: <span className="text-yellow-400">50/50 (MAX)</span></p>
              <p>STATUS: <span className="text-blue-400">TRUSTLESS & VERIFIED</span></p>
            </div>
            <Button onClick={resetGame} variant="outline">
              <RefreshCw className="mr-2" /> Deploy New Agent
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
