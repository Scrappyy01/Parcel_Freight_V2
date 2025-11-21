'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const PFConfirmInfo = dynamic(
  () => import('@/parcelfreights/confirmInfo/PF_SingleListing_Confirm_Info'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    ),
  }
);

export default function ConfirmInfoPage() {
  const router = useRouter();
  
  const handleSubmit = () => {
    // Navigate to payment page
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.indexOf('parcel-freight') + 1];
    router.push(`/parcel-freight/${id}/payment`);
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return <PFConfirmInfo onSubmitParcelFreightConfirmation={handleSubmit} onBack={handleBack} />;
}
