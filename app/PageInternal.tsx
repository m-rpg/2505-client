"use client";

import dynamic from "next/dynamic";
import "./page.css";

const AppNoSSR = dynamic(async () => (await import("./App")).App, {
  ssr: false,
});

export function PageInternal() {
  return <AppNoSSR />;
}
