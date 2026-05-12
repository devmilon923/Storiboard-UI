"use client";

import { useAuth } from "@/providers/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  User,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { user, logoutHelper, isLoading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  function handleLogout() {
    logoutHelper();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <rect
              width="24"
              height="24"
              rx="6"
              fill="currentColor"
              opacity="0.12"
            />
            <path d="M9.5 7.5l7 4.5-7 4.5V7.5z" fill="currentColor" />
          </svg>
          <span>ResumeBuilder</span>
        </Link>

        <div className="flex items-center gap-2">
          {isLoading && isMounted ? (
            <Loader2 size={18} className="animate-spin text-muted-foreground" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-border/70 bg-muted/50 px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary uppercase overflow-hidden border border-primary/20">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    user.name?.charAt(0) || <User size={14} />
                  )}
                </span>

                <span className="hidden sm:inline">{user.name}</span>

                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 origin-top-right animate-in fade-in slide-in-from-top-2 rounded-lg border border-border bg-popover p-1 shadow-lg">
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href={user.role === "admin" ? "/admin" : "/home"}
                      onClick={() => setMenuOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut size={15} />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ---- Not logged in: Sign In button ---- */
            <Button variant="default" size="sm" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
