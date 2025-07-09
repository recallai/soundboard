"use client";

import Image from "next/image";
import RecallLogo from "@/app/(client)/_assets/recall-logo.svg";

export function PoweredByRecallAi() {
  return (
    <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
      <span>Powered by</span>
      <a
        href="https://www.recall.ai"
        target="_blank"
        rel="noreferrer"
        className="hover:opacity-80 transition-opacity"
      >
        <Image
          src={RecallLogo}
          alt="Recall.ai"
          width={54}
          height={12}
          className="h-3.5 w-auto pb-0.5"
        />
      </a>
    </div>
  );
}
