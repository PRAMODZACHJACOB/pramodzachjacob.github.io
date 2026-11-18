import {assetPath} from "../lib/assets";
import type { Metadata } from "next";
import "./globals.css";
import "./enhancements.css";

export const metadata: Metadata = {
  title: "Zach Jacob — A little curious. A lot creative.",
  description: "Compositor, video editor and AI content creator. A creative playground, and a story to unfold.",
  icons: {
    icon: assetPath('/favicon.svg'),
    shortcut: assetPath('/favicon.svg'),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head><style>{[400,600,800].map((weight,index)=>`@font-face{font-family:Manrope;font-style:normal;font-weight:${weight};font-display:swap;src:url('${assetPath('/fonts/manrope-'+['regular','semibold','extrabold'][index]+'.ttf')}') format('truetype')}`).join('')}</style></head><body className="antialiased">{children}</body>
    </html>
  );
}
