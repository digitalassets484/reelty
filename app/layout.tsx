import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reelty — Listing in. Post out.",
  description:
    "Done-for-you social content for real estate agents. AI avatar videos, branded picture posts, auto-scheduled — all from one dashboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
