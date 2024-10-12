"use client";

import React, { useEffect, useState } from "react";
import ProfilePhone from "@modules/account/components/profile-phone";
import ProfileBillingAddress from "@modules/account/components/profile-billing-address";
import ProfileEmail from "@modules/account/components/profile-email";
import ProfileName from "@modules/account/components/profile-name";
import ProfilePassword from "@modules/account/components/profile-password";
import ProfileLocation from "@modules/account/components/ProfileLocation";
import AddressBook from "@modules/account/components/address-book";

interface ProfileClientProps {
  customer: any; // You can replace `any` with a more specific type
  regions: any;  // You can replace `any` with a more specific type
}

const ProfileClient: React.FC<ProfileClientProps> = ({ customer, regions }) => {
  // Handler to manage the selected address from the ProfileLocation component
  const handleLocationSelected = (address: string) => {
    console.log("Selected Address:", address);
    // Here you could add additional logic to save this address in state or send it to a server
  };

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl-semi">Profile</h1>
        <p className="text-base-regular">
          View and update your profile information, including your name, email,
          and phone number. You can also update your billing address, or change
          your password.
        </p>
      </div>
      <div className="flex flex-col gap-y-8 w-full">
        <ProfileName customer={customer} />
        <Divider />
        <ProfileEmail customer={customer} />
        <Divider />
        <ProfilePhone customer={customer} />
        <Divider />
        <ProfilePassword customer={customer} />
        <Divider />
        <ProfileBillingAddress customer={customer} regions={regions} />
        {/* <Divider /> */}
        {/* <ProfileLocation /> */}
      </div>
    </div>
  );
};

const Divider = () => {
  return <div className="w-full h-px bg-gray-200" />;
};

export default ProfileClient;
