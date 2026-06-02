"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageCircle,
  UserPlus,
  UserCheck,
  Link2,
  Calendar,
  MapPin,
  ArrowLeft,
  User,
  PenSquare,
  BadgeCheck,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  UserMinus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthContext";
import { SocialPostCard, Post } from "@/components/social-post-card";
import { CommentSidebar } from "@/components/comment-sidebar";
import {
  useGetAllMyPosts,
  useGetAllMyTrendingPosts,
  useGetAllPosts,
} from "@/utils/api/endpoints";
import BookmarkPost from "@/components/bookmarkPost";
import { useInView } from "react-intersection-observer";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("recent");
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetAllMyPosts(10, activeTab);
  const { data: trendingData, isLoading: trendingDataLoading } =
    useGetAllMyTrendingPosts(activeTab);
  const router = useRouter();
  const { ref, inView } = useInView();
  const { user: currentUser } = useAuth();
  console.log(trendingData);
  const postData =
    data?.pages.flatMap((data) => {
      return data.data;
    }) || [];
  useEffect(() => {
    if (inView && !isLoading && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]);
  // console.log(postData);
  // console.log(data);
  const isOwnProfile = true;
  const profileUser = currentUser;

  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Comments Sidebar state
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  // Fetch real posts
  const { data: postsData, isLoading: isPostsLoading } = useGetAllPosts(20);
  const allPosts: Post[] =
    postsData?.pages.flatMap((page: any) => page.data) || [];

  // Filter posts by the current profile user
  const userPosts = allPosts.filter((post) => {
    if (!post || !post.author) return false;
    if (!currentUser) return false;
    const authorIdStr = String(post.author.id);
    const currentUserIdStr = String(currentUser.id);
    return (
      authorIdStr === currentUserIdStr || post.author.name === currentUser.name
    );
  });

  // Top Trending: sort user posts by likesCount descending
  const trendingPosts = [...userPosts].sort(
    (a, b) => b.likesCount - a.likesCount,
  );

  const handleOpenComments = (post: Post, commentId?: string | number) => {
    setSelectedPost(post);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      setSelectedPost(null);
    }, 300);
  };

  const totalPostCount =
    userPosts.length > 0 ? userPosts.length : (profileUser?._count?.posts ?? 0);

  return (
    <div className="flex w-full min-h-screen bg-background relative">
      {/* Scrollable Main Area */}
      <div className="flex-1 max-w-2xl w-full mx-auto pb-24  bg-background/50 backdrop-blur-xs min-h-screen">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40">
          <div className="px-4">
            <div className="flex items-center gap-4 h-14">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors cursor-pointer text-foreground/80 hover:text-foreground"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="font-extrabold tracking-tight text-foreground">
                  {profileUser?.name}
                </h1>
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  {totalPostCount} {totalPostCount === 1 ? "post" : "posts"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Area (No Cover Photo) */}
        <div className="px-4 sm:px-6 py-6 space-y-6 mt-2">
          {/* Asymmetric Profile Metadata & Avatar block */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-6 ">
            <div className="flex-1 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-3xl font-black tracking-tight text-foreground">
                    {profileUser?.name}
                  </h2>
                  {profileUser?.isVerifyed && (
                    <BadgeCheck className="size-6 fill-primary text-primary-foreground shrink-0 shadow-xs" />
                  )}

                  {profileUser?.profession && (
                    <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] tracking-widest font-black px-2.5 py-0.5 rounded-full select-none capitalize">
                      {profileUser.profession}
                    </span>
                  )}
                </div>
              </div>

              {profileUser?.bio && (
                <p className="text-foreground/80 text-sm leading-relaxed max-w-xl font-medium">
                  {profileUser.bio}
                </p>
              )}

              {/* Meta tags */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground/80 pt-1 font-semibold">
                {profileUser?.address && (
                  <div className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <MapPin className="size-4 text-rose-500" />
                    <span>{profileUser.address}</span>
                  </div>
                )}
                {profileUser?.website && (
                  <div className="flex items-center gap-1.5">
                    <Link2 className="size-4 text-primary" />
                    <a
                      href={`https://${profileUser.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline underline-offset-4 cursor-pointer hover:text-primary/80 transition-colors"
                    >
                      {profileUser.website}
                    </a>
                  </div>
                )}
                {profileUser?.profession && (
                  <div className="flex items-center gap-1.5">
                    <User className="size-4 text-blue-500" />
                    <span>{profileUser.profession}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div
              className="relative size-24 sm:size-28 rounded-2xl ring-4 ring-muted bg-linear-to-br from-primary/30 to-primary/10 overflow-hidden shadow-md group cursor-pointer shrink-0"
              onClick={() => isOwnProfile && router.push("/home/profile/edit")}
            >
              {profileUser?.image ? (
                <img
                  src={profileUser.image}
                  alt={profileUser?.name || "Profile"}
                  className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/70 group-hover:scale-105 transition-all duration-500">
                  <User className="size-12 text-primary/40 animate-pulse" />
                </div>
              )}
              {isOwnProfile && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PenSquare className="size-5 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Stats & Actions Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
            {/* Stats Block */}
            <div className="flex gap-2 bg-muted/30 border border-border/30 rounded-2xl p-2.5 shadow-xs shrink-0 justify-around sm:justify-start">
              <div className="text-center px-4 min-w-17.5">
                <div className="font-black text-base text-foreground">
                  {totalPostCount.toLocaleString()}
                </div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">
                  posts
                </div>
              </div>
              <div className="w-px bg-border/40 my-1" />
              <div className="text-center px-4 min-w-17.5">
                <div className="font-black text-base text-foreground">
                  {(profileUser?._count?.followers ?? 0).toLocaleString()}
                </div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">
                  followers
                </div>
              </div>
              <div className="w-px bg-border/40 my-1" />
              <div className="text-center px-4 min-w-17.5">
                <div className="font-black text-base text-foreground">
                  {(profileUser?._count?.following ?? 0).toLocaleString()}
                </div>
                <div className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">
                  following
                </div>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="flex gap-2 flex-1 sm:justify-end">
              {isOwnProfile ? (
                <Button
                  onClick={() => router.push("/home/profile/edit")}
                  variant="outline"
                  className="w-full sm:w-auto gap-2 cursor-pointer font-bold rounded-xl border-border/60 hover:bg-muted shadow-xs transition-all hover:scale-[1.01] px-5 h-10"
                >
                  <PenSquare className="size-4 text-muted-foreground" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleFollowToggle}
                    variant={isFollowing ? "outline" : "default"}
                    className={cn(
                      "flex-1 sm:flex-initial gap-2 cursor-pointer font-bold rounded-xl shadow-xs transition-all hover:scale-[1.01] px-6 h-10",
                      isFollowing
                        ? "border-primary/20 hover:bg-primary/5 text-primary"
                        : "bg-primary text-primary-foreground shadow-md shadow-primary/10 hover:shadow-primary/20",
                    )}
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
                          <UserCheck className="size-4 animate-pulse" />
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
                    onClick={() =>
                      profileUser?.id &&
                      router.push(`/messages/${profileUser.id}`)
                    }
                    variant="outline"
                    className="gap-2 cursor-pointer font-bold rounded-xl border-border/60 hover:bg-muted shadow-xs transition-all hover:scale-[1.01] px-5 h-10"
                  >
                    <MessageCircle className="size-4 text-muted-foreground" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Tabs (Glassmorphic Slider Design) */}
          <div className="mt-8">
            <div className="flex p-1 bg-muted/40 backdrop-blur-sm border border-border/30 rounded-2xl relative">
              {[
                { id: "recent", label: "Recent Posts" },
                { id: "trending", label: "Top Trending" },
                { id: "saved", label: "Saved Posts" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={cn(
                      "flex-1 py-2.5 text-xs font-black tracking-wider uppercase rounded-xl transition-all duration-300 cursor-pointer relative z-10",
                      isActive
                        ? "text-primary-foreground bg-primary shadow-md shadow-primary/20 scale-[1.02]"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Content Panel */}
            <div className="mt-8">
              {activeTab === "recent" && (
                <div className="space-y-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-300">
                      <Loader2 className="size-8 animate-spin text-primary mb-4" />
                      <p className="text-xs uppercase font-extrabold tracking-widest animate-pulse">
                        Loading Feed...
                      </p>
                    </div>
                  ) : postData.length > 0 ? (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
                      {postData.map((post) => (
                        <SocialPostCard
                          key={post.id}
                          post={post}
                          onOpenComments={(commentId) =>
                            handleOpenComments(post, commentId)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-muted/15 border border-dashed border-border/50 rounded-3xl p-8 relative overflow-hidden group animate-in fade-in duration-500">
                      <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4 border border-primary/10 shadow-inner group-hover:scale-110 transition-all duration-500">
                        <Sparkles className="size-8 text-primary" />
                      </div>
                      <h3 className="font-extrabold text-foreground mb-1.5">
                        No stories shared yet
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
                        {isOwnProfile
                          ? "You haven't written any stories yet. Share your thoughts, designs, or ideas with the world!"
                          : `${profileUser?.name} hasn't posted anything yet.`}
                      </p>
                      {/* {isOwnProfile && (
                        <Button
                          onClick={() => router.push("/home/advanced-editor")}
                          className="gap-2 cursor-pointer font-bold rounded-xl shadow-md shadow-primary/15 hover:shadow-primary/25 transition-all"
                        >
                          <PenSquare className="size-4" />
                          Create Story
                        </Button>
                      )} */}
                    </div>
                  )}
                  <div ref={ref}></div>
                </div>
              )}

              {activeTab === "trending" && (
                <div className="space-y-6">
                  {trendingDataLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-300">
                      <Loader2 className="size-8 animate-spin text-primary mb-4" />
                      <p className="text-xs uppercase font-extrabold tracking-widest animate-pulse">
                        Loading Trending...
                      </p>
                    </div>
                  ) : trendingData.data.length > 0 ? (
                    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
                      {trendingData.data.map((post: any) => (
                        <SocialPostCard
                          key={post.id}
                          post={post}
                          onOpenComments={(commentId) =>
                            handleOpenComments(post, commentId)
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-muted/15 border border-dashed border-border/50 rounded-3xl p-8 relative overflow-hidden group animate-in fade-in duration-500">
                      <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4 border border-primary/10 shadow-inner group-hover:scale-110 transition-all duration-500">
                        <Sparkles className="size-8 text-primary animate-pulse" />
                      </div>
                      <h3 className="font-extrabold text-foreground mb-1.5">
                        No trending stories
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
                        Top posts with the highest popularity rating will appear
                        here once created and liked.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "saved" && (
                <div className="animate-in fade-in duration-500">
                  <BookmarkPost
                    isActive={activeTab === "saved"}
                    onOpenComments={handleOpenComments}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Comment Discussions Sidebar */}
      <CommentSidebar
        post={selectedPost}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
      />
    </div>
  );
}
