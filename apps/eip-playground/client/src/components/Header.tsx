import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Link } from "wouter";
import { Menu, X, Wallet } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [walletPopoverOpen, setWalletPopoverOpen] = useState(false);
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
          {/* Desktop / large screens: pixel buttons with chain + balance */}
          <div className="hidden lg:block">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openConnectModal,
                openChainModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                if (!connected) {
                  return (
                    <button
                      type="button"
                      onClick={openConnectModal}
                      className="btn-pixel btn-pixel-primary h-10 px-5 text-[10px] font-pixel uppercase tracking-widest hover:-translate-y-0.5 hover:brightness-110 transition-transform"
                      aria-label="Connect wallet"
                    >
                      CONNECT WALLET
                    </button>
                  );
                }

                return (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openChainModal}
                      className={`btn-pixel h-10 px-4 text-[10px] font-pixel uppercase tracking-widest hover:-translate-y-0.5 hover:brightness-110 transition-transform ${
                        chain?.unsupported
                          ? "bg-red-500 text-white border-white"
                          : "btn-pixel-accent"
                      }`}
                      aria-label="Select network"
                    >
                      {chain?.iconUrl && (
                        <img
                          src={chain.iconUrl}
                          alt={chain.name ?? "Network"}
                          className="w-3 h-3 mr-2"
                          style={{ background: chain.iconBackground }}
                        />
                      )}
                      {chain?.unsupported ? "WRONG NETWORK" : chain?.name}
                    </button>
                    <button
                      type="button"
                      onClick={openAccountModal}
                      className="btn-pixel btn-pixel-primary h-10 px-4 text-[10px] font-pixel uppercase tracking-widest hover:-translate-y-0.5 hover:brightness-110 transition-transform"
                      aria-label="Account"
                    >
                      <span>{account?.displayName}</span>
                      {account?.displayBalance && (
                        <span className="ml-2 text-[9px] opacity-80">
                          {account.displayBalance}
                        </span>
                      )}
                    </button>
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Mobile / small screens: icon-only */}
          <div className="lg:hidden">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                if (!connected) {
                  return (
                    <button
                      type="button"
                      onClick={openConnectModal}
                      className="relative inline-flex items-center justify-center w-10 h-10 border-2 border-border bg-black/40 text-primary hover:bg-black/60 hover:scale-105 transition-all"
                      aria-label="Connect wallet"
                    >
                      <Wallet className="w-4 h-4" />
                    </button>
                  );
                }

                const networkLabel = chain?.unsupported
                  ? "WRONG NETWORK"
                  : chain?.name ?? "NETWORK";

                return (
                  <Popover open={walletPopoverOpen} onOpenChange={setWalletPopoverOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="relative inline-flex items-center justify-center w-10 h-10 border-2 border-border bg-primary/20 text-primary hover:bg-black/60 hover:scale-105 transition-all"
                        aria-label="Account"
                      >
                        <Wallet className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      side="bottom"
                      align="end"
                      sideOffset={8}
                      className="w-56 border-2 border-border bg-background/95 p-3 shadow-lg"
                    >
                      <div className="flex flex-col gap-2 font-pixel text-[10px] uppercase text-foreground">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {chain?.iconUrl && (
                              <img
                                src={chain.iconUrl}
                                alt={chain.name ?? "Network"}
                                className="w-4 h-4"
                                style={{ background: chain.iconBackground }}
                              />
                            )}
                            <span
                              className={`truncate ${
                                chain?.unsupported ? "text-red-400" : ""
                              }`}
                            >
                              {networkLabel}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setWalletPopoverOpen(false);
                              openChainModal();
                            }}
                            className={`btn-pixel h-7 px-2 text-[9px] ${
                              chain?.unsupported
                                ? "bg-red-500 text-white border-white"
                                : "btn-pixel-accent"
                            }`}
                          >
                            NETWORK
                          </button>
                        </div>
                        <div className="h-px bg-border/70" />
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate">{account?.displayName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setWalletPopoverOpen(false);
                              openAccountModal();
                            }}
                            className="btn-pixel btn-pixel-primary h-7 px-2 text-[9px]"
                          >
                            ACCOUNT
                          </button>
                        </div>
                        {account?.displayBalance && (
                          <div className="text-[9px] text-muted-foreground">
                            {account.displayBalance}
                          </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
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
