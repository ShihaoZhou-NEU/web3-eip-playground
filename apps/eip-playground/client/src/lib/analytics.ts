import posthog from "posthog-js";

type EventProperties = Record<string, unknown>;

const isPostHogReady = () =>
  typeof window !== "undefined" &&
  Boolean((posthog as { __loaded?: boolean }).__loaded);

export const trackEvent = (event: string, properties?: EventProperties) => {
  if (!isPostHogReady()) return;
  posthog.capture(event, properties);
};
