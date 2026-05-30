"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  AlignLeft,
  ArrowLeft,
  Camera,
  Check,
  Globe,
  Loader2,
  MapPin,
  Pencil,
  Save,
  Sparkles,
  User,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthContext";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { editProfileSchema, TEditProfile } from "./validation";
import { useEditProfile } from "@/utils/api/endpoints";

function FloatingInput({
  icon: Icon,
  label,
  placeholder,
  error,
  value,
  inputProps,
}: {
  icon: React.ElementType;
  label: string;
  placeholder: string;
  error?: string;
  value?: string;
  inputProps: any;
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = !!value;
  return (
    <div className="group relative">
      <div
        className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 bg-muted/20 ${
          error
            ? "border-destructive/50 bg-destructive/5"
            : focused
              ? "border-primary bg-background shadow-lg shadow-primary/10 ring-4 ring-primary/8"
              : "border-border/60 hover:border-border"
        }`}
      >
        {/* Icon strip */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center transition-colors duration-300 ${
            error
              ? "text-destructive/60"
              : focused || hasValue
                ? "text-primary"
                : "text-muted-foreground/40"
          }`}
        >
          <Icon className="size-4" />
        </div>

        {/* Input */}
        <input
          {...inputProps}
          placeholder={focused ? placeholder : ""}
          onFocus={(e) => {
            setFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            inputProps.onBlur?.(e);
          }}
          className="peer h-12 w-full bg-transparent pr-4 pt-4 text-sm font-medium text-foreground placeholder:text-muted-foreground/50 outline-none"
        />

        {/* Floating label */}
        <label
          className={`pointer-events-none absolute left-12 font-semibold transition-all duration-300 ${
            focused || hasValue
              ? "top-1.5 text-[9px] uppercase tracking-widest text-primary"
              : "top-3.5 text-sm text-muted-foreground/60"
          }`}
        >
          {label}
        </label>

        {/* Check mark */}
        {hasValue && !error && (
          <div className="mr-4 shrink-0 animate-in zoom-in duration-200">
            <Check className="size-4 text-primary" />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1.5 ml-1 flex items-center gap-1.5 text-xs font-medium text-destructive animate-in slide-in-from-top-1 duration-200">
          <span className="inline-block size-1.5 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </div>
  );
}

function FloatingTextarea({
  icon: Icon,
  label,
  placeholder,
  error,
  value,
  maxLength = 160,
  inputProps,
}: {
  icon: React.ElementType;
  label: string;
  placeholder: string;
  error?: string;
  value?: string;
  maxLength?: number;
  inputProps: any;
}) {
  const [focused, setFocused] = useState(false);
  const charCount = value?.length ?? 0;
  const hasValue = charCount > 0;
  const nearLimit = charCount >= maxLength * 0.8;

  return (
    <div className="group relative">
      <div
        className={`relative flex rounded-2xl border-2 transition-all duration-300 bg-muted/20 ${
          error
            ? "border-destructive/50 bg-destructive/5"
            : focused
              ? "border-primary bg-background shadow-lg shadow-primary/10 ring-4 ring-primary/8"
              : "border-border/60 hover:border-border"
        }`}
      >
        {/* Icon strip */}
        <div
          className={`flex shrink-0 items-start justify-center pt-3.5 w-12 transition-colors duration-300 ${
            error
              ? "text-destructive/60"
              : focused || hasValue
                ? "text-primary"
                : "text-muted-foreground/40"
          }`}
        >
          <Icon className="size-4" />
        </div>

        {/* Textarea */}
        <div className="flex-1 pr-4 pb-3">
          <label
            className={`pointer-events-none block font-semibold transition-all duration-300 ${
              focused || hasValue
                ? "mt-1.5 text-[9px] uppercase tracking-widest text-primary"
                : "mt-3.5 text-sm text-muted-foreground/60"
            }`}
          >
            {label}
          </label>
          <textarea
            {...inputProps}
            rows={3}
            maxLength={maxLength}
            placeholder={focused ? placeholder : ""}
            onFocus={(e) => {
              setFocused(true);
              inputProps.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              inputProps.onBlur?.(e);
            }}
            className="mt-0.5 w-full resize-none bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/50 outline-none leading-relaxed"
          />
        </div>
      </div>

      {/* Character counter + error row */}
      <div className="mt-1.5 flex items-center justify-between px-1">
        {error ? (
          <p className="flex items-center gap-1.5 text-xs font-medium text-destructive animate-in slide-in-from-top-1 duration-200">
            <span className="inline-block size-1.5 rounded-full bg-destructive" />
            {error}
          </p>
        ) : (
          <span />
        )}
        <span
          className={`text-[10px] font-bold tabular-nums transition-colors duration-200 ${
            nearLimit
              ? charCount >= maxLength
                ? "text-destructive"
                : "text-amber-500"
              : "text-muted-foreground/40"
          }`}
        >
          {charCount}/{maxLength}
        </span>
      </div>
    </div>
  );
}

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const updateProfile = useEditProfile();
  const form = useForm<TEditProfile>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      image: user?.image ?? "",
      bio: user?.bio,
      website: user?.website,
      address: user?.address,
    },
  });

  const watchedImage = form.watch("image");
  const watchedName = form.watch("name");

  const onSubmit = async (data: TEditProfile) => {
    try {
      await updateProfile.mutateAsync(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center gap-4 px-4">
          <button
            onClick={() => router.back()}
            className="flex size-9 items-center justify-center rounded-full text-foreground/70 transition-all hover:bg-muted hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-extrabold tracking-tight text-foreground">
              Edit Profile
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              Update your public info
            </p>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateProfile.isPending || saved}
            variant="default"
            className={`gap-2 rounded-xl px-5 h-9 font-bold text-sm transition-all duration-300 cursor-pointer ${
              saved
                ? "bg-emerald-500 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "shadow-md shadow-primary/15 hover:shadow-primary/30"
            }`}
          >
            {updateProfile.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            {saved ? "Saved!" : "Save"}
          </Button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-2xl px-4 pb-32 pt-8">
        {/* ── Account Stats ── */}
        {user && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* Followers */}
            <div className="rounded-2xl border border-border/40 bg-muted/30 p-4 text-center">
              <p className="text-2xl font-black text-foreground">
                {user._count?.followers ?? 0}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Followers
              </p>
            </div>

            {/* Following */}
            <div className="rounded-2xl border border-border/40 bg-muted/30 p-4 text-center">
              <p className="text-2xl font-black text-foreground">
                {user._count?.following ?? 0}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Following
              </p>
            </div>

            {/* Posts */}
            <div className="rounded-2xl border border-border/40 bg-muted/30 p-4 text-center">
              <p className="text-2xl font-black text-foreground">
                {user._count?.posts ?? 0}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Posts
              </p>
            </div>

            {/* Verification Status */}
            <div className="rounded-2xl border border-border/40 bg-muted/30 p-4 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-xl font-black text-foreground">
                  {user.isVerifyed ? "✓" : "-"}
                </span>
              </div>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Verified
              </p>
            </div>
          </div>
        )}

        {/* ── Account Info ── */}
        {user && (
          <div className="mb-8 rounded-2xl border border-border/40 bg-muted/20 p-5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Account Information
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* User ID */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                  User ID
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  #{user.id}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                  Email
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground break-all">
                  {user.email}
                </p>
              </div>

              {/* Role */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                  Role
                </p>
                <div className="mt-1 inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary capitalize">
                  {user.role}
                </div>
              </div>

              {/* Profession */}
              {user.profession && (
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    Profession
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {user.profession}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* ── Avatar section ── */}
          <div className="relative flex flex-col items-center py-8">
            {/* Decorative glow */}
            <div className="absolute inset-x-0 top-0 h-48 rounded-3xl bg-linear-to-b from-primary/6 via-primary/3 to-transparent" />

            {/* Avatar + upload trigger */}
            <Controller
              name="image"
              control={form.control}
              render={({ field }) => (
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                  }
                  onSuccess={(result: any) => {
                    if (result.event === "success" && result.info?.secure_url) {
                      field.onChange(result.info.secure_url);
                    }
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="group relative z-10 cursor-pointer"
                    >
                      {/* Ring */}
                      <div className="absolute -inset-1.5 rounded-[2rem] bg-linear-to-br from-primary/40 via-primary/20 to-transparent opacity-0 blur-md transition-all duration-500 group-hover:opacity-100" />

                      {/* Avatar frame */}
                      <div className="relative size-28 overflow-hidden rounded-[1.5rem] border-4 border-background shadow-2xl ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/50">
                        {watchedImage ? (
                          <img
                            src={watchedImage}
                            alt="Profile"
                            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
                          />
                        ) : user?.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-75"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-primary/5 transition-all duration-300 group-hover:brightness-75">
                            <User className="size-12 text-primary/50" />
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                          <Camera className="size-6 text-white" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-white">
                            Change
                          </span>
                        </div>
                      </div>

                      {/* Upload badge */}
                      <div className="absolute -bottom-2 -right-2 flex size-8 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-110">
                        <Pencil className="size-3.5" />
                      </div>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            />

            {/* Name preview */}
            <div className="relative z-10 mt-5 text-center">
              <h2 className="text-xl font-black tracking-tight text-foreground">
                {watchedName || user?.name || "Your Name"}
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                {user?.email}
              </p>
            </div>

            {/* Tip */}
            <div className="relative z-10 mt-4 flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary/80">
              <Sparkles className="size-3.5 shrink-0 text-primary" />
              Click the avatar to upload a new photo via Cloudinary
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">
              Profile Details
            </span>
            <div className="h-px flex-1 bg-border/50" />
          </div>

          {/* ── Fields ── */}
          <FieldGroup className="space-y-5">
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <FloatingInput
                  icon={User}
                  label="Full Name"
                  placeholder="e.g. Sarah Johnson"
                  error={fieldState.error?.message}
                  value={field.value}
                  inputProps={field}
                />
              )}
            />

            {/* Website */}
            <Controller
              name="website"
              control={form.control}
              render={({ field, fieldState }) => (
                <FloatingInput
                  icon={Globe}
                  label="Website URL"
                  placeholder="e.g. https://yoursite.com"
                  error={fieldState.error?.message}
                  value={field.value}
                  inputProps={field}
                />
              )}
            />

            {/* Address */}
            <Controller
              name="address"
              control={form.control}
              render={({ field, fieldState }) => (
                <FloatingInput
                  icon={MapPin}
                  label="Location / Address"
                  placeholder="e.g. New York, NY"
                  error={fieldState.error?.message}
                  value={field.value}
                  inputProps={field}
                />
              )}
            />

            {/* Bio */}
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <FloatingTextarea
                  icon={AlignLeft}
                  label="Bio"
                  placeholder="Tell the world a little about yourself…"
                  error={fieldState.error?.message}
                  value={field.value}
                  maxLength={160}
                  inputProps={field}
                />
              )}
            />
          </FieldGroup>

          {/* ── Info card ── */}
          <div className="rounded-2xl border border-border/40 bg-muted/20 p-5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Visibility
            </p>
            {[
              { label: "Full Name", note: "Visible on your public profile" },
              { label: "Profile Photo", note: "Shown across the platform" },
              { label: "Bio", note: "Max 160 chars · shown on profile" },
              { label: "Website & Location", note: "Displayed on your bio" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-1.5 rounded-full bg-primary/60" />
                  <span className="text-sm font-bold text-foreground/80">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {item.note}
                </span>
              </div>
            ))}
          </div>

          {/* ── Submit (mobile) ── */}
          <Button
            type="submit"
            disabled={updateProfile.isPending || saved}
            variant="default"
            className={`w-full h-13 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 cursor-pointer ${
              saved
                ? "bg-emerald-500 hover:bg-emerald-500 shadow-lg shadow-emerald-500/20"
                : "shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5"
            }`}
          >
            {updateProfile.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Saving changes…
              </span>
            ) : saved ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                Profile Updated!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="size-4" />
                Save Changes
              </span>
            )}
          </Button>

          {/* Error from mutation */}
          {updateProfile.isError && (
            <p className="text-center text-xs font-semibold text-destructive animate-in fade-in duration-200">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
