import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storiboard - Notifications",
  description: "Keep track of comments, likes, and mentions on your stories.",
};

export default function NotificationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
