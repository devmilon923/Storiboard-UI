import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storiboard - Messages",
  description: "Chat in real-time with your friends and connections on Storiboard.",
};

export default function MessagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
