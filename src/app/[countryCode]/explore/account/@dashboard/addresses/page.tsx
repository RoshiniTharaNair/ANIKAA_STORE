// [countryCode]/addresses/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";

import AddressBook from "@modules/account/components/address-book";

import { getCustomer, getRegion } from "@lib/data";

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
};

interface AddressesProps {
  params: {
    countryCode: string;
  };
}

export default async function Addresses({ params }: AddressesProps) {
  const { countryCode } = params;
  const customer = await getCustomer();
  const region = await getRegion(countryCode);

  if (!customer || !region) {
    notFound();
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Shipping Addresses</h1>
        <p className="text-base-regular">
          View and update your shipping addresses, you can add as many as you
          like. Saving your addresses will make them available during checkout.
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  );
}
