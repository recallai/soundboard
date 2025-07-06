"use client";

import React, { useState } from "react";
import { Button } from "@/app/(client)/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/(client)/_components/ui/tooltip";
import { cn } from "@/app/(client)/_lib/utils";

export interface CodeTab {
  language: string;
  code: string;
}

interface CodeTabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: CodeTab[];
}

export const CodeTabs: React.FC<CodeTabsProps> = ({
  tabs,
  className,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (!tabs.length) {
    return null;
  }

  const activeCode = tabs[activeTab].code;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCopied(false);
  };

  return (
    <TooltipProvider>
      <div className={cn("relative", className)} {...props}>
        {/* Tab Headers */}
        <div className="flex items-center">
          {tabs.map((tab, index) => (
            <button
              key={tab.language}
              onClick={() => setActiveTab(index)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative border-b-2",
                activeTab === index
                  ? "text-foreground border-blue-600"
                  : "text-muted-foreground hover:text-foreground border-border"
              )}
            >
              {tab.language}
            </button>
          ))}
        </div>

        {/* Code Content */}
        <div className="relative mt-4">
          <pre className="p-4 bg-muted rounded-lg text-sm font-mono overflow-x-auto border">
            <code className="text-foreground">{activeCode}</code>
          </pre>
          <Tooltip open={isHovered}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{copied ? "Copied!" : "Copy code"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};
