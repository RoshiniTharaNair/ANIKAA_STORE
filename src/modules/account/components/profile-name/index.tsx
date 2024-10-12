"use client"

import { Customer } from "@medusajs/medusa"
import React, { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import Input from "@modules/common/components/input"
import { updateCustomerName } from "@modules/account/actions"
import ErrorMessage from "@modules/checkout/components/error-message"
import AccountInfo from "../account-info"
import { namePattern } from "@lib/util/regex"

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

const ProfileName: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = useState(false)
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
  })

  const [formData, setFormData] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
  })

  const [state, formAction] = useFormState(updateCustomerName, {
    error: false,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  const isNameMissing = !customer.first_name && !customer.last_name

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear previous error
    setErrors({
      ...errors,
      [name]: "",
    })

    // Perform validation against namePattern
    if (!namePattern.test(value)) {
      setErrors({
        ...errors,
        [name]: "Invalid name. Please use letters only.",
      })

    }
  }

  return (
    <form
      action={formAction}
      className={`w-full overflow-visible ${isNameMissing ? "border border-red-500 p-2" : ""}`}
    >
      <AccountInfo
        label="Name"
        currentInfo={`${customer.first_name} ${customer.last_name}`}
        isSuccess={successState}
        isError={!!state?.error}
        clearState={clearState}
        data-testid="account-name-editor"
      >
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col">
            <Input
              label="First name"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleInputChange}
              data-testid="first-name-input"
            />
            {errors.first_name && (
              <ErrorMessage error={errors.first_name} data-testid="first-name-error" />
            )}
          </div>
          <div className="flex flex-col">
            <Input
              label="Last name"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleInputChange}
              data-testid="last-name-input"
            />
            {errors.last_name && (
              <ErrorMessage error={errors.last_name} data-testid="last-name-error" />
            )}
          </div>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileName
