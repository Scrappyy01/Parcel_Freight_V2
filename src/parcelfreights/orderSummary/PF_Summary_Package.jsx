'use client';

const PF_Summary_Package = ({ freight_package, index }) => {
  return (
    <>
      <li>
        Item {index + 1}:{" "}
        {parseFloat(freight_package.weight * freight_package.quantity).toFixed(
          2
        )}
        kg, Dimensions: {freight_package.length}x{freight_package.width}x
        {freight_package.height} (LxWxH)
      </li>
    </>
  );
};

export default PF_Summary_Package;



