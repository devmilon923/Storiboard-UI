import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Storiboard - Saved Posts",
  description: "Browse through stories you've saved and bookmarked for later reading.",
};

export default function SavePostLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
