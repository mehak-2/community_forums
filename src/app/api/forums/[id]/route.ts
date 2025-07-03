import { NextRequest, NextResponse } from "next/server";
import { getForumById, updateForum, deleteForum } from "@/lib/db";
import { getOrCreatePrismaUser } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const forum = await getForumById(id);

    if (!forum) {
      return NextResponse.json({ error: "Forum not found" }, { status: 404 });
    }

    return NextResponse.json(forum);
  } catch (error) {
    console.error("Error fetching forum:", error);
    return NextResponse.json(
      { error: "Failed to fetch forum" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbUser = await getOrCreatePrismaUser(request);
    const body = await request.json();

    const { title, description, tags } = body;

    const forum = await updateForum(
      id,
      {
        title,
        description,
        tags,
      },
      dbUser.id
    );

    return NextResponse.json(forum);
  } catch (error) {
    console.error("Error updating forum:", error);

    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (error.message === "Forum not found") {
        return NextResponse.json({ error: "Forum not found" }, { status: 404 });
      }

      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Unauthorized: You can only update your own forums" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update forum" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbUser = await getOrCreatePrismaUser(request);

    await deleteForum(id, dbUser.id);

    return NextResponse.json({ message: "Forum deleted successfully" });
  } catch (error) {
    console.error("Error deleting forum:", error);

    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (error.message === "Forum not found") {
        return NextResponse.json({ error: "Forum not found" }, { status: 404 });
      }

      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Unauthorized: You can only delete your own forums" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to delete forum" },
      { status: 500 }
    );
  }
}
