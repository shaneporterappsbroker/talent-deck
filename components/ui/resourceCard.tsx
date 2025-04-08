import { Resource } from "@/lib/api/models/types";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";

export const ResourceCard = ({ resource }: { resource: Resource }) => {
  const { name, img, title, skills, languages, certifications, projects } =
    resource;

  const keySkills = skills.filter((s) => s.level == 5);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-top bg-white shadow-md rounded-2xl p-4 mb-4 gap-4 w-full">
      {/* Avatar */}
      <div className="flex-shrink-0 pt-1">
        <Avatar>
          <AvatarImage src={img} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
      </div>

      {/* Main Info */}
      <div className="">
        <h3 className="text-lg font-semibold text-gray-700">{name}</h3>
        <p className="text-sm text-gray-500">{title}</p>
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          {/* Languages */}
          {languages.length > 0 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-xl">
              🌐 {languages.join(", ")}
            </span>
          )}

          {/* Certifications */}
          {certifications.map((cert, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-2 py-0.5 rounded-xl"
            >
              🎓 {cert}
            </span>
          ))}

          <div className="flex flex-wrap">
            {projects.map((project, index) => (
              <span
                key={index}
                className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-xl mb-1 mr-2 whitespace-nowrap"
              >
                {project.client}
              </span>
            ))}
          </div>
        </div>
        {/* Key Skills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {keySkills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 text-sm px-2 py-0.5 rounded-xl"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
