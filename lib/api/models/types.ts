import { z } from "zod";

export type SlidesGenerationError = {
  message: string;
  stack?: string;
};

export const ProjectSchema = z.object({
  client: z.string(),
  description: z.string(),
});

export const ResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  img: z.string(),
  title: z.string(),
  skills: z.array(z.string()),
  languages: z.array(z.string()),
  certifications: z.array(z.string()),
  projects: z.array(ProjectSchema),
});

export const GeneratedResourceSchema = ResourceSchema.extend({
  strapline: z.string().default(""),
  professionalBackground: z.string().default(""),
});

export type Project = z.infer<typeof ProjectSchema>;
export type Resource = z.infer<typeof ResourceSchema>;
export type GeneratedResource = z.infer<typeof GeneratedResourceSchema>;
