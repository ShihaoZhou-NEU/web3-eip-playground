import { createRoot } from "react-dom/client";
import { PostHogProvider } from "posthog-js/react";
import App from "./App";
import "./index.css";

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost =
  import.meta.env.VITE_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

const posthogOptions = {
  api_host: posthogHost,
  autocapture: true,
  capture_pageview: "history_change",
  defaults: "2025-11-30",
} as const;

createRoot(document.getElementById("root")!).render(
  posthogKey ? (
    <PostHogProvider apiKey={posthogKey} options={posthogOptions}>
      <App />
    </PostHogProvider>
  ) : (
    <App />
  )
);
