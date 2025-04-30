import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { SlidesGenerationError } from "@/lib/api/models/types";
import { AlertTriangle, Info } from "lucide-react";

export function SlidesError({ error }: { error: SlidesGenerationError }) {
  if (!error) return null;

  return (
    <div className="mt-6 border  rounded-xl p-4 flex justify-between items-center gap-4 bg-red-100">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="w-5 h-5" />
        <p className="text-md">{error.message}</p>
      </div>

      {error.stack && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              aria-label="View stack trace"
              className="text-muted-foreground hover:text-foreground"
            >
              <Info className="w-4 h-4 stroke-[2.5] text-red-500" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] text-xs whitespace-pre-wrap">
            <strong className="block mb-2">Stack Trace</strong>
            <pre className="overflow-x-auto">{error.stack}</pre>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
