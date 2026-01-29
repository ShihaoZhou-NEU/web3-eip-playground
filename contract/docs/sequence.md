# GameBadgeNFT 交互图（纯文本）

```
User        Frontend        Backend        Project Wallet        Contract
 |             |               |                |                   |
 | 打开应用     |               |                |                   |
 |-----------> |               |                |                   |
 |             | 请求连接钱包   |                |                   |
 |             |<------------- |                |                   |
 | 连接确认    |               |                |                   |
 |-----------> |               |                |                   |
 |             | 读取地址       |                |                   |
 |             |---------------|                |                   |
 | 闯关成功     |               |                |                   |
 |-----------> |               |                |                   |
 |             | POST /game/clear(user, gameId)  |                   |
 |             |-------------->|                |                   |
 |             |               | 生成 claimId    |                   |
 |             |               |--------------->|                   |
 |             |               | 签名 mintTo     |                   |
 |             |               |--------------->|                   |
 |             |               |                | 调用 mintTo        |
 |             |               |                |------------------>| 
 |             |               |                |                   | 校验/铸造/发事件
 |             |               |<---------------|                   |
 |             |               | 索引事件        |                   |
 |             |               |<---------------|                   |
 |             | GET /nft/status|                |                   |
 |             |-------------->|                |                   |
 |             |<--------------| tokenId/index  |                   |
 |             | 调 tokenURI    |                |                   |
 |             |----------------------------------------------->    |
 |             |<----------------------------------------------      |
 |             | 展示 NFT       |                |                   |
 |<------------|               |                |                   |
```
后端要干什么

  - 在用户通关后生成唯一 claimId（幂等 ID），并把 user + gameId + claimId 发起链上 mint。
  - 用项目方 minter 热钱包调用合约 mintTo(user, gameId, claimId)，项目方承担 gas。
  - 监听 Minted(to, tokenId, index, gameId, claimId) 事件，索引 tokenId/index，写入数据库（或可被前端查询）。
  - 提供查询接口让前端拿到用户的 tokenId/index，并可直接用 tokenURI 展示。

  合约要干什么

  - 提供 ERC‑721 NFT（可转移）。
  - 只允许 minter 调用 mintTo（权限控制）。
  - 防重复：claimUsed[claimId] 防重放。
  - mint 时为每个 token 生成一个 index(0..14)（弱随机），并固定保存到 tokenToIndex[tokenId]。
  - tokenURI = baseURI + index + ".json"，指向已上传的 IPFS 元数据（0.json~14.json）。
  - 管理员（owner）可设置 baseURI、minter、paused。

  前端要干什么

  - 连接钱包（仅首次），拿到用户地址。
  - 用户闯关，通关后通知后端（user + gameId + runId）。
  - 轮询/查询后端，拿到 tokenId/index。
  - 调用合约 tokenURI(tokenId) 获取元数据并展示 NFT。
  - 全过程无需用户签名或弹钱包（由后端 minter 发起 mint）。

