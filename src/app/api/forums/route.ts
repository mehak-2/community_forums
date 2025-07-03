import { NextRequest, NextResponse } from "next/server";
import { getAllForums, createForum } from "@/lib/db";
import { getOrCreatePrismaUser } from "@/lib/auth-utils";

export async function GET() {
  try {
    const forums = await getAllForums();
    return NextResponse.json(forums);
  } catch (error) {
    console.error("Error fetching forums:", error);
    return NextResponse.json(
      { error: "Failed to fetch forums" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const dbUser = await getOrCreatePrismaUser(request);
    const body = await request.json();

    const { title, description, tags } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const forum = await createForum({
      title,
      description,
      tags: tags || [],
      userId: dbUser.id,
    });

    return NextResponse.json(forum, { status: 201 });
  } catch (error) {
    console.error("Error creating forum:", error);

    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create forum" },
      { status: 500 }
    );
  }
}
