import { TalentSelectionForm } from "@/components/talent/talentSelectionForm";
import { Center } from "@/components/ui/center";

export default async function SelectTalent() {
  return (
    <Center>
      <div className="w-[600px] p-6 bg-gray-900 border shadow-lg rounded-lg min-h-40 text-gray-100">
        <TalentSelectionForm />
      </div>
    </Center>
  );
}
