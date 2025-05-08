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
import { PROMPTS_COUNT, promptStepsConfig } from "@/lib/config/promptSteps";
import { useChatState } from "@/hooks/useChatState";
import { StepNumber, useCapturedInfo } from "@/hooks/useCapturedInfo";
import { validateUserResponse } from "@/app/actions/validateUserResponse";
import { isCapturedInfoComplete } from "@/lib/utils";
import StickyFooter from "@/components/stickyFooter";

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
    const { botPrompt: prompt } = promptStepsConfig[step + 1];

    const baseMessage = {
      role: "bot",
      text: prompt ? `${validationText} ${prompt}` : `${validationText}`,
    } as const;

    setMessages((prev) => [...prev, baseMessage]);
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

    const { botPrompt: prompt } = promptStepsConfig[step];

    if (inputText) {
      setIsBusy(true);
      validationResponse = await validateUserResponse({
        question: prompt,
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

        if (step === PROMPTS_COUNT - 1) {
          setIsBusy(true);
        }

        // Delay step increment slightly to allow final message to show before preview
        setTimeout(() => {
          if (step < PROMPTS_COUNT) {
            setStep((step) => step + 1);
          }
        }, 200);
      }, 400);
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

      {step < PROMPTS_COUNT && (
        <StickyFooter>
          {step === 1 ? (
            <EngineersSelect
              onSelectionComplete={(engineers: EngineerResource[]) => {
                setSelectedEngineers(engineers);
                handleSend({ engineers });
              }}
            />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend({ inputText: input });
              }}
              className="flex max-w-3xl mx-auto items-center gap-2"
            >
              <AutoResizingTextArea
                placeholder={promptStepsConfig[step].placeholder}
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
          )}
        </StickyFooter>
      )}

      {step === PROMPTS_COUNT && !isBusy && (
        <StickyFooter>
          <div className="flex justify-center">
            <Button variant="secondary" onClick={reset}>
              Start Again
            </Button>
          </div>
        </StickyFooter>
      )}
    </div>
  );
}
