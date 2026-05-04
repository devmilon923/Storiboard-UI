import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  BadgeCheck,
  UserPlus,
  UserCheck,
} from "lucide-react";
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
import { useAddLike } from "@/utils/api/endpoints";

interface Author {
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
  onOpenComments?: () => void;
}

export const SocialPostCard: React.FC<SocialPostCardProps> = ({
  post,
  onOpenComments,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [replyingToCommentId, setReplyingToCommentId] = useState<
    string | number | null
  >(null);
  const [likedComments, setLikedComments] = useState<Set<string | number>>(
    new Set(),
  );

  const [replyValue, setReplyValue] = useState("");
  const addPostLike = useAddLike();
  const toggleCommentLike = (id: string | number) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleFollow = () => setIsFollowing(!isFollowing);

  const handleReply = (data: {
    commentId: string | number;
    content: string;
  }) => {
    console.log("handleReply", data);
  };
  const handlePostLike = async (data: z.infer<typeof likeValidation>) => {
    console.log("handlePostLike", data);
    try {
      if (data) {
        await addPostLike.mutateAsync(data);
        setIsLiked(!isLiked);
      }
    } catch (error) {}
  };
  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  const isLongText = post.content.length > 200;
  const displayContent = isExpanded
    ? post.content
    : post.content.slice(0, 200) + (isLongText ? "..." : "");

  return (
    <Card className="w-full bg-background border-border/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-5">
        <div className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-primary/10 shadow-sm transition-transform hover:scale-105">
          <img
            src={post.author.image}
            alt={post.author.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-1 flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[0.9375rem] font-bold tracking-tight text-foreground truncate max-w-[150px]">
              {post.author.name}
            </span>
            {post.author.isVerifyed && (
              <BadgeCheck className="size-4 fill-blue-500 text-white" />
            )}
            {post.feeling && (
              <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                <span className="text-gray-400 font-normal">feeling</span>
                <span className="font-semibold text-foreground/80 bg-muted/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {post.feeling.emoji} {post.feeling.label}
                </span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground/70">
            <span>{post.author.profession}</span>
            <span className="size-1 rounded-full bg-muted-foreground/30" />
            <span>{moment(post.createdAt).fromNow()}</span>
          </div>
        </div>
        <Button
          onClick={handleFollow}
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          className={`h-9 px-4 cursor-pointer font-bold rounded-full transition-all duration-300 shadow-sm ${
            isFollowing
              ? "border-primary/20 hover:bg-primary/5 text-primary"
              : "shadow-primary/20 hover:-translate-y-px active:translate-y-0"
          }`}
        >
          {isFollowing ? (
            <UserCheck className="size-4 mr-1.5" />
          ) : (
            <UserPlus className="size-4 mr-1.5" />
          )}
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0 min-w-0">
        <p className="text-[0.9375rem] leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word overflow-hidden">
          {displayContent}
        </p>
        {isLongText && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 text-[0.9375rem] font-bold text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </CardContent>

      <CardFooter className="flex items-center gap-1 border-t bg-transparent p-1.5 px-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            handlePostLike({ likeType: "post", sourceId: Number(post.id) })
          }
          className={`flex-1 cursor-pointer gap-2 transition-colors group ${
            isLiked
              ? "text-rose-500 bg-rose-500/5"
              : "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5"
          }`}
        >
          <Heart
            className={`size-4.5 ${
              isLiked ? "fill-rose-500" : "group-hover:fill-rose-500/10"
            }`}
          />
          <span className="text-xs font-medium">
            {formatNumber(post.likesCount + (isLiked ? 1 : 0))}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenComments}
          className="flex-1 cursor-pointer gap-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/5 transition-colors group"
        >
          <MessageCircle className="size-4.5" />
          <span className="text-xs font-medium">
            {formatNumber(post.commentsCount)}
          </span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 cursor-pointer gap-2 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/5 transition-colors group"
        >
          <Share2 className="size-4.5" />
          <span className="text-xs font-medium">Share</span>
        </Button>
      </CardFooter>

      {post.commentsCount >= 5 && (
        <div className="border-t border-border/40 bg-muted/5 px-4 py-3 space-y-4">
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-4">
              {post.comments.slice(0, 1).map((comment) => (
                <div key={comment.id} className="group">
                  <div className="flex gap-2.5">
                    <div className="size-7 shrink-0 overflow-hidden rounded-full border border-border">
                      <img
                        src={comment.user.image}
                        alt={comment.user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="inline-block rounded-2xl bg-muted/50 px-3 py-2 max-w-[90%]">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-[11px] font-bold text-foreground">
                            {comment.user.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {moment(comment.createdAt).fromNow()}
                          </span>
                        </div>
                        <p className="text-[12px] text-foreground/80 mt-0.5">
                          {comment.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 pl-1">
                        <button
                          onClick={() => toggleCommentLike(comment.id)}
                          className={`text-[10px] font-bold transition-colors ${
                            likedComments.has(comment.id)
                              ? "text-rose-500"
                              : "text-muted-foreground hover:text-rose-500"
                          }`}
                        >
                          Like
                        </button>
                        <button
                          onClick={() => setReplyingToCommentId(comment.id)}
                          className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                      {replyingToCommentId === comment.id && (
                        <div className="flex items-center gap-2 mt-2">
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
                              placeholder={`Reply to ${comment.user.name}...`}
                              className="h-8 rounded-full bg-muted/60 border-none px-3 text-[10px] focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                          </div>
                          <button
                            onClick={() => {
                              setReplyingToCommentId(null);
                              setReplyValue("");
                            }}
                            className="text-[10px] font-bold text-muted-foreground hover:text-foreground"
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
                  onClick={onOpenComments}
                  className="text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors pl-10 cursor-pointer"
                >
                  View all {post.commentsCount} comments
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
