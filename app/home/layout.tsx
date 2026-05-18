import type { Metadata } from "next";
import ProtectUserRoute from "@/providers/ProtectUser";
import { HomeNavbar } from "@/components/home-navbar";

export const metadata: Metadata = {
  title: "Storiboard - Feed",
  description: "Trending posts feed",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectUserRoute>
      <div className="flex flex-col min-h-screen">
        <HomeNavbar />
        <main className="flex-1 w-full overflow-y-scroll">{children}</main>
      </div>
    </ProtectUserRoute>
  );
}
