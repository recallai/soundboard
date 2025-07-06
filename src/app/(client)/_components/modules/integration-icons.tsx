"use client";

import Image from "next/image";
import GoogleMeetIcon from "@/app/(client)/_assets/google_meet.svg";
import MicrosoftTeamsIcon from "@/app/(client)/_assets/microsoft_teams.svg";
import ZoomIcon from "@/app/(client)/_assets/zoom.svg";
import SlackIcon from "@/app/(client)/_assets/slack.svg";
import WebexIcon from "@/app/(client)/_assets/webex.svg";
import G2MIcon from "@/app/(client)/_assets/g2m.svg";

interface IntegrationItem {
  name: string;
  icon: string;
  url: string;
}

const integrations: IntegrationItem[] = [
  {
    name: "Google Meet",
    icon: GoogleMeetIcon,
    url: "https://docs.recall.ai/docs/google-meet",
  },
  {
    name: "Microsoft Teams",
    icon: MicrosoftTeamsIcon,
    url: "https://docs.recall.ai/docs/microsoft-teams",
  },
  {
    name: "Zoom",
    icon: ZoomIcon,
    url: "https://docs.recall.ai/docs/zoom-overview",
  },
  {
    name: "Slack",
    icon: SlackIcon,
    url: "https://docs.recall.ai/docs/slack-huddle-bots-overview",
  },
  {
    name: "WebEx",
    icon: WebexIcon,
    url: "https://docs.recall.ai/docs/webex",
  },
  {
    name: "GoToMeeting",
    icon: G2MIcon,
    url: "https://docs.recall.ai/docs/go-to-meeting-overview",
  },
];

export function IntegrationIcons() {
  return (
    <div className="flex items-center justify-center gap-4">
      {integrations.map((integration) => (
        <a
          key={integration.name}
          href={integration.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
          title={integration.name}
        >
          <Image
            src={integration.icon}
            alt={integration.name}
            width={32}
            height={32}
            className="h-8 w-auto transition-transform duration-200 group-hover:scale-110"
          />
        </a>
      ))}
    </div>
  );
}
