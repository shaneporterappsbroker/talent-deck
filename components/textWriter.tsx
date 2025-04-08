"use client";

import { Typewriter } from "react-simple-typewriter";

export type TextWriterProps = {
  words: string[];
};

export const TextWriter = ({ words }: TextWriterProps) => (
  <Typewriter
    words={words}
    loop={1}
    typeSpeed={45}
    onLoopDone={() => console.log("Done typing")}
  />
);
