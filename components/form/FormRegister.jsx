"use client";

import { useState } from "react";
import Image from "next/image";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/app/auth/register/actions";

const initialState = { error: {} };

const FormRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(register, initialState);

  return (
    <form action={formAction} className="p-6 md:p-8">
      <div className="mb-6">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="mb-4"
        />
        <h1 className="text-xl font-extrabold text-slate-700 md:text-2xl">
          Welcome <br></br> to{" "}
          <span className="text-green-600">Farm Management</span>
        </h1>
        <p className="mt-1 text-[11px] tracking-tight text-slate-500">
          Fill in the fields below to create your account.
        </p>
      </div>

      <div className="space-y-3">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="e.g. John"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {state.errors?.firstName && (
              <p className="mt-1 text-[10px] font-bold text-red-400">
                {state.errors.firstName}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="e.g. Doe"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            {state.errors?.lastName && (
              <p className="mt-1 text-[10px] font-bold text-red-400">
                {state.errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@mail.com"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          {state.errors?.email && (
            <p className="mt-1 text-[10px] font-bold text-red-400">
              {state.errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500">Password</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="contain at least 8 characters"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-2 -translate-y-1/2 transform text-slate-500"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
          {state.errors?.password && (
            <p className="mt-1 text-[10px] font-bold text-red-400">
              {state.errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-green-700"
        >
          Sign Up
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
          Sign up with Google
        </button>
        <div className="mt-4 text-center text-xs font-semibold text-slate-500">
          Already have an account?{" "}
          <Link
            href="./login"
            className="text-blue-500 underline underline-offset-2"
          >
            Login
          </Link>
        </div>
      </div>
    </form>
  );
};

export default FormRegister;
