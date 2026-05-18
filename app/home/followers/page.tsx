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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllFollowers } from "@/utils/api/endpoints";
import { useInView } from "react-intersection-observer";

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
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetAllFollowers(
      10,
      selectedProfession === "All" ? "" : selectedProfession,
      searchQuery,
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
    searchQuery,
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

  const handleFollowToggle = (id: string) => {
    setFollowState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const stats = useMemo(() => {
    return {
      total: finalData.length || 0,
      verified: finalData.filter((f: any) => f.isVerifyed).length || 0,
    };
  }, [finalData]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-background">
      <div className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header with Stats */}
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/40">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-foreground">
                Followers
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Manage your connections, see who is following you, and filter
                your professional network.
              </p>
            </div>

            <div className="flex w-full md:w-auto justify-around md:justify-end gap-3 sm:gap-4 bg-card/25 border border-border/40 backdrop-blur-md p-3 rounded-2xl shadow-sm">
              <div className="text-center flex-1 md:flex-initial min-w-[65px] sm:min-w-[75px]">
                <div className="text-base sm:text-lg font-extrabold text-foreground">
                  {stats.total}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Total
                </div>
              </div>
              <div className="w-px bg-border/40 self-stretch" />
              <div className="text-center flex-1 md:flex-initial min-w-[65px] sm:min-w-[75px]">
                <div className="text-base sm:text-lg font-extrabold text-primary flex items-center justify-center gap-0.5">
                  {stats.verified}
                  <BadgeCheck className="size-3.5 sm:size-4 fill-primary text-primary-foreground" />
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Verified
                </div>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
              <Input
                type="text"
                placeholder="Search by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 w-full rounded-2xl bg-card/30 border-border/50 text-foreground text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
              {FILTER_PROFESSIONS.map((prof) => (
                <button
                  key={prof}
                  onClick={() => setSelectedProfession(prof)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer border whitespace-nowrap ${
                    selectedProfession === prof
                      ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
                      : "bg-card/30 text-muted-foreground border-border/40 hover:text-foreground hover:border-primary/20"
                  }`}
                >
                  {prof === "Verified" ? (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="size-3" />
                      Verified Only
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
            <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/20 px-3 py-1.5 rounded-xl">
              <span>
                Showing{" "}
                <strong className="text-foreground">{finalData.length}</strong>{" "}
                results for "{searchQuery}"
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-primary hover:underline font-bold transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Follower Cards */}
          {finalData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {finalData.map((follower: any) => (
                <Card
                  key={follower.followerId}
                  className="group relative w-full overflow-hidden bg-card/40 border-border/40 hover:border-primary/20 transition-all duration-300 backdrop-blur-sm rounded-3xl p-3 sm:p-4 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: avatar + message button */}
                    <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                      <div className="relative shrink-0">
                        <div className="size-10 sm:size-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm group-hover:border-primary/40 transition-all duration-300">
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
                        className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 shrink-0 border border-transparent hover:border-primary/10 cursor-pointer"
                        title="Send Message"
                      >
                        <MessageSquare className="size-3.5" />
                      </Button>
                    </div>

                    {/* Name + profession */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-foreground truncate group-hover:text-primary transition-colors duration-300">
                          {follower.name}
                        </h3>
                        {follower.isVerifyed && (
                          <BadgeCheck className="size-4 sm:size-4.5 fill-primary text-primary-foreground shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md w-fit">
                        <Briefcase className="size-3 text-primary/80" />
                        <span>{follower.profession}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer: stats + follow button */}
                  <div className="border-t border-border/30 pt-2 sm:pt-3 mt-2 sm:mt-3 flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <div className="text-[9px] sm:text-[10px] text-muted-foreground/60 font-semibold tracking-wide uppercase">
                        Followers
                      </div>
                      <div className="text-xs font-black text-foreground flex items-center gap-1">
                        <TrendingUp className="size-3 text-emerald-400" />
                        {formatCount(follower.followersCount)}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleFollowToggle(follower.followerId)}
                      variant={
                        followState[follower.followerId]
                          ? "destructive"
                          : "outline"
                      }
                      size="sm"
                      className={`h-7 sm:h-8 font-bold rounded-full text-[11px] sm:text-xs transition-all duration-300 px-3.5 sm:px-4 group/btn ${
                        followState[follower.followerId]
                          ? "bg-destructive/10 text-destructive border-transparent hover:bg-destructive hover:text-white active:scale-95"
                          : "bg-primary text-primary-foreground border-transparent hover:bg-primary/95 hover:text-white hover:shadow-lg shadow-primary/20 active:scale-95"
                      }`}
                    >
                      {followState[follower.followerId] ? (
                        <>
                          <UserX className="size-3.5 mr-1 group-hover/btn:scale-110 transition-transform" />
                          <span>Unfollow</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="size-3.5 mr-1 group-hover/btn:scale-110 transition-transform" />
                          <span>Follow</span>
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-card/20 border-border/30 rounded-3xl min-h-[250px] sm:min-h-[300px] border border-dashed">
              <div className="size-12 sm:size-16 rounded-2xl bg-muted/30 border border-border/40 flex items-center justify-center shadow-inner mb-4">
                <Users className="size-6 sm:size-8 text-muted-foreground/60" />
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
                className="mt-5 sm:mt-6 font-bold rounded-xl"
              >
                Reset Filters
              </Button>
            </Card>
          )}
          <div ref={ref}>Load more....</div>
          {/* Footer */}
          <div className="pt-4 flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground/60 border-t border-border/30">
            <span>List updated real-time</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-500" />
              Fully Verified Security
            </span>
          </div>
        </div>
      </div>

      {/* Dev Modal */}
      {isDevModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsDevModalOpen(false)}
          />
          <Card className="relative w-full max-w-[90%] sm:max-w-sm overflow-hidden bg-card/85 border border-primary/20 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-300 z-10 text-center">
            <div className="mx-auto size-12 sm:size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 sm:mb-4 relative shadow-inner">
              <Sparkles className="size-6 sm:size-7 text-primary animate-pulse" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              Under Development
            </h3>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              The direct messaging interface with{" "}
              <strong className="text-primary">{selectedUserForMessage}</strong>{" "}
              is currently under development. Stay tuned for updates!
            </p>
            <div className="mt-5 sm:mt-6 flex justify-center">
              <Button
                onClick={() => setIsDevModalOpen(false)}
                variant="premium"
                className="h-8 font-bold rounded-full px-5 sm:px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 cursor-pointer active:scale-[0.98] border border-primary/20 text-xs sm:text-sm"
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
