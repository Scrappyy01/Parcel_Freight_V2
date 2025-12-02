'use client';

import loadlink from '@/assets/Loadlink-Logo.svg';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Footer Line One - Logo and Text */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <p className="text-gray-700 text-3xl font-light text-center sm:text-left">
            Parcel Freight Listings are powered by
          </p>
          <img
            src={loadlink.src}
            alt="Loadlink Australia"
            className="h-12 w-auto"
          />
        </div>

        {/* Disclaimer Text */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-gray-500 text-[8px] leading-relaxed text-center">
            All Quotes received by a Shipper are communications between the Carrier and the Shipper, as defined in the Loadlink Terms & Conditions.
            Loadlink accepts no responsibility or liability for the accuracy of the information provided by the Shipper or the Carrier.
            Acceptance of a Carrier's Quote by the Shipper does not form a binding agreement between the Shipper and the Carrier,
            such contractual nexus is to be formed between the Shipper and the Carrier directly.
            Loadlink is not a party to any agreement between the Shipper and the Carrier. All quotes are valid for 7 days.
          </p>
        </div>
      </div>
    </footer>
  );
}
