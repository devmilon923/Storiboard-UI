"use client";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectUserRoute({
  children,
}: {
  children: ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isMounted) {
      if (!user) {
        router.push("/auth/login");
      } else if (user.role !== "user") {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, user, router, isMounted]);

  if (!isMounted || (isLoading && !user)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <div className="animate-pulse text-sm font-medium text-muted-foreground">
            Restoring session...
          </div>
        </div>
      </div>
    );
  }

  if (user?.role === "user") {
    return <>{children}</>;
  }

  return null;
}
