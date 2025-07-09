"use client";

import confetti from "canvas-confetti";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/app/(client)/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/(client)/_components/ui/form";
import { Input } from "@/app/(client)/_components/ui/input";
import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  meetingUrl: z.string().url({
    message: "Please enter a valid URL.",
  }),
});

export function CreateBotForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meetingUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);

      if (
        !values.meetingUrl.includes("google") &&
        !values.meetingUrl.includes("zoom") &&
        !values.meetingUrl.includes("microsoft")
      ) {
        throw new Error("Meeting URL must be from Google, Zoom, or Microsoft");
      }

      const res = await fetch(`/api/v1/bot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(`${data?.message}`);
      }

      // Wait + randomness for UX
      await new Promise((resolve) =>
        setTimeout(resolve, 500 + Math.random() * 1000)
      );

      setIsSuccess(true);

      // Trigger confetti on success
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error("Error creating bot:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create bot. Please check your meeting URL and try again"
      );
      setIsSuccess(false);
    }
  }

  const buttonContent = useMemo(() => {
    if (isSuccess) {
      return "Deployed";
    }
    if (form.formState.isSubmitting) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Deploying
        </>
      );
    }
    return "Create Bot";
  }, [isSuccess, form.formState.isSubmitting]);

  const buttonClassName = useMemo(() => {
    const baseClasses =
      "px-8 py-2 whitespace-nowrap rounded-l-none text-white transition-colors w-32";

    if (isSuccess) {
      return `${baseClasses} bg-green-600 hover:bg-green-700`;
    }
    if (form.formState.isSubmitting) {
      return `${baseClasses} bg-blue-400 cursor-not-allowed`;
    }
    return `${baseClasses} bg-blue-600 hover:bg-blue-700`;
  }, [isSuccess, form.formState.isSubmitting]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="meetingUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex w-full items-center">
                    <Input
                      placeholder="https://meeting-link.com"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (error) setError(null);
                        if (isSuccess) setIsSuccess(false);
                      }}
                      className="flex-1 rounded-r-none border-r-0"
                      disabled={form.formState.isSubmitting || isSuccess}
                    />
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting || isSuccess}
                      className={buttonClassName}
                    >
                      {buttonContent}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
                {isSuccess && (
                  <p className="text-sm text-green-600 mt-1">
                    🎉 Bot deployed successfully! Your meeting is about to
                    become a lot more fun.
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
