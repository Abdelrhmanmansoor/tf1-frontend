'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This page redirects to the integrated CV Builder at /jobs/cv-builder
 * The actual CV Builder implementation is at /app/jobs/cv-builder/page.tsx
 * which includes proper layout integration with navbar, footer, and platform styling
 */
export default function CVBuilderRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the integrated CV Builder
    router.replace('/jobs/cv-builder');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-4 text-gray-600">Redirecting to CV Builder...</p>
      </div>
    </div>
  );
}
