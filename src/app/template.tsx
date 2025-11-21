'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/contexts/UserContext';
import { ApplicationMode } from '@/contexts/ApplicationMode';
import PF_Navigation from '@/components/Navigations/PF_Navigation';
import TitleBanner from '@/components/PF_TitleBanner';

export default function Template({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

  return (
    <>
      <PF_Navigation onLogout={handlePF_Logout} onLogin={handlePF_Login} />
      <TitleBanner title={pf_title} isDesktop={true} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </>
  );
}
