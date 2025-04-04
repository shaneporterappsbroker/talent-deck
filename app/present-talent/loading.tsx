import { Center } from "@/components/ui/center";
import { Star } from "lucide-react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <Center>
      <div className="flex flex-col items-center justify-center">
        <Star className="animate-spin text-gray-500" size={80} />
      </div>
    </Center>
  );
}
