import { Message, EngineerResource } from "@/lib/api/models/types";
import { BOT_PROMPT, promptStepsConfig } from "@/lib/config/promptSteps";
import { useState } from "react";

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: promptStepsConfig[1][BOT_PROMPT],
    },
  ]);

  const [step, setStep] = useState(1);
  const [selectedEngineers, setSelectedEngineers] = useState<
    EngineerResource[]
  >([]);
  const [input, setInput] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const reset = () => {
    setMessages([
      {
        role: "bot",
        text: promptStepsConfig[1][BOT_PROMPT],
      },
    ]);
    setStep(1);
    setSelectedEngineers([]);
    setInput("");
  };

  return {
    messages,
    setMessages,
    step,
    setStep,
    selectedEngineers,
    setSelectedEngineers,
    input,
    setInput,
    isGenerating,
    setIsGenerating,
    reset,
  };
}
