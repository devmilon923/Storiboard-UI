import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Reply, X, Send, Loader2 } from "lucide-react";
import moment from "moment";
import { Post, Comment } from "./social-post-card";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  useAddComment,
  useAddLike,
  useAddReplie,
  useGetAllComments,
  useGetAllReplie,
} from "@/utils/api/endpoints";
import { useAuth } from "@/providers/AuthContext";
import { useInView } from "react-intersection-observer";

interface CommentSidebarProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  // initialCommentId?: string | number | null;
}

export const CommentSidebar: React.FC<CommentSidebarProps> = ({
  post,
  isOpen,
  onClose,
  // initialCommentId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Comment[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<
    string | number | null
  >(null);
  const addComment = useAddComment();
  const addReplie = useAddReplie();
  const [commentInput, setCommentInput] = useState("");
  const [replyInput, setReplyInput] = useState("");

  const selectedComment = comments.find((c) => c.id === selectedCommentId);
  const {
    data: mainComments,
    isLoading: mainLoading,
    fetchNextPage: mainFetchNextPage,
    hasNextPage: mainHasNextPage,
    isFetchingNextPage: mainIsFetchingNextPage,
  } = useGetAllComments(post?.id as number, "post", 5);
  const {
    data: replieComments,
    isLoading: replieLoading,
    fetchNextPage: replieFetchNextPage,
    hasNextPage: replieHasNextPage,
    isFetchingNextPage: replieIsFetchingNextPage,
  } = useGetAllReplie(selectedCommentId, 5);
  const { user } = useAuth();
  const { ref: cRef, inView: cInView } = useInView({
    threshold: 1,
    delay: 100,
  });
  const { ref: rRef, inView: rInView } = useInView({
    threshold: 1,
    delay: 100,
  });
  const mainCommentsData =
    mainComments?.pages?.flatMap((page: any) => page.data) || [];
  const repliesData =
    replieComments?.pages?.flatMap((page: any) => page.data) || [];
  useEffect(() => {
    if (cInView && mainHasNextPage && !mainIsFetchingNextPage) {
      mainFetchNextPage();
    }
  }, [cInView, mainHasNextPage, mainIsFetchingNextPage, mainFetchNextPage]);

  useEffect(() => {
    if (rInView && replieHasNextPage && !replieIsFetchingNextPage) {
      replieFetchNextPage();
    }
  }, [
    rInView,
    replieFetchNextPage,
    replieHasNextPage,
    replieIsFetchingNextPage,
  ]);
  // Reset navigation state whenever the post changes or sidebar closes
  useEffect(() => {
    setSelectedCommentId(null);
    setReplies([]);
  }, [post?.id, isOpen]);

  // Sync main comments data
  useEffect(() => {
    if (isOpen && mainCommentsData && !mainLoading) {
      setComments(mainCommentsData);
    } else if (!isOpen) {
      setComments([]);
    }
  }, [isOpen, mainIsFetchingNextPage, mainLoading]);

  useEffect(() => {
    if (selectedCommentId && !replieLoading && repliesData) {
      setReplies(repliesData);
    } else {
      setReplies([]);
    }
  }, [selectedCommentId, replieLoading, replieIsFetchingNextPage]);

  const handleSendComment = async () => {
    if (!commentInput.trim()) return;
    try {
      const data = await addComment.mutateAsync({
        sourceId: post?.id as number,
        content: commentInput,
        commentType: "post",
      });
      setComments([
        ...mainCommentsData,
        {
          user: {
            name: user?.name,
            image: user?.image,
          },
          createdAt: new Date().toISOString(),
          content: commentInput,
          id: data?.data?.id,
          likesCount: 0,
          commentCount: 0,
        },
      ]);
      setCommentInput("");
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSendReply = async () => {
    if (!replyInput.trim()) return;
    try {
      const data = await addReplie.mutateAsync({
        sourceId: selectedCommentId as number,
        content: replyInput,
        commentType: "replie",
      });
      setReplies([
        ...repliesData,
        {
          user: {
            name: user?.name,
            image: user?.image,
          },
          createdAt: new Date().toISOString(),
          content: replyInput,
          id: data?.data?.id,
          likesCount: 0,
          commentCount: 0,
        },
      ]);

      setCommentInput("");
    } catch (error) {
      console.log("error", error);
    }
    setReplyInput("");
  };

  if (!isOpen || !post) return null;

  return (
    <aside className="w-full lg:w-[450px] h-full flex flex-col bg-background border-l shadow-xl animate-in slide-in-from-right duration-300">
      {/* Header Section */}
      <header className="flex items-center justify-between p-5 border-b bg-card/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MessageCircle className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Discussions</h2>
            <p className="text-xs text-muted-foreground font-medium">
              On <span className="text-foreground">{post.author.name}'s</span>{" "}
              post
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted/50 cursor-pointer"
        >
          <X className="size-5" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* VIEW 1: Main Comments List */}
        {!selectedCommentId && (
          <div className="flex-1 flex flex-col min-h-0 bg-muted/5 animate-in fade-in duration-500 overflow-hidden">
            <div className="px-5 py-3 border-b flex items-center justify-between bg-background/50 shrink-0">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                All Comments
                {!mainLoading && (
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[9px]">
                    {comments.length}
                  </span>
                )}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
              {mainLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground animate-pulse">
                  <Loader2 className="size-8 animate-spin mb-4 text-primary/40" />
                  <p className="text-sm font-medium">Loading...</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onSelect={() => setSelectedCommentId(comment.id)}
                  />
                ))
              )}
              <div ref={cRef} className="py-8 flex justify-center">
                {mainIsFetchingNextPage ? (
                  <Loader2 className="size-6 animate-spin text-primary" />
                ) : mainHasNextPage ? (
                  <span className="text-sm text-muted-foreground animate-pulse">
                    Loading more comments...
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    You've reached the end of the comments
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 border-t bg-card/30 backdrop-blur-md shrink-0">
              <CommentInput
                value={commentInput}
                onChange={setCommentInput}
                onSend={() => handleSendComment()}
                placeholder="Add a comment..."
                userImage={user?.image}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: Nested Replies View */}
        {selectedCommentId && (
          <div className="flex-1 flex flex-col min-h-0 bg-background relative animate-in slide-in-from-right-5 duration-500 ease-out overflow-hidden">
            <div className="px-5 py-3 border-b bg-card/30 backdrop-blur-sm flex items-center justify-between shrink-0">
              <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Reply className="size-3" />
                Conversation
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 cursor-pointer gap-2 rounded-full px-3 text-[11px] font-bold hover:bg-muted"
                onClick={() => setSelectedCommentId(null)}
              >
                <Reply className="size-3 rotate-180" />
                Back
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              {selectedComment && (
                <div className="p-6 space-y-8">
                  <ParentCommentHeader comment={selectedComment} />
                  <Separator className="bg-border/40" />
                  <div className="space-y-6 relative pl-2">
                    {replieLoading ? (
                      <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                        <Loader2 className="size-6 animate-spin mb-2 text-primary/40" />
                        <p className="text-[11px] font-bold uppercase tracking-tighter">
                          Loading replies...
                        </p>
                      </div>
                    ) : replies.length > 0 ? (
                      <>
                        <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-linear-to-b from-primary/20 via-border/50 to-transparent" />
                        {replies.map((reply) => (
                          <ReplyItem key={reply.id} reply={reply} />
                        ))}
                        <div ref={rRef} className="py-8 flex justify-center">
                          {replieIsFetchingNextPage ? (
                            <Loader2 className="size-6 animate-spin text-primary" />
                          ) : replieHasNextPage ? (
                            <span className="text-sm text-muted-foreground animate-pulse">
                              Loading more replies...
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              You've reached the end of the replies
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <EmptyRepliesState />
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-card/50 backdrop-blur-md shrink-0">
              <CommentInput
                value={replyInput}
                onChange={setReplyInput}
                onSend={handleSendReply}
                placeholder={`Reply to ${selectedComment?.user.name.split(" ")[0]}...`}
                userImage={user?.image}
              />
            </div>
          </div>
        )}
      </main>
    </aside>
  );
};

// --- SUB-COMPONENTS ---

const CommentCard = ({
  comment,
  onSelect,
}: {
  comment: Comment;
  onSelect: () => void;
}) => {
  const [cLikeCount, setCLikeCount] = useState(comment.likesCount);
  const [isCLiked, setIsCLiked] = useState(comment.isLiked);
  const addLike = useAddLike();

  const handleLike = async () => {
    setIsCLiked((prev) => !prev);
    try {
      await addLike.mutateAsync({
        likeType: "comment",
        sourceId: Number(comment.id),
      });
      setCLikeCount((prev: any) => (isCLiked ? prev - 1 : prev + 1));
    } catch (error) {
      setIsCLiked((prev) => !prev);
      setCLikeCount((prev: any) => (isCLiked ? prev + 1 : prev - 1));
      console.log(error);
    }
  };
  return (
    <div className="group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border bg-background border-border/40 hover:border-primary/10 hover:bg-muted/30">
      <div className="flex gap-4">
        <div className="size-10 shrink-0 overflow-hidden rounded-full border border-border shadow-sm">
          <img
            src={comment.user.image}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">
              {comment.user.name}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground/60">
              {moment(comment.createdAt).fromNow(true)}
            </span>
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/80 line-clamp-2">
            {comment.content}
          </p>
          <div className="flex items-center gap-5 mt-3">
            <div
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors ${isCLiked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"}`}
            >
              <Heart
                className={`size-3.5 ${isCLiked ? "fill-rose-500" : ""}`}
              />
              <span>{cLikeCount || 0}</span>
            </div>
            <div
              onClick={onSelect}
              className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="size-3.5" />
              <span>{comment.commentCount || 0}</span>
            </div>
          </div>

          {comment.commentCount === 1 && comment.previewReply && (
            <div className="mt-3 pt-3 border-t border-border/30">
              <div className="flex gap-3 bg-muted/20 p-2.5 rounded-xl border border-border/20">
                <div className="size-6 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={comment.previewReply.user.image}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[11px] font-extrabold">
                      {comment.previewReply.user.name}
                    </span>
                    <span className="text-[9px] text-muted-foreground/50">
                      {moment(comment.previewReply.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground/70 line-clamp-1 italic mb-1">
                    "{comment.previewReply.content}"
                  </p>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/70">
                    <Heart className="size-2.5" />
                    <span>{comment.previewReply.likesCount || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ParentCommentHeader = ({ comment }: { comment: Comment }) => (
  <div className="relative">
    <div className="absolute -left-3 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
    <div className="flex gap-4">
      <div className="size-11 shrink-0 overflow-hidden rounded-full border-2 border-primary/10">
        <img src={comment.user.image} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold">{comment.user.name}</span>
          <span className="text-[10px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full uppercase tracking-tighter">
            Author
          </span>
        </div>
        <p className="text-[14px] leading-relaxed font-medium">
          {comment.content}
        </p>
        <div className="text-[10px] text-muted-foreground pt-1">
          Posted {moment(comment.createdAt).calendar()}
        </div>
      </div>
    </div>
  </div>
);

const ReplyItem = ({ reply }: { reply: Comment }) => {
  const [rLikeCount, setRLikeCount] = useState(reply.likesCount);
  const [isRLiked, setIsRLiked] = useState(reply.isLiked);
  const addLike = useAddLike();
  const handleLike = async () => {
    setIsRLiked((prev) => !prev);
    try {
      await addLike.mutateAsync({
        likeType: "comment",
        sourceId: Number(reply.id),
      });
      setRLikeCount((prev: any) => (isRLiked ? prev - 1 : prev + 1));
    } catch (error) {
      setIsRLiked((prev) => !prev);
      setRLikeCount((prev: any) => (isRLiked ? prev + 1 : prev - 1));
      console.log(error);
    }
  };
  return (
    <div className="flex gap-4 relative group">
      <div className="size-8 shrink-0 overflow-hidden rounded-full border border-border bg-background z-10 transition-transform group-hover:scale-105">
        <img src={reply.user.image} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold group-hover:text-primary transition-colors">
            {reply.user.name}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground/60">
            {moment(reply.createdAt).fromNow()}
          </span>
        </div>
        <div className="bg-muted/30 p-3.5 rounded-2xl rounded-tl-none border border-border/30 group-hover:bg-muted/50 transition-colors">
          <p className="text-[13px] text-foreground/80 leading-relaxed">
            {reply.content}
          </p>
        </div>
        <div className="flex items-center gap-4 pl-1">
          <button
            onClick={handleLike}
            className={`text-[10px] cursor-pointer font-bold transition-colors flex items-center gap-1 ${isRLiked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"}`}
          >
            <Heart className={`size-3 ${isRLiked ? "fill-rose-500" : ""}`} />{" "}
            {rLikeCount || 0} Like
          </button>
        </div>
      </div>
    </div>
  );
};

const CommentInput = ({
  value,
  onChange,
  onSend,
  placeholder,
  userImage,
}: any) => (
  <div className="flex items-center gap-3 bg-background border border-border/60 rounded-2xl p-1.5 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all shadow-sm">
    {userImage && (
      <div className="size-8 shrink-0 overflow-hidden rounded-full border border-border ml-1">
        <img
          src={userImage}
          className="h-full w-full object-cover opacity-80"
        />
      </div>
    )}
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSend()}
      className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm h-9 px-3"
    />
    <Button
      size="sm"
      disabled={!value.trim()}
      onClick={onSend}
      className={cn(
        "rounded-xl h-9 transition-all",
        userImage
          ? "px-4 font-bold shadow-md shadow-primary/20 hover:-translate-y-px active:translate-y-0"
          : "w-9 p-0 hover:bg-primary/10 hover:text-primary variant-ghost",
      )}
      variant={userImage ? "default" : "ghost"}
    >
      <Send className="size-4" />
      {userImage && <span className="ml-2">Send</span>}
    </Button>
  </div>
);

const EmptyRepliesState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="size-16 rounded-full bg-muted/30 flex items-center justify-center mb-4">
      <Reply className="size-8 text-muted-foreground/40" />
    </div>
    <p className="text-sm font-bold text-foreground/60">No replies yet</p>
    <p className="text-xs text-muted-foreground max-w-[200px] mt-1">
      Be the first to start the conversation!
    </p>
  </div>
);
