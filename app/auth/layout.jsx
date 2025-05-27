import React from "react";
import Image from "next/image";

const layout = ({ children }) => {
  return (
    <main className="relative -z-0 min-h-screen bg-gray-50">
      {/* Background Image blur */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/images/bg_image.png"
          alt="Background image"
          fill
          priority
          quality={50}
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
      </div>
      {/* Main content container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="grid md:grid-cols-2">
            {/* Form Register section */}
            {children}
            {/* Image section - Hidden on mobile */}
            <div className="relative hidden min-h-[500px] md:block">
              <Image
                src="/images/bg_image_2.jpg"
                alt="Farm illustration"
                fill
                priority
                quality={10}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                className="rounded-r-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default layout;
