"use server";

import {
  QuestionAnswer,
  ValidateUserResponseData,
  ValidateUserResponseDataSchema,
} from "@/lib/api/models/types";
import { validateResponse } from "@/lib/google/ai/ai.client";

export async function validateUserResponse(questionAnswer: QuestionAnswer) {
  try {
    const text = await validateResponse(questionAnswer);

    const parsedResult = ValidateUserResponseDataSchema.safeParse(
      JSON.parse(text ?? "{}"),
    );

    if (parsedResult.success) {
      return parsedResult.data as ValidateUserResponseData;
    } else {
      return {
        result: "fail",
        text: parsedResult.error.message,
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        result: "fail",
        text: error.message,
      };
    } else {
      return {
        result: "fail",
        text: "An unknown error occurred.",
      };
    }
  }
}
