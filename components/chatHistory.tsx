import { Message } from "@/lib/api/models/types";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";

export const ChatHistory = ({
  messages,
  isBusy,
}: {
  messages: Message[];
  isBusy: boolean;
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl mx-auto w-full">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
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
                  <div className="max-w-xl text-md text-gray-200 whitespace-pre-line">
                    <Typewriter
                      words={[msg.text || ""]}
                      loop={1}
                      typeSpeed={15}
                      deleteSpeed={0}
                      delaySpeed={1000}
                    />
                  </div>
                )
              ) : (
                <div className="px-3 py-1 rounded-xl bg-[#FFE7D0] text-gray-800 max-w-xl text-md whitespace-pre-line">
                  {msg.text}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {isBusy && (
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500"
            >
              <Star className="animate-spin" size={25} />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
