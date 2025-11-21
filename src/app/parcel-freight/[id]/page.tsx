'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with localStorage
const PFSingleListingData = dynamic(
  () => import('@/parcelfreights/PF_SingleListing_Collection_Data'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    ),
  }
);

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // The component will use the URL to get the ID internally
  return <PFSingleListingData />;
}
