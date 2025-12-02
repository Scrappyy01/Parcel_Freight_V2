'use client';

import dynamic from 'next/dynamic';
import loadlink from '@/assets/Loadlink-Logo.svg';

const PFEcommerceList = dynamic(
  () => import('@/parcelfreights/management/PF_Ecommerce_List'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center" style={{ marginTop: '75px' }}>
          <img 
            src={loadlink.src} 
            alt="Loading..." 
            className="w-64 h-auto mb-4 animate-pulse mx-auto"
          />
          <p className="text-gray-600">Loading ecommerce bookings...</p>
          
          {/* Progress bar */}
          <div className="mt-8 w-64 mx-auto">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]"
                style={{ 
                  background: 'linear-gradient(90deg, transparent, #FF7D44, transparent)',
                  width: '50%'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  }
);

export default function EcommerceParcelFreightsPage() {
  return <PFEcommerceList />;
}
