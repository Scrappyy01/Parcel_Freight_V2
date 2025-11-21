'use client';

import { Fragment, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { UserContext } from "@/contexts/UserContext";
import loadlink from "@/assets/ll-logo.svg";
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
  
  const [showModal, setShowModal] = useState({
    pfbutton: false,
    pfform: false,
  });
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  
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

          <div className="flex items-center justify-between flex-grow">
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
                href="https://app.loadlink.com.au/listings/"
              >
                General Freight
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
              <div className="flex gap-3">
                <Link
                  href="/trade-application"
                  className="btn btn-outline-primary"
                  style={{ lineHeight: "35px" }}
                >
                  Trade Account Application
                </Link>
                <Link
                  className="btn btn-primary wgl-button"
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setApplicationMode("Parcel Freight");
                    logout();
                    router.push("/");
                  }}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <PFPopupComponent show={showModal} handleClose={handleCloseModal} handleUpload={handleUpload} />
    </Fragment>
  );
};
  
export default PF_Navigation;
