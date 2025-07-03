"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@/components/AuthProvider";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  getForumById,
  getCommentsByForumId,
  addComment,
  deleteComment,
  deleteForum,
} from "@/lib/api";

interface Forum {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
  _count: {
    comments: number;
  };
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export default function ForumDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [forum, setForum] = useState<Forum | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchForumAndComments(params.id as string);
    }
  }, [params.id]);

  const fetchForumAndComments = async (forumId: string) => {
    try {
      setLoading(true);
      const [forumData, commentsData] = await Promise.all([
        getForumById(forumId),
        getCommentsByForumId(forumId),
      ]);
      setForum(forumData);
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load forum");
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentContent.trim()) return;

    try {
      setSubmitting(true);
      const newComment = await addComment(
        params.id as string,
        commentContent.trim()
      );
      setComments([...(comments || []), newComment]);
      setCommentContent("");

      if (forum) {
        setForum({
          ...forum,
          _count: { comments: (forum._count?.comments || 0) + 1 },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user) return;

    try {
      await deleteComment(commentId);
      setComments((comments || []).filter((c) => c.id !== commentId));

      if (forum) {
        setForum({
          ...forum,
          _count: { comments: Math.max((forum._count?.comments || 0) - 1, 0) },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete comment");
    }
  };

  const handleDeleteForum = async () => {
    if (!user || !forum) return;

    try {
      setDeleting(true);
      await deleteForum(forum.id);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete forum");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-forum-light">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-forum-light flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 border border-forum-medium max-w-md mx-auto">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-forum-dark mb-2">
              Error Loading Forum
            </h3>
            <p className="text-forum-primary mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-forum-light bg-forum-primary hover:bg-forum-dark transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Forums
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="min-h-screen bg-forum-light flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 border border-forum-medium max-w-md mx-auto">
          <div className="text-center">
            <svg
              className="mx-auto h-16 w-16 text-forum-primary mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-forum-dark mb-2">
              Forum Not Found
            </h3>
            <p className="text-forum-primary mb-6">
              The forum you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-forum-light bg-forum-primary hover:bg-forum-dark transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Forums
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forum-light">
      <div className="bg-white shadow-sm border-b border-forum-medium sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center text-forum-primary hover:text-forum-dark transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="font-medium hidden sm:inline">Forums</span>
              </Link>
              <span className="text-forum-primary hidden sm:inline">/</span>
              <h1 className="text-lg font-semibold text-forum-dark truncate max-w-md">
                {forum.title}
              </h1>
            </div>

            {user && user.email === forum.user.email && (
              <div className="flex items-center space-x-2">
                <Link
                  href={`/forums/${forum.id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-forum-medium text-sm font-medium rounded-lg text-forum-primary hover:bg-forum-light transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span className="hidden sm:inline">Edit</span>
                </Link>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 hover:bg-red-50 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-forum-medium p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-forum-dark mb-4">
                {forum.title}
              </h1>

              {forum.description && (
                <div className="prose prose-sm max-w-none mb-6">
                  <p className="text-forum-primary text-base leading-relaxed">
                    {forum.description}
                  </p>
                </div>
              )}

              {forum.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {forum.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-forum-medium text-forum-dark"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <div className="flex items-center text-sm text-forum-primary bg-forum-light px-3 py-2 rounded-lg">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {forum._count?.comments || 0}{" "}
                {(forum._count?.comments || 0) === 1 ? "reply" : "replies"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-forum-medium">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-forum-medium rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-forum-dark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-forum-dark">
                  {forum.user.name || forum.user.email.split("@")[0]}
                </div>
                <div className="text-xs text-forum-primary">
                  Started{" "}
                  {formatDistanceToNow(new Date(forum.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-forum-dark">
              Discussion ({comments?.length || 0})
            </h2>
          </div>

          {user ? (
            <div className="bg-white rounded-xl shadow-sm border border-forum-medium p-6">
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium text-forum-dark mb-2"
                  >
                    Join the discussion
                  </label>
                  <textarea
                    id="comment"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full px-4 py-3 border border-forum-medium rounded-lg focus:ring-2 focus:ring-forum-primary focus:border-forum-primary resize-none"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-forum-primary">
                    {commentContent.length}/500 characters
                  </div>
                  <button
                    type="submit"
                    disabled={submitting || !commentContent.trim()}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-forum-light bg-forum-primary hover:bg-forum-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forum-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-forum-light"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Posting...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                        Post Reply
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-forum-light rounded-xl border border-forum-medium p-6 text-center">
              <p className="text-forum-primary mb-4">
                Sign in to join the discussion
              </p>
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-forum-light bg-forum-primary hover:bg-forum-dark transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {!comments || comments.length === 0 ? (
              <div className="bg-white rounded-xl border border-forum-medium p-8 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-forum-primary mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-forum-dark mb-2">
                  No comments yet
                </h3>
                <p className="text-forum-primary">
                  Be the first to share your thoughts on this topic!
                </p>
              </div>
            ) : (
              (comments || []).map((comment, index) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-xl shadow-sm border border-forum-medium p-6 hover:border-forum-primary transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-forum-medium rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-forum-dark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-forum-dark">
                            {comment.user.name ||
                              comment.user.email.split("@")[0]}
                          </h4>
                          <span className="text-xs text-forum-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-forum-primary">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          {user && user.email === comment.user.email && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="prose prose-sm max-w-none">
                        <p className="text-forum-primary whitespace-pre-wrap text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-forum-dark">
                  Delete Forum
                </h3>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-forum-primary">
                Are you sure you want to delete this forum? This action cannot
                be undone and will also delete all comments.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 text-sm font-medium text-forum-primary border border-forum-medium rounded-lg hover:bg-forum-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteForum}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deleting ? "Deleting..." : "Delete Forum"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
