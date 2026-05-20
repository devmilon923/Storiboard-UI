"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Settings,
  MessageCircle,
  UserPlus,
  UserCheck,
  Link2,
  Calendar,
  MapPin,
  CheckCircle,
  ArrowLeft,
  User,
  PenSquare,
  BadgeCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthContext";

// Mock data - replace with your actual API calls
const MOCK_USER = {
  id: "1",
  name: "Sarah Johnson",
  username: "sarahj",
  image: null,
  bio: "Creative director & digital artist. Passionate about design, photography, and coffee.",
  location: "New York, NY",
  website: "sarahj.design",
  joinDate: "2023-01-15",
  isVerified: true,
  followerCount: 12450,
  followingCount: 832,
  postCount: 347,
};

const MOCK_OTHER_USER = {
  id: "2",
  name: "Michael Chen",
  username: "michaelc",
  image: null,
  bio: "Software engineer | Tech enthusiast | Building cool things",
  location: "San Francisco, CA",
  website: "michaelchen.dev",
  joinDate: "2023-06-20",
  isVerified: false,
  followerCount: 3420,
  followingCount: 456,
  postCount: 128,
};

export default function ProfilePage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  // For demo: change this to false to see "other user" view
  // In real app, check if profile userId matches current user id
  const isOwnProfile = true; // Change to false for other user view

  const profileUser = isOwnProfile ? MOCK_USER : MOCK_OTHER_USER;

  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
    } else {
      setIsFollowing(true);
    }
  };

  const formatJoinDate = (date: string) => {
    const joinDate = new Date(date);
    return `Joined ${joinDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-2xl w-full mx-auto px-4">
          <div className="flex items-center gap-4 h-14">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="font-semibold">{profileUser.name}</h1>
              <p className="text-xs text-muted-foreground">
                {profileUser.postCount} posts
              </p>
            </div>
            {/* {isOwnProfile && (
              <button 
                onClick={() => router.push('/settings/profile')}
                className="ml-auto p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
              >
                <Settings className="size-5" />
              </button>
            )} */}
          </div>
        </div>
      </div>

      <div className="max-w-2xl w-full mx-auto px-4 py-6 ">
        {/* Profile Info */}
        <div className="space-y-5">
          {/* Avatar and Stats Row */}
          <div className="flex items-start justify-between gap-6">
            {/* Avatar */}
            <div
              className="relative shrink-0 cursor-pointer"
              onClick={() => router.push(`/profile/${profileUser.id}/photo`)}
            >
              <div className="size-20 rounded-full ring-4 ring-background bg-linear-to-br from-primary/20 to-primary/10 overflow-hidden">
                {profileUser.image ? (
                  <Image
                    src={profileUser.image}
                    alt={profileUser.name}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <User className="size-9 text-primary/40" />
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 flex justify-around">
              <div className="text-center">
                <div className="font-bold text-lg">
                  {profileUser.postCount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">posts</div>
              </div>
              <div
                className="text-center cursor-pointer"
                onClick={() =>
                  router.push(`/profile/${profileUser.id}/followers`)
                }
              >
                <div className="font-bold text-lg">
                  {profileUser.followerCount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">followers</div>
              </div>
              <div
                className="text-center cursor-pointer"
                onClick={() =>
                  router.push(`/profile/${profileUser.id}/following`)
                }
              >
                <div className="font-bold text-lg">
                  {profileUser.followingCount.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">following</div>
              </div>
            </div>
          </div>

          {/* Name and Bio */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xl font-bold">{profileUser.name}</h2>
              {profileUser.isVerified && (
                <BadgeCheck className=" fill-primary text-primary-foreground shrink-0" />
              )}
            </div>
            {/* <p className="text-muted-foreground text-sm">@{profileUser.username}</p> */}

            {profileUser.bio && (
              <p className="text-foreground/80 text-sm leading-relaxed">
                {profileUser.bio}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground pt-1">
              {profileUser.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              {profileUser.website && (
                <div className="flex items-center gap-1">
                  <Link2 className="size-3.5" />
                  <a
                    href={`https://${profileUser.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline cursor-pointer"
                  >
                    {profileUser.website}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                <span>{formatJoinDate(profileUser.joinDate)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {isOwnProfile ? (
              <Button
                onClick={() => router.push("/settings/profile")}
                variant="outline"
                className="flex-1 gap-2 cursor-pointer"
              >
                <PenSquare className="size-4" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleFollowToggle}
                  variant={isFollowing ? "outline" : "default"}
                  className="flex-1 gap-2 cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isFollowing ? (
                    isHovered ? (
                      <>
                        <UserMinus className="size-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserCheck className="size-4" />
                        Following
                      </>
                    )
                  ) : (
                    <>
                      <UserPlus className="size-4" />
                      Follow
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => router.push(`/messages/${profileUser.id}`)}
                  variant="outline"
                  className="gap-2 cursor-pointer"
                >
                  <MessageCircle className="size-4" />
                  Message
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Simple Tabs (no shadcn Tabs, using custom for compactness) */}
        <div className="mt-8">
          <div className="flex border-b border-border">
            {["Posts", "Replies", "Media", "Likes"].map((tab) => (
              <button
                key={tab}
                className="flex-1 pb-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer data-[active=true]:text-primary data-[active=true]:border-b-2 data-[active=true]:border-primary"
                data-active={activeTab === tab.toLowerCase()}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "posts" && (
              <div className="text-center py-12 text-muted-foreground">
                <User className="size-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No posts yet</p>
              </div>
            )}
            {activeTab === "replies" && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="size-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No replies yet</p>
              </div>
            )}
            {activeTab === "media" && (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="size-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No media yet</p>
              </div>
            )}
            {activeTab === "likes" && (
              <div className="text-center py-12 text-muted-foreground">
                <Heart className="size-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No liked posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons
const UserMinus = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="22" x2="16" y1="11" y2="11" />
  </svg>
);

const Heart = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const ImageIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="2.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
