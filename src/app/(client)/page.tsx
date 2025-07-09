import { CreateBotForm } from "@/app/(client)/_components/forms/create-bot-form";
import { Navbar } from "@/app/(client)/_components/modules/navbar";
import { Signature } from "@/app/(client)/_components/modules/signature";
import { Button } from "@/app/(client)/_components/ui/button";
import { GITHUB_URL } from "@/lib/urls";
import { FaGithub } from "react-icons/fa";

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
                Recall.ai Soundboard Bot
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Send a bot to a meeting that can play viral sounds
              </p>
            </div>

            <div className="w-full max-w-2xl flex flex-col items-center gap-4">
              {/* Form */}
              <div className="min-w-[400px]">
                <CreateBotForm />
              </div>

              {/* GitHub CTA */}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="group bg-white hover:bg-gray-50 border-gray-200 text-gray-900 font-medium px-4 sm:px-6 py-3 h-auto shadow-sm hover:shadow-md transition-all duration-200"
              >
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <FaGithub />
                  <span className="text-sm sm:text-base">
                    View Source code on GitHub
                  </span>
                </a>
              </Button>
            </div>

            {/* Powered by Recall.ai */}
            <div className="mt-12 pt-8 border-t border-muted-foreground/10">
              <Signature />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
