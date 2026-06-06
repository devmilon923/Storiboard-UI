"use client";

import { useState, useMemo, useEffect } from "react";
import {
  BadgeCheck,
  Search,
  Users,
  UserPlus,
  MessageSquare,
  Sparkles,
  UserX,
  TrendingUp,
  X,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFollowerAction, useGetAllFollowers } from "@/utils/api/endpoints";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/app/hooks/debounce";

const FILTER_PROFESSIONS = [
  "All",
  "Verified",
  "Doctor",
  "Engineering",
  "Product",
  "Creator",
  "Research",
];

function FollowersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("All");
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [selectedUserForMessage, setSelectedUserForMessage] = useState("");
  const [followState, setFollowState] = useState<Record<string, boolean>>({});
  const { ref, inView } = useInView();
  const followAction = useFollowerAction();
  const debounceSearch = useDebounce(searchQuery, 700);
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetAllFollowers(
      10,
      selectedProfession === "All" ? "" : selectedProfession,
      debounceSearch,
    );

  const finalData = useMemo(() => {
    return data?.pages.flatMap((page) => page.data || []) || [];
  }, [data]);
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    debounceSearch,
    selectedProfession,
  ]);
  useEffect(() => {
    if (!finalData.length) return;
    const initialState: Record<string, boolean> = {};
    finalData.forEach((f: any) => {
      initialState[f.followerId] = true;
    });
    setFollowState(initialState);
  }, [finalData]);

  const formatCount = (num: number) => {
    if (!num) return "0";
    if (num >= 1000) return (num / 1000).toFixed(1) + "k";
    return num;
  };

  const handleFollowToggle = async (id: number) => {
    try {
      await followAction.mutateAsync(id);
      setFollowState((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const stats = useMemo(() => {
    return {
      total: finalData.length || 0,
      verified: finalData.filter((f: any) => f.isVerifyed).length || 0,
    };
  }, [finalData]);

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header with Stats */}
        <div className="relative flex flex-col gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-border/40">
          <div className="space-y-0.5 sm:space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mt-0 sm:mt-1 text-foreground">
              Followers
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Manage your connections, see who is following you, and filter your
              professional network.
            </p>
          </div>

          <div className="flex w-full gap-2 sm:gap-3 bg-card/25 border border-border/40 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-sm">
            <div className="text-center flex-1 min-w-0">
              <div className="text-sm sm:text-base md:text-lg font-extrabold text-foreground">
                {stats.total}
              </div>
              <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Total
              </div>
            </div>
            <div className="w-px bg-border/40 self-stretch" />
            <div className="text-center flex-1 min-w-0">
              <div className="text-sm sm:text-base md:text-lg font-extrabold text-primary flex items-center justify-center gap-0.5">
                {stats.verified}
                <BadgeCheck className="size-3 sm:size-3.5 md:size-4 fill-primary text-primary-foreground" />
              </div>
              <div className="text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 size-3.5 sm:size-4 text-muted-foreground/60" />
            <Input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-9 sm:h-10 w-full rounded-2xl bg-card/30 border-border/50 text-foreground text-xs sm:text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-3.5 sm:size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
            {FILTER_PROFESSIONS.map((prof) => (
              <button
                key={prof}
                onClick={() => setSelectedProfession(prof)}
                className={`relative px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer border whitespace-nowrap ${
                  selectedProfession === prof
                    ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                    : "bg-card/30 text-muted-foreground border-border/40 hover:text-foreground hover:border-primary/20"
                }`}
              >
                {prof === "Verified" ? (
                  <span className="flex items-center gap-0.5 sm:gap-1">
                    <ShieldCheck className="size-2.5 sm:size-3" />
                    <span className="hidden xs:inline">Verified Only</span>
                    <span className="inline xs:hidden">Verified</span>
                  </span>
                ) : (
                  prof
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Info */}
        {searchQuery && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/20 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl">
            <span>
              Showing{" "}
              <strong className="text-foreground">{finalData.length}</strong>{" "}
              results for "{searchQuery}"
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-primary hover:underline font-bold transition-all cursor-pointer text-left sm:text-right ml-auto sm:ml-0"
            >
              Clear
            </button>
          </div>
        )}

        {/* Follower Cards */}
        {finalData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
            {finalData.map((follower: any) => (
              <Card
                key={follower.followerId}
                className="group relative w-full overflow-hidden bg-card/40 border-border/40 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-2.5 sm:p-3 md:p-4 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between"
              >
                <div>
                  {/* Header: avatar + message button */}
                  <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2 md:mb-3">
                    <div className="relative shrink-0">
                      <div className="size-9 sm:size-10 md:size-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm group-hover:border-primary/40 transition-all duration-300">
                        <img
                          src={follower.image}
                          alt={follower.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setSelectedUserForMessage(follower.name);
                        setIsDevModalOpen(true);
                      }}
                      className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 shrink-0 border border-transparent hover:border-primary/10 cursor-pointer h-8 w-8 sm:h-9 sm:w-9"
                      title="Send Message"
                    >
                      <MessageSquare className="size-3 sm:size-3.5" />
                    </Button>
                  </div>

                  {/* Name + profession */}
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="flex items-center gap-1 min-w-0">
                      <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                        {follower.name}
                      </h3>
                      {follower.isVerifyed && (
                        <BadgeCheck className="size-3.5 sm:size-4 md:size-4.5 fill-primary text-primary-foreground shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-xs font-bold text-primary/70 bg-primary/5 px-1.5 sm:px-2 py-0.5 rounded-md w-fit">
                      <Briefcase className="size-2.5 sm:size-3 text-primary/80" />
                      <span>{follower.profession}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: stats + follow button */}
                <div className="border-t border-border/30 pt-1.5 sm:pt-2 md:pt-3 mt-1.5 sm:mt-2 md:mt-3 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
                  <div className="space-y-0.5">
                    <div className="text-[10px] sm:text-xs text-muted-foreground/60 font-semibold tracking-wide uppercase">
                      Followers
                    </div>
                    <div className="text-xs sm:text-sm font-black text-foreground flex items-center gap-0.5 sm:gap-1">
                      <TrendingUp className="size-2.5 sm:size-3 text-emerald-400" />
                      {formatCount(follower.followersCount)}
                    </div>
                  </div>

                  <Button
                    onClick={() => handleFollowToggle(follower.followerId)}
                    variant={
                      followState[follower.followerId] ? "outline" : "default"
                    }
                    size="sm"
                    className={`h-6 sm:h-7 px-2.5 sm:px-4 cursor-pointer font-bold rounded-full text-xs sm:text-xs transition-all duration-300 shrink-0 ${
                      followState[follower.followerId]
                        ? "border-primary/20 hover:bg-primary/5 text-primary"
                        : "bg-primary text-primary-foreground shadow-md shadow-primary/10 hover:shadow-primary/20"
                    }`}
                  >
                    {followState[follower.followerId] ? (
                      <UserCheck className="size-2.5 sm:size-3 mr-0.5 sm:mr-1" />
                    ) : (
                      <UserPlus className="size-2.5 sm:size-3 mr-0.5 sm:mr-1" />
                    )}
                    <span className="hidden xs:inline">
                      {followState[follower.followerId]
                        ? "Following"
                        : "Follow"}
                    </span>
                    <span className="inline xs:hidden">
                      {followState[follower.followerId] ? "✓" : "+"}
                    </span>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center text-center p-6 sm:p-8 md:p-12 bg-card/20 border-border/30 rounded-2xl sm:rounded-3xl min-h-56 sm:min-h-62.5 md:min-h-75 border border-dashed">
            <div className="size-10 sm:size-12 rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-center shadow-inner mb-3 sm:mb-4">
              <Users className="size-5 sm:size-6 text-muted-foreground/60" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              No followers found
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-xs mt-1">
              We couldn't find any follower matching "{searchQuery}" under the
              profession category "{selectedProfession}". Try refining your
              filters!
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setSelectedProfession("All");
              }}
              className="mt-4 sm:mt-5 md:mt-6 font-bold rounded-xl text-xs sm:text-sm"
            >
              Reset Filters
            </Button>
          </Card>
        )}
        <div ref={ref} className="py-3 sm:py-4 flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : hasNextPage ? (
            <span className="text-xs sm:text-sm text-muted-foreground animate-pulse">
              Loading more followers...
            </span>
          ) : finalData.length > 0 ? (
            <span className="text-xs sm:text-sm text-muted-foreground/50 italic">
              You've reached the end of the list
            </span>
          ) : null}
        </div>
        {/* Footer */}
        <div className="pt-3 sm:pt-4 flex flex-col xs:flex-row xs:items-center gap-1.5 xs:gap-2 text-xs sm:text-sm text-muted-foreground/60 border-t border-border/30">
          <span>List updated real-time</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-2.5 sm:size-3 text-emerald-500" />
            Fully Verified Security
          </span>
        </div>
      </div>

      {/* Dev Modal */}
      {isDevModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsDevModalOpen(false)}
          />

          <Card className="relative w-full max-w-[95%] xs:max-w-[90%] sm:max-w-sm overflow-hidden bg-card/85 border border-primary/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-2xl animate-in zoom-in-95 duration-300 z-10 text-center">
            {/* Icon */}
            <div className="mx-auto size-11 sm:size-12 md:size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2.5 sm:mb-3 md:mb-4 relative shadow-inner">
              <Sparkles className="size-5 sm:size-6 md:size-7 text-primary animate-pulse" />
            </div>

            <h3 className="text-sm sm:text-base md:text-lg font-black text-foreground">
              Message Options
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2 leading-relaxed">
              You can try sending a direct message to{" "}
              <strong className="text-primary">{selectedUserForMessage}</strong>
              .
            </p>

            {/* Actions */}
            <div className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2">
              <Button
                disabled
                variant="outline"
                className="w-full h-8 sm:h-9 rounded-full text-xs sm:text-sm font-bold opacity-60 cursor-not-allowed"
              >
                Send Message (Coming Soon)
              </Button>
              {/* Email contact (optional) */}
              {(() => {
                const user = finalData.find(
                  (f: any) => f.name === selectedUserForMessage,
                );

                return user?.email ? (
                  <a
                    href={`mailto:${user.email}`}
                    className="w-full inline-flex items-center justify-center h-8 sm:h-9 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all"
                  >
                    Contact via Email
                  </a>
                ) : null;
              })()}

              {/* Image message (future feature placeholder) */}

              {/* Close */}
              <Button
                onClick={() => setIsDevModalOpen(false)}
                variant="ghost"
                className="w-full h-7 sm:h-8 rounded-full text-xs sm:text-sm font-bold"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default FollowersPage;
