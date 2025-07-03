import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ForumCardProps {
  forum: {
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
  };
  layout?: "grid" | "list";
}

export function ForumCard({ forum, layout = "grid" }: ForumCardProps) {
  const timeAgo = formatDistanceToNow(new Date(forum.createdAt), {
    addSuffix: true,
  });

  if (layout === "list") {
    return (
      <Link href={`/forums/${forum.id}`} className='block group'>
        <div className='bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-forum-medium hover:border-forum-primary group-hover:transform group-hover:-translate-y-0.5'>
          <div className='flex flex-col sm:flex-row sm:items-start gap-4'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between mb-2'>
                <h3 className='text-xl font-semibold text-forum-dark group-hover:text-forum-primary transition-colors truncate pr-4'>
                  {forum.title}
                </h3>
                <div className='flex items-center space-x-4 text-sm text-forum-primary flex-shrink-0'>
                  <span className='flex items-center'>
                    <svg
                      className='w-4 h-4 mr-1'
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
                    {forum._count.comments}
                  </span>
                </div>
              </div>

              {forum.description && (
                <p className='text-forum-primary text-sm leading-relaxed mb-3 line-clamp-2'>
                  {forum.description}
                </p>
              )}

              <div className='flex flex-wrap items-center gap-3'>
                {forum.tags.length > 0 && (
                  <div className='flex flex-wrap gap-1.5'>
                    {forum.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forum-medium text-forum-dark'
                      >
                        {tag}
                      </span>
                    ))}
                    {forum.tags.length > 3 && (
                      <span className='text-xs text-forum-primary'>
                        +{forum.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className='flex items-center text-xs text-forum-primary space-x-3 ml-auto'>
                  <span className='flex items-center'>
                    <svg
                      className='w-3 h-3 mr-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                    {forum.user.name || forum.user.email.split("@")[0]}
                  </span>
                  <span className='hidden sm:flex items-center'>
                    <svg
                      className='w-3 h-3 mr-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                      />
                    </svg>
                    {timeAgo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid layout (default)
  return (
    <Link href={`/forums/${forum.id}`} className='block group h-full'>
      <div className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 h-full border border-forum-medium hover:border-forum-primary group-hover:transform group-hover:-translate-y-1'>
        <div className='flex flex-col h-full'>
          <div className='flex-1'>
            <div className='flex items-start justify-between mb-3'>
              <h3 className='text-lg font-semibold text-forum-dark group-hover:text-forum-primary transition-colors line-clamp-2 pr-2'>
                {forum.title}
              </h3>
              <div className='flex items-center text-sm text-forum-primary bg-forum-light px-2 py-1 rounded-full flex-shrink-0'>
                <svg
                  className='w-4 h-4 mr-1'
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
                {forum._count.comments}
              </div>
            </div>

            {forum.description && (
              <p className='text-forum-primary text-sm leading-relaxed mb-4 line-clamp-3'>
                {forum.description}
              </p>
            )}

            {forum.tags.length > 0 && (
              <div className='flex flex-wrap gap-1.5 mb-4'>
                {forum.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-forum-medium text-forum-dark hover:bg-opacity-80 transition-colors'
                  >
                    #{tag}
                  </span>
                ))}
                {forum.tags.length > 3 && (
                  <span className='text-xs text-forum-primary font-medium'>
                    +{forum.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className='flex items-center justify-between text-xs text-forum-primary pt-4 border-t border-forum-medium'>
            <div className='flex items-center'>
              <div className='w-6 h-6 bg-forum-medium rounded-full flex items-center justify-center mr-2'>
                <svg
                  className='w-3 h-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              </div>
              <span className='font-medium truncate'>
                {forum.user.name || forum.user.email.split("@")[0]}
              </span>
            </div>

            <span className='flex items-center text-forum-primary'>
              <svg
                className='w-3 h-3 mr-1'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              {timeAgo}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
