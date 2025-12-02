'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import loadlink from '@/assets/Loadlink-Logo.svg';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to new booking page
    router.push('/parcel-freight');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center" style={{ marginTop: '75px' }}>
        <img 
          src={loadlink.src} 
          alt="Loading..." 
          className="w-64 h-auto mb-4 animate-pulse mx-auto"
        />
        <p className="text-gray-600">Redirecting to Parcel Freight...</p>
        
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
  );
}
