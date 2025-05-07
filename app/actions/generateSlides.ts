"use server";

import {
  GeneratedEngineerResourceSchema,
  EngineerResource,
  CapturedInfo,
} from "@/lib/api/models/types";
import { getUsersData } from "@/lib/api/services/resource.service";
import { authOptions } from "@/lib/auth/options";
import { generateSlidesData } from "@/lib/google/ai/ai.client";
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
  projectDetails,
}: {
  projectDetails: CapturedInfo;
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

  let engineerResources: EngineerResource[];
  try {
    engineerResources = await getUsersData({
      searchQuery: projectDetails.engineers,
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
    generatedDevs = await generateSlidesData({
      projectDetails,
      engineerResources,
    });
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
    const result = GeneratedEngineerResourceSchema.safeParse(item);
    return result.success ? [result.data] : [];
  });

  let slideInfo: GenerateSlidesResult;
  try {
    slideInfo = await generateSlides({
      capturedInfo: projectDetails,
      resources: slidesData,
      accessToken: session?.accessToken,
    });
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
