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
import { useCreateUser, useVerifyAccount } from "@/utils/api/endpoints";

function RegisterPage() {
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [activeField, setActiveField] = useState<FieldPath<TRegister>[]>([]);
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
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
        console.log("Account verified successfully", result.data);
      } catch (error: any) {
        console.log(error?.message);
      }
    }
  };
  return (
    <div className="max-w-xl mx-auto my-12">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-slate-800">
              Registration
            </span>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Step {step} of 7
            </span>
          </div>
          <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${(step / 7) * 100}%` }}
              className="absolute top-0 left-0 h-full bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-500 ease-in-out"
            />
          </div>
          <div className="flex justify-end mt-1">
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
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
                        <FieldLabel className="text-sm font-bold text-slate-700 mb-2 ml-1 flex items-center gap-2">
                          <User className="w-4 h-4 text-green-600" />
                          Full Name
                        </FieldLabel>
                        <div className="relative group">
                          <Input
                            placeholder="Type your full name here..."
                            className="pl-4 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 pr-10"
                            {...field}
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-green-400 transition-colors duration-300">
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
                        <FieldLabel className="text-sm font-bold text-slate-700 mb-2 ml-1 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-green-600" />
                          Password
                        </FieldLabel>
                        <div className="relative group">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password..."
                            className="pl-4 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-600 transition-colors duration-200 cursor-pointer"
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
                        <div className="h-6 w-1 bg-green-500 rounded-full" />
                        <FieldLabel className="text-xl font-bold text-slate-800">
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
                                  ? "border-green-500 bg-green-50 shadow-lg shadow-green-100"
                                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:-translate-y-1"
                              }`}
                            >
                              <div className="mb-4 bg-slate-50 rounded-full p-3 group-hover:bg-green-100 transition-colors duration-300">
                                <img
                                  src={gender.emoji}
                                  alt={gender.label}
                                  className={`w-12 h-12 object-contain transition-all duration-300 ${!isSelected && "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}
                                />
                              </div>
                              <h3
                                className={`text-sm font-bold transition-colors duration-300 ${isSelected ? "text-green-700" : "text-slate-600"}`}
                              >
                                {gender.label}
                              </h3>

                              {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white animate-in zoom-in duration-200">
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
                      <FieldDescription className="mt-4 text-slate-400 text-[10px] italic">
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
                        <div className="h-6 w-1 bg-green-500 rounded-full" />
                        <FieldLabel className="text-xl font-bold text-slate-800">
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
                                  ? "border-green-500 bg-green-50 shadow-lg shadow-green-100"
                                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-md hover:-translate-y-1"
                              }`}
                            >
                              <div className="mb-4 bg-slate-50 rounded-full p-3 group-hover:bg-green-100 transition-colors duration-300">
                                <img
                                  src={profession.emoji}
                                  alt={profession.label}
                                  className={`w-12 h-12 object-contain transition-all duration-300 ${!isSelected && "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}
                                />
                              </div>
                              <h3
                                className={`text-sm font-bold transition-colors duration-300 ${isSelected ? "text-green-700" : "text-slate-600"}`}
                              >
                                {profession.label}
                              </h3>

                              {isSelected && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white animate-in zoom-in duration-200">
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
                      <FieldDescription className="mt-4 text-slate-400 text-[10px] italic">
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
                    <div className="absolute inset-0 bg-green-500 blur-[20px] opacity-20 rounded-full animate-pulse" />
                    <div className="w-16 h-16 bg-white border-2 border-green-100 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-transform hover:scale-105 duration-300">
                      <UploadCloud className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Upload Image
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-[260px] mx-auto leading-relaxed">
                      Upload your image to continue.
                    </p>
                  </div>
                  <CldUploadWidget
                    uploadPreset={
                      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                    }
                    onSuccess={(result: any) => {
                      if (
                        result.event === "success" &&
                        result.info?.secure_url
                      ) {
                        form.setValue("image", result.info.secure_url);
                        console.log("Image uploaded:", result.info.secure_url);
                      }
                    }}
                    onError={(error) => {
                      console.error("Upload Error:", error);
                    }}
                  >
                    {({ open }) => (
                      <Button
                        type="button"
                        onClick={() => open()}
                        variant="outline"
                        className="w-full max-w-[200px] h-12 border-2 border-dashed border-green-200 hover:border-green-500 hover:bg-green-50 text-green-700 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                      >
                        <UploadCloud className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {form.watch("image") ? "Change Image" : "Upload Image"}
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
                      <FieldLabel className="text-sm font-bold text-slate-700 mb-2 ml-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-600" />
                        Email Address
                      </FieldLabel>
                      <div className="relative group">
                        <Input
                          placeholder="john@example.com"
                          className="pl-4 h-12 bg-slate-50/50 border-slate-200 focus:bg-white transition-all duration-300 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 pr-10"
                          {...field}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-green-400 transition-colors duration-300">
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
                      <FieldDescription className="mt-4 text-slate-400 text-[10px] leading-relaxed">
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
                    <div className="absolute inset-0 bg-green-500 blur-[20px] opacity-20 rounded-full animate-pulse" />
                    <div className="w-16 h-16 bg-white border-2 border-green-100 rounded-2xl flex items-center justify-center shadow-xl relative z-10 transition-transform hover:scale-105 duration-300">
                      <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      Verification Code
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-[260px] mx-auto leading-relaxed">
                      We've sent a 6-digit secure code to your email. Enter it
                      below to continue.
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
                                className={`w-12 h-14 sm:w-14 sm:h-16 text-2xl font-bold rounded-xl border-2 transition-all duration-300 bg-slate-50/50 hover:bg-white
                                  ${
                                    fieldState.error
                                      ? "border-red-200 focus:border-red-500 focus:ring-red-500/20 data-[active=true]:border-red-500"
                                      : "border-slate-200 focus:border-green-500 focus:ring-green-500/20 data-[active=true]:border-green-500 data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:scale-105"
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
                  <p className="text-sm text-slate-500">
                    Didn't receive a code?{" "}
                    <button
                      type="button"
                      className="font-semibold text-green-600 hover:text-green-700 hover:underline transition-all"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </div>
            )}

            {step === 7 && verifiedUser && (
              <div className="animate-in fade-in zoom-in-95 duration-500 py-6">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-500 blur-[30px] opacity-20 rounded-full animate-pulse" />
                    <div className="w-24 h-24 bg-green-50 rounded-3xl flex items-center justify-center shadow-inner relative z-10 animate-bounce duration-2000">
                      <PartyPopper className="w-12 h-12 text-green-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg animate-in zoom-in duration-500 delay-300">
                      <BadgeCheck className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      Welcome aboard!
                    </h2>
                    <p className="text-slate-500 font-medium">
                      Your account has been successfully verified
                    </p>
                  </div>

                  <div className="w-full bg-slate-50/80 backdrop-blur-sm rounded-3xl p-6 border border-slate-100 space-y-4 shadow-sm">
                    <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Full Name
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {verifiedUser.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Email Address
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {verifiedUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                            Profession
                          </p>
                          <p className="text-xs font-bold text-slate-700">
                            {verifiedUser.profession}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-sm border border-slate-50">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="text-left">
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                            Status
                          </p>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-xs font-bold text-green-600">
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
                      className="w-full h-14 cursor-pointer bg-slate-900 hover:bg-black text-white rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 group"
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
        <CardFooter className="flex justify-between items-center border-t border-slate-100 p-6 bg-slate-50/50">
          {step !== 7 && (
            <Button
              variant="ghost"
              className={`cursor-pointer gap-2 transition-all rounded-full px-8 duration-300 ${step === 1 ? "opacity-0 pointer-events-none" : "hover:bg-white hover:shadow-sm"}`}
              onClick={goBack}
              disabled={step === 1}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          )}

          {step < 6 ? (
            <Button
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-8 rounded-full shadow-lg shadow-green-200 transition-all duration-300 group gap-2"
              onClick={goNext}
            >
              Next Step
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : step === 6 ? (
            <Button
              type="submit"
              form="register-form"
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-10 rounded-xl shadow-lg shadow-green-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
