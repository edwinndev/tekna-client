import { z } from "zod";

export const dashboardFilterSchema = z.object({
  timeframe: z.enum(["TODAY", "WEEK", "MONTH", "ALL"]).default("ALL"),
});

export type DashboardFilterSchemaType = z.infer<typeof dashboardFilterSchema>;
