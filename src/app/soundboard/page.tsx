"use client";

import { usePlaySoundboard } from "@/app/(client)/_hooks/use-play-soundboard";
import { Card, CardContent } from "@/app/(client)/_components/ui/card";
import Image from "next/image";
import recallLogo from "@/app/(client)/_assets/recall-logo.svg";

const Page: React.FC = () => {
  const { isConnected } = usePlaySoundboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image src={recallLogo} alt="Recall Logo" width={32} height={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Recall.ai Soundboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Send a message in-chat like !hello to play a sound!
          </p>
        </div>

        {/* Main Status Card */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-0 shadow-xl">
          <CardContent className="p-8">
            {/* Connection Status */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`w-4 h-4 rounded-full mr-3 ${
                    isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                  }`}
                ></div>
                <span
                  className={`text-lg font-semibold ${
                    isConnected
                      ? "text-green-700 dark:text-green-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              {isConnected && (
                <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <svg
                    className="w-4 h-4 text-green-600 dark:text-green-400 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Ready for audio
                  </span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Powered by Recall.ai
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
