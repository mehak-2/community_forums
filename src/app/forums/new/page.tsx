"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/AuthProvider";
import { createForum } from "@/lib/api";
import { ForumForm } from "@/components/ForumForm";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function NewForumPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    tags: string[];
  }) => {
    try {
      setLoading(true);
      setError(null);

      const forum = await createForum(data);

      // Redirect to the newly created forum
      router.push(`/forums/${forum.id}`);
    } catch (err) {
      console.error("Error creating forum:", err);
      setError(err instanceof Error ? err.message : "Failed to create forum");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-forum-light'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-6'>
            <button
              onClick={() => router.push("/")}
              className='text-forum-primary hover:text-forum-dark text-sm font-medium mb-4 transition-colors'
            >
              ← Back to forums
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
                    Error creating forum
                  </h3>
                  <p className='text-sm text-red-700 mt-1'>{error}</p>
                </div>
              </div>
            </div>
          )}

          <ForumForm mode='create' onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
