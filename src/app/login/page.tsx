"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signUp, signInWithGithub } from "@/lib/auth";
import { useUser } from "@/components/AuthProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();

  // Get redirect URL from query params (set by middleware)
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  useEffect(() => {
    if (user) {
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isSignUp) {
      // Registration
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      const { error } = await signUp(email, password);

      if (error) {
        setError(error.message);
      } else {
        setSuccess(
          "Registration successful! Please check your email to verify your account."
        );
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // Switch to sign-in mode after successful registration
        setTimeout(() => {
          setIsSignUp(false);
          setSuccess("");
        }, 3000);
      }
    } else {
      // Login
      const { error } = await signIn(email, password);

      if (error) {
        setError(error.message);
      } else {
        router.push(redirectTo);
      }
    }

    setLoading(false);
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    const { error } = await signInWithGithub();

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // Note: GitHub OAuth will handle redirect automatically
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setSuccess("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  if (user) return null;

  return (
    <div className='min-h-screen flex items-center justify-center bg-forum-light py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <div className='flex items-center justify-center mb-6'>
            <div className='w-12 h-12 bg-forum-primary rounded-xl flex items-center justify-center'>
              <svg
                className='w-7 h-7 text-forum-light'
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
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-forum-dark'>
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className='mt-2 text-center text-sm text-forum-primary'>
            {isSignUp ? "Join our community today" : "Sign in to continue"}
          </p>
          {redirectTo !== "/dashboard" && !isSignUp && (
            <p className='mt-2 text-center text-sm text-forum-primary'>
              Please sign in to access this page
            </p>
          )}
        </div>

        <div className='bg-white rounded-xl shadow-sm border border-forum-medium p-8'>
          <form className='space-y-6' onSubmit={handleEmailAuth}>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>
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
                    <p className='text-sm font-medium'>{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg
                      className='h-5 w-5 text-green-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm font-medium'>{success}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-forum-dark mb-2'
              >
                Email address
              </label>
              <input
                id='email'
                type='email'
                required
                className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-forum-medium placeholder-forum-primary text-forum-dark focus:outline-none focus:ring-2 focus:ring-forum-primary focus:border-forum-primary sm:text-sm'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-forum-dark mb-2'
              >
                Password
              </label>
              <input
                id='password'
                type='password'
                required
                className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-forum-medium placeholder-forum-primary text-forum-dark focus:outline-none focus:ring-2 focus:ring-forum-primary focus:border-forum-primary sm:text-sm'
                placeholder={
                  isSignUp
                    ? "Create a password (min 6 characters)"
                    : "Enter your password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {isSignUp && (
              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-forum-dark mb-2'
                >
                  Confirm Password
                </label>
                <input
                  id='confirmPassword'
                  type='password'
                  required
                  className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-forum-medium placeholder-forum-primary text-forum-dark focus:outline-none focus:ring-2 focus:ring-forum-primary focus:border-forum-primary sm:text-sm'
                  placeholder='Confirm your password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <div>
              <button
                type='submit'
                disabled={loading}
                className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-forum-light bg-forum-primary hover:bg-forum-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forum-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {loading ? (
                  <>
                    <svg
                      className='animate-spin -ml-1 mr-2 h-4 w-4 text-forum-light'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  <>
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
                        d={
                          isSignUp
                            ? "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            : "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        }
                      />
                    </svg>
                    {isSignUp ? "Create Account" : "Sign In"}
                  </>
                )}
              </button>
            </div>

            <div className='text-center'>
              <button
                type='button'
                onClick={toggleMode}
                className='text-forum-primary hover:text-forum-dark text-sm font-medium transition-colors'
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>

          <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-forum-medium' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-forum-primary'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6'>
              <button
                type='button'
                onClick={handleGithubLogin}
                disabled={loading}
                className='w-full inline-flex justify-center py-3 px-4 border border-forum-medium rounded-lg shadow-sm bg-white text-sm font-medium text-forum-dark hover:bg-forum-light disabled:opacity-50 transition-colors'
              >
                <svg
                  className='w-5 h-5 mr-2'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Sign {isSignUp ? "up" : "in"} with GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
