import { getData } from "@/lib/translators/kantata/translator";
import { ResourceCard } from "../ui/resourceCard";

export const List = async () => {
  const resources = await getData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-8">
      {resources.map((resource) => (
        <ResourceCard resource={resource} key={resource.id} />
      ))}
    </div>
  );
};
