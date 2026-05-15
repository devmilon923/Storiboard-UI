import {
  BookOpen,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BadgeCheck,
  Loader2,
  Feather,
} from "lucide-react";
import DOMPurify from "dompurify";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import moment from "moment";

import { calculateReadTime } from "@/utils/helpers";
import Image from "next/image";
import {
  useAddLike,
  useBookmarkAction,
  useGetAllSavePosts,
} from "@/utils/api/endpoints";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { formatNumber, Post } from "./social-post-card";
import { likeValidation } from "@/utils/api/validations";
import z from "zod";

interface BookmarkItem {
  id: number;
  createdAt: string;
  post: {
    id: number;
    content: string;
    author: {
      name: string;
      image: string;
      profession: string;
      isVerifyed: boolean;
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
  };
  isLiked: boolean;
}

function BookmarkCard({
  item,
  onOpenComments,
}: {
  item: BookmarkItem;
  onOpenComments: (post: Post, commentId?: string | number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = item.post.content.length > 200;
  const displayContent = isExpanded
    ? item.post.content
    : item.post.content.slice(0, 200) + (isLongText ? "..." : "");
  const readTime = calculateReadTime(item.post.content);
  const [isBookmarked, setIsBookmarked] = useState(true);
  const updateBookmarks = useBookmarkAction();
  const [isLiked, setIsLiked] = useState(item.isLiked || false);
  const addSavePostLike = useAddLike();
  const handleBookmark = async (id: number) => {
    try {
      await updateBookmarks.mutateAsync(id);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostLike = async (data: z.infer<typeof likeValidation>) => {
    try {
      if (data) {
        await addSavePostLike.mutateAsync(data);
        setIsLiked(!isLiked);
        item.post.likesCount = isLiked
          ? item.post.likesCount - 1
          : item.post.likesCount + 1;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card className="group relative overflow-hidden bg-card/40 border-border/40 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 rounded-3xl">
      <CardHeader className="flex flex-row items-start gap-4 p-5 pb-3">
        <div className="relative size-10 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-full border-2 border-primary/20 shadow-sm">
            <Image
              width={100}
              height={100}
              src={item.post?.author?.image}
              alt={item.post.author.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-bold text-foreground truncate">
                {item.post.author.name}
              </span>
              {item.post.author.isVerifyed && (
                <BadgeCheck className="size-3.5 fill-primary text-primary-foreground" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-y-1 gap-x-2 text-[11px] font-medium text-muted-foreground/60 flex-wrap">
            <span className="text-primary/60 truncate">
              {item.post.author.profession}
            </span>
            <span className="size-0.5 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <Clock className="size-2.5 opacity-70" />
                <span>Posted {moment(item.post.createdAt).fromNow()}</span>
              </div>
              <span className="size-0.5 rounded-full bg-border" />
              <div className="flex items-center gap-1 text-primary/70">
                <Bookmark className="size-2.5 opacity-70 fill-current" />
                <span>Saved {moment(item.createdAt).fromNow()}</span>
              </div>
            </div>
            <span className="size-0.5 rounded-full bg-border" />
            <span className="bg-primary/10 text-primary/80 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-widest font-extrabold whitespace-nowrap">
              {readTime} min read
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0 min-w-0">
        <div
          className="text-[14px] leading-relaxed text-foreground/80 whitespace-pre-wrap wrap-break-word overflow-hidden [&>p]:mb-2 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-4 [&>ol]:ml-4"
          dangerouslySetInnerHTML={{
            __html:
              typeof window !== "undefined"
                ? DOMPurify.sanitize(displayContent)
                : displayContent,
          }}
        />
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-2 text-[13px] font-bold text-primary hover:text-primary/80 cursor-pointer transition-all hover:gap-3 group/read"
          >
            <span className="underline decoration-primary/30 underline-offset-4 group-hover/read:decoration-primary">
              {isExpanded ? "Close story" : "Continue reading"}
            </span>
            <Feather
              className={`size-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t border-border/10 bg-muted/5 p-2 px-4">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              handlePostLike({
                likeType: "post",
                sourceId: Number(item.post.id),
              })
            }
            className={`h-8 gap-1.5 rounded-full px-3 transition-all duration-300 ${
              isLiked
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Heart
              className={`size-4 transition-transform duration-300 ${
                isLiked ? "fill-primary scale-110" : ""
              }`}
            />
            <span className="text-[11px] font-bold">
              {formatNumber(item.post.likesCount)}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenComments(item.post as Post)}
            className="h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300"
          >
            <MessageCircle className="size-4" />
            <span className="text-[11px] font-bold">
              {formatNumber(item.post.commentsCount)}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-primary hover:bg-primary/5"
          >
            <Share2 className="size-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleBookmark(+item.post.id)}
          className={`size-8 rounded-full transition-all duration-300 ${
            isBookmarked
              ? "text-primary bg-primary/10 shadow-inner"
              : "text-muted-foreground hover:text-primary hover:bg-primary/5"
          }`}
        >
          <Bookmark
            className={`size-4 transition-all duration-500 ${isBookmarked ? "fill-primary scale-110" : ""}`}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}

function BookmarkPost({
  isActive,
  onOpenComments,
}: {
  isActive: boolean;
  onOpenComments: (post: Post, commentId?: string | number) => void;
}) {
  const { ref, inView } = useInView({ threshold: 1, delay: 100 });
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllSavePosts(10, isActive);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);
  const bookmarks = data?.pages.flatMap(
    (page: any) => page.data || [],
  ) as BookmarkItem[];

  console.log(bookmarks);
  if (!bookmarks) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="size-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 border border-primary/10 shadow-inner">
          <BookOpen className="size-10 text-primary/40" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          Your Reading List
        </h3>
        <p className="text-muted-foreground max-w-xs mx-auto">
          Stories you save will appear here. This feature is coming soon to help
          you build your personal library.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Saved Posts</h3>
          <p className="text-sm text-muted-foreground">in your library</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            item={bookmark}
            onOpenComments={onOpenComments}
          />
        ))}
        <div ref={ref} className="py-8 flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="size-6 animate-spin text-primary" />
          ) : hasNextPage ? (
            <span className="text-sm text-muted-foreground animate-pulse">
              Loading more bookmarks...
            </span>
          ) : (
            <span className="text-sm text-muted-foreground italic">
              You've reached the end of the bookmarks
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookmarkPost;
