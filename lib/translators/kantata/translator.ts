import { definitions as Kantata } from "./types.gen";
import data from "../../../data/user-data.json";
import { Project, Resource } from "@/lib/types";

import { sleep } from "@/lib/utils";

// for now, let's just return some data from here:
export const getData = async (): Promise<Resource[]> => {
  // note that the data used in the JSON was returned from the Kantata API
  // https://api.mavenlink.com/api/v1/users?on_my_account=true&by_email_addresses=conor.fayle%40cts.co,shane.porter%40appsbroker.com&include=skills,skill_memberships,custom_field_values

  // first, get all the skills for a particular user,
  // augmented with a description for later filtering.
  const getSkills = (user: Kantata["User"]) => {
    return (user.skill_membership_ids ?? [])
      .map(
        (id) =>
          data.skill_memberships[id as keyof typeof data.skill_memberships],
      )
      .filter((skill) => skill !== undefined)
      .map((skill) => ({
        name: skill!.cached_skill_name,
        level: skill!.level,
        description:
          data.skills[
            data.skill_memberships[
              skill.id as keyof typeof data.skill_memberships
            ].skill_id as keyof typeof data.skills
          ].description,
      }));
  };

  const getProjects = (user: Kantata["User"]) => {
    // this is based on the assumption that project information is
    // stored in custom field pairs - each pair having a project client, and a
    // description of what was done, skills etc.
    const ids = user.custom_field_value_ids ?? [];

    const result: Record<string, Project> = {};

    ids.forEach((key) => {
      const entry =
        data.custom_field_values[key as keyof typeof data.custom_field_values];
      if (!entry) return; // Skip if key is not in dictionary

      // Extract number suffix
      const match = entry.custom_field_name.match(/(\d+)$/);
      const index = match ? parseInt(match[1], 10) : null;

      if (index !== null) {
        if (!result[index]) {
          result[index] = { client: "", description: "" };
        }

        if (entry.custom_field_name.includes("Client Project Name")) {
          result[index].client = entry.value.trim();
        } else if (
          entry.custom_field_name.includes("Client Project Skills Summary")
        ) {
          result[index].description = entry.value.trim();
        }
      }
    });

    return Object.values(result);
  };

  const func = () => {
    const retData = Object.values(data.users).map((user) => {
      const skillsData = getSkills(user);

      return {
        id: user.id,
        name: user.full_name,
        img: user.photo_path,
        title: user.headline,
        languages: skillsData
          .filter((skill) => skill.description === "Language")
          .map((skill) => skill.name),
        certifications: skillsData
          .filter((skill) => skill.description.includes("Certification"))
          .map((skill) => skill.name),
        // not the most robust way, but it's based on the source data let's
        // hope we don't have a skill with 'Certification' in the name
        skills: skillsData
          .filter(
            (skill) =>
              skill.description !== "Language" &&
              !skill.description.includes("Certification"),
          )
          .map(({ name, level }) => ({
            name,
            level,
          })),
        projects: getProjects(user),
      };
    });

    return retData;
  };

  return sleep(2000).then(() => func());
};
