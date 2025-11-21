'use client';

const Summary_Package = ({ freight_package }) => {
  return (
    <div className="p-6 space-y-2">
      <p className="text-sm text-gray-700">
        <span className="font-medium text-[#132B43]">Quantity:</span> {freight_package.quantity}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium text-[#132B43]">Length:</span> {freight_package.length} cm
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium text-[#132B43]">Width:</span> {freight_package.width} cm
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium text-[#132B43]">Height:</span> {freight_package.height} cm
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-medium text-[#132B43]">Weight:</span> {freight_package.weight} kg
      </p>
    </div>
  );
};

export default Summary_Package;


