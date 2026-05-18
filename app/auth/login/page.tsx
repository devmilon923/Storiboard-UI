"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginUser } from "@/utils/api/endpoints";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import z from "zod";
import { useAuth } from "@/providers/AuthContext";
import { Loader2 } from "lucide-react";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(20, { message: "Password must be less than 20 characters long" });

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export default function LoginPage() {
  const { setUser } = useAuth();
  const login = useLoginUser();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const result: any = await login.mutateAsync({
        email: data.email,
        password: data.password,
      });
      setUser(result.data);
    } catch (error: any) {
      console.log("Login failed", error.response.data.message);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-background">
      {/* Ambient background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
      </div>

      <div
        className="group w-full max-w-lg rounded-3xl overflow-hidden border border-border/60 bg-card/85 p-8 backdrop-blur-xl sm:p-10 relative shadow-md animate-in fade-in slide-in-from-bottom-5 duration-500"
        role="form"
        aria-labelledby="login-title"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 -z-10"
        />

        <div className="mb-8 space-y-2 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Sign In
          </div>
          <h1
            id="login-title"
            className="text-2xl font-semibold text-foreground sm:text-3xl tracking-tight"
          >
            Access your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in to your account.
          </p>
        </div>

        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="h-11 rounded-2xl border-border/60 bg-background/60 px-4 transition-all focus:ring-2 focus:ring-primary/20"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <p className="text-[10px] text-destructive font-medium ml-2">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-11 rounded-2xl border-border/60 bg-background/60 px-4 transition-all focus:ring-2 focus:ring-primary/20"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.error && (
                    <p className="text-[10px] text-destructive font-medium ml-2">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <Controller
              name="rememberMe"
              control={form.control}
              render={({ field }) => (
                <label className="flex items-center gap-2 cursor-pointer group/label">
                  <Checkbox
                    id="remember-me"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <span className="group-hover/label:text-foreground transition-colors select-none">
                    Remember me
                  </span>
                </label>
              )}
            />
            <button
              type="button"
              className="text-xs cursor-pointer font-medium text-primary underline-offset-4 hover:underline transition-all"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full h-12 cursor-pointer rounded-full bg-primary text-primary-foreground font-semibold shadow-xl shadow-primary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-70 disabled:translate-y-0"
          >
            {login.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging in...
              </div>
            ) : (
              "Login Now"
            )}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            New to Storiboard?{" "}
            <Link
              href="/auth/register"
              className="font-bold text-primary hover:underline transition-all cursor-pointer"
            >
              Create an Account
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground leading-relaxed">
          By continuing you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">
            terms of service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground">
            privacy policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
