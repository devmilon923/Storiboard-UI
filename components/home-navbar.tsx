"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bell,
  Users,
  User,
  Settings,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
  },
  {
    label: "Messages",
    href: "/home/messages",
    icon: MessageCircle,
  },
  {
    label: "Notifications",
    href: "/home/notifications",
    icon: Bell,
  },
  {
    label: "Followers",
    href: "/home/followers",
    icon: Users,
  },
  {
    icon: User,
    isProfile: true,
  },
];

export const HomeNavbar = () => {
  const pathname = usePathname();
  const { user, logoutHelper } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    logoutHelper();
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border/50 py-1 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-2xl px-4">
        <div className="flex h-12 items-center justify-between gap-1">
          {NAV_ITEMS.map((item, index) => {
            const isProfile = "isProfile" in item && item.isProfile;
            const href =
              ("href" in item ? item.href : "/home/profile") || "/home/profile";
            const label = "label" in item ? item.label : "Profile";
            const isActive = pathname === href;
            const Icon = item.icon;

            if (isProfile && user) {
              return (
                <div
                  key={index}
                  className="relative flex flex-1 items-center justify-center h-full"
                  ref={menuRef}
                >
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="relative flex items-center justify-center outline-none group"
                    title="Profile Menu"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center p-2 rounded-2xl transition-all duration-300 cursor-pointer",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                      )}
                    >
                      <div className="relative">
                        <div
                          className={cn(
                            "relative flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-full bg-secondary overflow-hidden border-2 border-background shadow-sm ring-1 ring-border transition-all duration-300 group-hover:ring-primary/50 group-hover:shadow-md",
                            isActive &&
                              "ring-primary shadow-primary/20 shadow-md",
                          )}
                        >
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={100}
                              height={100}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-xs">
                              {user.name?.charAt(0) || "U"}
                            </div>
                          )}
                        </div>
                        {/* Status Indicator */}
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500 shadow-sm" />
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute top-full mt-2 right-0 min-w-[220px] overflow-hidden rounded-2xl border border-border bg-background/95 p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-200 ease-out z-50">
                      <div className="px-3 py-3 mb-1 border-b border-border/50">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase overflow-hidden border border-border/50">
                            {user.image ? (
                              <Image
                                src={user.image}
                                alt={user.name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              user.name?.charAt(0) || "U"
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="text-sm font-bold truncate leading-tight">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <Link
                          href="/home/profile"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-all hover:bg-accent hover:text-accent-foreground rounded-xl group"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-accent group-hover:bg-background transition-colors">
                            <User className="size-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/home/profile?tab=settings"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-all hover:bg-accent hover:text-accent-foreground rounded-xl group"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-accent group-hover:bg-background transition-colors">
                            <Settings className="size-4 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <span>Settings</span>
                        </Link>

                        <div className="my-1 border-t border-border/50" />

                        <button
                          onClick={handleLogout}
                          className="flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-[13px] font-medium transition-all hover:bg-rose-500/10 hover:text-rose-500 rounded-xl group text-left"
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors">
                            <LogOut className="size-4 text-rose-500" />
                          </div>
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-1 items-center justify-center h-full transition-all duration-300 group"
                title={label}
              >
                <div
                  className={cn(
                    "flex items-center justify-center p-2 rounded-2xl transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        "size-6 transition-transform duration-200 group-active:scale-95",
                        isActive && "fill-primary/10",
                      )}
                    />

                    {href === "/home/notifications" && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background animate-pulse" />
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
