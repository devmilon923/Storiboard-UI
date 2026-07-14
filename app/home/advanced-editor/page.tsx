"use client";

import { useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "next/link";

import {
  Bold,
  Italic,
  Send,
  Smile,
  X,
  BaselineIcon,
  Heading1,
  Heading3,
  Heading2,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthContext";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "@/utils/api/endpoints";
import { useRouter } from "next/navigation";

const FEELINGS = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😇", label: "Blessed" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😢", label: "Sad" },
  { emoji: "🤔", label: "Thinking" },
  { emoji: "😎", label: "Cool" },
  { emoji: "😴", label: "Tired" },
];

export default function AdvancedEditorPage() {
  const { user } = useAuth();
  const createPost = useCreatePost();
  const router = useRouter();
  const [text, setText] = useState("");
  const [showFeelings, setShowFeelings] = useState(false);

  const [selectedFeeling, setSelectedFeeling] = useState<{
    emoji: string;
    label: string;
  } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          // keepOnSplit: false,
        },
      }),
    ],

    content: "",
    onUpdate: ({ editor }) => {
      setText(editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[100px] rich-text resize-none outline-none bg-transparent py-2 text-[1rem] focus-visible:ring-0",
      },
    },
  });

  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold"),
      italic: editor?.isActive("italic"),
      h1: editor?.isActive("heading", { level: 1 }),
      h2: editor?.isActive("heading", { level: 2 }),
      h3: editor?.isActive("heading", { level: 3 }),
    }),
  });

  if (!editor) return null;

  const content = editor.getText();

  const handleSubmit = async () => {
    if (!content.trim() || !selectedFeeling) return;
    const data = { content: editor.getHTML(), feeling: selectedFeeling };

    try {
      const result = await createPost.mutateAsync(data);
      if (result) {
        editor.commands.setContent("");
        setSelectedFeeling(null);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const toolbarButton = (active?: boolean) =>
    cn(
      "p-2 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer",
      active
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-muted",
    );

  return (
    <div className="container mx-auto min-h-screen py-10 px-4">
      <Card className="max-w-2xl w-full mx-auto border border-border/50 shadow-md bg-card overflow-visible animate-in fade-in slide-in-from-top-2 duration-200">
        <CardContent className="p-4 w-full">
          <div className="flex gap-3">
            {/* Avatar */}
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

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                    Advanced Editor
                  </span>
                  <Link href="/home">
                    <button className="p-1 hover:bg-muted cursor-pointer rounded-full text-muted-foreground hover:text-foreground transition-colors">
                      <X className="size-4" />
                    </button>
                  </Link>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 mt-2 mb-1">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={toolbarButton(editorState.bold)}
                  >
                    <Bold size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    className={toolbarButton(editorState.h1)}
                  >
                    <Heading1 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    className={toolbarButton(editorState.h2)}
                  >
                    <Heading2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    className={toolbarButton(editorState.h3)}
                  >
                    <Heading3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={toolbarButton(editorState.italic)}
                  >
                    <Italic size={16} />
                  </button>
                </div>

                {/* Editor */}
                <div className="relative ">
                  {!content.trim() && (
                    <div className="absolute top-2 left-0 text-[1rem] text-muted-foreground/60 pointer-events-none">
                      What's on your mind, {user?.name?.split(" ")[0] || "User"}
                      ?
                    </div>
                  )}
                  <EditorContent editor={editor} />
                </div>

                {selectedFeeling && (
                  <div className="flex items-center gap-1.5 mt-2 bg-muted/50 w-fit px-2 py-1 rounded-full border border-border/50 transition-all animate-in fade-in zoom-in-95">
                    <span className="text-sm">{selectedFeeling.emoji}</span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Feeling {selectedFeeling.label}
                    </span>
                    <button
                      onClick={() => setSelectedFeeling(null)}
                      className="ml-1 p-0.5 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-border/50 pt-3">
                <div className="flex items-center gap-1">
                  {/* Feelings */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className={cn(
                        "text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer",
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
                              className="flex flex-col items-center gap-1 rounded-lg p-2 hover:bg-muted transition-colors cursor-pointer"
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

                  <div className="h-4 w-px bg-border/60 mx-1" />

                  <Link
                    href={"/home"}
                    className="gap-1.5 flex items-center justify-center py-1.5 text-muted-foreground hover:text-primary  cursor-pointer px-2"
                  >
                    <BaselineIcon className="size-4" />
                    <span className="text-xs font-medium">Normal Editor</span>
                  </Link>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !content.trim() || !selectedFeeling || createPost.isPending
                  }
                  variant="premium"
                  className="gap-2 px-6 rounded-full cursor-pointer"
                >
                  <span className="font-semibold">
                    {createPost.isPending ? "Posting..." : "Post"}
                  </span>
                  {createPost.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
