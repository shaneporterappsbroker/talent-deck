"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading" || !session?.user) return;

  return (
    <div className="absolute top-4 right-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 rounded-full cursor-pointer object-cover"
          >
            <Avatar className="w-12 h-12 bg-cover">
              {/* Ensuring width and height are the same */}
              <AvatarImage
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? ""}
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback className="text-black">
                {(session.user?.name ?? "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2">
          <div className="text-sm font-medium px-2 py-1">
            {session.user?.name}
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-100"
            onClick={async () =>
              await signOut({
                redirect: true,
                callbackUrl: "/",
              })
            }
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
