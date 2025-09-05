import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  organizerRegistrationSchema,
  type OrganizerRegistrationInput,
  type OrganizerRegistrationOutput,
} from "@/lib/validation/schema";
import { registerOrganizer } from "@/api/registrationApi";

export function OrganizerRegistrationForm({
  className,
}: {
  className?: string;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<OrganizerRegistrationInput>({
    resolver: zodResolver(organizerRegistrationSchema),
    defaultValues: {
      name: "",
      user_name: "",
      user_password: "",
      user_email: "",
      user_mobile: "",
      event_name: "",
      event_description: "",
      event_start_time: "",
      event_end_time: "",
    },
  });

  const onSubmit = handleSubmit(async (raw) => {
    try {
      const parsed: OrganizerRegistrationOutput =
        organizerRegistrationSchema.parse(raw);
      await registerOrganizer(parsed);
      reset();
    } catch (err: any) {
      setError("root", {
        message:
          err?.response?.data?.message ??
          "Registration failed. Please try again.",
      });
    }
  });

  return (
    <Card className={cn("w-full max-w-2xl", className)}>
      <CardHeader>
        <CardTitle className="text-2xl">Organizer Registration</CardTitle>
        <CardDescription>
          Create your organizer account and event details.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={onSubmit}
          noValidate
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {/* Name */}
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Username */}
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="user_name">Username</Label>
            <Input
              id="user_name"
              {...register("user_name")}
              aria-invalid={!!errors.user_name}
            />
            {errors.user_name && (
              <p className="text-sm text-destructive">
                {errors.user_name.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="user_password">Password</Label>
            <Input
              id="user_password"
              type="password"
              autoComplete="new-password"
              {...register("user_password")}
              aria-invalid={!!errors.user_password}
            />
            {errors.user_password && (
              <p className="text-sm text-destructive">
                {errors.user_password.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="user_email">Email</Label>
            <Input
              id="user_email"
              type="email"
              autoComplete="email"
              {...register("user_email")}
              aria-invalid={!!errors.user_email}
            />
            {errors.user_email && (
              <p className="text-sm text-destructive">
                {errors.user_email.message}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="user_mobile">Mobile</Label>
            <Input
              id="user_mobile"
              {...register("user_mobile")}
              aria-invalid={!!errors.user_mobile}
            />
            {errors.user_mobile && (
              <p className="text-sm text-destructive">
                {errors.user_mobile.message}
              </p>
            )}
          </div>

          {/* Event Name */}
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="event_name">Event name</Label>
            <Input
              id="event_name"
              {...register("event_name")}
              aria-invalid={!!errors.event_name}
            />
            {errors.event_name && (
              <p className="text-sm text-destructive">
                {errors.event_name.message}
              </p>
            )}
          </div>

          {/* Event Description (full width) */}
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="event_description">Event description</Label>
            <Input
              id="event_description"
              placeholder="(optional)"
              {...register("event_description")}
              aria-invalid={!!errors.event_description}
            />
            {errors.event_description && (
              <p className="text-sm text-destructive">
                {errors.event_description.message}
              </p>
            )}
          </div>

          {/* Start time */}
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="event_start_time">Start time</Label>
            <Controller
              name="event_start_time"
              control={control}
              render={({ field }) => (
                <Input
                  id="event_start_time"
                  type="datetime-local"
                  value={(field.value as string) ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={!!errors.event_start_time}
                />
              )}
            />
            {errors.event_start_time && (
              <p className="text-sm text-destructive">
                {String(errors.event_start_time.message) ||
                  "Invalid start time"}
              </p>
            )}
          </div>

          {/* End time */}
          <div className="grid gap-2 md:col-span-1">
            <Label htmlFor="event_end_time">End time</Label>
            <Controller
              name="event_end_time"
              control={control}
              render={({ field }) => (
                <Input
                  id="event_end_time"
                  type="datetime-local"
                  value={(field.value as string) ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  aria-invalid={!!errors.event_end_time}
                />
              )}
            />
            {errors.event_end_time && (
              <p className="text-sm text-destructive">
                {String(errors.event_end_time.message) || "Invalid end time"}
              </p>
            )}
          </div>

          {/* Root/server error */}
          {errors.root?.message && (
            <div className="md:col-span-2">
              <p className="text-sm text-destructive">{errors.root.message}</p>
            </div>
          )}

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" className="h-11" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create organizer & event"}
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter />
    </Card>
  );
}
