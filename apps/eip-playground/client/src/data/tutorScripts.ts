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

// Game-level greetings used when a game section enters the viewport.
const GAME_GREETINGS: Record<string, string> = {
  "eip-1559:gaswar":
    "Legacy Gas War time. Place your bid and see how first-price auctions force you to overpay just to get included.",
  "eip-1559:burner":
    "This is the Base Fee Burner. Adjust congestion and see how the base fee rises or falls block by block.",
  "eip-7702:batching":
    "Batching time! Compare slow, repeated EOA clicks with a single 7702 batch execution.",
  "eip-7702:sponsorship":
    "Sponsorship mode. Watch how a paymaster can cover gas so users can claim rewards without ETH.",
  "eip-7702:delegation":
    "Delegation story. See how an EOA can temporarily gain smart contract powers, then safely return to normal.",
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

// Page-level greeting used when entering an EIP detail page.
export function getTutorPageGreeting({ eipId }: TutorContext): string {
  if (eipId && EIP_PAGE_GREETINGS[eipId]) return EIP_PAGE_GREETINGS[eipId];
  return DEFAULT_PAGE_GREETING;
}

type Eip1559MessageKey =
  | "mempool_ready"
  | "simulation_success"
  | "simulation_fail"
  | "overpaid"
  | "base_fee_rise"
  | "base_fee_drop"
  | "tx_rejected"
  | "tx_included"
  | "demand_high"
  | "demand_low";

type Eip1559MessageParams = {
  userBid?: number;
  lowestIncluded?: number;
  overpaid?: number;
  prevFee?: number;
  nextFee?: number;
  maxFee?: number;
  totalCost?: number;
  demandLevel?: number;
};

// Fine-grained tutor messages for EIP-1559 game events.
export function getEip1559TutorMessage(
  key: Eip1559MessageKey,
  params: Eip1559MessageParams = {}
): string {
  switch (key) {
    case "mempool_ready":
      return "Mempool refreshed! Set your bid and try to win a scarce block slot.";
    case "simulation_success":
      return `Nice! Your transaction made the block. Your bid was ${params.userBid} Gwei.`;
    case "simulation_fail":
      return "Your bid was too low, so your transaction stayed pending. Try raising it to beat the competition.";
    case "overpaid":
      return `You overpaid by ${params.overpaid} Gwei. In first-price auctions, you pay your bid even if the clearing price is lower.`;
    case "base_fee_rise":
      return `Base fee increased from ${params.prevFee} to ${params.nextFee} Gwei. Blocks are over 50% full, so fees rise automatically.`;
    case "base_fee_drop":
      return `Base fee decreased from ${params.prevFee} to ${params.nextFee} Gwei. Blocks are under 50% full, so fees fall.`;
    case "tx_rejected":
      return `Your transaction was rejected. Max fee ${params.maxFee} Gwei is below the required cost ${params.totalCost} Gwei. Increase your cap.`;
    case "tx_included":
      return `Transaction included! You cap at ${params.maxFee} Gwei but only pay ${params.totalCost} Gwei. The rest is refunded.`;
    case "demand_high":
      return `Congestion is now ${params.demandLevel}%. Watch the base fee climb as demand exceeds target.`;
    case "demand_low":
      return `Congestion is now ${params.demandLevel}%. Base fee will drift down as blocks stay under target.`;
    default:
      return DEFAULT_PAGE_GREETING;
  }
}

type Eip7702MessageKey =
  | "eoa_start"
  | "eoa_timeout"
  | "eoa_success"
  | "batch_start"
  | "batch_success"
  | "sponsor_blocked"
  | "sponsor_appears"
  | "sponsor_signing"
  | "sponsor_success"
  | "panel_1"
  | "panel_2"
  | "panel_3"
  | "panel_4";

// Fine-grained tutor messages for EIP-7702 game events.
export function getEip7702TutorMessage(key: Eip7702MessageKey): string {
  switch (key) {
    case "eoa_start":
      return "EOA mode: each click is its own transaction. Race the clock!";
    case "eoa_timeout":
      return "Time’s up! Separate signatures are too slow. Let’s try batching.";
    case "eoa_success":
      return "You squeezed in all 10 signatures—barely! This is why batching helps.";
    case "batch_start":
      return "7702 mode: one signature to execute the whole batch.";
    case "batch_success":
      return "Instant execution! One signature, no waiting. That’s the power of 7702.";
    case "sponsor_blocked":
      return "No gas means no claim. With 7702, a paymaster can sponsor the fee.";
    case "sponsor_appears":
      return "A sponsor showed up—sign once and they’ll cover the gas.";
    case "sponsor_signing":
      return "Signing the sponsorship request… this delegates gas payment to the sponsor.";
    case "sponsor_success":
      return "Success! The sponsor paid gas so you could claim the reward.";
    case "panel_1":
      return "As a normal EOA, you’re limited. The cliff is your blocker.";
    case "panel_2":
      return "Transformation begins—7702 injects smart contract logic into your EOA temporarily.";
    case "panel_3":
      return "Now you have smart contract powers. The impossible gap becomes trivial.";
    case "panel_4":
      return "Transformation ends, and you revert safely to EOA mode. Powerful, but temporary.";
    default:
      return DEFAULT_PAGE_GREETING;
  }
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
