import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ["Home", "Blog", "FAQ", "Team"];

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-border bg-background/90 backdrop-blur-sm">
      <div className="container flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4">
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
        <nav className="hidden md:flex items-center gap-8">
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="md:hidden inline-flex items-center justify-center w-10 h-10 border-2 border-border bg-black/40 text-primary hover:bg-black/60 transition-colors"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Status Bar / Wallet Connect */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop / large screens: default button with text */}
          <div className="hidden md:block">
            <ConnectButton />
          </div>

          {/* Mobile / small screens: icon-only */}
          <div className="md:hidden">
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
                    } hover:bg-black/60 transition-colors`}
                    aria-label={connected ? "Account" : "Connect wallet"}
                  >
                    <img
                      src="/images/wallet_icon.png"
                      alt=""
                      className="w-4 h-4 pixelated"
                    />
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
        <div className="md:hidden border-t-4 border-border bg-background/95 backdrop-blur-sm">
          <div className="container py-4 flex flex-col gap-3">
            {navItems.map(item => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="font-pixel text-xs text-foreground hover:text-primary transition-colors uppercase"
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
