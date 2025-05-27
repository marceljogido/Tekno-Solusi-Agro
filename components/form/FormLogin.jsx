"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { login } from "../../app/auth/login/actions";
import Image from "next/image";
import Link from "next/link";

const initialState = { error: null, success: false };

const FormLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [state, setState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    const formData = new FormData(event.currentTarget);
    const result = await login(initialState, formData);

    setState(result);
    setIsSubmitting(false);
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
        {" "}
        {/*error info*/}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@mail.com"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none "
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500">Password</label>
            <button
              className="text-[11px] text-slate-500 underline"
              type="button"
            >
              Forgot password
            </button>
          </div>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 -translate-y-1/2 transform text-slate-500"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
        </div>
        {state?.error && (
          <p className="mt-1 flex w-full justify-center rounded-sm border border-red-300 bg-red-100 p-1 text-[10px] font-bold text-red-600">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <button
          type="button"
          onClick={() => alert("Login dengan Google nanti kita buat")}
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
            href="./register"
            className="text-blue-500 underline underline-offset-2"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default FormLogin;
