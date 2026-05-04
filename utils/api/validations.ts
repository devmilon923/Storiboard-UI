import z from "zod";

const loginSchema = z.object({
  email: z.string().email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});
export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  image: z.string().min(1, "Image path is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one special character (!@#$%^&*)",
    ),
  gender: z.enum(["Male", "Female", "Others"], {
    error: "Please select your gender",
  }),
  profession: z.enum(["Student", "Teacher", "Doctor", "Engineer"], {
    error: "Please select your profession",
  }),
  otp: z.string().min(5, "OTP must be 5 digits long"),
});
export interface GenderEmojiChoiceOption {
  value: z.infer<typeof registerSchema.shape.gender>;
  emoji: string;
  label: string;
  description?: string;
}

export interface EmojiChoiceOption {
  value: z.infer<typeof registerSchema.shape.profession>;
  emoji: string;
  label: string;
  description?: string;
}
export type TLogin = z.infer<typeof loginSchema>;
export type TRegister = z.infer<typeof registerSchema>;

// dummy data:
export const professionOptions: EmojiChoiceOption[] = [
  {
    value: "Student",
    emoji: "https://img.icons8.com/?size=100&id=12197&format=png&color=000000",
    label: "Student",
    description: "Select if you are a student",
  },
  {
    value: "Teacher",
    emoji:
      "https://img.icons8.com/?size=100&id=owZ150JlNlBu&format=png&color=000000",
    label: "Teacher",
    description: "Select if you are a teacher",
  },
  {
    value: "Doctor",
    emoji:
      "https://img.icons8.com/?size=100&id=fhnv2wJYtCWH&format=png&color=000000",
    label: "Doctor",
    description: "Select if you are a doctor",
  },
  {
    value: "Engineer",
    emoji: "https://img.icons8.com/?size=100&id=41237&format=png&color=000000",
    label: "Engineer",
    description: "Select if you are an engineer",
  },
];

export const genderOptions: GenderEmojiChoiceOption[] = [
  {
    value: "Male",
    emoji: "https://img.icons8.com/?size=100&id=18738&format=png&color=000000",
    label: "Male",
    description: "Select if you are a male",
  },
  {
    value: "Female",
    emoji: "https://img.icons8.com/?size=100&id=23256&format=png&color=000000",
    label: "Female",
    description: "Select if you are a female",
  },
  {
    value: "Others",
    emoji:
      "https://img.icons8.com/?size=100&id=vri4BrW3A8Uj&format=png&color=000000",
    label: "Others",
    description: "Select if you are others",
  },
];

export const commentValidation = z.object({
  content: z.string().min(1, "Comment content is required"),
  sourceId: z.number().min(1, "Comment source id is required"),
  commentType: z.enum(["post", "replie"]),
});
export const likeValidation = z.object({
  sourceId: z.number().min(1, "Like source id is required"),
  likeType: z.enum(["post", "replie", "comment"]),
});