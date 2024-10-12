import { useFormState } from "react-dom"

import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import Input from "@modules/common/components/input"
import { logCustomerIn } from "@modules/account/actions"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { useState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useFormState(logCustomerIn, null)
  
  // State to manage form inputs
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: ""
  })

  // Update form data state
  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Form submission handling
  const handleFormSubmit = (e: any) => {
    e.preventDefault()

    // Define dataToSubmit to allow both email and password
    let dataToSubmit: { password: string; email?: string } = {
      password: formData.password
    }

    // Check if the input is an email or phone number
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailPattern.test(formData.emailOrPhone)) {
      // If the input matches an email pattern
      console.log("email ", formData.emailOrPhone)

      dataToSubmit = {
        ...dataToSubmit,
        email: formData.emailOrPhone
      }
    } else if (/^\+?[0-9\s\-()]+$/.test(formData.emailOrPhone)) {
      // If the input contains valid phone characters, treat it as a phone number
      console.log("phone number ", formData.emailOrPhone)

      // Instead of removing non-digits, use the original input with symbols included
      dataToSubmit = {
        ...dataToSubmit,
        email: `${formData.emailOrPhone}@unidentified.com`
      }
      
      console.log("dataToSubmit ", dataToSubmit)
    } else {
      console.log("neither ", formData.emailOrPhone)

      // If input doesn't match either, show an error
      alert("Please enter a valid email address or phone number.")
      return
    }

    // Convert dataToSubmit to FormData instance
    const formDataToSubmit = new FormData()
    Object.entries(dataToSubmit).forEach(([key, value]) => {
      formDataToSubmit.append(key, value)
    })

    // Submit the form
    formAction(formDataToSubmit)
  }

  return (
    <div className="max-w-sm w-full flex flex-col items-center" data-testid="login-page">
      <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full" onSubmit={handleFormSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email or Phone"
            name="emailOrPhone"
            type="text"
            title="Enter a valid email address or phone number."
            autoComplete="email"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            required
            data-testid="email-or-phone-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleInputChange}
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">Sign in</SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          Join us
        </button>
        .
      </span>
    </div>
  )
}

export default Login
