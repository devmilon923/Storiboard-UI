"use client";

import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Bell,
  Clock,
  ChevronRight,
  BadgeCheck,
  Loader2,
} from "lucide-react";
import moment from "moment";
import { Card, CardHeader } from "@/components/ui/card";
import { useGetAllNotifications } from "@/utils/api/endpoints";
import { useInView } from "react-intersection-observer";

// Dummy Notification Types based on updated schema
type NotificationType =
  | "LIKE_ON_POST"
  | "LIKE_ON_COMMENT"
  | "COMMENT_ON_POST"
  | "REPLIE_ON_COMMENT"
  | "REPLIE_ON_REPLIE"
  | "FOLLOW";

interface User {
  id: number;
  name: string;
  image: string;
  isVerifyed?: boolean;
}

interface Notification {
  id: number;
  sender: User;
  title: string;
  ref: string | null;
  notiType: NotificationType;
  createdAt: string;
  updatedAt: string;
}

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "LIKE_ON_POST":
    case "LIKE_ON_COMMENT":
      return <Heart className="size-3.5 fill-rose-500 text-rose-500" />;
    case "COMMENT_ON_POST":
    case "REPLIE_ON_COMMENT":
    case "REPLIE_ON_REPLIE":
      return (
        <MessageCircle className="size-3.5 fill-blue-500/20 text-blue-500" />
      );
    case "FOLLOW":
      return <UserPlus className="size-3.5 text-emerald-500" />;
    default:
      return <Bell className="size-3.5 text-gray-500" />;
  }
};

export default function NotificationsPage() {
  const { ref, inView } = useInView({ threshold: 1, delay: 100 });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetAllNotifications();

  const mainNotifications = data?.pages?.flatMap((page) => page.data) || [];
  console.log(mainNotifications);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Notifications
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Latest updates from your social network
        </p>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : mainNotifications.length > 0 ? (
          <>
            {mainNotifications.map((notification: any) => (
              <Card
                key={notification.id}
                className="group relative w-full overflow-hidden bg-card/40 border-border/40 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm rounded-3xl cursor-pointer"
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  {/* Avatar Section */}
                  <div className="relative size-12 shrink-0">
                    <div className="h-full w-full overflow-hidden rounded-full border-2 border-primary/20 shadow-sm">
                      <img
                        src={notification.sender.image}
                        alt={notification.sender.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-background border border-border shadow-sm">
                      <NotificationIcon type={notification.notiType} />
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-foreground">
                            {notification.sender.name}
                          </span>
                          {notification.sender.isVerifyed && (
                            <BadgeCheck className="size-3.5 fill-primary text-primary-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-foreground/80 leading-snug">
                          {notification.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground/60">
                          <Clock className="size-3" />
                          <span>{moment(notification.createdAt).fromNow()}</span>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
            <div ref={ref} className="w-full flex justify-center py-4">
              {isFetchingNextPage ? (
                <Loader2 className="size-6 animate-spin text-primary" />
              ) : null}
            </div>
          </>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="size-20 rounded-full bg-muted/20 flex items-center justify-center mb-4">
              <Bell className="size-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              No notifications yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">
              We'll let you know when something important happens.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
