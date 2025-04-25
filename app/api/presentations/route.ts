import { getUsersData } from "@/lib/api/services/resource.service";
import { authOptions } from "@/lib/auth/options";
import { generateSlides } from "@/lib/google/workspace/workspace.client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type RequestBody = {
  emails: string | string[];
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { emails }: RequestBody = body;

    const developers = await getUsersData({
      searchQuery: emails,
      token: session?.kantataAccessToken,
      by: "email",
    });

    // TEMP:
    const modifiedDevs = developers.map((dev) => ({
      ...dev,
      projects: dev.projects.slice(0, 4),
      skills: dev.skills.slice(0, 12),
      // certifications: dev.certifications.slice(0, 2),
      certifications: ["Professional Cloud Developer"],
      professionalBackground:
        "Seasoned Full Stack Developer with 25 years of experience delivering scalable, high-performance solutions across the entire software lifecycle.",
      strapline: "From concept to cloud. Done right.",
    }));

    const ret = await generateSlides(session?.accessToken, modifiedDevs);
    //////////////////////////////////////////////////////////////////////

    return NextResponse.json(ret);
  } catch (error) {
    console.error("❌ Error in POST /api/presentations:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
