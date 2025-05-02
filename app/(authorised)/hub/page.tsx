"use client";

import { useState } from "react";
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

export default function Page() {
  const {
    messages,
    setMessages,
    step,
    setStep,
    input,
    setInput,
    setSelectedEngineers,
    isGenerating,
    setIsGenerating,
    reset,
  } = useChatState();

  const { capturedInfo, updateStepValue } = useCapturedInfo();

  // we can use the override for the engineers select step:
  const handleSend = async ({
    engineers,
    inputText,
  }: {
    engineers?: EngineerResource[];
    inputText?: string;
  }) => {
    // we need one of the two:
    if (engineers?.length === 0 && !inputText?.trim()) return;

    // append the response/user's messages to the chat history:
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: engineers?.length
          ? engineers.map((e) => e.name).join(",")
          : inputText,
      },
    ]);

    // clear the input:
    setInput("");

    // for text input, we need to further validate the response:
    let validationResponse = {
      result: "pass",
      text: "",
    };

    if (inputText) {
      validationResponse = await validateUserResponse({
        question: promptStepsConfig[step][BOT_PROMPT],
        answer: inputText ?? "",
      });
    }

    if (validationResponse.result === "pass") {
      updateStepValue(
        step as StepNumber,
        engineers?.length
          ? engineers.map(({ email }) => email).join(",")
          : (inputText ?? ""),
      );
    }

    setTimeout(() => {
      if (validationResponse.result === "pass") {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: `${validationResponse.text} ${promptStepsConfig[step + 1][BOT_PROMPT]}`,
          } as const,
          ...(step < PROMPTS_COUNT - 1
            ? []
            : [
                {
                  role: "bot",
                  type: "component",
                  component: (
                    <SlidesPreview
                      projectDetails={capturedInfo}
                      onComplete={() => setIsGenerating(false)}
                    />
                  ),
                } as const,
              ]),
        ]);
      } else {
        // if the validation fails, we need to show the validation message:
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: validationResponse.text,
          } as const,
        ]);
      }
    }, 400);

    // move on if the validation passes:
    if (validationResponse.result === "pass") {
      if (step === PROMPTS_COUNT) {
        setIsGenerating(true);
      } else {
        setStep((step) => step + 1);
      }
    }
  };

  const [opacity, setOpacity] = useState(0);
  const getOpacity = () =>
    `absolute top-4 left-4 bg-white opacity-${opacity} text-black p-4 rounded-lg max-w-[450px] break-all`;

  return (
    <div className="flex flex-col h-screen bg-[#343541] text-white relative">
      <UserMenu />

      <ChatHistory messages={messages} />

      <div
        className={getOpacity()}
        onMouseOver={() => setOpacity(100)}
        onMouseLeave={() => setOpacity(0)}
      >
        {JSON.stringify(capturedInfo, null, 2)}
      </div>

      {/* first step */}
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
        // one of the intermediate steps:
        step !== PROMPTS_COUNT && (
          <div className="sticky bottom-0 w-full bg-[#343541] border-t border-[#40414f] px-4 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend({
                  inputText: input,
                });
              }}
              className="flex max-w-3xl mx-auto items-center gap-2"
            >
              <AutoResizingTextArea
                placeholder={promptStepsConfig[step][PLACEHOLDER]}
                value={input}
                onChange={(value) => setInput(value)}
                onSubmit={(value) => {
                  setInput(value);
                  handleSend({
                    inputText: value,
                  });
                }}
              />
              <Button type="submit" size="icon" variant="ghost">
                <CornerDownLeft className="w-5 h-5" />
              </Button>
            </form>
          </div>
        )
      )}

      {/* this is what is shown when the slides have been generated and the chat has finished */}
      {step === PROMPTS_COUNT && !isGenerating && (
        <div className="sticky bottom-0 w-full bg-[#343541] border-t border-[#40414f] px-4 py-6 flex justify-center">
          <Button variant="secondary" onClick={reset}>
            Start Again
          </Button>
        </div>
      )}
    </div>
  );
}
