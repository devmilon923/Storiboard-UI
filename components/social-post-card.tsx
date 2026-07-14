import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  BadgeCheck,
  UserPlus,
  UserCheck,
  ArrowRight,
  Bookmark,
  Clock,
  Feather,
} from "lucide-react";
import DOMPurify from "dompurify";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import moment from "moment";
import z from "zod";
import { likeValidation } from "@/utils/api/validations";
import {
  useAddLike,
  useAddReplie,
  useBookmarkAction,
  useFollowerAction,
} from "@/utils/api/endpoints";
import { useAuth } from "@/providers/AuthContext";
import { calculateReadTime } from "@/utils/helpers";

interface Author {
  id: number;
  name: string;
  image: string;
  isVerifyed: boolean;
  profession: string;
}

export interface Comment {
  id: string | number;
  user: {
    name: string;
    image: string;
  };
  content: string;
  createdAt: string;
  isLiked: boolean;
  likesCount?: number;
  commentCount?: number;
  previewReply?: Comment;
}

export interface Post {
  id: string | number;
  author: Author;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: Boolean;
  isFollowing: Boolean;
  commentsCount: number;
  feeling?: {
    emoji: string;
    label: string;
  };
  comments?: Comment[];
}

interface SocialPostCardProps {
  post: Post;
  className?: string;
  onOpenComments?: (commentId?: string | number) => void;
}
export const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num;
};
export const SocialPostCard: React.FC<SocialPostCardProps> = ({
  post,
  onOpenComments,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [replyingToCommentId, setReplyingToCommentId] = useState<
    string | number | null
  >(null);
  const [likedComments, setLikedComments] = useState<Set<string | number>>(
    new Set(),
  );
  const savePost = useBookmarkAction();
  const { user } = useAuth();
  const follow = useFollowerAction();
  const [replyValue, setReplyValue] = useState("");
  const addPostLike = useAddLike();
  const addCommentReplie = useAddReplie();

  const handleFollow = async (userId: number) => {
    try {
      await follow.mutateAsync(userId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReply = async (data: {
    commentId: string | number;
    content: string;
  }) => {
    try {
      const result = await addCommentReplie.mutateAsync({
        sourceId: Number(data.commentId),
        commentType: "replie",
        content: data.content,
      });
      onOpenComments?.(data.commentId);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePostLike = async (data: z.infer<typeof likeValidation>) => {
    try {
      if (data) {
        await addPostLike.mutateAsync(data);
        setIsLiked(!isLiked);
        post.likesCount = isLiked ? post.likesCount - 1 : post.likesCount + 1;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = async (postId: number) => {
    console.log(postId);
    try {
      await savePost.mutateAsync(postId);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.log(error);
    }
  };
  const readTime = calculateReadTime(post.content);

  const isLongText = post.content.length > 200;
  const displayContent = isExpanded
    ? post.content
    : post.content.slice(0, 200) + (isLongText ? "..." : "");

  return (
    <Card className="group relative w-full overflow-hidden bg-card/40 border-border/40 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm rounded-3xl">
      <CardHeader className="flex flex-row items-start gap-4 p-5 pb-0">
        {/* Avatar Section */}
        <div className="relative size-10 shrink-0">
          <div className="h-full w-full overflow-hidden rounded-full border-2 border-primary/20 shadow-sm">
            <img
              src={post.author.image}
              alt={post.author.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top Row: Name + Follow Button */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm font-bold text-foreground truncate">
                {post.author.name}
              </span>
              {post.author.isVerifyed && (
                <BadgeCheck className="size-3.5 fill-primary text-primary-foreground shrink-0" />
              )}
            </div>

            {post.author.id !== user?.id && (
              <Button
                onClick={() => handleFollow(post.author.id)}
                variant={isFollowing ? "outline" : "default"}
                size="sm"
                className={`h-7 px-4 cursor-pointer font-bold rounded-full text-[10px] transition-all duration-300 shrink-0 ${
                  isFollowing
                    ? "border-primary/20 hover:bg-primary/5 text-primary"
                    : "bg-primary text-primary-foreground shadow-md shadow-primary/10 hover:shadow-primary/20"
                }`}
              >
                {isFollowing ? (
                  <UserCheck className="size-3 mr-1" />
                ) : (
                  <UserPlus className="size-3 mr-1" />
                )}
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          {/* Middle Row: Feeling Badge */}
          {post.feeling && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-muted-foreground/40 italic text-[10px] font-medium shrink-0">
                is feeling
              </span>
              <span className="font-bold text-primary/80 bg-primary/5 px-2 py-0.5 rounded-full flex items-center gap-1 border border-primary/10 shadow-sm shadow-primary/5">
                <span className="text-[11px] leading-none">
                  {post.feeling.emoji}
                </span>
                <span className="tracking-wider uppercase text-[8px]">
                  {post.feeling.label}
                </span>
              </span>
            </div>
          )}

          {/* Bottom Row: Metadata */}
          <div className="flex items-center gap-y-1 gap-x-2 text-[11px] font-medium text-muted-foreground/60 flex-wrap">
            <span className="text-primary/60 truncate max-w-30">
              {post.author.profession}
            </span>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="size-0.5 rounded-full bg-border" />
              <div className="flex items-center gap-1">
                <Clock className="size-2.5 opacity-70" />
                <span>{moment(post.createdAt).fromNow()}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="size-0.5 rounded-full bg-border" />
              <span className="bg-primary/10 text-primary/80 px-2 py-0.5 rounded-md text-[8px] uppercase tracking-widest font-extrabold whitespace-nowrap">
                {readTime} min read
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-0 min-w-0">
        <div
          className="text-[1rem] text-foreground/80 break-words overflow-hidden rich-text"
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
              handlePostLike({ likeType: "post", sourceId: Number(post.id) })
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
              {formatNumber(post.likesCount)}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenComments?.()}
            className="h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300"
          >
            <MessageCircle className="size-4" />
            <span className="text-[11px] font-bold">
              {formatNumber(post.commentsCount)}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-300"
          >
            <Share2 className="size-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleBookmark(+post.id)}
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

      {post.commentsCount > 0 && (
        <div className="border-t border-border/40 bg-muted/5 px-4 sm:px-6 py-3 sm:py-4 space-y-3 sm:y-4">
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              {post.comments.slice(0, 1).map((comment) => (
                <div key={comment.id} className="group/comment">
                  <div className="flex gap-2 sm:gap-3">
                    <div className="size-7 sm:size-8 shrink-0 overflow-hidden rounded-full border-2 border-primary/10 shadow-sm">
                      <img
                        src={comment.user.image}
                        alt={comment.user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1 sm:space-y-1.5">
                      <div className="inline-block rounded-2xl bg-muted/50 px-3 sm:px-4 py-2 sm:py-2.5 max-w-[95%] sm:max-w-[90%] border border-border/30 group-hover/comment:bg-muted/80 transition-colors">
                        <div className="flex items-center justify-between gap-4 sm:gap-6">
                          <span className="text-[11px] sm:text-[12px] font-bold text-foreground">
                            {comment.user.name}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground/60 font-medium">
                            {moment(comment.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="text-[12px] sm:text-[13px] text-foreground/80 mt-1 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-5 pl-2">
                        <button
                          onClick={() => onOpenComments?.(comment.id)}
                          className={`text-[10px] sm:text-[11px] font-bold transition-all hover:scale-105 active:scale-95 ${
                            likedComments.has(comment.id)
                              ? "text-primary"
                              : "text-muted-foreground/70 hover:text-primary"
                          }`}
                        >
                          Like
                        </button>
                        <button
                          onClick={() => setReplyingToCommentId(comment.id)}
                          className="text-[10px] sm:text-[11px] font-bold text-muted-foreground/70 hover:text-primary transition-all hover:scale-105 active:scale-95"
                        >
                          Reply
                        </button>
                      </div>
                      {replyingToCommentId === comment.id && (
                        <div className="flex items-center gap-2 mt-2 sm:mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex-1">
                            <Input
                              value={replyValue}
                              onChange={(e) => setReplyValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && replyValue.trim()) {
                                  handleReply({
                                    commentId: comment.id,
                                    content: replyValue,
                                  });
                                  setReplyValue("");
                                  setReplyingToCommentId(null);
                                }
                              }}
                              autoFocus
                              placeholder={`Reply...`}
                              className="h-8 sm:h-9 rounded-full bg-background border-border/60 px-3 sm:px-4 text-[11px] sm:text-[12px] focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setReplyingToCommentId(null);
                              setReplyValue("");
                            }}
                            className="text-[10px] sm:text-[11px] font-bold text-muted-foreground hover:text-foreground px-1 sm:px-2"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {post.commentsCount > 1 && (
                <button
                  onClick={() => onOpenComments?.()}
                  className="text-[11px] sm:text-[12px] font-bold text-primary/80 hover:text-primary transition-all pl-9 sm:pl-11 flex items-center gap-1.5 group/all"
                >
                  <span className="underline decoration-primary/20 underline-offset-4 group-hover/all:decoration-primary">
                    View all {post.commentsCount} comments
                  </span>
                  <ArrowRight className="size-3 sm:size-3.5 group-hover/all:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
