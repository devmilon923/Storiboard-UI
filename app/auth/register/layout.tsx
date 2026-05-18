import type { Metadata } from "next";
import ProtectGestRoute from "@/providers/ProtectGest";

export const metadata: Metadata = {
  title: "Storiboard - Sign Up",
  description: "Create your Storiboard account to start publishing stories and connecting with creators.",
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectGestRoute>{children}</ProtectGestRoute>;
}
