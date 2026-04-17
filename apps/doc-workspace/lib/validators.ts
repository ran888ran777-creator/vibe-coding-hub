import { z } from "zod";

export const askQuestionSchema = z.object({
  question: z.string().min(3).max(2000)
});
