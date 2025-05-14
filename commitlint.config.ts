import type { UserConfig } from "@commitlint/types";

const Configuration: UserConfig = {
  extends: ["@commitlint/config-conventional"],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w+)\((NO-JIRA|ISE-\d+)\):\s(.+)$/,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "style",
        "refactor",
        "test",
        "ci",
        "build",
      ],
    ],
    // Scope is now validated by the header regex, so we can omit this:
    "scope-enum": [0],
  },
};

export default Configuration;
