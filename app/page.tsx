"use client";

import { useAuth } from "@/providers/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  PenLine,
  BookOpen,
  Users,
  ArrowRight,
  Sparkles,
  Globe,
  Feather,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginUser } from "@/utils/api/endpoints";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export default function Page() {
  const { user, isLoading, logoutHelper, setUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const login = useLoginUser();

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      const result: any = await login.mutateAsync({
        email: data.email,
        password: data.password,
      });
      setUser(result.data);
    } catch (error) {
      form.setError("email", { message: "Invalid email address" });
      form.setError("password", { message: "Invalid password" });
      console.error("Login failed", error);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute -top-[25%] left-1/3 h-175 w-175 rounded-full bg-primary/3 blur-[140px]" />
        <div className="absolute -bottom-[10%] right-1/4 h-125 w-125 rounded-full bg-primary/2 blur-[120px]" />
      </div>

      <nav className="relative z-50 w-full">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          {/* Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            id="nav-brand"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm group-hover:shadow-primary/20">
              <Feather
                size={16}
                className="text-primary group-hover:text-primary-foreground transition-colors"
              />
            </div>
            <span className="text-[17px] font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Storiboard
            </span>
          </Link>

          {/* Right — keep it minimal */}
          <div className="flex items-center">
            {mounted && user && (
              <button
                onClick={() => {
                  logoutHelper();
                  router.push("/");
                }}
                className="cursor-pointer rounded-full border border-border/60 px-4 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:border-foreground/20 hover:text-foreground"
                id="nav-logout"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ─── Hero: 2-Column Layout ─── */}
      <main className="relative flex flex-1 items-center justify-center px-5 sm:px-8">
        <div className="mx-auto w-full max-w-6xl py-12 sm:py-16 lg:py-0">
          {isLoading && mounted ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            /* ════════════════════════════════════════
               LOGGED-IN: 2-Column Layout
               Left  = Welcome + headline
               Right = Quick actions card
            ════════════════════════════════════════ */
            <div
              className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
              style={{ animationFillMode: "both" }}
            >
              {/* Left Column */}
              <div
                className="animate-in fade-in slide-in-from-left-6 duration-700"
                style={{ animationFillMode: "both" }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold tracking-wide text-primary">
                  <Sparkles size={13} className="animate-pulse" />
                  Welcome back, {user.name?.split(" ")[0]}
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                  Your stories
                  <br />
                  <span className="text-muted-foreground/70">are waiting.</span>
                </h1>

                <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
                  Continue sharing your imagination with the community. Your
                  next great story is just a thought away.
                </p>

                {/* Feature list */}
                <div className="mt-8 flex flex-col gap-3">
                  {[
                    {
                      icon: PenLine,
                      text: "Draft and publish stories instantly",
                    },
                    {
                      icon: Users,
                      text: "Engage with your growing audience",
                    },
                    {
                      icon: Globe,
                      text: "Discover trending stories from the community",
                    },
                  ].map(({ icon: Icon, text }) => (
                    <div
                      key={text}
                      className="flex items-center gap-3 text-sm text-muted-foreground group/item"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                        <Icon
                          size={15}
                          className="text-primary transition-transform group-hover/item:scale-110"
                        />
                      </div>
                      <span className="group-hover/item:text-foreground transition-colors">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column — Quick Actions Card */}
              <div
                className="animate-in fade-in slide-in-from-right-6 duration-700 delay-150"
                style={{ animationFillMode: "both" }}
              >
                <div className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-foreground text-xl font-bold uppercase text-primary shadow-inner border border-primary/20 overflow-hidden">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0) || "U"
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-foreground truncate">
                        {user.name}
                      </h2>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Button asChild variant="premium" className="h-11 w-full">
                      <Link href="/home" id="hero-go-to-feed">
                        Go to Feed
                        <ArrowRight size={15} className="ml-1.5" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      className="h-11 w-full rounded-xl border-border/60 text-sm font-medium transition-all duration-200 hover:-translate-y-px hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    >
                      <Link href="/home" id="hero-write-story">
                        <PenLine size={15} className="mr-1.5 text-primary" />
                        Write a Story
                      </Link>
                    </Button>
                  </div>

                  {/* Mini stats */}
                  <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-secondary/50 p-3.5">
                    {[
                      { value: "Free", label: "Forever" },
                      { value: "Open", label: "Community" },
                      { value: "∞", label: "Stories" },
                    ].map(({ value, label }) => (
                      <div key={label} className="text-center">
                        <p className="text-base font-bold text-foreground">
                          {value}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ════════════════════════════════════════
               GUEST: 2-Column Layout
               Left  = Headline + features
               Right = Login card with register link
            ════════════════════════════════════════ */
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              {/* Left Column — Headline & Value Props */}
              <div
                className={`${
                  mounted
                    ? "animate-in fade-in slide-in-from-left-6 duration-700"
                    : "opacity-0"
                }`}
                style={{ animationFillMode: "both" }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <BookOpen size={13} className="animate-bounce-subtle" />
                  Free &amp; Open Platform
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem] lg:leading-[1.15]">
                  Where imagination
                  <br />
                  <span className="text-muted-foreground/70">
                    finds its voice.
                  </span>
                </h1>

                <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                  A place to share stories — real or imagined. Whether
                  you&apos;re a dreamer, a writer, or a filmmaker searching for
                  the next big idea — your story starts here.
                </p>

                {/* Feature list */}
                <div className="mt-8 flex flex-col gap-3.5">
                  {[
                    {
                      icon: PenLine,
                      title: "Write Freely",
                      desc: "Share fiction, memoirs, ideas — no limits on your imagination.",
                    },
                    {
                      icon: Users,
                      title: "Build Community",
                      desc: "Connect with readers and creators who love great stories.",
                    },
                    {
                      icon: Globe,
                      title: "Inspire Anyone",
                      desc: "Your story could spark a film, a book, or someone's dream.",
                    },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 group/item"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover/item:bg-primary/20 transition-all duration-300">
                        <Icon
                          size={16}
                          className="text-primary group-hover/item:scale-110 transition-transform"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover/item:text-primary transition-colors">
                          {title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column — Login Card */}
              <div
                className={`${
                  mounted
                    ? "animate-in fade-in slide-in-from-right-6 duration-700 delay-150"
                    : "opacity-0"
                }`}
                style={{ animationFillMode: "both" }}
              >
                <div className="rounded-2xl border border-border/50 bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-7">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-foreground">
                      Start your journey
                    </h2>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      Sign in to share your stories with the world.
                    </p>
                  </div>

                  <form
                    className="space-y-3.5"
                    onSubmit={form.handleSubmit(onSubmit)}
                    suppressHydrationWarning
                  >
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="hero-email"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Email address
                      </Label>
                      <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div>
                            <Input
                              {...field}
                              id="hero-email"
                              type="email"
                              placeholder="you@example.com"
                              autoComplete="email"
                              className="h-10 rounded-lg border-border/60 bg-background/60 px-3.5 text-sm transition-all focus:ring-2 focus:ring-primary/20"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.error && (
                              <p className="mt-1 text-[11px] font-medium text-destructive">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="hero-password"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Password
                      </Label>
                      <Controller
                        name="password"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <div>
                            <div className="relative">
                              <Input
                                {...field}
                                id="hero-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                className="h-10 rounded-lg border-border/60 bg-background/60 px-3.5 pr-10 text-sm transition-all focus:ring-2 focus:ring-primary/20"
                                aria-invalid={fieldState.invalid}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((p) => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
                                tabIndex={-1}
                              >
                                {showPassword ? (
                                  <EyeOff size={15} />
                                ) : (
                                  <Eye size={15} />
                                )}
                              </button>
                            </div>
                            {fieldState.error && (
                              <p className="mt-1 text-[11px] font-medium text-destructive">
                                {fieldState.error.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={login.isPending}
                      variant="premium"
                      className="h-11 w-full"
                      id="hero-login-btn"
                    >
                      {login.isPending ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Signing in...
                        </span>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/40" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-3 text-[11px] text-muted-foreground/60">
                        New here?
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full rounded-lg border-border/60 text-sm font-medium transition-all duration-200 hover:-translate-y-px hover:bg-primary/5 hover:text-primary hover:border-primary/30 group"
                  >
                    <Link href="/auth/register" id="hero-register-btn">
                      Create an Account
                      <ArrowRight
                        size={15}
                        className="ml-1.5 group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </Button>

                  <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground/50">
                    Free forever. No credit card required.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-border/30 py-5">
        <p className="text-center text-xs text-muted-foreground/50">
          Storiboard — Share your imagination with the world.
        </p>
      </footer>
    </div>
  );
}
