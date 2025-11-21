'use client';

const Summary_Address = ({ address }) => {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">From:</p>
        <h3 className="text-xl font-semibold text-[#132B43]">
          {address.company_name}
        </h3>
        <div className="space-y-1">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Contact:</span> {address.company_contact_name}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Email:</span> {address.company_email}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Phone:</span> {address.company_phone}
          </p>
        </div>
      </div>

      <div className="space-y-1 pt-2">
        <p className="text-sm font-medium text-gray-600">Address:</p>
        <p className="text-sm text-gray-700">{address.address1}</p>
        {address.address2 && (
          <p className="text-sm text-gray-700">{address.address2}</p>
        )}
        <p className="text-sm text-gray-700">
          {address?.suburb}, {address?.state} {address?.postcode}
        </p>
        <p className="text-sm text-gray-700">Australia</p>
      </div>
    </div>
  );
};

export default Summary_Address;


