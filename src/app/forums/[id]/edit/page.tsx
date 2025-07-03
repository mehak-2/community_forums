"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/components/AuthProvider";
import { getForumById, updateForum } from "@/lib/api";
import { ForumForm } from "@/components/ForumForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ForumData {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

export default function EditForumPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [forum, setForum] = useState<ForumData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    async function fetchForum() {
      try {
        setLoading(true);
        setError(null);

        const data = await getForumById(params.id as string);
        setForum(data);

        // Check if current user is the owner
        if (user && data.user.email !== user.email) {
          setAccessDenied(true);
        }
      } catch (err) {
        console.error("Error fetching forum:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch forum");
      } finally {
        setLoading(false);
      }
    }

    if (params.id && user) {
      fetchForum();
    }
  }, [params.id, user]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    if (!forum) return;

    try {
      setSubmitting(true);
      setError(null);

      const updatedForum = await updateForum(forum.id, data);

      // Redirect to the updated forum
      router.push(`/forums/${forum.id}`);
    } catch (err) {
      console.error("Error updating forum:", err);
      setError(err instanceof Error ? err.message : "Failed to update forum");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className='flex items-center justify-center min-h-screen bg-forum-light'>
          <LoadingSpinner size='lg' />
        </div>
      </ProtectedRoute>
    );
  }

  if (error && !forum) {
    return (
      <ProtectedRoute>
        <div className='min-h-screen bg-forum-light flex items-center justify-center'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-forum-dark mb-4'>{error}</h2>
            <button
              onClick={() => router.push("/")}
              className='bg-forum-primary text-forum-light px-4 py-2 rounded-md hover:bg-forum-dark transition-colors'
            >
              Go back to home
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (accessDenied) {
    return (
      <ProtectedRoute>
        <div className='min-h-screen bg-forum-light flex items-center justify-center'>
          <div className='text-center'>
            <div className='mb-4'>
              <svg
                className='mx-auto h-12 w-12 text-red-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 48 48'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m0 0v2m0-2h2m-2 0H10m15 7a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-forum-dark mb-4'>
              Access Denied
            </h2>
            <p className='text-forum-primary mb-6'>
              You can only edit forums that you created.
            </p>
            <div className='space-x-4'>
              <button
                onClick={() => router.push(`/forums/${params.id}`)}
                className='bg-forum-primary text-forum-light px-4 py-2 rounded-md hover:bg-forum-dark transition-colors'
              >
                View Forum
              </button>
              <button
                onClick={() => router.push("/")}
                className='text-forum-primary border border-forum-medium px-4 py-2 rounded-md hover:bg-forum-medium transition-colors'
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-forum-light'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-6'>
            <button
              onClick={() => router.push(`/forums/${params.id}`)}
              className='text-forum-primary hover:text-forum-dark text-sm font-medium mb-4 transition-colors'
            >
              ← Back to forum
            </button>
          </div>

          {error && (
            <div className='mb-6 bg-red-50 border border-red-200 rounded-md p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5 text-red-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>
                    Error updating forum
                  </h3>
                  <p className='text-sm text-red-700 mt-1'>{error}</p>
                </div>
              </div>
            </div>
          )}

          {forum && (
            <ForumForm
              mode='edit'
              initialData={{
                title: forum.title,
                description: forum.description || "",
                tags: forum.tags,
              }}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
