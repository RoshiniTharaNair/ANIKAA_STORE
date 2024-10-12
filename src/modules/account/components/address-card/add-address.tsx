"use client";

import { useState, useEffect } from "react";
import { Region, Customer } from "@medusajs/medusa";
import { Plus, MapPin } from "@medusajs/icons";
import { Button, Heading } from "@medusajs/ui";
import { useFormState } from "react-dom";
import useToggleState from "@lib/hooks/use-toggle-state";
import CountrySelect from "@modules/checkout/components/country-select";
import Input from "@modules/common/components/input";
import Modal from "@modules/common/components/modal";
import { SubmitButton } from "@modules/checkout/components/submit-button";
import { addCustomerShippingAddress } from "@modules/account/actions";
import ProfileLocation from "../ProfileLocation";

// Updated Address type with null allowed
type Address = {
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  address_1?: string | null;
  address_2?: string | null;
  postal_code?: string | null;
  city?: string | null;
  province?: string | null;
  country_code?: string | null;
  phone?: string | null;
};

const AddAddress = ({ region, customer }: { region: Region, customer: Omit<Customer, "password_hash"> }) => {
  const [successState, setSuccessState] = useState(false);
  const { state: modalState, open: openModal, close: closeModal } = useToggleState(false);
  const [addressMethod, setAddressMethod] = useState<"manual" | "map" | null>(null);
  const [formState, formAction] = useFormState(addCustomerShippingAddress, {
    success: false,
    error: null,
  });

  const [useBillingAddress, setUseBillingAddress] = useState(false);
 // Move the billingAddress declaration above where it's used
 const billingAddress: Address = useBillingAddress && customer?.billing_address
 ? {
     first_name: customer.billing_address.first_name,
     last_name: customer.billing_address.last_name,
     company: customer.billing_address.company,
     address_1: customer.billing_address.address_1,
     address_2: customer.billing_address.address_2,
     postal_code: customer.billing_address.postal_code,
     city: customer.billing_address.city,
     province: customer.billing_address.province,
     country_code: customer.billing_address.country_code,
     phone: customer.billing_address.phone,
   }
 : {};
 

const [selectedCountry, setSelectedCountry] = useState(billingAddress.country_code || ""); // Moved here after billingAddress definition

  const close = () => {
    setSuccessState(false);
    closeModal();
    setAddressMethod(null); // Reset the method when modal closes
  };

  useEffect(() => {
    if (successState) {
      close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState]);

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true);
    }
  }, [formState]);

  // Autofill form values if useBillingAddress is true, using optional chaining to safely access billing_address
 

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-4">
        <button
          className="border border-ui-border-base rounded-rounded p-5 min-h-[100px] h-full w-full flex flex-col justify-between"
          onClick={() => {
            setAddressMethod("manual");
            openModal();
          }}
          data-testid="add-address-manual-button"
        >
          <span className="text-base-semi">Add Address Manually</span>
          <Plus />
        </button>
        <button
          className="border border-ui-border-base rounded-rounded p-5 min-h-[100px] h-full w-full flex flex-col justify-between"
          onClick={() => {
            setAddressMethod("map");
            openModal();
          }}
          data-testid="set-address-map-button"
        >
          <span className="text-base-semi">Set Address Using Map</span>
          <MapPin />
        </button>
      </div>

      {addressMethod === "manual" && (
        <Modal isOpen={modalState} close={close} data-testid="add-address-modal">
          <Modal.Title>
            <Heading className="mb-2">Add address</Heading>
          </Modal.Title>
          <form action={formAction}>
            <Modal.Body>
              <div className="flex flex-col gap-y-2">
                {customer?.billing_address && (
                  <div className="flex items-center gap-x-2">
                    <input
                      type="checkbox"
                      id="use-billing-address"
                      checked={useBillingAddress}
                      onChange={() => setUseBillingAddress(!useBillingAddress)}
                      data-testid="use-billing-address-checkbox"
                    />
                    <label htmlFor="use-billing-address" className="text-sm mt-4">
                      Use billing address as shipping address
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-x-2">
                  <Input
                    label="First name"
                    name="first_name"
                    defaultValue={billingAddress.first_name || ""}
                    required
                    autoComplete="given-name"
                    data-testid="first-name-input"
                  />
                  <Input
                    label="Last name"
                    name="last_name"
                    defaultValue={billingAddress.last_name || ""}
                    required
                    autoComplete="family-name"
                    data-testid="last-name-input"
                  />
                </div>
                <Input
                  label="Location"
                  name="company"
                  defaultValue={billingAddress.company || ""}
                  required
                  autoComplete="organization"
                  data-testid="company-input"
                />
                <Input
                  label="Address"
                  name="address_1"
                  defaultValue={billingAddress.address_1 || ""}
                  required
                  autoComplete="address-line1"
                  data-testid="address-1-input"
                />
                <Input
                  label="Apartment, suite, etc."
                  name="address_2"
                  defaultValue={billingAddress.address_2 || ""}
                  autoComplete="address-line2"
                  data-testid="address-2-input"
                />
                <div className="grid grid-cols-[144px_1fr] gap-x-2">
                  <Input
                    label="Postal code"
                    name="postal_code"
                    defaultValue={billingAddress.postal_code || ""}
                    required
                    autoComplete="postal-code"
                    data-testid="postal-code-input"
                  />
                  <Input
                    label="City"
                    name="city"
                    defaultValue={billingAddress.city || ""}
                    required
                    autoComplete="locality"
                    data-testid="city-input"
                  />
                </div>
                <Input
                  label="Province / State"
                  name="province"
                  defaultValue={billingAddress.province || ""}
                  autoComplete="address-level1"
                  data-testid="state-input"
                />
                <CountrySelect
                  region={region}
                  name="country_code"
                  value={selectedCountry} // Controlled value from state
                  onChange={handleCountryChange} // Handle country selection
                  required
                  autoComplete="country"
                  data-testid="country-select"
                />
                <Input
                  label="Phone"
                  name="phone"
                  defaultValue={billingAddress.phone || ""}
                  required
                  autoComplete="phone"
                  data-testid="phone-input"
                />
              </div>
              {formState.error && (
                <div className="text-rose-500 text-small-regular py-2" data-testid="address-error">
                  {formState.error}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <div className="flex gap-3 mt-6">
                <Button
                  type="reset"
                  variant="secondary"
                  onClick={close}
                  className="h-10"
                  data-testid="cancel-button"
                >
                  Cancel
                </Button>
                <SubmitButton data-testid="save-button">Save</SubmitButton>
              </div>
            </Modal.Footer>
          </form>
        </Modal>
      )}

      {addressMethod === "map" && (
        <ProfileLocation
          modalState={modalState}
          closeModal={close}
          customerId={customer.id}
        />
      )}
    </>
  );
};

export default AddAddress;
