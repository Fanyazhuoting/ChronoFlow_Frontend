import { z } from "zod";

//Login
//later need to adjust the password length to at least 8 characters
export const loginUserSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .max(128, "Password is too long"),
  remember: z.boolean(),
});

export type LoginUser = z.infer<typeof loginUserSchema>;

//Registeration
export const MAX_REGISTRATION_FORM_LENGTH = {
  name: 100,
  username: 100,
  password: 100,
  email: 200,
  mobile: 20,
  eventName: 100,
  eventDesc: 255,
} as const;

export const dateFromInput = z.preprocess((v) => {
  if (typeof v === "string" || v instanceof Date) {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return undefined;
}, z.date());

export const organizerRegistrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .max(MAX_REGISTRATION_FORM_LENGTH.name),

    user_name: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(MAX_REGISTRATION_FORM_LENGTH.username)
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Only letters, numbers, dot, underscore, hyphen"
      ),

    user_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(MAX_REGISTRATION_FORM_LENGTH.password),

    user_email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .max(MAX_REGISTRATION_FORM_LENGTH.email)
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email address"),

    user_mobile: z
      .string()
      .trim()
      .min(3, "Mobile is required")
      .max(MAX_REGISTRATION_FORM_LENGTH.mobile)
      .regex(/^[0-9+\-\s()]{3,20}$/, "Invalid mobile format"),

    event_name: z
      .string()
      .trim()
      .min(1, "Event name is required")
      .max(MAX_REGISTRATION_FORM_LENGTH.eventName),

    event_description: z
      .string()
      .trim()
      .max(MAX_REGISTRATION_FORM_LENGTH.eventDesc)
      .optional()
      .default(""),

    event_start_time: dateFromInput,
    event_end_time: dateFromInput,
  })
  .refine((v) => v.event_end_time.getTime() > v.event_start_time.getTime(), {
    path: ["event_end_time"],
    message: "End time must be after start time",
  });

// Types
export type OrganizerRegistrationInput = z.input<
  typeof organizerRegistrationSchema
>; // what the form accepts (strings for datetime-local)
export type OrganizerRegistrationOutput = z.infer<
  typeof organizerRegistrationSchema
>; // after parse (Dates)
