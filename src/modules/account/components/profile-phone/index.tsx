"use client"

import { Customer } from "@medusajs/medusa"
import React, { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import Input from "@modules/common/components/input"

import AccountInfo from "../account-info"
import { updateCustomerPhone } from "@modules/account/actions"
import { phoneNumberPattern } from "@lib/util/regex"

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = useState(false)
  const [phoneValue, setPhoneValue] = useState(customer.phone || "")
  const [phoneError, setPhoneError] = useState("")

  const [state, formAction] = useFormState(updateCustomerPhone, {
    error: false,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPhoneValue(value)

    // Validate against the phone number pattern
    if (!phoneNumberPattern.test(value)) {
      setPhoneError("Phone number is invalid. Please enter a valid phone number.")
    } else {
      setPhoneError("")
    }
  }

  // Disable form submission if there is a validation error
  const isFormInvalid = phoneError !== "" || phoneValue === ""

  return (
    <form
      action={formAction}
      className={`w-full ${!customer.phone ? "border border-red-500 p-2" : ""}`}
    >
      <AccountInfo
        label="Phone"
        currentInfo={`${customer.phone}`}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error}
        clearState={clearState}
        data-testid="account-phone-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phoneValue}
            onChange={handlePhoneChange}
            data-testid="phone-input"
          />
          {phoneError && (
            <span className="text-red-500 text-sm" data-testid="phone-error">
              {phoneError}
            </span>
          )}
        </div>
        <div className="flex items-center justify-end mt-4">
          <button
            type="submit"
            className={`btn btn-primary ${isFormInvalid ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isFormInvalid}
            data-testid="save-button"
          >
            Save changes
          </button>
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileEmail
