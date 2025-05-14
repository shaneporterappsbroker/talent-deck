// added a comment to the top of the file
// and another comment
// another comment
// yet another comment
// and another
// yet another
// blah

import { CapturedInfo } from "@/lib/api/models/types";
import { useState } from "react";

const stepToKey = {
  1: "engineers",
  2: "clientName",
  3: "clientAndProjectDescription",
  4: "technologies",
  5: "otherDetails",
} as const;

export type StepNumber = keyof typeof stepToKey;

export function useCapturedInfo() {
  const [capturedInfo, setCapturedInfo] = useState<CapturedInfo>({
    engineers: "",
    clientName: "",
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
      clientName: "",
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
