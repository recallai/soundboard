import { CreateBotForm } from "@/app/(client)/_components/forms/create-bot-form";
import { IntegrationIcons } from "@/app/(client)/_components/modules/integration-icons";
import { Navbar } from "@/app/(client)/_components/modules/navbar";
import { SampleCodeBlock } from "@/app/(client)/_components/modules/recall-bot-config";
import { ExternalLink } from "lucide-react";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col gap-16">
      <Navbar />
      <div className="min-h-screen max-w-4xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Make any meeting fun with Recall.ai
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Deploy a soundboard bot that joins a call in-chat and plays sounds,
            <br />
            no code required
          </p>
          {/* Form */}
          <div className="max-w-2xl mx-auto w-full px-4">
            <CreateBotForm />
          </div>
        </div>

        {/* Integration Icons */}
        <IntegrationIcons />

        {/* Divider */}
        <div className="w-full h-[1px] bg-muted" />

        {/* Content Sections */}
        <div className="flex flex-col gap-16">
          {/* Quickstart Section */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground uppercase font-medium">
                QUICKSTART
              </p>
              <h2 className="text-3xl font-bold text-foreground">
                Deploy your Own!
              </h2>
            </div>
            <a
              href="https://github.com/recallai"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
              <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span>View this repo on GitHub</span>
            </a>
            <SampleCodeBlock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
