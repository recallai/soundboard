import type { Metadata } from "next";
import "./(client)/globals.css";

export const metadata: Metadata = {
  title: "Recall.ai Soundboard",
  description:
    "Have fun with your team in meetings with the Recall.ai Soundboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-geist antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
