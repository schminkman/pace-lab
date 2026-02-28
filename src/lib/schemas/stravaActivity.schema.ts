import z from "zod";

// zod default behavior is to allow additional fields, so we only define fields here
// which are useful for our application
export const $StravaActivitySchema = z.object({
  id: z.number(),
  name: z.string(),
  sport_type: z.string(),
  start_date: z.string(),
  timezone: z.string(),
  distance: z.number(),
  moving_time: z.number(),
  elapsed_time: z.number(),
  total_elevation_gain: z.number(),
  average_speed: z.number().optional(),
  max_speed: z.number().optional(),
  has_heartrate: z.boolean(),
  average_heartrate: z.number().optional(),
  max_heartrate: z.number().optional(),
  kudos_count: z.number(),
});

export type StravaActivity = z.infer<typeof $StravaActivitySchema>;
