# GameBadgeNFT 流程图（纯文本）

```
[用户打开应用]
      |
      v
[连接钱包(仅首次)]
      |
      v
[前端获取用户地址]
      |
      v
[用户闯关]
      |
      v
<通关?> ---- 否 ----> [继续闯关]
   |
   是
   v
[前端通知后端: user + gameId + runId]
      |
      v
[后端生成 claimId(幂等)]
      |
      v
[后端用 minter 钱包调用合约 mintTo]
      |
      v
[合约校验: onlyMinter / paused / claimId 未用]
      |
      v
[合约 mint + 事件 Minted]
      |
      v
[后端索引事件(tokenId/index)]
      |
      v
[前端查询 tokenURI 并展示 NFT]
```
