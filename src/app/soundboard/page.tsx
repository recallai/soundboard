"use client";

import { usePlaySoundboard } from "@/app/(client)/_hooks/use-play-soundboard";
import { Signature } from "@/app/(client)/_components/modules/signature";
import { SoundCommands } from "@/server/utils/SoundCommands";

const Page: React.FC = () => {
  const { isConnected, isReconnecting } = usePlaySoundboard();

  const soundCommands = Object.keys(SoundCommands);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl text-center font-bold text-gray-900 dark:text-white mb-4">
            Soundboard
          </h1>
          <div className="space-y-3">
            <p className="text-xl text-gray-600 dark:text-gray-300 text-center">
              Send commands in-chat to play viral sounds
            </p>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 dark:border-gray-600/50">
              {/* Control Commands */}
              <div className="grid grid-cols-2 gap-2 text-lg mb-4">
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-base font-mono">
                    !list
                  </code>
                  <span className="text-gray-600 dark:text-gray-400">
                    List sounds
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-base font-mono">
                    !kick
                  </code>
                  <span className="text-gray-600 dark:text-gray-400">
                    Bot leaves call
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200/60 dark:border-gray-600/60 my-4"></div>

              {/* Sound Commands */}
              <div className="text-center">
                <p className="text-base text-gray-600 dark:text-gray-400 mb-3">
                  Available sounds:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {soundCommands.map((command) => (
                    <code
                      key={command}
                      className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-base font-mono"
                    >
                      {command}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Info */}
        <div className="space-y-4">
          {/* Compact Status */}
          <div className="flex items-center justify-center gap-3 py-3 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/20 dark:border-gray-700/30">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected
                  ? "bg-green-500"
                  : isReconnecting
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-lg font-medium ${
                isConnected
                  ? "text-green-700 dark:text-green-400"
                  : isReconnecting
                  ? "text-yellow-700 dark:text-yellow-400"
                  : "text-red-700 dark:text-red-400"
              }`}
            >
              {isConnected
                ? "Connected"
                : isReconnecting
                ? "Reconnecting..."
                : "Disconnected"}
            </span>
          </div>

          {/* Recording Disclaimer */}
          <div className="text-center">
            <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
              It only joins to play sounds when requested.
            </p>
          </div>
        </div>

        {/* Powered by Recall.ai */}
        <div className="mt-6">
          <Signature />
        </div>
      </div>
    </div>
  );
};

export default Page;
