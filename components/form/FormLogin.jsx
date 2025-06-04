"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { login } from "../../app/auth/login/actions";
import Image from "next/image";
import Link from "next/link";

const initialState = { error: null, success: false };

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return null;
};

const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  return null;
};

const FormLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({ email: null, password: null });
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setState(initialState);
    setFormErrors({ email: null, password: null });

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    // Validate inputs
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setFormErrors({
        email: emailError,
        password: passwordError
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(initialState, formData);
      setState(result);
    } catch (error) {
      setState({ 
        error: "An error occurred during login. Please try again.", 
        success: false 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleLoginSubmit} className="p-6 md:p-8">
      <div className="mb-6">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="mb-4"
        />
        <h1 className="text-xl font-extrabold text-slate-700 md:text-2xl">
          Welcome Back<br></br> to{" "}
          <span className="text-green-600">Farm Management</span>
        </h1>
        <p className="mt-1 text-[11px] tracking-tight text-slate-500 md:text-sm">
          Please enter your details to log in.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@mail.com"
            required
            className={`w-full rounded-md border ${
              formErrors.email ? 'border-red-500' : 'border-slate-300'
            } px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none`}
          />
          {formErrors.email && (
            <p className="text-xs text-red-500">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500">Password</label>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] text-slate-500 hover:text-slate-700"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              className={`w-full rounded-md border ${
                formErrors.password ? 'border-red-500' : 'border-slate-300'
              } px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 -translate-y-1/2 transform text-slate-500 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-xs text-red-500">{formErrors.password}</p>
          )}
        </div>

        {state?.error && (
          <div className="rounded-md bg-red-50 p-3">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-colors duration-300 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Logging in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push('/auth/google')}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors duration-300 hover:bg-slate-200"
        >
          <Image
            src="/icons/google_icon.svg"
            alt="Google Icon"
            width={20}
            height={20}
          />
          Login with Google
        </button>

        <div className="mt-4 text-center text-xs font-semibold text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-500 hover:text-blue-600 underline underline-offset-2"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default FormLogin;
