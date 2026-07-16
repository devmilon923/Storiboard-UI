"use client";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, FieldPath, useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  PartyPopper,
  ShieldCheck,
  UploadCloud,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  genderOptions,
  professionOptions,
  registerSchema,
  TRegister,
} from "@/utils/api/validations";
import {
  useCreateUser,
  useResendOTP,
  useVerifyAccount,
} from "@/utils/api/endpoints";

function RegisterPage() {
  const resendOtp = useResendOTP();
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState<FieldPath<TRegister>[]>([]);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const [isWidgetLoading, setIsWidgetLoading] = useState(false);
  const router = useRouter();
  const register = useCreateUser();
  const verifyAccount = useVerifyAccount();
  const form = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      otp: "",
    },
  });
  useEffect(() => {
    if (step === 1) {
      setActiveField(["name"]);
    } else if (step === 2) {
      setActiveField(["password"]);
    } else if (step === 3) {
      setActiveField(["profession", "gender"]);
    } else if (step === 4) {
      setActiveField(["image"]);
    } else if (step === 5) {
      setActiveField(["email"]);
    } else if (step === 6) {
      setActiveField(["otp"]);
    }
  }, [step]);

  const stepValidation = async () => {
    const isValid = await form.trigger(activeField);
    return isValid;
  };
  const goNext = async () => {
    const isValid = await stepValidation();
    if (!isValid) return;

    if (step === 5) {
      try {
        await register.mutateAsync(form.getValues());
        setStep(6);
      } catch (error: any) {
        form.setError("email", {
          type: "manual",
          message: error?.response?.data?.message,
        });
      }
    } else if (step < 6) {
      setStep(step + 1);
    }
  };

  const goBack = async () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const selectedProfession = form.watch("profession");
  const selectedGender = form.watch("gender");
  const onSubmit = async (data: TRegister) => {
    if (step === 6) {
      try {
        const result: any = await verifyAccount.mutateAsync(
          parseInt(data.otp as string),
        );
        setVerifiedUser(result.data);
        setStep(7);
        console.log("Account verified successfully");
      } catch (error: any) {
        form.setError("otp", {
          message: error?.response?.data?.message || "Unknown error",
        });
        console.log(error?.message);
      }
    }
  };
  const handleResendOtp = async () => {
    try {
      await resendOtp.mutateAsync();
    } catch (error: any) {
      console.log(error.message);
    }
  };
  return (
    <div className="max-w-xl mx-auto my-12">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-foreground">
              Registration
            </span>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Step {step} of 7
            </span>
          </div>
          <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              style={{ width: `${(step / 7) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-md shadow-primary/30 transition-all duration-500 ease-in-out"
            />
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
              {Math.round((step / 7) * 100)}% Complete
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <FieldGroup>
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <Field>
                        <FieldLabel className="text-sm font-bold text-foreground/80 mb-2 ml-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Full Name
                        </FieldLabel>
                        <div className="relative group">
                          <Input
                            placeholder="Type your full name here..."
                            className="pl-4 h-12 bg-muted/30 border-border focus:bg-background transition-all duration-300 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary pr-10"
                            {...field}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors duration-300">
                            {!fieldState.error && field.value && (
                              <Check className="w-5 h-5" />
                            )}
                          </div>
                        </div>
                        {fieldState.error && (
                          <div className="animate-in fade-in zoom-in-95 duration-200">
                            <FieldError className="mt-2 ml-1 text-xs font-medium flex items-center gap-1">
                              {fieldState.error.message}
                            </FieldError>
                          </div>
                        )}
                      </Field>
                    </div>
                  )}
                />
              </FieldGroup>
            )}

            {step === 2 && (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    return (
                      <Field>
                        <FieldLabel className="text-sm font-bold text-foreground/80 mb-2 ml-1 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-primary" />
                          Password
                        </FieldLabel>
                        <div className="relative group">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password..."
                            className="pl-4 h-12 bg-muted/30 border-border focus:bg-background transition-all duration-300 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-primary transition-colors duration-200 cursor-pointer"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {fieldState.error && (
                          <div className="animate-in fade-in zoom-in-95 duration-200">
                            <FieldError className="mt-2 ml-1 text-xs font-medium">
                              {fieldState.error.message}
                            </FieldError>
                          </div>
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Gender Section */}
                <Controller
                  name="gender"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-6 w-1 bg-primary rounded-full" />
                        <FieldLabel className="text-xl font-bold text-foreground">
                          Gender
                        </FieldLabel>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {genderOptions.map((gender) => {
                          const isSelected = selectedGender === gender.value;
                          return (
                            <button
                              key={gender.value}
                              type="button"
                              onClick={() => field.onChange(gender.value)}
                              className={`relative cursor-pointer group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 h-40 active:scale-95 animate-in fade-in slide-in-from-bottom-2 ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                  : "border-border/50 bg-background hover:border-border hover:shadow-md hover:-translate-y-1"
                              }`}
                            >
                              <div className="mb-4 bg-muted/50 rounded-full p-3 group-hover:bg-primary/10 transition-colors duration-300">
                                <img
                                  src={gender.emoji}
                                  alt={gender.label}
                                  className={`w-12 h-12 object-contain transition-all duration-300 ${!isSelected && "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}
                                />
                              </div>
                              <h3
                                className={`text-sm font-bold transition-colors duration-300 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                              >
                                {gender.label}
                              </h3>

                              {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg border-2 border-background animate-in zoom-in duration-200">
                                  <Check className="w-3 h-3 stroke-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {fieldState.error && (
                        <FieldError className="mt-2">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                      <FieldDescription className="mt-4 text-muted-foreground/60 text-[10px] italic">
                        Please select the gender you most identify with for
                        personalized content.
                      </FieldDescription>
                    </Field>
                  )}
                />

                {/* Profession Section */}
                <Controller
                  name="profession"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-6 w-1 bg-primary rounded-full" />
                        <FieldLabel className="text-xl font-bold text-foreground">
                          Profession
                        </FieldLabel>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {professionOptions.map((profession) => {
                          const isSelected =
                            selectedProfession === profession.value;
                          return (
                            <button
                              key={profession.value}
                              type="button"
                              onClick={() => field.onChange(profession.value)}
                              className={`relative cursor-pointer group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 h-40 active:scale-95 animate-in fade-in slide-in-from-bottom-2 ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                  : "border-border/50 bg-background hover:border-border hover:shadow-md hover:-translate-y-1"
                              }`}
                            >
                              <div className="mb-4 bg-muted/50 rounded-full p-3 group-hover:bg-primary/10 transition-colors duration-300">
                                <img
                                  src={profession.emoji}
                                  alt={profession.label}
                                  className={`w-12 h-12 object-contain transition-all duration-300 ${!isSelected && "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}
                                />
                              </div>
                              <h3
                                className={`text-sm font-bold transition-colors duration-300 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                              >
                                {profession.label}
                              </h3>

                              {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg border-2 border-background animate-in zoom-in duration-200">
                                  <Check className="w-3 h-3 stroke-3" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {fieldState.error && (
                        <FieldError className="mt-2">
                          {fieldState.error.message}
                        </FieldError>
                      )}
                      <FieldDescription className="mt-4 text-muted-foreground/60 text-[10px] italic">
                        Selecting your profession helps us tailor your
                        experience to your specific career path.
                      </FieldDescription>
                    </Field>
                  )}
                />
              </div>
            )}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 py-4">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-[20px] opacity-20 rounded-full animate-pulse" />
                    <div className="w-16 h-16 bg-background border-2 border-primary/20 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-transform hover:scale-105 duration-300">
                      <UploadCloud className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Add Profile Photo
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-65 mx-auto leading-relaxed">
                      Choose a photo for your account profile.
                    </p>
                  </div>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    options={{
                      multiple: false,
                      resourceType: "image",
                      clientAllowedFormats: ["png", "jpeg", "jpg", "webp", "gif"],
                      maxFiles: 1,
                    }}
                    onOpen={() => {
                      setIsWidgetLoading(false);
                    }}
                    onClose={() => {
                      setIsWidgetLoading(false);
                    }}
                    onSuccess={(result: any) => {
                      setIsWidgetLoading(false);
                      if (
                        result.event === "success" &&
                        result.info?.secure_url
                      ) {
                        form.setValue("image", result.info.secure_url);
                        console.log("Image uploaded:", result.info.secure_url);
                      }
                    }}
                    onError={(error) => {
                      setIsWidgetLoading(false);
                      console.error("Upload Error:", error);
                    }}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        onClick={() => {
                          setIsWidgetLoading(true);
                          open();
                        }}
                        disabled={isWidgetLoading}
                        variant="outline"
                        className="w-full max-w-50 h-12 border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
                      >
                        {isWidgetLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        )}
                        {isWidgetLoading
                          ? "Opening..."
                          : form.watch("image")
                            ? "Change Photo"
                            : "Choose Photo"}
                      </Button>
                    )}
                  </CldUploadWidget>
                  {form.watch("image") && (
                    <div className="mt-4 relative group animate-in zoom-in duration-300">
                      <img
                        src={form.watch("image")}
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 5 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel className="text-sm font-bold text-foreground/80 mb-2 ml-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        Email Address
                      </FieldLabel>
                      <div className="relative group">
                        <Input
                          placeholder="john@example.com"
                          className="pl-4 h-12 bg-muted/30 border-border focus:bg-background transition-all duration-300 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary pr-10"
                          {...field}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors duration-300">
                          {!fieldState.error && field.value && (
                            <Check className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                      {fieldState.error && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                          <FieldError className="mt-2 ml-1 text-xs font-medium">
                            {fieldState.error.message}
                          </FieldError>
                        </div>
                      )}
                      <FieldDescription className="mt-4 text-muted-foreground/50 text-[10px] leading-relaxed">
                        We'll send you a verification link to this email address
                        once you complete the registration.
                      </FieldDescription>
                    </Field>
                  )}
                />
              </div>
            )}
            {step === 6 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 py-4">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-[20px] opacity-20 rounded-full animate-pulse" />
                    <div className="w-16 h-16 bg-background border-2 border-primary/20 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-transform hover:scale-105 duration-300">
                      <ShieldCheck className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Verification Code
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-65 mx-auto leading-relaxed">
                      We've sent a 6-digit Storiboard verification code to your
                      email. Enter it below to continue.
                    </p>
                  </div>
                </div>

                <Controller
                  name="otp"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field className="flex flex-col items-center">
                      <div className="relative group p-1 flex justify-center w-full">
                        <InputOTP maxLength={5} {...field}>
                          <InputOTPGroup className="gap-2 sm:gap-3">
                            {[0, 1, 2, 3, 4].map((index) => (
                              <InputOTPSlot
                                key={index}
                                index={index}
                                className={`w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl border-2 transition-all duration-300 bg-muted/20 hover:bg-background
                                  ${
                                    fieldState.error
                                      ? "border-destructive/30 focus:border-destructive focus:ring-destructive/20 data-[active=true]:border-destructive"
                                      : "border-border focus:border-primary focus:ring-primary/20 data-[active=true]:border-primary data-[active=true]:bg-background data-[active=true]:shadow-md data-[active=true]:scale-105"
                                  }
                                `}
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      {fieldState.error && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-6">
                          <FieldError className="text-sm font-medium px-4 py-2 bg-red-50 text-red-600 rounded-full flex items-center gap-2 shadow-sm border border-red-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            {fieldState.error.message}
                          </FieldError>
                        </div>
                      )}
                    </Field>
                  )}
                />

                <div className="text-center mt-8">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive a code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="font-semibold text-primary cursor-pointer hover:underline transition-all"
                    >
                      {resendOtp.isPending ? "Sending..." : "Resend"}
                    </button>
                    <p>
                      {resendOtp.isError && (
                        <span className="text-red-800 text-xs">
                          {(resendOtp.error as Error)?.message}
                        </span>
                      )}
                      {resendOtp.isSuccess && (
                        <span className="text-green-800 text-xs">
                          {resendOtp.data?.message}
                        </span>
                      )}
                    </p>
                  </p>
                </div>
              </div>
            )}

            {step === 7 && verifiedUser && (
              <div className="animate-in fade-in zoom-in-95 duration-500 py-6">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-[30px] opacity-20 rounded-full animate-pulse" />
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center shadow-inner relative z-10 animate-bounce duration-2000">
                      <PartyPopper className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-background rounded-full p-2 shadow-lg animate-in zoom-in duration-500 delay-300">
                      <BadgeCheck className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                      Welcome to Storiboard!
                    </h2>
                    <p className="text-muted-foreground font-medium">
                      Your account has been successfully verified
                    </p>
                  </div>

                  <div className="w-full bg-muted/30 backdrop-blur-sm rounded-3xl p-6 border border-border space-y-4 shadow-sm">
                    <div className="flex items-center gap-4 p-3 bg-background rounded-2xl shadow-sm border border-border/50">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">
                          Full Name
                        </p>
                        <p className="text-sm font-bold text-foreground/80">
                          {verifiedUser.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-background rounded-2xl shadow-sm border border-border/50">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider">
                          Email Address
                        </p>
                        <p className="text-sm font-bold text-foreground/80">
                          {verifiedUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-background rounded-2xl shadow-sm border border-border/50">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                          <p className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-wider">
                            Profession
                          </p>
                          <p className="text-xs font-bold text-foreground/80">
                            {verifiedUser.profession}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-background rounded-2xl shadow-sm border border-border/50">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-[8px] font-bold text-muted-foreground/50 uppercase tracking-wider">
                            Status
                          </p>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <p className="text-xs font-bold text-primary">
                              Verified
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 w-full">
                    <Button
                      onClick={() => router.push("/auth/login")}
                      variant="premium"
                      className="w-full h-14"
                    >
                      Access Your Account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between items-center border-t border-border/50 p-6 bg-muted/20">
          {step !== 7 && (
            <Button
              variant="ghost"
              className={`cursor-pointer gap-2 transition-all rounded-full px-8 duration-300 ${step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-background hover:shadow-sm"}`}
              onClick={goBack}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          )}

          {step < 6 ? (
            <Button
              onClick={goNext}
              variant="premium"
              className="px-8 rounded-full"
              disabled={register.isPending}
            >
              {register.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {register.isPending ? (
                "Please wait"
              ) : (
                <>
                  Next Step
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          ) : step === 6 ? (
            <Button
              type="submit"
              form="register-form"
              variant="premium"
              className="px-10"
            >
              Complete Registration
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
}

export default RegisterPage;
