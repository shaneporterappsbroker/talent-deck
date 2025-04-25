export type Project = {
  client: string;
  description: string;
};

export type Skill = {
  name: string;
  level: number;
};

export type Resource = {
  id: string;
  name: string;
  email: string;
  img: string;
  title: string;
  skills: Skill[];
  languages: string[];
  certifications: string[];
  projects: Project[];
};

export type GeneratedResource = Resource & {
  strapline: string;
  professionalBackground: string;
};
