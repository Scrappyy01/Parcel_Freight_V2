'use client';

import dynamic from 'next/dynamic';

const UserContent = dynamic(() => import('@/backend/admin/users/User_Content.jsx'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading users...</p>
      </div>
    </div>
  ),
});

export default function UsersPage() {
  return <UserContent />;
}
