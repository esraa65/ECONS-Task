import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Econs Consultant",
  description:
    "Econs Consultant: personalized consulting, practical education, and a live trading room with a real-time economic calendar and breaking-news alerts.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
