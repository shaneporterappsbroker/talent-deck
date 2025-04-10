import { SparklesCore } from "@/components/ui/sparkles";
import Image from "next/image";
import { metadata } from "./layout";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { routes } from "@/lib/routes";
import { SignInButton } from "@/components/signInButton";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session?.user && session?.kantataAccessToken) {
    redirect(routes.hub);
  }

  return (
    <div className="h-screen relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.1}
          maxSize={2}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#fff"
        />
      </div>
      <Image
        src="/qodea-logo.svg"
        alt="Qodea Logo"
        width="100"
        height="40"
        className="z-20"
      />
      <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20 font-weight-700">
        Welcome to {metadata.title as string}
      </h1>
      <h2 className="lg:text-3xl md:text-5xl text-xl text-white mt-2">
        {metadata.description}
      </h2>

      <SignInButton />
    </div>
  );
}
