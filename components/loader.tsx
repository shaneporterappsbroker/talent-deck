import { Star } from "lucide-react";
import { Center } from "./ui/center";

export const Loader = ({
  text,
  spinnerSize,
}: {
  text?: string;
  spinnerSize?: number;
}) => (
  <Center>
    <div className="flex flex-col items-center justify-center">
      {text && (
        <h1 className="text-2xl font-bold text-gray-300 mb-8">{text}</h1>
      )}
      <Star className="animate-spin text-gray-500" size={spinnerSize ?? 80} />
    </div>
  </Center>
);
