# Frontend Agent Notes: apps/eip-playground (Vite + React)

Scope
This document covers only the frontend under `apps/eip-playground/client`. It explains architecture, routing, and what every file in `client/src` does, including which components each page uses.

Quick Start (Frontend Only)
1. `cd apps/eip-playground`
2. `pnpm install`
3. `pnpm run dev`

Frontend Architecture (High Level)
- Build tool: Vite
- UI: React + TypeScript
- Styling: Tailwind CSS (configured in `client/src/index.css`)
- Routing: `wouter`
- Wallet: RainbowKit + wagmi
- Data: static EIP content in `client/src/data/eips.ts`
- Games: mini-game components under `client/src/components/games/`

Routing Map (`client/src/App.tsx`)
- `/` -> `Home` (hero + feature grid)
- `/comics` -> `ComicsPage` (comic reader + gallery)
- `/eip/:id` -> `EIPDetail` (comic, games, and content for one EIP)
- `/blog` -> `Blog` (list posts)
- `/blog/:slug` -> `BlogDetail` (render markdown)
- `/faq` -> `FAQ` (markdown-driven FAQ)
- `/team` -> `Team` (team page from JSON)
- Fallback -> `NotFound`

Entry + Providers
- `client/src/main.tsx`: React entry, mounts `App` and loads `index.css`.
- `client/src/App.tsx`: Global providers (Wagmi, RainbowKit, React Query, ThemeProvider, TooltipProvider), router, scroll restoration, error boundary, Vercel analytics.

Pages (What Each Page Uses)
- `client/src/pages/Home.tsx`: Uses `Header`, `Hero`, `FeatureGrid`, `Footer`.
- `client/src/pages/EIPDetail.tsx`: Uses `Header`, `Footer`, `ComicReader`, games (`GasWarGame`, `BurnerGame`, `BatchingGame`, `SponsorshipGame`, `DelegationGame`, `AgentAcademyGame`), `AITutor`, and markdown renderer `Streamdown`. It also connects section scroll to tutor greetings and renders EIP content from `data/eips.ts`.
- `client/src/pages/ComicsPage.tsx`: Uses `Header`, `Footer`, `ComicReader`, `eips` data. Includes random-pick and gallery list.
- `client/src/pages/Blog.tsx`: Uses `Header`, `PageBanner`, `Card`. Fetches `/blog/blog-manifest.json` and each `/blog/:slug/index.md` to build a list.
- `client/src/pages/BlogDetail.tsx`: Uses `Header`, `Card`, `Button`, `Streamdown`. Fetches and parses markdown for a single blog post.
- `client/src/pages/FAQ.tsx`: Uses `Header`, `PageBanner`, `Card`, `Streamdown`. Fetches `/faq/questions.md` and renders collapsible Q&A.
- `client/src/pages/Team.tsx`: Uses `Header`, `PageBanner`, `Card`. Fetches `/team/members.json` and renders team cards.
- `client/src/pages/NotFound.tsx`: Uses `Card`, `Button` and redirects home.

Core Components
- `client/src/components/Header.tsx`: Top nav, logo, wouter links, RainbowKit connect button, mobile menu.
- `client/src/components/Footer.tsx`: Partner logos and legal links.
- `client/src/components/Hero.tsx`: Home hero with CTAs, typewriter text, and mascot art.
- `client/src/components/FeatureGrid.tsx`: Flipping cards for EIP modules using `eips` data.
- `client/src/components/ComicReader.tsx`: Paginated comic reader with preload, keyboard navigation, fullscreen portal.
- `client/src/components/AITutor.tsx`: Floating tutor with speech bubble, typewriter effect, and expandable chat history.
- `client/src/components/AIChatBox.tsx`: Generic chat UI component with Streamdown rendering, scroll, loading state.
- `client/src/components/ConsoleDialog.tsx`: Modal console-style quiz UI with typewriter tutor messages.
- `client/src/components/ErrorBoundary.tsx`: Catches render errors and provides reload UI.
- `client/src/components/PageBanner.tsx`: Reusable page hero banner.
- `client/src/components/Map.tsx`: Google Maps loader and wrapper (not currently used in pages).
- `client/src/components/Typewriter.tsx`: Typewriter text effect for Hero.

Games (Interactive Modules)
- `client/src/components/games/eip1559/GasWarGame.tsx`: First-price auction simulation with mempool and block inclusion.
- `client/src/components/games/eip1559/BurnerGame.tsx`: EIP-1559 base fee simulator + chart, tutor tips.
- `client/src/components/games/eip7702/BatchingGame.tsx`: EOA vs 7702 batching mini-game.
- `client/src/components/games/eip7702/SponsorshipGame.tsx`: Gas sponsorship mini-game.
- `client/src/components/games/eip7702/DelegationGame.tsx`: Panel-by-panel narrative game for “temporary code”.
- `client/src/components/games/erc8004/AgentAcademyGame.tsx`: Multi-stage ERC-8004 game with tasks, validation, quiz, and NFT claim.

Data + APIs
- `client/src/data/eips.ts`: Canonical EIP content, sections, comic metadata, and game block config.
- `client/src/data/tutorScripts.ts`: Tutor message scripts for EIP pages and game events.
- `client/src/lib/quizApi.ts`: REST client for quiz endpoints.
- `client/src/lib/nftMint.ts`: REST client for ERC-8004 badge claim.
- `client/src/lib/wagmi.ts`: RainbowKit config and supported chains.
- `client/src/lib/utils.ts`: `cn()` Tailwind class merge helper.
- `client/src/constants/GameBadgeNFTABI.ts`: ERC-8004 NFT ABI for on-chain reads (not wired in pages yet).
- `client/src/const.ts`: Frontend OAuth helper for login URL (currently unused in pages).

Hooks + Contexts
- `client/src/hooks/useMobile.tsx`: `useIsMobile` breakpoint hook.
- `client/src/hooks/useComposition.ts`: Composition event handling for IME input.
- `client/src/hooks/usePersistFn.ts`: Stable callback helper to avoid rebinds.
- `client/src/contexts/ThemeContext.tsx`: Theme provider with optional switchable mode.
- `client/src/contexts/ScrollContext.tsx`: Stores scroll position for potential restoration (not wired in pages).

Styling
- `client/src/index.css`: Tailwind theme tokens, pixel-art styles, custom utilities, global background.

File-by-File Reference (client/src)
- `client/src/App.tsx`: App shell + providers + routes + scroll restoration + analytics.
- `client/src/main.tsx`: React root mount.
- `client/src/index.css`: Global theme, pixel styles, utilities.
- `client/src/const.ts`: OAuth login URL builder using envs.
- `client/src/constants/GameBadgeNFTABI.ts`: ABI constants.
- `client/src/contexts/ThemeContext.tsx`: Theme state and provider.
- `client/src/contexts/ScrollContext.tsx`: Scroll position context.
- `client/src/data/eips.ts`: EIP content and section config.
- `client/src/data/tutorScripts.ts`: Tutor narrative strings and helpers.
- `client/src/hooks/useMobile.tsx`: Mobile breakpoint hook.
- `client/src/hooks/useComposition.ts`: Composition event helper.
- `client/src/hooks/usePersistFn.ts`: Stable function wrapper.
- `client/src/lib/nftMint.ts`: NFT claim API client.
- `client/src/lib/quizApi.ts`: Quiz API client.
- `client/src/lib/utils.ts`: `cn` class merge.
- `client/src/lib/wagmi.ts`: Wallet config.
- `client/src/pages/Home.tsx`: Home page layout.
- `client/src/pages/EIPDetail.tsx`: EIP detail page with comics/games/content/tutor.
- `client/src/pages/ComicsPage.tsx`: Comic reader + gallery.
- `client/src/pages/Blog.tsx`: Blog list.
- `client/src/pages/BlogDetail.tsx`: Blog detail markdown render.
- `client/src/pages/FAQ.tsx`: FAQ markdown render.
- `client/src/pages/Team.tsx`: Team page from JSON.
- `client/src/pages/NotFound.tsx`: 404 page.
- `client/src/components/Header.tsx`: Top navigation + wallet connect.
- `client/src/components/Footer.tsx`: Footer.
- `client/src/components/Hero.tsx`: Hero section.
- `client/src/components/FeatureGrid.tsx`: EIP cards.
- `client/src/components/ComicReader.tsx`: Comic paging + fullscreen.
- `client/src/components/AITutor.tsx`: Tutor UI + chat history.
- `client/src/components/AIChatBox.tsx`: Generic chat box UI.
- `client/src/components/ConsoleDialog.tsx`: Terminal-style quiz dialog.
- `client/src/components/ErrorBoundary.tsx`: Global error boundary.
- `client/src/components/PageBanner.tsx`: Page banner.
- `client/src/components/Map.tsx`: Google Maps wrapper.
- `client/src/components/Typewriter.tsx`: Typewriter effect.
- `client/src/components/games/eip1559/GasWarGame.tsx`: Gas auction game.
- `client/src/components/games/eip1559/BurnerGame.tsx`: Base fee simulator.
- `client/src/components/games/eip7702/BatchingGame.tsx`: Batching game.
- `client/src/components/games/eip7702/SponsorshipGame.tsx`: Sponsorship game.
- `client/src/components/games/eip7702/DelegationGame.tsx`: Delegation story game.
- `client/src/components/games/erc8004/AgentAcademyGame.tsx`: Agent Academy game.
- `client/src/components/ui/*`: Radix/Tailwind component library (button, card, dialog, tooltip, etc.). These are shared UI primitives; each file exports a specific UI element (e.g. `button.tsx` for `Button`, `card.tsx` for `Card`).

Notes for New Agents
- EIP modules are data-driven: the EIP list, sections, and game IDs live in `client/src/data/eips.ts`.
- `EIPDetail` renders sections based on `sections[]` and maps `gameId` to a component.
- Tutor messages are centralized in `client/src/data/tutorScripts.ts`.
- Blog/FAQ/Team pages load markdown or JSON from `/public` paths.
