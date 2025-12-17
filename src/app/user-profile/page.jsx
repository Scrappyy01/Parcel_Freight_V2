'use client';

import { useContext, useState } from 'react';
import { UserContext } from '@/contexts/UserContext';
import Image from 'next/image';
import fedexLogo from '@/assets/fedex-express-6.svg';
import hunterExpress from '@/assets/hunterexpress.svg';
import Aramax_logo from '@/assets/Aramax_logo.svg';
import couriersPlease from '@/assets/Couriers Please.png';

export default function UserProfilePage() {
  const { pf_user } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  
  // Courier selection states
  const [couriers, setCouriers] = useState({
    fedex: false,
    couriersPlease: false,
    hunterExpress: false,
    aramax: false
  });

  const toggleCourier = (courier) => {
    setCouriers(prev => ({
      ...prev,
      [courier]: !prev[courier]
    }));
  };

  if (!pf_user || !pf_user.isAuthenticated) {
    return (
      <div className="w-full py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-md p-12">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Log In</h2>
            <p className="text-gray-600">You need to be logged in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = pf_user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <div className="w-full py-8 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-br from-[#132B43] to-[#1a3a52]"></div>
          
          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 mb-6">
              {/* Profile Picture */}
              <div className="relative mb-4 sm:mb-0">
                {pf_user?.profile_photo_path ? (
                  <>
                    <img
                      src={pf_user.profile_photo_path}
                      alt={pf_user?.name || 'User'}
                      className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-[#132B43] to-[#1a3a52] flex items-center justify-center" style={{ display: 'none' }}>
                      <span className="text-white text-5xl font-bold">{userInitial}</span>
                    </div>
                  </>
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-gradient-to-br from-[#132B43] to-[#1a3a52] flex items-center justify-center">
                    <span className="text-white text-5xl font-bold">{userInitial}</span>
                  </div>
                )}
              </div>
              
              {/* Name and Role */}
              <div className="sm:ml-6 text-center sm:text-left flex-grow">
                <h2 className="text-3xl font-bold text-gray-900">{pf_user?.name || 'User'}</h2>
                <p className="text-gray-600 text-lg capitalize">{pf_user?.role_name || 'Member'}</p>
                {pf_user?.custno && (
                  <p className="text-sm text-gray-500 mt-1">Customer ID: {pf_user.custno}</p>
                )}
              </div>
              
              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2.5 rounded-lg border-2 border-[#FF7D44] text-[#FF7D44] font-medium hover:bg-[#FF7D44] hover:text-white transition-all duration-200 mt-4 sm:mt-0 cursor-pointer"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

          {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-500">Total Bookings</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-500">Active Bookings</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-medium text-gray-500">Member Since</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
          </div>
        </div>

        {/* Courier Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 mb-6">
          <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
            <svg className="w-6 h-6 text-[#FF7D44] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900">Courier Selection</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FedEx */}
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF7D44] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img src={fedexLogo.src} alt="FedEx" className="w-14 h-14" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">FedEx</h4>
                  <p className="text-sm text-gray-500">Express shipping</p>
                </div>
              </div>
              <button
                onClick={() => toggleCourier('fedex')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:ring-offset-2 cursor-pointer ${
                  couriers.fedex ? 'bg-[#FF7D44]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    couriers.fedex ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Couriers Please */}
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF7D44] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12  rounded-lg flex items-center justify-center">
                    <img src={couriersPlease.src} alt="Couriers Please" className="w-11 h-8" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Couriers Please</h4>
                  <p className="text-sm text-gray-500">Reliable delivery</p>
                </div>
              </div>
              <button
                onClick={() => toggleCourier('couriersPlease')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:ring-offset-2 cursor-pointer ${
                  couriers.couriersPlease ? 'bg-[#FF7D44]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    couriers.couriersPlease ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Hunter Express */}
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF7D44] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img src={hunterExpress.src} alt="FedEx" className="w-12 h-12" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Hunter Express</h4>
                  <p className="text-sm text-gray-500">Fast & efficient</p>
                </div>
              </div>
              <button
                onClick={() => toggleCourier('hunterExpress')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:ring-offset-2 cursor-pointer ${
                  couriers.hunterExpress ? 'bg-[#FF7D44]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    couriers.hunterExpress ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Aramax */}
            <div className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#FF7D44] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img src={Aramax_logo.src} alt="FedEx" className="w-12 h-12" />

                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Aramax</h4>
                  <p className="text-sm text-gray-500">Premium service</p>
                </div>
              </div>
              <button
                onClick={() => toggleCourier('aramax')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF7D44] focus:ring-offset-2 cursor-pointer ${
                  couriers.aramax ? 'bg-[#FF7D44]' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    couriers.aramax ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-2">
              <svg className="w-6 h-6 text-blue-800 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                Select your preferred couriers for booking. You can enable multiple options to compare rates and delivery times.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
              <svg className="w-6 h-6 text-[#FF7D44] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Email Address</label>
                <div className="flex items-center text-gray-900">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span className="text-base">{pf_user?.email || 'Not provided'}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Phone Number</label>
                <div className="flex items-center text-gray-900">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-base">{pf_user?.phone_no || 'Not provided'}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Location</label>
                <div className="flex items-center text-gray-900">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-base">{pf_user?.location || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
              <svg className="w-6 h-6 text-[#FF7D44] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900">Company Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Company Name</label>
                <div className="flex items-center text-gray-900">
                  <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-base">{pf_user?.company_name || 'Not provided'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
              <svg className="w-6 h-6 text-[#FF7D44] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900">Address</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Street Address 1</label>
                <p className="text-gray-900 text-base">{pf_user?.address_1 || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Street Address 2</label>
                <p className="text-gray-900 text-base">{pf_user?.address_2 || '—'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">City</label>
                <p className="text-gray-900 text-base">{pf_user?.city || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">State</label>
                <p className="text-gray-900 text-base">{pf_user?.state || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">Postcode</label>
                <p className="text-gray-900 text-base">{pf_user?.postcode || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Account Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-2.5 bg-gradient-to-br from-[#132B43] to-[#1a3a52] text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200 cursor-pointer">
              Change Password
            </button>
            <button className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer">
              Update Preferences
            </button>
          </div>
        </div>        
      </div>
      

   
    </div>
  );
}