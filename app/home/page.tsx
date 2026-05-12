"use client";
import React, { useEffect, useState } from "react";
import { SocialPostCard, Post } from "@/components/social-post-card";
import { CreatePost } from "@/components/create-post";
import { useGetAllPosts } from "@/utils/api/endpoints";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CommentSidebar } from "@/components/comment-sidebar";
import { useInView } from "react-intersection-observer";
const HomePage: React.FC = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllPosts(5);

  const posts: Post[] = data?.pages.flatMap((page: any) => page.data) || [];
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [initialCommentId, setInitialCommentId] = useState<
    string | number | null
  >(null);
  const [activeTab, setActiveTab] = useState<"foryou" | "trending">("trending");
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 1, delay: 100 });

  const handleTabChange = (tab: "foryou" | "trending") => {
    setActiveTab(tab);
    if (tab === "foryou") {
      router.push("/home/foryou");
    } else {
      router.push("/home");
    }
  };
  const handleOpenComments = (post: Post, commentId?: string | number) => {
    setSelectedPost(post);
    setInitialCommentId(commentId || null);
    setIsSidebarOpen(true);
  };
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      setSelectedPost(null);
      setInitialCommentId(null);
    }, 300);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Main Feed Section */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
          <CreatePost />

          <div className="space-y-6">
            <div className="flex items-center gap-8 border-b border-border/50 px-2">
              <button
                onClick={() => handleTabChange("trending")}
                className={`relative flex items-center justify-center pb-3 text-sm tracking-tight transition-colors ${
                  activeTab === "trending"
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Trending</span>
                {activeTab === "trending" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
              <button
                onClick={() => handleTabChange("foryou")}
                className={`relative flex items-center justify-center pb-3 text-sm tracking-tight transition-colors ${
                  activeTab === "foryou"
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>For You</span>
                {activeTab === "foryou" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            </div>

            <div className="flex flex-col gap-6 pb-20">
              {posts?.map((post) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  onOpenComments={(commentId) =>
                    handleOpenComments(post, commentId)
                  }
                />
              ))}
              <div ref={ref} className="py-8 flex justify-center">
                {isFetchingNextPage ? (
                  <Loader2 className="size-6 animate-spin text-primary" />
                ) : hasNextPage ? (
                  <span className="text-sm text-muted-foreground animate-pulse">
                    Loading more posts...
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    You've reached the end of the feed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Sidebar */}
      <CommentSidebar
        post={selectedPost}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        initialCommentId={initialCommentId}
      />
    </div>
  );
};

export default HomePage;
