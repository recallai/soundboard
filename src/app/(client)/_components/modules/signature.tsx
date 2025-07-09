"use client";

import Image from "next/image";
import RecallLogo from "@/app/(client)/_assets/recall-logo.svg";
import { RECALL_URL } from "@/lib/urls";

export function Signature() {
  return (
    <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
      <span>Built with</span>
      <a
        href={RECALL_URL}
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
