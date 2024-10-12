"use client"

import { Customer } from "@medusajs/medusa"
import React, { useEffect, useState } from "react"
import { useFormState } from "react-dom"

import Input from "@modules/common/components/input"

import AccountInfo from "../account-info"
import { updateCustomerEmail } from "@modules/account/actions"
import { emailPattern } from "@lib/util/regex"

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  const [successState, setSuccessState] = useState(false)
  const [emailValue, setEmailValue] = useState(customer.email || "")
  const [emailError, setEmailError] = useState("")

  const [state, formAction] = useFormState(updateCustomerEmail, {
    error: false,
    success: false,
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  // Determine if the customer's email is identified as a null placeholder
  const isNullEmail = customer.email.endsWith("@unidentified.com")

  // Handle email input change and validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmailValue(value)

    // Validate email with the pattern
    if (!emailPattern.test(value)) {
      setEmailError("Email is invalid. Please enter a valid email address.")
    } else {
      setEmailError("")
    }
  }

  // Disable form submission if there is a validation error or if email field is empty
  const isFormInvalid = emailError !== "" || emailValue === ""

  return (
    <form
      action={formAction}
      className={`w-full ${isNullEmail ? "border border-red-500 p-2" : ""}`}
    >
      <AccountInfo
        label="Email"
        currentInfo={isNullEmail ? "No email provided" : `${customer.email}`}
        isSuccess={successState}
        isError={!!state.error}
        errorMessage={state.error}
        clearState={clearState}
        data-testid="account-email-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={emailValue}
            onChange={handleEmailChange}
            data-testid="email-input"
          />
          {emailError && (
            <span className="text-red-500 text-sm" data-testid="email-error">
              {emailError}
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
