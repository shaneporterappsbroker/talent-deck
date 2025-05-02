export const promptStepsConfig: Record<number, [string, string?]> = {
  1: [
    "Hi! Let's start building your team. Please select the engineers you'd like to add.",
    "Your selected engineers will appear here...",
  ],
  2: [
    "Great! Now please describe the client - what's their industry and what type of project is it?",
    "Describe the client...",
  ],
  3: [
    "What are the key technologies and tools that will be used on the project?",
    "List the technologies and tools...",
  ],
  4: [
    "Anything else we should know about the project? For example, the project timeline, budget, or any specific requirements?",
    "Describe the project details...",
  ],
  5: [
    "I'm crafting your CV slides now - aligning experience, skills and design magic. Almost there...",
  ],
};

export const PROMPTS_COUNT = Object.keys(promptStepsConfig).length;
export const BOT_PROMPT = 0;
export const PLACEHOLDER = 1;
