'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const Payment = dynamic(
  () => import('@/parcelfreights/payments/Payment'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading payment...</p>
        </div>
      </div>
    ),
  }
);

export default function PaymentPage() {
  const router = useRouter();
  
  const handleSubmit = () => {
    // Payment completed - redirect to confirmation
    router.push('/parcel-freight/success');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleNext = () => {
    router.push('/parcel-freight/success');
  };
  
  return <Payment onSubmitPayment={handleSubmit} onBack={handleBack} onNext={handleNext} />;
}
