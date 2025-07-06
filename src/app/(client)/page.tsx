import { CreateBotForm } from "@/app/(client)/_components/forms/create-bot-form";
import { Navbar } from "@/app/(client)/_components/modules/navbar";
import { PoweredByRecall } from "@/app/(client)/_components/modules/powered-by-recall";
import { Badge } from "@/app/(client)/_components/ui/badge";
import { Button } from "@/app/(client)/_components/ui/button";
import { Github, Star, GitFork } from "lucide-react";

const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12 lg:py-16">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                Make meetings intereactive and fun
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Deploy a soundboard bot that joins a call in-chat and plays
                sounds,
                <span className="hidden sm:inline">
                  <br />
                </span>
                <span className="sm:hidden"> </span>
                no code required
              </p>
            </div>

            {/* Form */}
            <div className="w-full max-w-2xl">
              <CreateBotForm />
            </div>

            {/* GitHub CTA */}
            <div className="flex flex-col items-center gap-4 pt-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group bg-white hover:bg-gray-50 border-gray-200 text-gray-900 font-medium px-4 sm:px-6 py-3 h-auto shadow-sm hover:shadow-md transition-all duration-200"
              >
                <a
                  href="https://github.com/recallai/soundboard"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">View on GitHub</span>
                  <Badge
                    variant="secondary"
                    className="ml-1 sm:ml-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs sm:text-sm"
                  >
                    Open Source
                  </Badge>
                </a>
              </Button>

              {/* GitHub Stats */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span>Give it a star</span>
                </div>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  <span>Fork & customize</span>
                </div>
              </div>
            </div>

            {/* Powered by Recall.ai */}
            <div className="mt-12 pt-8 border-t border-muted">
              <PoweredByRecall />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
