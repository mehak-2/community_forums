import { NextRequest, NextResponse } from "next/server";
import { getCommentsByForumId, addComment } from "@/lib/db";
import { getOrCreatePrismaUser } from "@/lib/auth-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await getCommentsByForumId(id);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbUser = await getOrCreatePrismaUser(request);
    const body = await request.json();

    const { content } = body;

    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const comment = await addComment(id, dbUser.id, content.trim());

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);

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
    }

    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
