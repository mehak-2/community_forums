"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUser } from "@/components/AuthProvider";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-forum-light'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-6'>
            <Link
              href='/'
              className='text-forum-primary hover:text-forum-dark text-sm font-medium mb-4 transition-colors'
            >
              ← Back to forums
            </Link>
          </div>

          <div className='bg-white overflow-hidden shadow-md rounded-lg border border-forum-medium'>
            <div className='px-6 py-8'>
              <div className='text-center mb-8'>
                <h1 className='text-3xl font-bold text-forum-dark mb-4'>
                  Welcome to your dashboard!
                </h1>
                <p className='text-forum-primary'>
                  Manage your forums and account settings
                </p>
              </div>

              <div className='space-y-6'>
                <div className='bg-forum-light rounded-lg p-6 border border-forum-medium'>
                  <h2 className='text-xl font-semibold text-forum-dark mb-4'>
                    Account Information
                  </h2>
                  <div className='space-y-3 text-sm'>
                    <div className='flex justify-between'>
                      <span className='font-medium text-forum-dark'>
                        Email:
                      </span>
                      <span className='text-forum-primary'>{user?.email}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-forum-dark'>
                        User ID:
                      </span>
                      <span className='text-forum-primary font-mono text-xs'>
                        {user?.id}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-medium text-forum-dark'>
                        Last sign in:
                      </span>
                      <span className='text-forum-primary'>
                        {user?.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='bg-forum-light rounded-lg p-6 border border-forum-medium'>
                  <h2 className='text-xl font-semibold text-forum-dark mb-4'>
                    Quick Actions
                  </h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Link
                      href='/forums/new'
                      className='flex items-center justify-center px-6 py-4 bg-forum-primary text-forum-light rounded-lg hover:bg-forum-dark transition-colors group'
                    >
                      <svg
                        className='w-5 h-5 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                        />
                      </svg>
                      Create New Forum
                    </Link>

                    <Link
                      href='/'
                      className='flex items-center justify-center px-6 py-4 bg-white text-forum-primary border border-forum-medium rounded-lg hover:bg-forum-medium transition-colors'
                    >
                      <svg
                        className='w-5 h-5 mr-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                        />
                      </svg>
                      Browse Forums
                    </Link>
                  </div>
                </div>

                <div className='bg-forum-light rounded-lg p-6 border border-forum-medium'>
                  <h2 className='text-xl font-semibold text-forum-dark mb-4'>
                    Account Actions
                  </h2>
                  <button
                    onClick={handleSignOut}
                    className='flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors'
                  >
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                      />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
