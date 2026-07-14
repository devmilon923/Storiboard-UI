"use client";
import React, { useEffect, useState } from "react";
import { SocialPostCard, Post } from "@/components/social-post-card";
import { CreatePost } from "@/components/create-post";
import { useGetAllPosts } from "@/utils/api/endpoints";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { CommentSidebar } from "@/components/comment-sidebar";
import { useInView } from "react-intersection-observer";
import BookmarkPost from "@/components/bookmarkPost";
const HomePage: React.FC = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllPosts(5);

  const posts: Post[] = data?.pages.flatMap((page: any) => page.data) || [];
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [initialCommentId, setInitialCommentId] = useState<
    string | number | null
  >(null);
  const [activeTab, setActiveTab] = useState<"save" | "trending">("trending");
  const router = useRouter();
  const { ref, inView } = useInView({ threshold: 1, delay: 100 });

  const handleTabChange = (tab: "save" | "trending") => {
    setActiveTab(tab);
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
    <div className="flex h-[calc(100vh-64px)] w-full bg-background">
      {/* Main Feed Section */}
      <div className="flex-1 ">
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div data-create-post-section>
            <CreatePost />
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-8 border-b border-border/50 px-2">
              <button
                onClick={() => handleTabChange("trending")}
                className={`relative flex items-center justify-center cursor-pointer pb-3 text-sm tracking-tight transition-colors ${
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
                onClick={() => handleTabChange("save")}
                className={`relative flex items-center justify-center cursor-pointer pb-3 text-sm tracking-tight transition-colors ${
                  activeTab === "save"
                    ? "font-bold text-foreground"
                    : "font-medium text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>Save Post</span>
                {activeTab === "save" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            </div>

            <div className="flex flex-col gap-6 pb-20">
              {activeTab === "trending" ? (
                <>
                  {posts && posts.length > 0 ? (
                    <>
                      {posts.map((post) => (
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
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-4 space-y-3">
                      <div className="text-center space-y-2">
                        <h3 className="text-sm font-semibold text-foreground">
                          No posts yet
                        </h3>
              
                        <p className="text-xs text-muted-foreground italic">
                          Share your thoughts with the community
                        </p>
                      </div>
                      <button
                        onClick={() => router.push("/home/advanced-editor")}
                        className="px-4 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        Create Post
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <BookmarkPost
                  isActive={activeTab === "save" ? true : false}
                  onOpenComments={handleOpenComments}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Sidebar */}
      <CommentSidebar
        post={selectedPost}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        // initialCommentId={initialCommentId}
      />
    </div>
  );
};

export default HomePage;
