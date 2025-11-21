'use client';

import dynamic from 'next/dynamic';

const SettingsContent = dynamic(() => import('@/backend/admin/settings/Settings_Content.jsx'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading settings...</p>
      </div>
    </div>
  ),
});

export default function SettingsPage() {
  return <SettingsContent />;
}
