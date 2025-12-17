'use client';

import { FC, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserContext } from "@/contexts/UserContext";
import { ApplicationMode } from "@/contexts/ApplicationMode";

type PFParcelFreightListProps = {
  isDark?: boolean;
};

const PF_Parcel_Freight_List: FC<PFParcelFreightListProps> = ({
  isDark = false,
}) => {
  const pathname = usePathname();
  const { pf_user, setPf_User } = useContext(UserContext);
  const { applicationMode, setApplicationMode } = useContext(ApplicationMode);
  const [isUser, setIsUser] = useState(false);
  const [isTrade, setIsTrade] = useState(false);
  const [isEcommerce, setIsEcommerce] = useState(false);

  useEffect(() => {
    setIsUser(pf_user?.user_roles?.user);
    setIsTrade(pf_user?.user_roles?.trade);
    setIsEcommerce(pf_user?.user_roles?.ecommerce);
  }, [pf_user]);

  return (
    <>
      {isUser && (
        <Link
          className={`${!isDark ? "ll-navlink " : ""}text-decoration-none fw-semibold relative pb-1 whitespace-nowrap ${
            pathname.startsWith('/my-parcel-freights') ? 'text-[#FF7D44]' : ''
          }`}
          href="/my-parcel-freights/"
          onClick={() => setApplicationMode("Parcel Freight")}
        >
          Parcel Freight User View
          {pathname.startsWith('/my-parcel-freights') && (
            <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-[#FF7D44] rounded-full"></span>
          )}
        </Link>
      )}
      {isTrade && (
        <Link
          className={`${!isDark ? "ll-navlink " : ""}text-decoration-none fw-semibold relative pb-1 whitespace-nowrap ${
            pathname.startsWith('/trade-parcel-freights') ? 'text-[#FF7D44]' : ''
          }`}
          href="/trade-parcel-freights/"
          onClick={() => setApplicationMode("Trade Account")}
        >
          Trade Parcel Freight
          {pathname.startsWith('/trade-parcel-freights') && (
            <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-[#FF7D44] rounded-full"></span>
          )}
        </Link>
      )}
      {isEcommerce && (
        <Link
          className={`${!isDark ? "ll-navlink " : ""}text-decoration-none fw-semibold relative pb-1 whitespace-nowrap ${
            pathname.startsWith('/ecommerce-parcel-freights') ? 'text-[#FF7D44]' : ''
          }`}
          href="/ecommerce-parcel-freights/"
          onClick={() => setApplicationMode("Ecommerce")}
        >
          Ecommerce Parcel Freight
          {pathname.startsWith('/ecommerce-parcel-freights') && (
            <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-[#FF7D44] rounded-full"></span>
          )}
        </Link>
      )}
    </>
  );
};

export default PF_Parcel_Freight_List;
