"use client";

import { MessageCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="flex pt-12  w-full items-center justify-center px-6 bg-background ">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="relative w-full bg-card/30 border border-border/40 backdrop-blur-md rounded-3xl p-8 sm:p-10 shadow text-center flex flex-col items-center gap-6">
          <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center relative shadow-inner">
            <MessageCircle className="size-8 text-primary animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Messages
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed max-w-xs mx-auto">
              This feature is currently under development. We are crafting a
              clean, real-time messaging experience for you.
            </p>
          </div>

          <div className="w-full space-y-2 pt-2">
            <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden border border-border/20">
              <div
                className="h-full bg-linear-to-r from-primary to-emerald-400 rounded-full animate-pulse"
                style={{ width: "70%" }}
              />
            </div>
            <div className="flex justify-between w-full text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider px-0.5">
              <span>Development Progress</span>
              <span>70%</span>
            </div>
          </div>

          <Button
            onClick={() => router.push("/home")}
            className="h-9 font-bold rounded-full text-xs px-6 bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md shadow-primary/10 active:scale-[0.98] cursor-pointer flex items-center gap-1.5 border border-primary/20"
          >
            <ArrowLeft className="size-3.5" />
            Go Back Home
          </Button>
        </Card>
      </div>
    </div>
  );
}
