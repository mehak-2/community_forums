"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/components/AuthProvider";
import { signOut } from "@/lib/auth";
import { getAllForums } from "@/lib/api";
import { ForumCard } from "@/components/ForumCard";
import { LoadingCard, LoadingSpinner } from "@/components/LoadingSpinner";

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

type ViewMode = "grid" | "list";

export default function Home() {
  const { user, loading: userLoading } = useUser();
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchForums() {
      try {
        setLoading(true);
        const data = await getAllForums();
        setForums(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch forums");
      } finally {
        setLoading(false);
      }
    }

    fetchForums();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  if (userLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-forum-light'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-forum-light'>
      <div className='bg-white shadow-sm border-b border-forum-medium sticky top-0 z-40 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center'>
              <Link href='/' className='flex items-center space-x-2'>
                <div className='w-8 h-8 bg-forum-primary rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-5 h-5 text-forum-light'
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
                </div>
                <h1 className='text-xl font-bold text-forum-dark hidden sm:block'>
                  Forum Community
                </h1>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className='hidden md:flex items-center space-x-4'>
              {user ? (
                <>
                  <Link
                    href='/dashboard'
                    className='text-forum-primary hover:text-forum-dark px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                  >
                    Dashboard
                  </Link>
                  <Link
                    href='/forums/new'
                    className='bg-forum-primary text-forum-light px-4 py-2 rounded-lg text-sm font-medium hover:bg-forum-dark transition-colors flex items-center'
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
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      />
                    </svg>
                    New Forum
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className='text-forum-primary hover:text-forum-dark px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href='/login'
                  className='bg-forum-primary text-forum-light px-4 py-2 rounded-lg text-sm font-medium hover:bg-forum-dark transition-colors'
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className='md:hidden'>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className='text-forum-primary hover:text-forum-dark p-2 rounded-lg transition-colors'
                aria-label='Toggle mobile menu'
              >
                {mobileMenuOpen ? (
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M6 18L18 6M6 6l12 12'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-6 h-6'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className='md:hidden border-t border-forum-medium py-4'>
              <div className='flex flex-col space-y-3'>
                {user ? (
                  <>
                    <Link
                      href='/dashboard'
                      onClick={closeMobileMenu}
                      className='text-forum-primary hover:text-forum-dark px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center'
                    >
                      <svg
                        className='w-4 h-4 mr-3'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
                        />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      href='/forums/new'
                      onClick={closeMobileMenu}
                      className='bg-forum-primary text-forum-light px-3 py-2 rounded-lg text-sm font-medium hover:bg-forum-dark transition-colors flex items-center'
                    >
                      <svg
                        className='w-4 h-4 mr-3'
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
                      New Forum
                    </Link>
                    <div className='border-t border-forum-medium pt-3 mt-3'>
                      <div className='px-3 py-2 text-xs font-medium text-forum-primary uppercase tracking-wider'>
                        Account
                      </div>
                      <div className='px-3 py-1 text-sm text-forum-dark'>
                        {user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className='w-full text-left text-red-600 hover:text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center'
                      >
                        <svg
                          className='w-4 h-4 mr-3'
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
                        Sign Out
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    href='/login'
                    onClick={closeMobileMenu}
                    className='bg-forum-primary text-forum-light px-3 py-2 rounded-lg text-sm font-medium hover:bg-forum-dark transition-colors flex items-center justify-center'
                  >
                    <svg
                      className='w-4 h-4 mr-3'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                      />
                    </svg>
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
            <div>
              <h2 className='text-3xl font-bold text-forum-dark mb-2'>
                Latest Discussions
              </h2>
              <p className='text-forum-primary'>
                Discover and join conversations in our community
              </p>
            </div>

            <div className='flex items-center space-x-2 bg-white rounded-lg p-1 border border-forum-medium'>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "grid"
                    ? "bg-forum-primary text-forum-light"
                    : "text-forum-primary hover:bg-forum-light"
                }`}
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
                    d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
                  />
                </svg>
                <span className='hidden sm:inline'>Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-forum-primary text-forum-light"
                    : "text-forum-primary hover:bg-forum-light"
                }`}
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
                    d='M4 6h16M4 10h16M4 14h16M4 18h16'
                  />
                </svg>
                <span className='hidden sm:inline'>List</span>
              </button>
            </div>
          </div>
        </div>

        {!loading && forums.length > 0 && (
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8'>
            <div className='bg-white rounded-xl p-4 border border-forum-medium'>
              <div className='text-2xl font-bold text-forum-dark'>
                {forums.length}
              </div>
              <div className='text-sm text-forum-primary'>Forums</div>
            </div>
            <div className='bg-white rounded-xl p-4 border border-forum-medium'>
              <div className='text-2xl font-bold text-forum-dark'>
                {forums.reduce((acc, forum) => acc + forum._count.comments, 0)}
              </div>
              <div className='text-sm text-forum-primary'>Comments</div>
            </div>
            <div className='bg-white rounded-xl p-4 border border-forum-medium'>
              <div className='text-2xl font-bold text-forum-dark'>
                {new Set(forums.map((f) => f.user.id)).size}
              </div>
              <div className='text-sm text-forum-primary'>Contributors</div>
            </div>
            <div className='bg-white rounded-xl p-4 border border-forum-medium'>
              <div className='text-2xl font-bold text-forum-dark'>
                {new Set(forums.flatMap((f) => f.tags)).size}
              </div>
              <div className='text-sm text-forum-primary'>Tags</div>
            </div>
          </div>
        )}

        {error && (
          <div className='mb-6 bg-red-50 border border-red-200 rounded-xl p-4'>
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
                  Error loading forums
                </h3>
                <p className='text-sm text-red-700 mt-1'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : forums.length === 0 ? (
          <div className='text-center py-16'>
            <div className='bg-white rounded-xl p-8 border border-forum-medium max-w-md mx-auto'>
              <svg
                className='mx-auto h-16 w-16 text-forum-primary mb-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 48 48'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                />
              </svg>
              <h3 className='text-xl font-semibold text-forum-dark mb-2'>
                No forums yet
              </h3>
              <p className='text-forum-primary mb-6'>
                Be the first to start a discussion and help build our community!
              </p>
              {user && (
                <Link
                  href='/forums/new'
                  className='inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-forum-light bg-forum-primary hover:bg-forum-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forum-primary transition-colors'
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
                  Create First Forum
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {forums.map((forum) => (
              <ForumCard key={forum.id} forum={forum} layout={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
