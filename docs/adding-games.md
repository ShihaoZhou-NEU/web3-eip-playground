# 新增游戏与 EIP 章节说明（EIP Playground）

这份说明用于指导你新增游戏、接入 AI Tutor，并配置 EIP 详情页结构（EIPSection）。

## 1) 新建游戏组件

- 位置：`apps/eip-playground/client/src/components/games/<eip-id>/<GameName>.tsx`
- UI 风格保持与现有游戏一致
- 添加可选的 `onTutorSpeak`，让页面级 Tutor 发声

示例：

```tsx
type GameProps = {
  onTutorSpeak?: (message: string, pose?: TutorPose) => void;
};

export default function MyGame({ onTutorSpeak }: GameProps) {
  // 在关键时刻触发（开始/成功/失败/提示等）
  const notify = () => onTutorSpeak?.("...");
  return <div>{/* game UI */}</div>;
}
```

## 2) 添加 Tutor 文案脚本

更新 `apps/eip-playground/client/src/data/tutorScripts.ts`：

- 在 `GAME_GREETINGS` 中新增游戏问候，key 为 `"<eip-id>:<game-id>"`
- 在对应 EIP 的 helper 中新增更细的文案（例如 `getEip1559TutorMessage`）
- 文案 key 建议保持稳定，方便复用

## 3) 配置 EIPSection（详情页结构）

`EIPSection` 用于描述 EIP 详情页的结构，现在是数据驱动渲染：

```ts
type EIPSection =
  | { type: "comic" }
  | { type: "games"; title: string; intro?: string; spacingClass?: string; blocks: EIPGameBlock[] }
  | { type: "content" };

type EIPGameBlock = {
  gameId: string;
  title?: string;
  description?: string;
  dividerTop?: boolean;
};
```

字段说明：

- **spacingClass**：控制 games 区域内部 block 的间距（对应 `space-y-...`）
- **dividerTop**：为某个 block 顶部加分隔线与 padding（常用于 Part 2）

## 4) 在 eips.ts 中声明 sections

在 `apps/eip-playground/client/src/data/eips.ts` 里配置：

```tsx
sections: [
  { type: "comic" },
  {
    type: "games",
    title: "Game Start",
    spacingClass: "space-y-8 md:space-y-12",
    blocks: [
      {
        gameId: "my-game",
        title: "PART 1",
        description: "介绍...",
        dividerTop: true
      }
    ]
  },
  { type: "content" }
]
```

## 5) 注册游戏组件

在 `EIPDetail.tsx` 的 `GAME_COMPONENTS` 里注册：

```ts
const GAME_COMPONENTS = {
  "my-game": MyGame,
  ...
};
```

## 6) 触发滚动问候

滚动进入游戏区域时，会触发 `GAME_GREETINGS`（已在 EIPDetail 中统一处理）。

## 7) Checklist

- [ ] 游戏组件已创建 `components/games/<eip-id>/`
- [ ] Tutor 文案已补充在 `tutorScripts.ts`
- [ ] `eips.ts` 中已配置 `sections`
- [ ] `GAME_COMPONENTS` 已注册组件
- [ ] 如有新素材，已放入 `public/images`
