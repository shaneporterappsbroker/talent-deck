"use client";

import { useState, useEffect, useRef, JSX } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { CornerDownLeft, PlusIcon, CheckIcon } from "lucide-react";
import { Typewriter } from "react-simple-typewriter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { Resource } from "@/lib/api/models/types";
import { getUsersData } from "@/lib/api/services/resource.service";
import { UserMenu } from "@/components/userMenu";
import { AutoResizingTextArea } from "@/components/AutoResizingTextArea";
import { SlidesPreview } from "@/components/slidesPreview";

interface Message {
  id: number;
  role: "user" | "bot";
  text?: string;
  type?: "text" | "component";
  component?: JSX.Element;
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "bot",
      text: "Hi! Let's start building your team. Please select the engineers you'd like to add.",
    },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [engineers, setEngineers] = useState<Resource[]>([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [selectedEngineers, setSelectedEngineers] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer); // Clean up timeout on each render
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchEngineers(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length,
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setTimeout(() => {
      if (step === 1) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length,
            role: "bot",
            text: "Great! Now please describe the project.",
          },
        ]);
        setStep(2);
      } else if (step === 2) {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length,
            role: "bot",
            text: "Awesome. Generating CV-friendly summaries...",
          },
          {
            id: prev.length + 1,
            role: "bot",
            type: "component",
            component: (
              <SlidesPreview emails={selectedEngineers.map((e) => e.email)} />
            ),
          },
        ]);
        setStep(3);
      }
    }, 800);
  };

  const fetchEngineers = async (searchQuery: string) => {
    if (searchQuery.length < 4) return;

    setLoading(true);

    const users = await getUsersData({
      searchQuery,
      by: "name",
    });

    setEngineers(users);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#343541] text-white relative">
      <UserMenu />
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`w-full flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" ? (
                msg.type === "component" ? (
                  // Render the component if the message type is "component"
                  <div className="max-w-xl">{msg.component}</div>
                ) : (
                  // Render text if it's not a component
                  <div className="max-w-xl text-lg text-gray-200 whitespace-pre-line">
                    <Typewriter
                      words={[msg.text || ""]}
                      loop={1}
                      typeSpeed={30}
                      deleteSpeed={0}
                      delaySpeed={1000}
                    />
                  </div>
                )
              ) : (
                <div className="px-4 py-3 rounded-xl bg-[#2e8fff] text-white max-w-xl text-lg whitespace-pre-line">
                  {msg.text}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {step === 1 ? (
        <div className="sticky bottom-0 w-full bg-[#343541] border-t-4 border-[#40414f] px-4 py-4">
          <div className="flex max-w-3xl mx-auto items-center gap-2 w-full">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="secondary">
                  <PlusIcon strokeWidth={4} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white text-black">
                <div className="space-y-4">
                  <div className="font-semibold">Select Engineers</div>
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />

                  <div className="space-y-2">
                    {loading ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="animate-spin text-gray-500" />
                      </div>
                    ) : (
                      engineers.map((engineer) => {
                        const isSelected = selectedEngineers
                          .map((resource) => resource.id)
                          .includes(engineer.id);
                        return (
                          <div
                            key={engineer.id}
                            onClick={() => {
                              if (
                                !selectedEngineers
                                  .map((resource) => resource.id)
                                  .includes(engineer.id)
                              ) {
                                setSelectedEngineers((prev) => [
                                  ...prev,
                                  engineer,
                                ]);
                              }
                            }}
                            className="flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                          >
                            <div className="flex items-center gap-3">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={engineer.img}
                                alt={engineer.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <div className="font-medium">
                                  {engineer.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {engineer.title}
                                </div>
                              </div>
                            </div>
                            {isSelected ? (
                              <CheckIcon className="text-green-500" />
                            ) : (
                              <PlusIcon />
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex-grow flex items-center gap-2">
              {selectedEngineers.length > 0 ? (
                <div className="flex flex-wrap gap-2 ml-2">
                  {selectedEngineers.map((engineer) => (
                    <Popover key={engineer.id}>
                      <PopoverTrigger>
                        <div className="flex items-center bg-blue-600 text-white py-1 px-4 rounded-full cursor-pointer">
                          <span>{engineer.name}</span>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="bg-white text-black p-4">
                        <div className="font-semibold">{engineer.name}</div>
                        <div>{engineer.title}</div>
                        <div className="mt-2">
                          <Button
                            onClick={() => {
                              setSelectedEngineers((prev) =>
                                prev.filter(
                                  (selectedEngineer) =>
                                    selectedEngineer.id !== engineer.id,
                                ),
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              ) : (
                <div>Your selected engineers will appear here...</div>
              )}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      variant="secondary"
                      disabled={selectedEngineers.length === 0}
                      onClick={() => {
                        setMessages((prev) => [
                          ...prev,
                          {
                            id: prev.length,
                            role: "user",
                            text: `${selectedEngineers
                              .map((engineer) => engineer.name)
                              .join(", ")}`,
                          },
                          {
                            id: prev.length + 1,
                            role: "bot",
                            text: "Great! Now please describe the project.",
                          },
                        ]);
                        setStep(2);
                      }}
                    >
                      Done
                    </Button>
                  </span>
                </TooltipTrigger>
                {selectedEngineers.length === 0 && (
                  <TooltipContent>
                    <p>Please select at least one engineer</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ) : (
        step !== 3 && (
          <div className="sticky bottom-0 w-full bg-[#343541] border-t border-[#40414f] px-4 py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex max-w-3xl mx-auto items-center gap-2"
            >
              <AutoResizingTextArea
                placeholder={
                  step === 2 ? "Describe your project..." : "Send a message..."
                }
                value={input}
                onChange={(value) => setInput(value)}
                onSubmit={(value) => {
                  setInput(value);
                  handleSend();
                }}
              />
              <Button type="submit" size="icon" variant="ghost">
                <CornerDownLeft className="w-5 h-5" />
              </Button>
            </form>
          </div>
        )
      )}

      {step === 3 && (
        <div className="sticky bottom-0 w-full bg-[#343541] border-t border-[#40414f] px-4 py-6 flex justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              setMessages([
                {
                  id: 0,
                  role: "bot",
                  text: "Hi! Let's start building your team. Please select the engineers you'd like to add.",
                },
              ]);
              setStep(1);
              setSelectedEngineers([]);
              setInput("");
            }}
          >
            Start Again
          </Button>
        </div>
      )}
    </div>
  );
}
