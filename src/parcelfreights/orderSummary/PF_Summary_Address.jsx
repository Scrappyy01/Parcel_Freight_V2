'use client';

import { Card } from "@/components/ui/ui";

const PF_Summary_Address = ({ address }) => {
  return (
    <div className="w-full md:w-1/3">
      <Card variant="elevated">
        <Card.Header>{address.address_type}</Card.Header>
        <Card.Body>
          <strong>Name:</strong> {address.company_name}
          <br />
          <strong>Contact:</strong> {address.company_contact_name}
          <br />
          <strong>Email:</strong> {address.company_email}
          <br />
          <strong>Phone:</strong> {address.company_phone}
          <br />
          <strong>Address:</strong>
          <div>{address.address1}</div>
          {address.address2 ? <div>{address.address2}</div> : ""}
          <div>
            {address?.suburb}, &nbsp;
            {address?.state} &nbsp;
            {address?.postcode}, Australia
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PF_Summary_Address;



