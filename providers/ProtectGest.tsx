"use client";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectGestRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (!isLoading && user && isMounted) {
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    }
  }, [isLoading, user, router]);

  if (isLoading) return <>Loading</>;

  // Only show the login/guest page if NO user is logged in
  if (!user) {
    return <>{children}</>;
  }

  // Return null or a loader while the redirect is happening
  return null;
}
