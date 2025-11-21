'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/contexts/UserContext';
import dynamic from 'next/dynamic';

const Sidenav = dynamic(() => import('@/backend/admin/Sidenav'), {
  ssr: false,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pf_user } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    if (pf_user && !pf_user?.user_roles?.admin) {
      router.push('/');
    }
  }, [pf_user, router]);

  // Show loading while checking auth
  if (!pf_user || !pf_user?.user_roles?.admin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidenav />
      <main className="flex-grow bg-gray-50 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
