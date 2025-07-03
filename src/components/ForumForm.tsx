"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ForumFormProps {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    description: string;
    tags: string[];
  };
  onSubmit: (data: {
    title: string;
    description: string;
    tags: string[];
  }) => Promise<void>;
  loading?: boolean;
}

export function ForumForm({
  mode,
  initialData,
  onSubmit,
  loading = false,
}: ForumFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();

      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        tags,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='bg-white rounded-lg shadow-md border border-forum-medium p-6'>
        <h1 className='text-2xl font-bold text-forum-dark mb-6'>
          {mode === "create" ? "Create New Forum" : "Edit Forum"}
        </h1>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-forum-dark mb-2'
            >
              Title *
            </label>
            <input
              type='text'
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-forum-primary focus:border-forum-primary ${
                errors.title ? "border-red-500" : "border-forum-medium"
              }`}
              placeholder='Enter forum title...'
              maxLength={100}
            />
            {errors.title && (
              <p className='mt-1 text-sm text-red-600'>{errors.title}</p>
            )}
            <p className='mt-1 text-xs text-forum-primary'>
              {title.length}/100 characters
            </p>
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-forum-dark mb-2'
            >
              Description
            </label>
            <textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-forum-primary focus:border-forum-primary ${
                errors.description ? "border-red-500" : "border-forum-medium"
              }`}
              placeholder='Describe what this forum is about...'
              maxLength={500}
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-600'>{errors.description}</p>
            )}
            <p className='mt-1 text-xs text-forum-primary'>
              {description.length}/500 characters
            </p>
          </div>

          <div>
            <label
              htmlFor='tags'
              className='block text-sm font-medium text-forum-dark mb-2'
            >
              Tags
            </label>
            <input
              type='text'
              id='tags'
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className='w-full px-3 py-2 border border-forum-medium rounded-md focus:outline-none focus:ring-2 focus:ring-forum-primary focus:border-forum-primary'
              placeholder='Add tags (press Enter or comma to add)...'
              disabled={tags.length >= 5}
            />
            <p className='mt-1 text-xs text-forum-primary'>
              Press Enter or comma to add tags. Maximum 5 tags.
            </p>

            {tags.length > 0 && (
              <div className='mt-3 flex flex-wrap gap-2'>
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-forum-medium text-forum-dark'
                  >
                    {tag}
                    <button
                      type='button'
                      onClick={() => handleRemoveTag(tag)}
                      className='ml-2 text-forum-primary hover:text-forum-dark transition-colors'
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className='flex items-center justify-between pt-6 border-t border-forum-medium'>
            <button
              type='button'
              onClick={() => router.back()}
              className='px-4 py-2 text-sm font-medium text-forum-primary border border-forum-medium rounded-md hover:bg-forum-medium transition-colors'
            >
              Cancel
            </button>

            <button
              type='submit'
              disabled={loading}
              className='px-6 py-2 text-sm font-medium text-forum-light bg-forum-primary rounded-md hover:bg-forum-dark focus:outline-none focus:ring-2 focus:ring-forum-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Forum"
                : "Update Forum"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
