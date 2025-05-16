import { ModeContextProvider } from "@-ft/mode-next";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const theme = (await cookies()).get("theme");

  return (
    <html
      className={theme?.value === "dark" ? "dark" : undefined}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script src="/mode.js" />
      </head>
      <body>
        <ModeContextProvider
          variableName="__theme_mode"
          ssrInitialMode={theme?.value || "light"}
        >
          {children}
        </ModeContextProvider>
      </body>
    </html>
  );
}
