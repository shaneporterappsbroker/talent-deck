import { JSX } from "react";
import { z } from "zod";

export type CapturedInfo = {
  engineers: string;
  clientAndProjectDescription: string;
  technologies: string;
  otherDetails: string;
};

export type Message = {
  role: "user" | "bot";
  text?: string;
  type?: "text" | "component";
  component?: JSX.Element;
};

export type SlidesGenerationError = {
  message: string;
  stack?: string;
};

export const ProjectSchema = z.object({
  client: z.string(),
  description: z.string(),
});

export const EngineerResourceSchema = z.object({
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

export const GeneratedEngineerResourceSchema = EngineerResourceSchema.extend({
  strapline: z.string().default(""),
  professionalBackground: z.string().default(""),
});

export type Project = z.infer<typeof ProjectSchema>;
export type EngineerResource = z.infer<typeof EngineerResourceSchema>;
export type GeneratedEngineerResource = z.infer<
  typeof GeneratedEngineerResourceSchema
>;
