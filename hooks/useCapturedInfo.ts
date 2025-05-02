import { CapturedInfo } from "@/lib/api/models/types";
import { useState } from "react";

const stepToKey = {
  1: "engineers",
  2: "clientAndProjectDescription",
  3: "technologies",
  4: "otherDetails",
} as const;

export type StepNumber = keyof typeof stepToKey;

export function useCapturedInfo() {
  const [capturedInfo, setCapturedInfo] = useState<CapturedInfo>({
    engineers: "",
    clientAndProjectDescription: "",
    technologies: "",
    otherDetails: "",
  });

  function updateStepValue<K extends StepNumber>(
    step: K,
    value: CapturedInfo[(typeof stepToKey)[K]],
  ) {
    const key = stepToKey[step];
    setCapturedInfo((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function reset() {
    setCapturedInfo({
      engineers: "",
      clientAndProjectDescription: "",
      technologies: "",
      otherDetails: "",
    });
  }

  return {
    capturedInfo,
    updateStepValue,
    reset,
  };
}
