import PageHeader from "@/components/layout/PageHeader";
import React from "react";

const page = () => {
  return (
    <div>
      <PageHeader title="Tugas" />

      <div className="px-4 pt-18 pb-4 md:pt-14">
        <div className="bg-white border mt-4 rounded-md h-screen flex mx-auto items-center justify-center">sedang dimasak...</div>
      </div>
    </div>
  );
};

export default page;
