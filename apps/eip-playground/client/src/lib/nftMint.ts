// FastAPI NFT Minting Client
import { trackEvent } from "@/lib/analytics";

// const NFT_API_BASE = "http://127.0.0.1:8009";
const NFT_API_BASE = import.meta.env.VITE_API_URL;

export interface ClaimBadgeRequest {
  userAddress: string;
}

export interface ClaimBadgeSuccessResponse {
  success: true;
  tokenId: number;
  contractAddress: string;
  txHash: string;
}

export interface ClaimBadgeErrorResponse {
  Detail: string;
}

export type ClaimBadgeResponse =
  | ClaimBadgeSuccessResponse
  | ClaimBadgeErrorResponse;

export async function claimERC8004Badge(
  userAddress: string
): Promise<ClaimBadgeSuccessResponse> {
  trackEvent("nft_mint_start", {
    eip_id: "erc-8004",
    wallet_address: userAddress,
  });

  let response: Response;
  try {
    response = await fetch(`${NFT_API_BASE}/claim-badge/8004`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userAddress }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Network error";
    trackEvent("nft_mint_fail", {
      eip_id: "erc-8004",
      wallet_address: userAddress,
      error: message,
    });
    throw error;
  }

  const data = await response.json();

  if (!response.ok) {
    const detail =
      (data as ClaimBadgeErrorResponse).Detail ||
      `Failed to claim badge: ${response.statusText}`;
    trackEvent("nft_mint_fail", {
      eip_id: "erc-8004",
      wallet_address: userAddress,
      status: response.status,
      error: detail,
    });
    // Handle error response
    throw new Error(detail);
  }

  const successData = data as ClaimBadgeSuccessResponse;
  trackEvent("nft_mint_success", {
    eip_id: "erc-8004",
    wallet_address: userAddress,
    token_id: successData.tokenId,
    contract_address: successData.contractAddress,
    tx_hash: successData.txHash,
  });

  return successData;
}
