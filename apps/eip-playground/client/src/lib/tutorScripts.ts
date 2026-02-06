export type TutorContext = {
  eipId?: string;
  gameId?: string;
};

const DEFAULT_PAGE_GREETING =
  "Hello! I'm Dr. Panda, your AI tutor. I'm here to guide you through this quest—let's level up together!";

const EIP_PAGE_GREETINGS: Record<string, string> = {
  "eip-1559":
    "Welcome to EIP-1559! I'll help you understand base fees, tips, and why this upgrade makes gas pricing more predictable.",
  "eip-7702":
    "Welcome to EIP-7702! Let's explore how EOAs can temporarily act like smart contracts and what that unlocks.",
  "erc-8004":
    "Welcome to ERC-8004! We'll cover agent identity, reputation, and validation so you can build trusted AI systems.",
};

const GAME_GREETINGS: Record<string, string> = {
  "eip-1559:burner":
    "This is the Base Fee Burner. Adjust congestion and see how the base fee rises or falls block by block.",
  "eip-7702:batching":
    "Batching time! Compare slow, repeated EOA clicks with a single 7702 batch execution.",
  "erc-8004:academy":
    "Agent Academy begins now. Mint your identity, earn reputation, and pass validation to claim your badge.",
};

export function getTutorGreeting({ eipId, gameId }: TutorContext): string {
  if (eipId && gameId) {
    const key = `${eipId}:${gameId}`;
    if (GAME_GREETINGS[key]) return GAME_GREETINGS[key];
  }
  return DEFAULT_PAGE_GREETING;
}

export function getTutorPageGreeting({ eipId }: TutorContext): string {
  if (eipId && EIP_PAGE_GREETINGS[eipId]) return EIP_PAGE_GREETINGS[eipId];
  return DEFAULT_PAGE_GREETING;
}

type Erc8004MessageKey =
  | "identity_minted"
  | "hard_task_blocked"
  | "task_monitoring"
  | "task_success"
  | "task_failure"
  | "reputation_unlock"
  | "validation_submitting"
  | "validation_reviewing"
  | "validation_verified"
  | "challenge_unlocked"
  | "reset"
  | "wallet_required"
  | "mint_start"
  | "mint_success"
  | "mint_error";

type Erc8004MessageParams = {
  newId?: string;
  reward?: number;
  totalRep?: number;
  errorMessage?: string;
  tokenId?: number;
};

export function getErc8004TutorMessage(
  key: Erc8004MessageKey,
  params: Erc8004MessageParams = {}
): string {
  switch (key) {
    case "identity_minted":
      return `Welcome! I see you've minted a new agent identity: ${params.newId}. This is your unique on-chain identifier. Let's start building your reputation!`;
    case "hard_task_blocked":
      return "Hold on! Hard tasks require validation first. You need to prove your reliability through the validation process.";
    case "task_monitoring":
      return "I'm monitoring your task execution. Let's see how you perform!";
    case "task_success":
      return `Excellent work! Your task was well-received and you got positive feedback. You earned ${params.reward} reputation points. Your total is now ${params.totalRep}.`;
    case "task_failure":
      return `Oh no! The task didn't go as planned and received some negative feedback. You lost ${Math.abs(params.reward ?? 0)} reputation points. Don't worry, you can recover! Your total is now ${params.totalRep}.`;
    case "reputation_unlock":
      return "Congratulations! You've reached 50 reputation. You're now eligible for validation. Click the button to proceed!";
    case "validation_submitting":
      return "I'm submitting your reputation proof to the validation registry. This is a critical step!";
    case "validation_reviewing":
      return "The validator is reviewing your credentials. This ensures only reliable agents get verified.";
    case "validation_verified":
      return "Fantastic! You're now a verified agent. High-value tasks are now unlocked for you!";
    case "challenge_unlocked":
      return "Excellent work! Now that you're verified, you can take the final challenge to test your knowledge of ERC-8004. Pass it to earn an NFT reward!";
    case "reset":
      return "Let's start fresh! Ready to create a new agent?";
    case "wallet_required":
      return "You need to connect your wallet to claim your NFT reward. Click the Connect Wallet button in the header!";
    case "mint_start":
      return "Excellent! Let me mint your ERC-8004 achievement badge on the blockchain...";
    case "mint_success":
      return `Congratulations! Your ERC-8004 badge has been minted! Token ID: ${params.tokenId}.`;
    case "mint_error":
      return `Oops! Something went wrong while minting your badge: ${params.errorMessage}. Please try again later.`;
    default:
      return DEFAULT_PAGE_GREETING;
  }
}
