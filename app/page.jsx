"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/me");
      const data = await res.json();
      if (data.user) {
    router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    };
    checkAuth();
  }, [router]);

  return null;
};

export default Page;
