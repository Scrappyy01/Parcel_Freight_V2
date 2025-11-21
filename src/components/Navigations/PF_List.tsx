'use client';

import { FC, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { UserContext } from "@/contexts/UserContext";
import { ApplicationMode } from "@/contexts/ApplicationMode";

type PFParcelFreightListProps = {
  isDark?: boolean;
};

const PF_Parcel_Freight_List: FC<PFParcelFreightListProps> = ({
  isDark = false,
}) => {
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
          className={`${!isDark ? "ll-navlink " : ""}text-decoration-none fw-semibold`}
          href="/my-parcel-freights/"
          onClick={() => setApplicationMode("Parcel Freight")}
        >
          Parcel Freight User View
        </Link>
      )}
      {isTrade && (
        <Link
          className={`${!isDark ? "ll-navlink " : ""}text-decoration-none fw-semibold`}
          href="/trade-parcel-freights/"
          onClick={() => setApplicationMode("Trade Account")}
        >
          Trade Parcel Freight
        </Link>
      )}
      {isEcommerce && (
        <Link
          className={`${!isDark ? "ll-navlink " : ""}text-decoration-none fw-semibold`}
          href="/ecommerce-parcel-freights/"
          onClick={() => setApplicationMode("Ecommerce")}
        >
          Ecommerce Parcel Freight
        </Link>
      )}
    </>
  );
};

export default PF_Parcel_Freight_List;
