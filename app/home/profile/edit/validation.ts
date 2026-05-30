import z from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  image: z.string().optional(),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  website: z
    .string()
    .optional()
    .refine(
      (v) =>
        !v ||
        v === "" ||
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v),
      { message: "Enter a valid URL" },
    ),
  address: z.string().optional(),
});
export type TEditProfile = z.infer<typeof editProfileSchema>;
