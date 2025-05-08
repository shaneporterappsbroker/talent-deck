export const promptStepsConfig: Record<
  number,
  { botPrompt: string; placeholder?: string }
> = {
  1: {
    botPrompt:
      "Hi! Let's start building your team. Please select the engineers you'd like to add.",
    placeholder: "Your selected engineers will appear here...",
  },
  2: {
    botPrompt: "What's the name of the client?",
    placeholder: "Enter the client name...",
  },
  3: {
    botPrompt:
      "Great! Now please describe the client - what's their industry and what type of project is it?",
    placeholder: "Describe the client...",
  },
  4: {
    botPrompt:
      "What are the key technologies and tools that will be used on the project?",
    placeholder: "List the technologies and tools...",
  },
  5: {
    botPrompt:
      "Anything else we should know about the project? For example, the project timeline, budget, or any specific requirements?",
    placeholder: "Describe the project details...",
  },
  6: {
    botPrompt:
      "I'm crafting your CV slides now - aligning experience, skills and design magic. Almost there...",
  },
};

export const PROMPTS_COUNT = Object.keys(promptStepsConfig).length;
