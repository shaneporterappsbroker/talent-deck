"use server";

import { GeneratedResourceSchema, Resource } from "@/lib/api/models/types";
import { getUsersData } from "@/lib/api/services/resource.service";
import { authOptions } from "@/lib/auth/options";
import { generateData } from "@/lib/google/ai/ai.client";
import {
  generateSlides,
  GenerateSlidesResult,
} from "@/lib/google/workspace/workspace.client";
import { getErrorStack } from "@/lib/utils";
import { getServerSession } from "next-auth";

export type ProcessDataResult = {
  data: GenerateSlidesResult | null;
  error?: { message: string; stack?: string };
};

export async function processDataAndGenerateSlides({
  projectDescription,
  emails,
}: {
  projectDescription: string;
  emails: string[];
}): Promise<ProcessDataResult> {
  const session = await getServerSession(authOptions);
  if (!session?.kantataAccessToken) {
    return {
      data: null,
      error: {
        message: "Missing or invalid session token.",
        stack: getErrorStack(new Error("Missing session token")),
      },
    };
  }

  let developers: Resource[];
  try {
    developers = await getUsersData({
      searchQuery: emails,
      token: session.kantataAccessToken,
      by: "email",
    });
  } catch (err) {
    return {
      data: null,
      error: {
        message: "Failed to fetch developer data.",
        stack: getErrorStack(err),
      },
    };
  }

  let generatedDevs: string | undefined;
  try {
    generatedDevs = await generateData(projectDescription, developers);
  } catch (err) {
    return {
      data: null,
      error: {
        message: "AI data generation failed.",
        stack: getErrorStack(err),
      },
    };
  }

  let parsedData: unknown[];
  try {
    parsedData = JSON.parse(generatedDevs ?? "[]");
  } catch {
    parsedData = [];
  }

  const slidesData = parsedData.flatMap((item) => {
    const result = GeneratedResourceSchema.safeParse(item);
    return result.success ? [result.data] : [];
  });

  let slideInfo: GenerateSlidesResult;
  try {
    slideInfo = await generateSlides(session?.accessToken, slidesData);
  } catch (err) {
    return {
      data: null,
      error: {
        message: "Failed to generate slides.",
        stack: getErrorStack(err),
      },
    };
  }

  return {
    data: slideInfo,
  };
}
