import { ThemeProvider } from "@/components/ThemeProvider";
import InstallPwaPrompt from "@/components/InstallPwaPrompt";
import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Softskills Lab | The Career Breweries",
  description: "Elevate your career through high-impact communication with 3-Days Workshop interactive simulators.",
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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider>
          {children}
          <InstallPwaPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
