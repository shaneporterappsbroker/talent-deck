import { CapturedInfo, EngineerResource } from "@/lib/api/models/types";
import { GoogleGenAI /*, schemaFromZodType */ } from "@google/genai";
// import { z } from "zod";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateData({
  projectDetails,
  engineerResources,
}: {
  projectDetails: CapturedInfo;
  engineerResources: EngineerResource[];
}) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents: getPrompt(projectDetails, engineerResources),
    config: {
      responseMimeType: "application/json",
      // TODO: reinstate this when the new version is made available
      // responseSchema: schemaFromZodType(z.array(GeneratedResourceSchema)),
    },
  });

  return response.text;
}

const getPrompt = (
  { clientAndProjectDescription, technologies, otherDetails }: CapturedInfo,
  engineerResources: EngineerResource[],
) => {
  return `
    You're a Resume writer who will be given some structured JSON data representing some Software Engineers. Each engineer will include a list of skills, and some history of past projects. 
    Each project will have a client name as well as the description of what they did on that project and skills they used.

    You will also be given the following:
    
    Client/Project Description: the client description and details about the project
    Technologies: the technologies used in the project
    Other details: any other details that may be relevant

    RULES:

    - choose the most relevant 10 skills
    - generate a strapline that's no more than 10 words - it should be a snappy title for the engineer's outlook or approach to software development
    - generate a professional background that's no more than 15-20 words - it should encapsulate the engineer's experience and skills
    - rephrase the project descriptions so that they generate the most impact; use no more than 60 words per project.

    The resulting data MUST be in a JSON array, where each item is in this format:

    {
    id: string,
    name: string,
    email: string,
    img: string,
    title: string,
    skills: array of string,
    languages: array of string,
    certifications: array of string,
    projects: array of client and description,
    strapline: string,
    professionalBackground: string,
    }

    CLIENT/PROJECT DESCRIPTION:

    ${clientAndProjectDescription}

    TECHNOLOGIES:
    ${technologies}

    OTHER DETAILS:
    ${otherDetails}

    ENGINEER JSON DATA:
    
    ${JSON.stringify(engineerResources, null, 2)}`;
};
