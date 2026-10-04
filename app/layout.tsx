import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./kz-overrides.css";
import "./kz-final-polish.css";
import "./kz-review-pass.css";
import "./kz-international-spacing.css";
import "./kz-brand-polish.css";
import "./kz-visual-final.css";
import "./kz-clean-pass.css";
import "./kz-aesthetic-pass.css";
import { SiteShell } from "../components/SiteShell";

export const metadata: Metadata = {
  title: {
    default: "KickSeatz — Find better tickets",
    template: "%s | KickSeatz",
  },
  description:
    "KickSeatz helps fans discover NFL games and compare tickets using price, seat area, game vibe, and personalized preferences.",
  applicationName: "KickSeatz",
  keywords: ["NFL tickets", "ticket discovery", "sports tickets", "KickSeatz"],
};

export const viewport: Viewport = {
  themeColor: "#0B0A12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
