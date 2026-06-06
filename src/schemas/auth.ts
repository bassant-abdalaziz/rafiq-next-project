import { z } from "zod";

/** regex of name  
// Allows letters from any language and single spaces between words.
// Prevents numbers, symbols, emojis, leading/trailing spaces, and multiple consecutive spaces.

// ^             Start of the string
// [\p{L}]+      One or more letters from any language: English, Arabic, accented letters, etc.
// (?: ... )     Non-capturing group, used only to group the next rule
// " "           A single normal space is allowed between words
// [\p{L}]+      After each space, there must be one or more letters
// *             The previous group can repeat zero or more times
// $             End of the string
// u             Unicode flag, required to make \p{L} support non-English letters

**/

const nameRegex = /^[\p{L}]+(?: [\p{L}]+)*$/u;

//signup schema
export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .min(3, "Name must be at least 3 characters.")
      .max(50, "Name must not exceed 50 characters.")
      .regex(
        nameRegex,
        "Name can only contain letters and single spaces. Numbers, symbols, and emojis are not allowed."
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),

    department: z.string().trim().optional(),

    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(64, "Password must not exceed 64 characters.")
      .regex(/^\S+$/, "Password must not contain spaces.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[!@#$_%^&*]/, "Password must contain at least one special character like !@#$%^&*."),

    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

//Generate the form values type from the Zod schema.
export type SignUpFormValues = z.infer<typeof signUpSchema>;

//login schema
export const LogInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof LogInSchema>;

//forgot password schema
export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
});

export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;


//reset password schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(64, "Password must be less than 64 characters.")
      .regex(/^\S+$/, "Password must not contain spaces.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[!@_#$%^&*]/, "Password must contain at least one special character."),

    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
