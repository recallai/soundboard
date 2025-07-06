"use client";

import { CodeTabs } from "@/app/(client)/_components/ui/code-tabs";

export interface BotConfigArgs {
  region?: string;
  recallApiKey?: string;
  meetingUrl?: string;
  clientWebpageUrl?: string;
  realtimeEventsUrl?: string;
}

export const recallBotConfig = {
  url: (config?: Pick<BotConfigArgs, "region">) =>
    `https://${config?.region ?? "us-west-2"}.recall.ai/api/v1/bots`,

  headers: (config?: Pick<BotConfigArgs, "recallApiKey">) => ({
    "Content-Type": "application/json",
    Authorization: config?.recallApiKey ?? "YOUR_RECALL_API_KEY",
  }),

  body: (
    config?: Pick<
      BotConfigArgs,
      "meetingUrl" | "clientWebpageUrl" | "realtimeEventsUrl"
    >
  ) => ({
    meeting_url: config?.meetingUrl ?? "https://your-meeting-url",
    bot_name: "Recall.ai Soundboard Bot",
    recording_config: {
      transription: {
        provider: {
          meeting_captions: {}, // Enables meeting caption transcription
        },
      },
      realtime_endpoints: [
        // This is the websocket endpoint that the bot will receive events from the bot
        {
          type: "websocket",
          url:
            config?.realtimeEventsUrl ??
            "wss://your-realtime-events-websocket-url",
          events: ["participant_events.chat_message"],
        },
      ],
    },
    chat: {
      on_bot_join: {
        send_to: "everyone",
        // This is the message that will be sent to the meeting chat when the bot joins
        message:
          "Hello! I'm a soundboard bot powered by https://recall.ai. Once connected, you can play sounds by typing in the chat: !<sound name> (i.e. !hello)",
      },
    },
    output_media: {
      // This is the webpage that will be displayed in the meeting chat
      // It will be outputted from the bot's tile (not screenshared)
      camera: {
        kind: "webpage",
        config: {
          url: config?.clientWebpageUrl ?? "https://your-webpage-url",
        },
      },
    },
    variant: {
      zoom: "web_4_core",
      google_meet: "web_4_core",
      microsoft_teams: "web_4_core",
    },
  }),
};

export const SampleCodeBlock: React.FC<{
  config?: BotConfigArgs;
}> = ({ config }) => {
  const codeTabs = [
    {
      language: "Shell",
      code: `curl -X POST ${recallBotConfig.url(config)} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: YOUR_RECALL_API_KEY" \\
  -d ${JSON.stringify(recallBotConfig.body(config), null, 2)}`,
    },
    {
      language: "Javascript",
      code: `
const response = await fetch('${recallBotConfig.url(config)}', {
  method: 'POST',
  headers: ${JSON.stringify(recallBotConfig.headers(config), null, 2).replace(
    /\n/g,
    "\n  "
  )},
  body: ${JSON.stringify(recallBotConfig.body(config), null, 2).replace(
    /\n/g,
    "\n  "
  )}
});

const data = await response.json();
console.log(data);`,
    },
    {
      language: "Python",
      code: `
import requests

response = requests.post(
  '${recallBotConfig.url(config)}',
  headers=${JSON.stringify(recallBotConfig.headers(config), null, 2).replace(
    /\n/g,
    "\n  "
  )},
  json=${JSON.stringify(recallBotConfig.body(config), null, 2).replace(
    /\n/g,
    "\n  "
  )}
)

data = response.json()
print(data)`,
    },
  ];
  return <CodeTabs tabs={codeTabs} />;
};
