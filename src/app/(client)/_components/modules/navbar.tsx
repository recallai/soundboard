"use client";

import Image from "next/image";
import RecallLogo from "@/app/(client)/_assets/recall-logo.svg";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a
            href="https://recall.ai"
            target="_blank"
            rel="noreferrer"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <Image
              src={RecallLogo}
              alt="Recall"
              width={20}
              height={20}
              className="h-5 w-auto"
            />
          </a>
          <div className="flex items-center gap-8">
            <a
              href="https://docs.recall.ai/docs"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Docs</span>
            </a>
            <a
              href="https://recall.ai"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Sign-up</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
