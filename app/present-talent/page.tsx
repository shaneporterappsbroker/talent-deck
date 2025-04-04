import { List } from "@/components/talent/list";

export default async function PresentTalent() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* <div className="w-[600px] p-6 bg-gray-900 border shadow-lg rounded-lg min-h-40 text-gray-100"> */}
      <div>
        <List />
      </div>
    </div>
  );
}
