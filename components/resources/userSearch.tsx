"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckIcon, MinusIcon, PlusIcon, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getUsersData } from "@/lib/api/services/resource.service";
import { Resource } from "@/lib/api/models/types";

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [users, setUsers] = useState<Resource[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (searchQuery: string) => {
    if (searchQuery.length < 4) return;

    setLoading(true);

    const users = await getUsersData({
      searchQuery,
    });

    setUsers(users);
    setLoading(false);
  };

  // Debouncing logic: update debouncedSearchTerm after 500ms of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(timer); // Clean up timeout on each render
    };
  }, [searchTerm]);

  // When debouncedSearchTerm changes, call the API
  useEffect(() => {
    if (debouncedSearchTerm) {
      fetchUsers(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="flex flex-col">
      <div>
        {selectedUsers.length > 0 ? (
          <ul>
            {selectedUsers.map((user, i) => (
              <li key={i} className="flex justify-between items-center py-2">
                <span>
                  {user.name} ({user.title})
                </span>
                <Button
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.filter(
                        (selectedUser) => selectedUser.id !== user.id,
                      ),
                    );
                  }}
                  variant="outline"
                >
                  <MinusIcon strokeWidth={4} />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <PlusIcon strokeWidth={4} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="flex items-center justify-between w-full">
              <h4 className="font-medium leading-none">Search for users</h4>
              {loading && (
                <Star className="animate-spin text-gray-500" size={20} />
              )}
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Name</Label>
                <Input
                  id="name"
                  defaultValue=""
                  className="col-span-2 h-8"
                  spellCheck={false}
                  data-gramm={false}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          {users.length > 0 ? (
            <ul>
              {users.map((user, i) => (
                <li key={i} className="flex justify-between items-center py-2">
                  <span>
                    {user.name} ({user.title})
                  </span>
                  {/* has this user already been added? */}
                  {selectedUsers.some(
                    (selectedUser) => selectedUser.id === user.id,
                  ) ? (
                    <CheckIcon className="mr-2" color="green" strokeWidth={3} />
                  ) : (
                    <Button
                      onClick={() => {
                        console.log(user);
                        setSelectedUsers((prev) => [...prev, user]);
                      }}
                      variant="outline"
                    >
                      <PlusIcon strokeWidth={4} />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserSearch;
