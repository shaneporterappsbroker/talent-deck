"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PlusIcon, CheckIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getUsersData } from "@/lib/api/services/resource.service";
import { EngineerResource } from "@/lib/api/models/types";
import { promptStepsConfig } from "@/lib/config/promptSteps";

export const EngineersSelect = ({
  onSelectionComplete,
}: {
  onSelectionComplete: (selectedEngineers: EngineerResource[]) => void;
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchResultEngineers, setSearchResultEngineers] = useState<
    EngineerResource[]
  >([]);
  const [selectedEngineers, setSelectedEngineers] = useState<
    EngineerResource[]
  >([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer); // Clean up timeout on each render
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchEngineers(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const fetchEngineers = async (searchQuery: string) => {
    if (searchQuery.length < 4) return;

    setIsLoading(true);

    const engineers = await getUsersData({
      searchQuery,
      by: "name",
    });

    setSearchResultEngineers(engineers);
    setIsLoading(false);
  };

  return (
    <div className="flex max-w-3xl mx-auto items-center gap-2 w-full">
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="secondary">
            <PlusIcon strokeWidth={4} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white text-black">
          <div className="space-y-4">
            <div className="font-semibold">Select Engineers</div>
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />

            <div className="space-y-2">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="animate-spin text-gray-500" />
                </div>
              ) : (
                searchResultEngineers.map((engineer) => {
                  const isSelected = selectedEngineers
                    .map((resource) => resource.id)
                    .includes(engineer.id);
                  return (
                    <div
                      key={engineer.id}
                      onClick={() => {
                        if (
                          !selectedEngineers
                            .map((resource) => resource.id)
                            .includes(engineer.id)
                        ) {
                          setSelectedEngineers((prev) => [...prev, engineer]);
                        }
                      }}
                      className="flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={engineer.img}
                          alt={engineer.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{engineer.name}</div>
                          <div className="text-sm text-gray-500">
                            {engineer.title}
                          </div>
                        </div>
                      </div>
                      {isSelected ? (
                        <CheckIcon className="text-green-500" />
                      ) : (
                        <PlusIcon />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-grow flex items-center gap-2">
        {selectedEngineers.length > 0 ? (
          <div className="flex flex-wrap gap-2 ml-2">
            {selectedEngineers.map((engineer) => (
              <Popover key={engineer.id}>
                <PopoverTrigger>
                  <div className="flex items-center bg-blue-600 text-white py-1 px-4 rounded-full cursor-pointer">
                    <span>{engineer.name}</span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="bg-white text-black p-4">
                  <div className="font-semibold">{engineer.name}</div>
                  <div>{engineer.title}</div>
                  <div className="mt-2">
                    <Button
                      onClick={() => {
                        setSelectedEngineers((prev) =>
                          prev.filter(
                            (selectedEngineer) =>
                              selectedEngineer.id !== engineer.id,
                          ),
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        ) : (
          <div>{promptStepsConfig[1].placeholder}</div>
        )}
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant="secondary"
                disabled={selectedEngineers.length === 0}
                onClick={() => onSelectionComplete(selectedEngineers)}
              >
                Done
              </Button>
            </span>
          </TooltipTrigger>
          {selectedEngineers.length === 0 && (
            <TooltipContent>
              <p>Please select at least one engineer</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
