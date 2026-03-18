// @author João Gabriel de Almeida

import type { Metadata } from "next";
import { FeedbackClient } from "./FeedbackClient";
import "./globals.css";

export const metadata: Metadata = {
  title: "Owl Feedback Example",
  description: "Example app with Owl feedback widget",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FeedbackClient>{children}</FeedbackClient>
      </body>
    </html>
  );
}
