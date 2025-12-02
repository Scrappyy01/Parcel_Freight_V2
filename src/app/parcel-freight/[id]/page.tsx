'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';
import loadlinkLogo from '@/assets/Loadlink-Logo.svg';

// Dynamically import to avoid SSR issues with localStorage
const PFSingleListingData = dynamic(
  () => import('@/parcelfreights/PF_SingleListing_Collection_Data'),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center min-h-[400px]" style={{ marginTop: '75px' }}>
        <img 
          src={loadlinkLogo.src} 
          alt="Loadlink" 
          className="w-64 animate-pulse mb-6"
        />
        <p className="text-gray-600 text-lg mb-4">Loading booking details...</p>
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent, #FF7D44, transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite'
            }}
          />
        </div>
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}</style>
      </div>
    ),
  }
);

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // The component will use the URL to get the ID internally
  return <PFSingleListingData />;
}
