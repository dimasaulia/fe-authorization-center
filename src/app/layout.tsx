import type { Metadata } from "next";

import { PreferencesProvider } from "@/modules/preferences";
import { OpenSuiteClientProvider } from "@/modules/opensuite-sdk/OpenSuiteClientProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "OpenSuite",
  description: "Enterprise frontend boilerplate for OpenSuite ecosystem apps.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className="h-full antialiased"
      data-theme="light"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <OpenSuiteClientProvider>
          <PreferencesProvider>{children}</PreferencesProvider>
        </OpenSuiteClientProvider>
      </body>
    </html>
  );
}
