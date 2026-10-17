import { z } from "zod";

export const alertFilterSchema = z.object({
  severity: z.enum(["ALL", "OUT_OF_STOCK", "CRITICAL", "WARNING"]).default("ALL"),
  search: z.string().optional(),
});

export type AlertFilterSchemaType = z.infer<typeof alertFilterSchema>;
