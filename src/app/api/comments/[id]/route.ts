import { NextRequest, NextResponse } from "next/server";
import { deleteComment } from "@/lib/db";
import { getOrCreatePrismaUser } from "@/lib/auth-utils";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dbUser = await getOrCreatePrismaUser(request);

    await deleteComment(id, dbUser.id);

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);

    if (error instanceof Error) {
      if (error.message === "Authentication required") {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (error.message === "Comment not found") {
        return NextResponse.json(
          { error: "Comment not found" },
          { status: 404 }
        );
      }

      if (error.message.includes("Unauthorized")) {
        return NextResponse.json(
          { error: "Unauthorized: You can only delete your own comments" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
