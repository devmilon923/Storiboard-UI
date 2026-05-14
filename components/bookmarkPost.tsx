import {
  BookOpen,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
} from "lucide-react";
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
      isVerified: boolean;
    };
    createdAt: string;
    likesCount: number;
    commentsCount: number;
  };
}

const dummyBookmarks: BookmarkItem[] = [
  {
    id: 1,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    post: {
      id: 101,
      content:
        "Just finished exploring the latest features in Next.js 14. The Server Actions and Partial Prerendering are absolute game changers for performance! 🚀 #webdev #nextjs",
      author: {
        name: "Alex River",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        profession: "Full Stack Developer",
        isVerified: true,
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likesCount: 124,
      commentsCount: 18,
    },
  },
  {
    id: 2,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    post: {
      id: 102,
      content:
        "Digital minimalism isn't about using less technology, it's about using technology more intentionally. I've cut my screen time by 40% and my focus has never been better. 🧠✨",
      author: {
        name: "Sarah Chen",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        profession: "Product Designer",
        isVerified: true,
      },
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likesCount: 89,
      commentsCount: 12,
    },
  },
  {
    id: 3,
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    post: {
      id: 103,
      content:
        "When designing for global markets, remember that accessibility isn't a feature—it's a fundamental requirement. Design for everyone, or you're excluding a billion users. 🌍🤝",
      author: {
        name: "Marcus Thorne",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
        profession: "UX Lead",
        isVerified: false,
      },
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      likesCount: 256,
      commentsCount: 45,
    },
  },
];

function BookmarkCard({ item }: { item: BookmarkItem }) {
  const readTime = calculateReadTime(item.post.content);

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
              {item.post.author.isVerified && (
                <BadgeCheck className="size-3.5 fill-primary text-primary-foreground" />
              )}
            </div>
            <Button variant="ghost" size="icon" className="size-8 rounded-full">
              <MoreHorizontal className="size-4 text-muted-foreground" />
            </Button>
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

      <CardContent className="px-5 pb-4 pt-0">
        <p className="text-[14px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
          {item.post.content}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2 border-t border-border/10 bg-muted/5 p-2 px-4">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-primary hover:bg-primary/5"
          >
            <Heart className="size-4" />
            <span className="text-[11px] font-bold">
              {item.post.likesCount}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-full px-3 text-muted-foreground hover:text-primary hover:bg-primary/5"
          >
            <MessageCircle className="size-4" />
            <span className="text-[11px] font-bold">
              {item.post.commentsCount}
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
          className="size-8 rounded-full text-primary bg-primary/10"
        >
          <Bookmark className="size-4 fill-primary" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function BookmarkPost() {
  const hasBookmarks = dummyBookmarks.length > 0;

  if (!hasBookmarks) {
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
          <p className="text-sm text-muted-foreground">
            {dummyBookmarks.length} posts in your library
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full font-bold">
          View All
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {dummyBookmarks.map((bookmark) => (
          <BookmarkCard key={bookmark.id} item={bookmark} />
        ))}
      </div>
    </div>
  );
}

export default BookmarkPost;
