import { definitions as Kantata } from "@/lib/api/kantata/kantata.types";
import { Project, Resource } from "@/lib/api/models/types";

import { GetUsersResponseData } from "./kantata.client";

const LOW_LEVEL_SKILL = 1;

// for now, let's just return some data from here:
export const translateUserData = (data: GetUsersResponseData): Resource[] => {
  if (data === undefined) {
    return [];
  }

  const getSkills = (user: Kantata["User"]) => {
    return (
      user.skill_membership_ids?.map((id) => {
        const skill = (data.skill_memberships ?? {})[
          id as keyof typeof data.skill_memberships
        ];
        const skillData = (data.skills ?? {})[
          skill?.skill_id as keyof typeof data.skills
        ];

        return {
          name: skill?.cached_skill_name,
          level: skill?.level,
          description: skillData?.description,
        };
      }) ?? []
    );
  };

  const getProjects = (user: Kantata["User"]) => {
    // this is based on the assumption that project information is
    // stored in custom field pairs - each pair having a project client, and a
    // description of what was done, skills etc.
    const ids = user.custom_field_value_ids ?? [];

    const result: Record<string, Project> = {};

    ids.forEach((key) => {
      const entry = (data.custom_field_values ?? {})[
        key as keyof typeof data.custom_field_values
      ];
      if (!entry) return; // Skip if key is not in dictionary

      // Extract number suffix
      const match = entry.custom_field_name?.match(/(\d+)$/);
      const index = match ? parseInt(match[1], 10) : null;

      if (index !== null) {
        if (!result[index]) {
          result[index] = { client: "", description: "" };
        }

        if (entry.custom_field_name?.includes("Client Project Name")) {
          result[index].client = (entry.value ?? "").trim();
        } else if (
          entry.custom_field_name?.includes("Client Project Skills Summary") ??
          false
        ) {
          result[index].description = (entry.value ?? "").trim();
        }
      }
    });

    return Object.values(result);
  };

  const retData = Object.entries(data.users ?? {}).map(([id, user]) => {
    const skillsData = getSkills(user);

    return {
      id,
      name: user.full_name ?? "",
      email: user.email_address ?? "",
      img: user.photo_path ?? "",
      title: user.headline ?? "",
      languages: skillsData
        .filter((skill) => skill.description === "Language")
        .map((skill) => skill.name ?? ""),
      certifications: skillsData
        .filter((skill) => skill.description?.includes("Certification"))
        .map((skill) => skill.name ?? ""),
      // not the most robust way, but it's based on the source data let's
      // hope we don't have a skill with 'Certification' in the name
      skills: skillsData
        .filter(
          (skill) =>
            skill.description !== "Language" &&
            !(skill.description?.includes("Certification") ?? false) &&
            (skill.level ?? 0) > LOW_LEVEL_SKILL,
        )
        .map((skill) => skill.name ?? ""),
      projects: getProjects(user),
    };
  });

  return retData;
};
