'use client';

import { Fragment, useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/contexts/UserContext";

/**
 * The title banner with the background image.
 * @param {string} title - The title of the page's title banner.
 * @param {boolean} isDesktop - Bool for if user's device is desktop.
 * @returns {JSX} React component.
 */

type TitleBannerProps = {
  title: string;
  isDesktop: boolean;
};

const TitleBanner_PF = ({ title, isDesktop }: TitleBannerProps) => {
  const fontColor = isDesktop ? "text-white" : "text-black";
  const { pf_user, setPf_User } = useContext(UserContext);

  let feedbackText = null;
  if (pf_user == null || pf_user == "{}") {
    feedbackText = (
      <div>
        <div className="flex items-center">
          <span className={`${fontColor}`} style={{ marginRight: "5px" }}>
            You are not logged in
          </span>
        </div>
      </div>
    );
  } else {
    feedbackText = (
      <div>
        <div className="flex items-center">
          <img
            src={pf_user.profile_image}
            alt="profile-image"
            className="w-8 h-8 rounded-full shadow-sm"
          />
          <Link
            className="text-decoration-none"
            href="/parcel-freight/"
            style={{
              color: "#FFFFFF",
              fontWeight: "lighter",
              marginLeft: "5px",
            }}
          >
            {pf_user ? pf_user.name : "Guest"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="pf-table-title relative flex flex-col justify-center mb-2 xl:mb-2 p-1 pb-20 xl:pb-20">
        <div className="container mx-auto px-4">
          <div
            className="flex flex-col md:flex-row justify-between items-center gap-5 md:gap-5"
            style={{ marginTop: "70px" }}
          >
            <div>
              <h1 className={`text-5xl font-bold ${fontColor}`}>{title}</h1>
            </div>
            {feedbackText}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default TitleBanner_PF;
