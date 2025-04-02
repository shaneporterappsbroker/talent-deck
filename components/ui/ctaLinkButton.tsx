import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./button";

function CtaLinkButton({
  className,
  href,
}: {
  className?: string;
  href: string;
}) {
  return (
    <Link
      className={cn(
        buttonVariants({ className, size: "lg" }),
        "hover:bg-amber-800 hover:text-white cursor:pointer z-20 hover:border-amber-800",
      )}
      href={href}
    >
      Get Started!
    </Link>
  );
}

export { CtaLinkButton };
