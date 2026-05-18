import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storiboard - Advanced Editor",
  description: "Draft, style, and perfect your next great story with our professional advanced editor.",
};

export default function AdvancedEditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
