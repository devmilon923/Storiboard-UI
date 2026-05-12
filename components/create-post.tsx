"use client";

import React, { useState } from "react";
import { Smile, Send, X, Sparkles, SquarePen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/providers/AuthContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCreatePost } from "@/utils/api/endpoints";
import Image from "next/image";

const FEELINGS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😇", label: "Blessed" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🤔", label: "Thinking" },
  { emoji: "😎", label: "Cool" },
  { emoji: "😴", label: "Tired" },
];

export const CreatePost = () => {
  const createPost = useCreatePost();
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [showFeelings, setShowFeelings] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<{
    emoji: string;
    label: string;
  } | null>(null);

  const handlePost = async () => {
    if (!content.trim()) return;
    if (!selectedFeeling) return;
    const data = { content, feeling: selectedFeeling };
    // Reset

    try {
      const result = await createPost.mutateAsync(data);
      if (result) {
        console.log(result);
        setContent("");
        setSelectedFeeling(null);
        setIsExpanded(false);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  if (!isExpanded) {
    return (
      <Card
        className="max-w-2xl w-full mx-auto border border-border/50 shadow-sm bg-card cursor-pointer hover:bg-accent/5 transition-all duration-200 group"
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="p-3 flex items-center gap-4">
          <div className="size-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm bg-primary/10">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={100}
                height={100}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-primary uppercase">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="flex-1 text-muted-foreground/60 text-sm font-medium">
            What's on your mind, {user?.name?.split(" ")[0] || "User"}?
          </div>
          <div className="flex items-center gap-3 pr-2 ml-auto">
            <div className="hidden sm:flex items-center gap-3">
              <Smile className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <Sparkles className="size-5 text-muted-foreground group-hover:text-primary/80 transition-colors" />
            </div>
            <div className="flex sm:hidden">
              <SquarePen className="size-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl w-full mx-auto border border-border/50 shadow-md bg-card overflow-visible animate-in fade-in slide-in-from-top-2 duration-200">
      <CardContent className="p-4 w-full">
        <div className="flex gap-3">
          <div className="size-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/20 shadow-sm bg-primary/10">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold text-primary uppercase">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Create Post
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-muted cursor-pointer rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
              <Textarea
                autoFocus
                placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || "User"}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[100px] resize-none rounded-none border-none bg-transparent p-0 py-2 text-[1rem] focus-visible:ring-0 placeholder:text-muted-foreground/60"
              />

              {selectedFeeling && (
                <div className="flex items-center gap-1.5 mt-2 bg-muted/50 w-fit px-2 py-1 rounded-full border border-border/50 transition-all animate-in fade-in zoom-in-95">
                  <span className="text-sm">{selectedFeeling.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Feeling {selectedFeeling.label}
                  </span>
                  <button
                    onClick={() => setSelectedFeeling(null)}
                    className="ml-1 p-0.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3 cursor-pointer" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-3">
              <div className="flex items-center gap-1">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={cn(
                      "text-muted-foreground  hover:text-primary hover:bg-primary/5 cursor-pointer",
                      showFeelings && "text-primary bg-primary/5",
                    )}
                    onClick={() => setShowFeelings(!showFeelings)}
                  >
                    <Smile className="size-5" />
                  </Button>

                  {showFeelings && (
                    <div className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-xl border border-border bg-popover p-2 shadow-xl animate-in fade-in slide-in-from-bottom-2">
                      <div className="grid grid-cols-4 gap-1">
                        {FEELINGS.map((f) => (
                          <button
                            key={f.label}
                            onClick={() => {
                              setSelectedFeeling(f);
                              setShowFeelings(false);
                            }}
                            className="flex  flex-col items-center gap-1 rounded-lg p-2 transition-colors hover:bg-muted"
                          >
                            <span className="text-xl">{f.emoji}</span>
                            <span className="text-[10px] font-medium text-muted-foreground">
                              {f.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-4 w-px bg-border/60 mx-1 " />

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer gap-1.5 px-2"
                >
                  <Sparkles className="size-4" />
                  <Link href="/home/advanced-editor">
                    <span className="text-xs font-medium">Advanced Editor</span>
                  </Link>
                </Button>
              </div>

              <Button
                onClick={handlePost}
                disabled={!content.trim() || !selectedFeeling}
                variant="premium"
                className="gap-2 px-6 rounded-full"
              >
                <span className="font-semibold">Post</span>
                <Send className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
