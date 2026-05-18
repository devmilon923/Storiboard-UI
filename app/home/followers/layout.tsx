import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storiboard - Followers",
  description: "Manage your professional connections, discover verified creators, and grow your network.",
};

export default function FollowersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
