'use client';

import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('@/backend/admin/dashboard/Dashboard_Content.jsx'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardContent />;
}
