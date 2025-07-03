interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    primary: "text-forum-primary",
    secondary: "text-forum-medium",
    white: "text-white",
  };

  return (
    <div
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    >
      <svg className='w-full h-full' fill='none' viewBox='0 0 24 24'>
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
        />
      </svg>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className='bg-white rounded-xl shadow-sm border border-forum-medium p-6 h-full animate-pulse'>
      <div className='flex flex-col h-full'>
        <div className='flex-1'>
          <div className='flex items-start justify-between mb-3'>
            <div className='h-6 bg-forum-medium rounded-lg w-3/4'></div>
            <div className='h-6 w-12 bg-forum-medium rounded-full'></div>
          </div>

          <div className='space-y-2 mb-4'>
            <div className='h-4 bg-forum-medium rounded w-full'></div>
            <div className='h-4 bg-forum-medium rounded w-5/6'></div>
            <div className='h-4 bg-forum-medium rounded w-2/3'></div>
          </div>

          <div className='flex flex-wrap gap-2 mb-4'>
            <div className='h-6 bg-forum-medium rounded-full w-16'></div>
            <div className='h-6 bg-forum-medium rounded-full w-20'></div>
            <div className='h-6 bg-forum-medium rounded-full w-14'></div>
          </div>
        </div>

        <div className='flex items-center justify-between pt-4 border-t border-forum-medium'>
          <div className='flex items-center space-x-2'>
            <div className='w-6 h-6 bg-forum-medium rounded-full'></div>
            <div className='h-4 bg-forum-medium rounded w-24'></div>
          </div>
          <div className='h-4 bg-forum-medium rounded w-16'></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingButton({
  children,
  loading = false,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-forum-light bg-forum-primary hover:bg-forum-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-forum-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size='sm' color='white' className='mr-2' />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function LoadingPage({ message = "Loading..." }: { message?: string }) {
  return (
    <div className='min-h-screen bg-forum-light flex flex-col items-center justify-center p-4'>
      <div className='bg-white rounded-xl shadow-sm border border-forum-medium p-8 max-w-sm w-full text-center'>
        <LoadingSpinner size='xl' className='mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-forum-dark mb-2'>
          {message}
        </h3>
        <p className='text-sm text-forum-primary'>
          Please wait while we load your content
        </p>
      </div>
    </div>
  );
}

export function LoadingOverlay({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <div className='bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center'>
        <LoadingSpinner size='xl' className='mx-auto mb-4' />
        <h3 className='text-lg font-semibold text-forum-dark mb-2'>
          {message}
        </h3>
        <p className='text-sm text-forum-primary'>Please wait...</p>
      </div>
    </div>
  );
}

export function LoadingText({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <LoadingSpinner size='sm' />
      <span className='text-forum-primary'>Loading...</span>
    </div>
  );
}

export function LoadingDots({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  };

  const delayClasses = ["animate-pulse", "animate-pulse", "animate-pulse"];

  return (
    <div className='flex items-center space-x-1'>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-forum-primary rounded-full ${delayClasses[i]}`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function LoadingBars({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-1 h-6",
    md: "w-2 h-8",
    lg: "w-3 h-12",
  };

  return (
    <div className='flex items-end space-x-1'>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`${sizeClasses[size]} bg-forum-primary rounded-sm animate-pulse`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "0.8s",
          }}
        />
      ))}
    </div>
  );
}

export function LoadingPulse({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className='bg-forum-medium rounded-lg h-full w-full'></div>
    </div>
  );
}

export function LoadingSkeletonText({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-forum-medium rounded animate-pulse ${
            i === lines - 1 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}
