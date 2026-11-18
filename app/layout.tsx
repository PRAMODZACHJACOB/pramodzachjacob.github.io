import type { Metadata } from "next";
import "./globals.css";
import "./enhancements.css";

export const metadata: Metadata = {
  title: "Zach Jacob — A little curious. A lot creative.",
  description: "Compositor, video editor and AI content creator. A creative playground, and a story to unfold.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
