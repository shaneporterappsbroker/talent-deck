"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import { EngineerResource } from "@/lib/api/models/types";
import { UserMenu } from "@/components/userMenu";
import { AutoResizingTextArea } from "@/components/AutoResizingTextArea";
import { SlidesPreview } from "@/components/slidesPreview";
import { ChatHistory } from "@/components/chatHistory";
import { EngineersSelect } from "@/components/engineersSelect";
import {
  BOT_PROMPT,
  PLACEHOLDER,
  PROMPTS_COUNT,
  promptStepsConfig,
} from "@/lib/config/promptSteps";
import { useChatState } from "@/hooks/useChatState";
import { StepNumber, useCapturedInfo } from "@/hooks/useCapturedInfo";
import { validateUserResponse } from "@/app/actions/validateUserResponse";
import { isCapturedInfoComplete } from "@/lib/utils";

export default function Page() {
  const {
    messages,
    setMessages,
    step,
    setStep,
    input,
    setInput,
    setSelectedEngineers,
    isBusy,
    setIsBusy,
    reset,
  } = useChatState();

  const { capturedInfo, updateStepValue } = useCapturedInfo();

  const addBotMessagesForStep = (step: number, validationText: string) => {
    const nextPrompt = promptStepsConfig[step + 1]?.[BOT_PROMPT];
    const newMessages =
      step < PROMPTS_COUNT - 1
        ? [
            {
              role: "bot",
              text: `${validationText} ${nextPrompt}`,
            } as const,
          ]
        : [];

    setMessages((prev) => [...prev, ...newMessages]);
  };

  const handleSend = async ({
    engineers,
    inputText,
  }: {
    engineers?: EngineerResource[];
    inputText?: string;
  }) => {
    if (engineers?.length === 0 && !inputText?.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: engineers?.length
          ? engineers.map((e) => e.name).join(", ")
          : inputText,
      },
    ]);

    setInput("");

    let validationResponse = { result: "pass", text: "" };

    if (inputText) {
      setIsBusy(true);
      validationResponse = await validateUserResponse({
        question: promptStepsConfig[step][BOT_PROMPT],
        answer: inputText ?? "",
      });
      setIsBusy(false);
    }

    if (validationResponse.result === "pass") {
      updateStepValue(
        step as StepNumber,
        engineers?.length
          ? engineers.map(({ email }) => email).join(",")
          : (inputText ?? ""),
      );

      setTimeout(() => {
        addBotMessagesForStep(step, validationResponse.text);
      }, 400);

      if (step === PROMPTS_COUNT - 1) {
        setIsBusy(true);
      }

      if (step !== PROMPTS_COUNT) {
        setStep((step) => step + 1);
      }
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: validationResponse.text,
        } as const,
      ]);
    }
  };

  useEffect(() => {
    if (step === PROMPTS_COUNT && isCapturedInfoComplete(capturedInfo)) {
      setMessages((prev) => {
        const alreadyHasPreview = prev.some(
          (msg) =>
            msg.type === "component" && msg.component?.type === SlidesPreview,
        );
        if (alreadyHasPreview) return prev;

        return [
          ...prev,
          {
            role: "bot",
            type: "component",
            component: (
              <SlidesPreview
                projectDetails={capturedInfo}
                onComplete={() => setIsBusy(false)}
              />
            ),
          } as const,
        ];
      });
    }
  }, [capturedInfo, setIsBusy, setMessages, step]);

  return (
    <div className="flex flex-col h-screen bg-[#343541] text-white relative">
      <UserMenu />
      <ChatHistory {...{ messages, isBusy }} />

      {step === 1 ? (
        <div className="sticky bottom-0 w-full bg-[#343541] border-t-4 border-[#40414f] px-4 py-4">
          <EngineersSelect
            onSelectionComplete={(engineers: EngineerResource[]) => {
              setSelectedEngineers(engineers);
              handleSend({ engineers });
            }}
          />
        </div>
      ) : (
        step < PROMPTS_COUNT && (
          <div className="sticky bottom-0 w-full bg-[#343541] border-t border-[#40414f] px-4 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend({ inputText: input });
              }}
              className="flex max-w-3xl mx-auto items-center gap-2"
            >
              <AutoResizingTextArea
                placeholder={promptStepsConfig[step][PLACEHOLDER]}
                value={input}
                onChange={(value) => setInput(value)}
                onSubmit={(value) => {
                  setInput(value);
                  handleSend({ inputText: value });
                }}
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={isBusy}
              >
                <CornerDownLeft className="w-5 h-5" />
              </Button>
            </form>
          </div>
        )
      )}

      {step === PROMPTS_COUNT && !isBusy && (
        <div className="sticky bottom-0 w-full bg-[#343541] border-t border-[#40414f] px-4 py-6 flex justify-center">
          <Button variant="secondary" onClick={reset}>
            Start Again
          </Button>
        </div>
      )}
    </div>
  );
}
