'use client';

import { useContext, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserContext } from '@/contexts/UserContext';
import { ApplicationMode } from '@/contexts/ApplicationMode';
import PF_Navigation from '@/components/Navigations/PF_Navigation';
import TitleBanner from '@/components/PF_TitleBanner';
import Footer from '@/components/Footer/Footer';

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { pf_user, setPf_User } = useContext(UserContext);
  const { setApplicationMode } = useContext(ApplicationMode);
  const [pf_title, setPf_Title] = useState('Parcel Freight');

  const handlePF_Logout = () => {
    localStorage.removeItem('pf_user');
    localStorage.removeItem('authToken');
    setPf_User({ user: null, isAuthenticated: false });
    router.push('/');
  };

  const handlePF_Login = () => {
    // Login handled by modal
  };

  // Determine if we should use full-width layout (list/management pages)
  // or contained layout (booking/creation pages)
  const isListOrManagementPage = 
    pathname.includes('/ecommerce-parcel-freights') ||
    pathname.includes('/trade-parcel-freights') ||
    pathname.includes('/my-parcel-freights') ||
    pathname.includes('/admin') ||
    pathname.includes('/parcel-freight/unquoted-jobs') ||
    pathname.includes('/parcel-freight/job-management');

  const isNewBookingPage = pathname.includes('/parcel-freight') && !isListOrManagementPage;

  return (
    <>
      <PF_Navigation onLogout={handlePF_Logout} onLogin={handlePF_Login} />
      
      {isNewBookingPage ? (
        // Constrained layout with gradient for new booking page
        <main className="w-full px-4 py-8 min-h-screen pt-[95px]" style={{ backgroundColor: '#f0f2f5' }}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      ) : (
        // Full-width background for list/management pages
        <main className="w-full px-4 py-8 min-h-screen pt-[95px]" style={{ backgroundColor: '#f0f2f5' }}>
          {children}
        </main>
      )}
      
      <Footer />
    </>
  );
}
