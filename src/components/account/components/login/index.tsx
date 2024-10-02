// Importing necessary /components and /libraries
import { medusaClient } from "@/lib/config";
import { LOGIN_VIEW, useAccount } from "@/lib/context/account-context";
import Button from "@/components/common/components/button";
import Input from "@/components/common/components/input";
import Spinner from "@/components/common/icons/spinner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify"; // Importing toast notification /library
import "react-toastify/dist/ReactToastify.css"; // Importing styles for toast notifications
import { ToastContainer } from "react-toastify";
import { emailPattern, phoneNumberPattern } from "@/lib/util/regex";
import axios from 'axios'
import { signIn, useSession } from "next-auth/react"; // Import signIn and useSession from next-auth


// Defining the interface for SignInCredentials
interface SignInCredentials extends FieldValues {
  identifier: string; // Can be email or phone
  password: string;
}

const Login = () => {
  const { loginView, refetchCustomer } = useAccount();
  const [_, setCurrentView] = loginView;
  const [authError, setAuthError] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const { data: session } = useSession(); // Get session data from next-auth

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setValue,
    setError,
  } = useForm<SignInCredentials>({
    mode: "onChange",
  });

  const handleError = (_e: Error) => {
    setAuthError("Invalid email, phone number, or password");
  };

  const onSubmit = handleSubmit(async (credentials) => {
    try {
      const { identifier, password } = credentials;
  
      // Check if the identifier is a phone or email
      let isEmail = emailPattern.test(identifier);
      let isPhone = phoneNumberPattern.test(identifier);
  
      if (!isEmail && !isPhone) {
        setError("identifier", {
          type: "manual",
          message: "Please enter a valid email or phone number",
        });
        return;
      }
  
      let payload;
  
      // If identifier is a phone number, fetch the associated email
      if (isPhone) {
        try {
          // Call the API to get the email for the phone number
          const phoneResponse = await axios.get("http://localhost:9000/store/getEmailforPassword", {
            params: {
              phoneNo: identifier,
            },
          });
  
          // console.log("phoneResponse.data.customer.email ",phoneResponse.data.customer.email)
          // Check if the API returned an email
          if (phoneResponse.data.customer.email) {
            payload = { email: phoneResponse.data.customer.email, password };
          } else {
            toast.error("No account exists for the provided phone number.");
            return;
          }
        } catch (error) {
          console.error("Error fetching email for phone number:", error);
          toast.error("An error occurred while fetching the email for the provided phone number.");
          return;
        }
      } else {
        // If it's an email, prepare the payload directly
        payload = { email: identifier, password };
      }
  
      // console.log("payload other ",payload)

      // Attempt to authenticate with the payload
      await medusaClient.auth
        .authenticate(payload)
        .then(() => {
          refetchCustomer();
  
          if (rememberMe) {
            localStorage.setItem("identifier", identifier);
            localStorage.setItem("password", password); // Storing password like this is not recommended for security reasons
          }
  
          router.push("/account");
        })
        .catch((error) => {
          console.error("Authentication failed:", error);
          handleError(error);
        });
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("An error occurred. Please try again.");
    }
  });
  
  const handleGoogleSignIn = async () => {
    try {
      // Trigger Google sign-in
      const result = await signIn('google', { redirect: false });

      if (result?.error) {
        toast.error("Google sign-in failed. Please try again.");
        return;
      }

      const sessionEmail = session?.user?.email || "";
      const sessionPassword = session?.user?.email || "";

      // Log the signed-in user's email to the console
      if (session?.user?.email) {
        // console.log("Google signed-in user's email:", session.user.email);
      //  let payload = { email: session?.user?.email, password: session?.user?.email };

       let payload = {email:sessionEmail, password:sessionPassword}

      //  console.log("payload signin ",payload)
       await medusaClient.auth
        .authenticate(payload)
        .then(() => {
          refetchCustomer();
  
          if (rememberMe) {
            localStorage.setItem("identifier", sessionEmail);
            localStorage.setItem("password", sessionPassword); // Storing password like this is not recommended for security reasons
          }
  
          router.push("/account");
        })
        .catch((error) => {
          console.error("Authentication failed:", error);
          handleError(error);
        });

      } else {
        console.log("User's email is not available in the session.");
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google sign-in failed. Please try again.");
    }
  };


  useEffect(() => {
    const savedIdentifier = localStorage.getItem("identifier");
    const savedPassword = localStorage.getItem("password");

    if (savedIdentifier && savedPassword) {
      setValue("identifier", savedIdentifier);
      setValue("password", savedPassword);
      setRememberMe(true);
    }
  }, [setValue]);

  return (
    <div className="max-w-sm w-full flex flex-col items-center" style={{ marginTop: "100px" }}>
      {isSubmitting && (
        <div className="z-10 fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <Spinner size={24} />
        </div>
      )}
      <ToastContainer />

      <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
      <p className="text-center text-base-regular text-gray-700 mb-8">
        Sign in to access an enhanced shopping experience.
      </p>

      <form className="w-full" onSubmit={onSubmit}>
        <div className="flex flex-col w-full gap-y-2">
          {errors.identifier && (
            <p style={{ textAlign: "center" }} className="-mt-4 pl-2 mb-4 text-rose-500 text-base-regular flex items-center justify-center">
              {errors.identifier.message}
            </p>
          )}

          <div className="input-wrapper" style={{ position: "relative" }}>
          <Input
  id="identifier"
  label="Email or Phone"
  {...register("identifier", {
    required: "Email or phone number is required",
    validate: (value) => {
      const isEmail = emailPattern.test(value);
      const isPhone = phoneNumberPattern.test(value);
      
      // Check if value matches either email or phone number patterns
      if (!isEmail && !isPhone) {
        return "Please enter a valid email or phone number";
      }
      return true;
    },
  })}
  autoComplete="username"
  className={`custom-input wide-input ${errors.identifier ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
  errors={errors}
/>

            {errors.identifier && <span className="error-icon">!</span>}
          </div>

          <div className="input-wrapper" style={{ position: "relative" }}>
            <Input
              label="Password"
              id="password"
              {...register("password", { required: "Password is required" })}
              type="password"
              autoComplete="current-password"
              className={`custom-input wide-input ${errors.password ? 'error-border pt-4 pb-1 block w-full h-11 px-4 mt-0' : "pt-4 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover"}`}
              errors={errors}
            />
            {errors.password && <span className="error-icon">!</span>}
          </div>
        </div>

        {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              These credentials do not match our records
            </span>
          </div>
        )}
        
        <Button className="mt-6 mb-5 pb-5">Enter</Button>
      </form>

 {/* Google Sign-In Button */}
      <Button
        onClick={handleGoogleSignIn} // Handle Google sign-in on click
        className="mb-4 w-full flex items-center justify-center"
        style={{ backgroundColor: "#4285F4", color: "white" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 48 48"
          className="mr-2"
        >
          <path
            fill="#fff"
            d="M44.5 20H24v8.5h11.9C34.4 33.2 30 36 24 36c-8.8 0-16-7.2-16-16S15.2 4 24 4c4.4 0 8.3 1.8 11.2 4.6l6-6C37.1 0.9 30.9-1.5 24-1.5 10.8-1.5 0 9.3 0 22.5S10.8 46.5 24 46.5 48 35.7 48 22.5c0-1.6-.2-3.1-.5-4.5z"
          />
        </svg>
        Sign in with Google
      </Button>
      <span className="text-center text-gray-700 text-small-regular mt-6">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
        >
          Join us
        </button>
        .
      </span>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label htmlFor="rememberMe">Remember me</label>
      </div>

      <style>{`
        .forgot-password-link:hover {
          text-decoration: underline;
        }
        .checkbox-container {
          margin-top: 10px;
        }
        
        .checkbox-container input {
          margin-right: 5px;
        }
        .custom-input {
          width: 100%;
        }
        .error-border {
          border: 1px solid red;
          border-radius: 5px;
        }
        .error-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: red;
          color: white;
          font-size: 16px;
          text-align: center;
          line-height: 20px;
        }
        .error-message {
          color: red;
          font-size: 0.8rem;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
};

export default Login;
