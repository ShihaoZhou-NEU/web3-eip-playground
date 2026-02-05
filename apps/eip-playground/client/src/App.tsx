import { useEffect } from "react";
import { useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import ComicsPage from "@/pages/ComicsPage";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import EIPDetail from "./pages/EIPDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import FAQ from "./pages/FAQ";
import Team from "./pages/Team";

// Wagmi & RainbowKit Imports
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "./lib/wagmi";

// Vercel Analytics
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/comics"} component={ComicsPage} />
      <Route path={"/eip/:id"} component={EIPDetail} />
      <Route path={"/404"} component={NotFound} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/blog/:slug"} component={BlogDetail} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/team"} component={Team} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function ScrollRestoration() {
  const [location] = useLocation();
  const previousLocationRef = useRef(location);
  const positionsRef = useRef<Record<string, number>>({});
  const isPopstateRef = useRef(false);

  useEffect(() => {
    const handlePopstate = () => {
      isPopstateRef.current = true;
    };

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  useEffect(() => {
    positionsRef.current[previousLocationRef.current] = window.scrollY;

    if (isPopstateRef.current) {
      const savedPosition = positionsRef.current[location] ?? 0;
      window.scrollTo(0, savedPosition);
    } else {
      window.scrollTo(0, 0);
    }

    isPopstateRef.current = false;
    previousLocationRef.current = location;
  }, [location]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#ffd700", // Gold
              accentColorForeground: "black",
              borderRadius: "medium", // Pixel style
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
            <ThemeProvider defaultTheme="dark">
              <TooltipProvider>
                <Toaster />
                <Router />
                <ScrollRestoration />
                <Analytics />
              </TooltipProvider>
            </ThemeProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}

export default App;
