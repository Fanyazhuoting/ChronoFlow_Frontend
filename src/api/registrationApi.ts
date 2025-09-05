import { http } from "@/lib/http";
import type { OrganizerRegistrationOutput } from "@/lib/validation/schema";

export async function registerOrganizer(input: OrganizerRegistrationOutput) {
  const payload = {
    ...input,
    event_start_time: input.event_start_time.toISOString(),
    event_end_time: input.event_end_time.toISOString(),
  };
  const res = await http.post("/system/organizer/register", payload);
  return res.data;
}
