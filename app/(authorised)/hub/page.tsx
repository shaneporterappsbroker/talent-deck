import UserSearch from "@/components/resources/userSearch";
import { TextWriter } from "@/components/textWriter";
import { Center } from "@/components/ui/center";

export default async function SelectTalent() {
  // const res = await getUsersData();

  return (
    <>
      <Center>
        <UserSearch />

        <div className="w-[600px] p-6 bg-gray-900 border shadow-lg rounded-lg min-h-40 text-gray-100">
          {/* <TalentSelectionForm /> */}
          <TextWriter
            words={[
              "Hey there! I am your AI assistant. I can help you find the right talent for your project. Just let me know what you need!",
            ]}
          />
        </div>
      </Center>
    </>
  );
}
