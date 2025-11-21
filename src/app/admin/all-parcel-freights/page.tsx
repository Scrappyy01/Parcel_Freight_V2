'use client';

import dynamic from 'next/dynamic';

const PFAllList = dynamic(() => import('@/backend/admin/parcelFreightLists/PF_All_List.jsx'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading all bookings...</p>
      </div>
    </div>
  ),
});

export default function AllParcelFreightsPage() {
  return <PFAllList />;
}
