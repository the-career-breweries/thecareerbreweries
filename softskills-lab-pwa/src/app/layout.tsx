import { ThemeProvider } from "@/components/ThemeProvider";
import InstallPwaPrompt from "@/components/InstallPwaPrompt";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "TCB Softskills Lab | Interactive Career Simulation Software",
  description: "Interactive software platform for automated ATS resume benchmarking, speech pitch simulators, and executive crisis decision drills.",
  manifest: "/manifest.json",
  icons: {
    icon: "/tcb-logo.png",
    apple: "/tcb-logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Softskills Lab",
  },
};

export const viewport: Viewport = {
  themeColor: "#885A3A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider>
          {children}
          <InstallPwaPrompt />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
