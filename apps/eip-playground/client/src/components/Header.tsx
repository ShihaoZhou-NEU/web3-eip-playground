import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "wouter";
import { Menu, X, Wallet } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ["Home", "Blog", "FAQ", "Team"];

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-background/90 backdrop-blur-sm">
      <div className="container flex h-16 sm:h-20 items-center gap-2 sm:gap-4">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          <img
            // src="/images/panda_logo.png"
            src="/images/eiplay-logo.png"
            alt="Panda Logo"
            className="h-9 w-9 sm:h-12 sm:w-12 object-contain group-hover:animate-pixel-bounce"
          />
          <div className="flex items-baseline gap-1 sm:gap-2">
            <span
              className="font-pixel text-primary text-shadow-pixel text-[22px] sm:text-[35px]"
            >
              EIP
            </span>
            <span
              className="font-pixel text-accent text-shadow-pixel ml-1 sm:ml-2 text-[12px] sm:text-[28px]"
            >
              PLAYGROUND
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
          {navItems.map(item => (
            <Link
              key={item}
              href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              className="relative font-pixel text-xs text-foreground hover:text-primary transition-colors text-shadow-pixel uppercase group"
            >
              {item}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full block" />
            </Link>
          ))}
        </nav>

        {/* Right-side Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(prev => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 border-2 border-border bg-black/40 text-primary hover:bg-black/60 transition-colors"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Status Bar / Wallet Connect */}
          {/* Desktop / large screens: pixel button with text */}
          <div className="hidden lg:block">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;
                const label = connected ? account.displayName : "CONNECT WALLET";

                return (
                  <button
                    type="button"
                    onClick={connected ? openAccountModal : openConnectModal}
                    className="btn-pixel btn-pixel-primary h-10 px-5 text-[10px] font-pixel uppercase tracking-widest hover:-translate-y-0.5 hover:brightness-110 transition-transform"
                    aria-label={connected ? "Account" : "Connect wallet"}
                  >
                    {label}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile / small screens: icon-only */}
          <div className="lg:hidden">
            <ConnectButton.Custom>
              {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <button
                    type="button"
                    onClick={connected ? openAccountModal : openConnectModal}
                    className={`relative inline-flex items-center justify-center w-10 h-10 border-2 border-border ${
                      connected ? "bg-primary/20 text-primary" : "bg-black/40 text-primary"
                    } hover:bg-black/60 hover:scale-105 transition-all`}
                    aria-label={connected ? "Account" : "Connect wallet"}
                  >
                    <Wallet className="w-4 h-4" />
                    {connected && (
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
                    )}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>

      {/* Mobile Nav Panel */}
      {isOpen && (
        <div className="lg:hidden border-t-4 border-border bg-background/95 backdrop-blur-sm">
          <div className="container py-4 flex flex-col gap-3">
            {navItems.map(item => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="font-pixel text-xs text-foreground hover:text-primary hover:bg-black/40 transition-colors uppercase px-2 py-1 border-2 border-transparent hover:border-primary/40"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
