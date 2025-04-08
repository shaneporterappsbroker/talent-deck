import { Star } from "lucide-react";
import { Center } from "./ui/center";

export const Loader = () => (
  <Center>
    <div className="flex flex-col items-center justify-center">
      <Star className="animate-spin text-gray-500" size={80} />
    </div>
  </Center>
);
