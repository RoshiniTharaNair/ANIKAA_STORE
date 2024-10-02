import { useAccount } from "@/lib/context/account-context";
import { Customer } from "@medusajs/medusa";
import Input from "@/components/common/components/input";
import { useUpdateMe } from "medusa-react";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import AccountInfo from "../account-info";

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">;
};

type UpdateCustomerPhoneFormData = {
  phone: string;
};

const ProfilePhone: React.FC<MyInformationProps> = ({ customer }) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateCustomerPhoneFormData>({
    defaultValues: {
      phone: customer.phone,
    },
  });

  const { refetchCustomer } = useAccount();

  const {
    mutate: update,
    isLoading,
    isSuccess,
    isError,
    reset: clearState,
  } = useUpdateMe();

  useEffect(() => {
    reset({
      phone: customer.phone,
    });
  }, [customer, reset]);

  const phone = useWatch({
    control,
    name: "phone",
  });

  const updatePhone = (data: UpdateCustomerPhoneFormData) => {
    return update(
      {
        id: customer.id,
        ...data,
      },
      {
        onSuccess: () => {
          refetchCustomer();
        },
      }
    );
  };

  const isPhoneEmpty = !customer.phone || customer.phone === "";

  return (
    <form
      onSubmit={handleSubmit(updatePhone)}
      className="w-full"
      style={{
        border: isPhoneEmpty ? "1px solid red" : "", // Apply red border if phone is empty
        padding: isPhoneEmpty ? "5px" : "", // Apply padding when red border is present
      }}
    >
      <AccountInfo
        label="Phone"
        currentInfo={isPhoneEmpty ? "Phone is not set" : customer.phone} // Show message if phone is not set
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        clearState={clearState}
      >
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Phone"
            {...register("phone", {
              required: true,
            })}
            defaultValue={phone}
            errors={errors}
          />
        </div>
      </AccountInfo>
    </form>
  );
};

export default ProfilePhone;
