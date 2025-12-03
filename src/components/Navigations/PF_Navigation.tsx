'use client';

import { Fragment, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { UserContext } from "@/contexts/UserContext";
import loadlink from "@/assets/Loadlink-Logo.svg";
import PFList from "./PF_List";
import { ApplicationMode } from "@/contexts/ApplicationMode";

// Dynamically import the modal to avoid SSR issues with localStorage/window
const PFPopupComponent = dynamic(() => import("@/parcelfreights/auth/PF_Popup_Component"), {
  ssr: false,
});

/**
 * Navigation menu for desktop views.
 * @returns {JSX} React component.
 */
const PF_Navigation = ({ onLogin, onLogout }: { onLogin: () => void; onLogout: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [showModal, setShowModal] = useState({
    pfbutton: false,
    pfform: false,
  });
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Ensure component only renders on client after mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setApplicationMode("Parcel Freight");
    setShowModal({ pfbutton: true, pfform: false });
  };
  
  const handleCloseModal = () => {
    setShowModal({ pfbutton: false, pfform: false });
    router.push("/parcel-freight/"); // Navigate to the default Parcel Freight route
  };
  
  const handleUpload = (data: any) => {
    // Handle upload logic here
    console.log('Upload data:', data);
  };
  
  const { applicationMode, setApplicationMode } = useContext(ApplicationMode);
  const { pf_user, setPf_User } = useContext(UserContext);

  const logout = () => {
    onLogout();
  };

  // Bool to determine if current page is a single listing page (/listings/:id/)
  const isSingleListingPage = /\/listings\/[0-9]{4}\/?/.test(pathname);
  const isSingleTruckPage = /\/trucks\/[0-9]{4}\/?/.test(pathname);
  
  // Href for the nav login button
  let loginBtnHref = `/login/`;
  let dashboard = null;
  
  if (isSingleListingPage) {
    loginBtnHref = `/login/?redirect=${pathname.split("/")[1]}-${pathname.split("/")[2]}/`;
  } else if (isSingleTruckPage) {
    loginBtnHref = `/login/?redirect=${pathname.split("/")[1]}-${pathname.split("/")[2]}/`;
  }
  
  if (pf_user != null && pf_user?.user_roles?.admin) {
    dashboard = (
      <div className="relative group">
        <button
          className="ll-navlink text-decoration-none fw-semibold px-3 py-2 hover:bg-gray-100 rounded"
          onMouseEnter={() => setShowAdminDropdown(true)}
          onMouseLeave={() => setShowAdminDropdown(false)}
        >
          Admin Tasks
        </button>
        {showAdminDropdown && (
          <div
            className="absolute left-0 mt-0 w-64 bg-white rounded-md shadow-lg z-50"
            onMouseEnter={() => setShowAdminDropdown(true)}
            onMouseLeave={() => setShowAdminDropdown(false)}
          >
            <div className="py-1">
              <Link
                className="ll-navlink text-decoration-none fw-semibold block px-4 py-2 hover:bg-gray-100"
                href="/parcel-freight/unquoted-jobs/"
              >
                Job Management
              </Link>
              <Link
                className="ll-navlink text-decoration-none fw-semibold block px-4 py-2 hover:bg-gray-100"
                href="/parcel-freight/job-management/addresses"
              >
                Jobs Awaiting Addresses
              </Link>
              <Link
                className="ll-navlink text-decoration-none fw-semibold block px-4 py-2 hover:bg-gray-100"
                href="/parcel-freight/job-management/payments"
              >
                Jobs Awaiting Payment
              </Link>
              <Link
                className="ll-navlink text-decoration-none fw-semibold block px-4 py-2 hover:bg-gray-100"
                href="/parcel-freight/user-management/"
              >
                User Management
              </Link>
              <hr className="my-1" />
              <Link
                className="ll-navlink text-decoration-none fw-semibold block px-4 py-2 hover:bg-gray-100"
                href="/parcel-freight/new-user/"
              >
                New User Example
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (pf_user != null && pf_user.role_name === "creator") {
    dashboard = (
      <div className="relative group">
        <button
          className="ll-navlink text-decoration-none fw-semibold px-3 py-2 hover:bg-gray-100 rounded"
          onMouseEnter={() => setShowAdminDropdown(true)}
          onMouseLeave={() => setShowAdminDropdown(false)}
        >
          Admin Tasks
        </button>
        {showAdminDropdown && (
          <div
            className="absolute left-0 mt-0 w-64 bg-white rounded-md shadow-lg z-50"
            onMouseEnter={() => setShowAdminDropdown(true)}
            onMouseLeave={() => setShowAdminDropdown(false)}
          >
            <div className="py-1">
              <Link
                className="ll-navlink text-decoration-none fw-semibold block px-4 py-2 hover:bg-gray-100"
                href="/parcel-freight/unquoted-jobs/"
              >
                Job Management
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white shadow h-[75px] z-10">
        <div className="container mx-auto flex items-center justify-between px-4 h-full">
          <a href="https://www.loadlink.com.au/">
            <img
              src={loadlink.src}
              width="200"
              height="50"
              className="inline-block align-top"
              alt="loadlink"
              style={{ marginTop: "-5px" }}
            />
          </a>
          <div className="flex-grow" />
          <div className="flex gap-3">
            <button className="btn btn-primary wgl-button">Login</button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <Fragment>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow h-[75px] z-10">
        <div className="container mx-auto flex items-center justify-between px-4 h-full">
          <a href="https://www.loadlink.com.au/">
            <img
              src={loadlink.src}
              width="200"
              height="50"
              className="inline-block align-top"
              alt="loadlink"
              style={{ marginTop: "-5px" }}
            />
          </a>

          {/* Hamburger menu button - visible on mobile */}
          <button
            className="lg:hidden flex flex-col gap-1 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>

          {/* Desktop menu - hidden on mobile */}
          <div className="hidden lg:flex items-center justify-between flex-grow">
            <div className="mx-3 flex gap-4 items-center">
              <Link
                className="ll-navlink text-decoration-none fw-semibold"
                href="/parcel-freight"
                onClick={() => setApplicationMode("Parcel Freight")}
              >
                New Booking 
              </Link>

              <a
                className="ll-navlink text-decoration-none fw-semibold"
                href=""
              >
                Loadlink Connect
              </a>

              {pf_user != null && <PFList />}
              
              {dashboard}
            </div>

            {pf_user != null && pf_user?.user_roles?.admin && (
              <Fragment>
                <Link
                  className="ll-navlink text-decoration-none fw-semibold"
                  href="/admin/all-parcel-freights/"
                  onClick={() => setApplicationMode("Parcel Freight")}
                >
                  Admin
                </Link>
              </Fragment>
            )}

            {!pf_user || !pf_user?.isAuthenticated ? (
              <div className="flex gap-3">
                <Link
                  className="btn btn-primary wgl-button"
                  href="/"
                  onClick={handleOpenModal}
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex gap-3 items-center">
                <Link
                  href="/trade-application"
                  className="px-4 py-4 rounded-lg border-2 text-center font-medium transition-all duration-200 hover:shadow-lg"
                  style={{ 
                    borderColor: '#FF7D44',
                    color: '#FF7D44',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FF7D44';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#FF7D44';
                  }}
                >
                  Trade Account Application
                </Link>
                
                {/* User Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-gray-200"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                  >
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-[#FF7D44] to-[#ff9f66] text-white text-sm font-bold shadow-sm">
                      {pf_user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-gray-900 text-sm leading-tight">{pf_user?.name || 'User'}</span>
                      <span className="text-xs text-gray-500">View profile</span>
                    </div>
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ml-1 ${showUserDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fadeIn">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FF7D44] to-[#ff9f66] text-white text-lg font-bold shadow-md">
                            {pf_user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{pf_user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{pf_user?.email || ''}</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/user-profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-orange-50 hover:text-[#FF7D44] transition-all cursor-pointer group"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-orange-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">My Profile</p>
                            <p className="text-xs text-gray-500">Account settings</p>
                          </div>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#FF7D44]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left cursor-pointer group"
                          onClick={(e) => {
                            e.preventDefault();
                            setApplicationMode("Parcel Freight");
                            setShowUserDropdown(false);
                            logout();
                            router.push("/");
                          }}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">Sign Out</p>
                            <p className="text-xs text-gray-500">Logout from account</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu - slides down when open */}
        <div className={`lg:hidden absolute top-[75px] left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
            <Link
              className="ll-navlink text-decoration-none fw-semibold py-2 px-3 hover:bg-gray-100 rounded"
              href="/parcel-freight"
              onClick={() => {
                setApplicationMode("Parcel Freight");
                setIsMobileMenuOpen(false);
              }}
            >
              New Booking
            </Link>

            <a
              className="ll-navlink text-decoration-none fw-semibold py-2 px-3 hover:bg-gray-100 rounded"
              href=""
            >
              Loadlink Connect
            </a>

            {pf_user != null && (
              <div className="border-t pt-3">
                <PFList />
              </div>
            )}
            
            {dashboard && (
              <div className="border-t pt-3">
                {dashboard}
              </div>
            )}

            {pf_user != null && pf_user?.user_roles?.admin && (
              <Link
                className="ll-navlink text-decoration-none fw-semibold py-2 px-3 hover:bg-gray-100 rounded border-t pt-3"
                href="/admin/all-parcel-freights/"
                onClick={() => {
                  setApplicationMode("Parcel Freight");
                  setIsMobileMenuOpen(false);
                }}
              >
                Admin
              </Link>
            )}

            <div className="border-t pt-3 flex flex-col gap-2">
              {!pf_user || !pf_user?.isAuthenticated ? (
                <Link
                  className="btn btn-primary wgl-button w-full text-center"
                  href="/"
                  onClick={(e) => {
                    handleOpenModal(e);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Login
                </Link>
              ) : (
                <Fragment>
                  {/* User Info Card */}
                  <div className="px-4 py-3 bg-gradient-to-br from-[#132B43] to-[#1a3a52] text-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-base font-semibold">
                        {pf_user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{pf_user?.name || 'User'}</p>
                        <p className="text-xs opacity-90">{pf_user?.email || ''}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Link
                    href="/user-profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded transition-colors cursor-pointer border border-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">User Profile</span>
                  </Link>
                  
                  <Link
                    href="/trade-application"
                    className="px-4 py-2.5 rounded-lg border-2 text-center font-medium transition-all duration-200 hover:shadow-lg w-full"
                    style={{ 
                      borderColor: '#FF7D44',
                      color: '#FF7D44',
                      backgroundColor: 'transparent',
                      display: 'block'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Trade Account Application
                  </Link>
                  
                  <button
                    className="flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded transition-colors w-full border border-red-200 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setApplicationMode("Parcel Freight");
                      logout();
                      setIsMobileMenuOpen(false);
                      router.push("/");
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </nav>
      <PFPopupComponent show={showModal} handleClose={handleCloseModal} handleUpload={handleUpload} />
    </Fragment>
  );
};
  
export default PF_Navigation;