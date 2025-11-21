'use client';

import { useState, useEffect, Fragment } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Sidenav = () => {
  const [selectedItem, setSelectedItem] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Determine the selected item based on the current path
    if (pathname.includes("dashboard")) {
      setSelectedItem("dashboard");
    } else if (pathname.includes("users")) {
      setSelectedItem("users");
    } else if (pathname.includes("expresses")) {
      setSelectedItem("expresses");
    } else if (pathname.includes("settings")) {
      setSelectedItem("settings");
    } else if (pathname.includes("freights")) {
      setSelectedItem("freights");
    } else {
      setSelectedItem(""); // Reset if no match
    }
  }, [pathname]);

  return (
    <Fragment>
      <div className="w-60 flex-shrink-0 bg-white border-r border-gray-200 hidden md:block">
        <div className="flex mt-4 p-3">
          <div className="flex-grow p-2 flex flex-col justify-between">
            <nav>
              {/* <Link href="/admin/dashboard/" className="block">
                <div className={`flex items-center px-4 py-2 rounded ${selectedItem === "dashboard" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span>Dashboard</span>
                </div>
              </Link> */}
              <Link href="/admin/all-parcel-freights/" className="block">
                <div className={`flex items-center px-4 py-2 rounded ${selectedItem === "freights" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Parcel Freights</span>
                </div>
              </Link>
              <Link href="/admin/users/" className="block">
                <div className={`flex items-center px-4 py-2 rounded ${selectedItem === "users" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span>Users</span>
                </div>
              </Link>
              <Link href="/admin/expresses/" className="block">
                <div className={`flex items-center px-4 py-2 rounded ${selectedItem === "expresses" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <span>Expresses</span>
                </div>
              </Link>
              <Link href="/admin/settings/" className="block">
                <div className={`flex items-center px-4 py-2 rounded ${selectedItem === "settings" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>Settings</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidenav;

