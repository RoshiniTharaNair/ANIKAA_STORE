import { useAccount } from "@/lib/context/account-context"
import { Customer } from "@medusajs/medusa"
import Input from "@/components/common/components/input"
import { useUpdateMe } from "medusa-react"
import React, { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import AccountInfo from "../account-info"

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

type UpdateCustomerEmailFormData = {
  email: string
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined
  )

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateCustomerEmailFormData>({
    defaultValues: {
      email: customer.email,
    },
  })

  const { refetchCustomer } = useAccount()

  const {
    mutate: update,
    isLoading,
    isSuccess,
    isError,
    reset: clearState,
  } = useUpdateMe()

  useEffect(() => {
    reset({
      email: customer.email,
    })
  }, [customer, reset])

  const email = useWatch({
    control,
    name: "email",
  })

  // Check if the email contains @unidentified.com
  const isGeneratedEmail = (email: string) => {
    return email?.includes("@unidentified.com");
  };

  const updateEmail = (data: UpdateCustomerEmailFormData) => {

    if (isGeneratedEmail(data.email)) {
      setErrorMessage("Generated emails cannot be used");
      return;
    }

    return update(
      {
        id: customer.id,
        ...data,
      },
      {
        onSuccess: () => {
          refetchCustomer()
        },
        onError: () => {
          setErrorMessage("Email already in use")
        },
      }
    )
  }

  // console.log("email ",email)
  return (
    <form onSubmit={handleSubmit(updateEmail)} className="w-full"
    style={{
      border: isGeneratedEmail(customer.email) ? "1px solid red" : "",
      padding: isGeneratedEmail(customer.email) ? "5px" : "",
    }}>
      <AccountInfo
        label="Email"
        currentInfo={isGeneratedEmail(customer.email) ? "Email is not set" : customer.email}  // Show message instead of email
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        errorMessage={errorMessage}
        clearState={clearState}
      >
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Email"
            {...register("email", {
              required: true,
            })}
            defaultValue={isGeneratedEmail(email) ? "" : email}  // Set the input field to empty if the email is generated
            errors={errors}
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileEmail
