'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CVBuilder from '@/components/cv-builder/cv-builder';
import { useAuth } from '@/contexts/auth-context';

export default function CVBuilderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  const cvId = searchParams?.get('id') || undefined;

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?redirect=/cv-builder');
    } else if (user?.id) {
      setUserId(user.id);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="loading-page">Loading...</div>;
  }

  if (!user) {
    return <div className="error-page">Please log in to access CV Builder</div>;
  }

  if (!userId) {
    return <div className="loading-page">Initializing...</div>;
  }

  return (
    <Suspense fallback={<div className="loading-page">Loading CV...</div>}>
      <CVBuilder cvId={cvId} userId={userId} />
    </Suspense>
  );
}
