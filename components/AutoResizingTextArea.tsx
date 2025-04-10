"use client";

import { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

type AutoResizingTextAreaProps = {
  placeholder?: string;
  value: string; // value as a prop to control external state
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
};

export const AutoResizingTextArea = ({
  placeholder,
  value,
  onChange,
  onSubmit,
}: AutoResizingTextAreaProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleAutoResize = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(value);
    }
  };

  useEffect(() => {
    handleAutoResize();
  }, [value]);

  return (
    <div className="relative w-full">
      <Textarea
        ref={textAreaRef}
        value={value} // Controlled value from the parent component
        onInput={handleInputChange}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} // Add onKeyDown for Enter key behavior
        className="resize-none overflow-hidden flex-grow rounded-md border border-[#40414f] bg-[#40414f] px-4 py-3 text-base placeholder-gray-400 text-white focus:outline-none"
        placeholder={placeholder}
        style={{ minHeight: "28px" }}
      />
    </div>
  );
};
