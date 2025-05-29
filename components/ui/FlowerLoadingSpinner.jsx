"use client";

export default function FlowerLoadingSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex flex-col items-center justify-center">
        {/* Flower loader - now properly centered */}
        <div className="relative flex justify-center">
          <div className="flower-loader">
            <span className="sr-only">Loading...</span>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <p className="animate-pulse font-medium text-gray-600">Memuat</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400"></div>
            <div
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-orange-400"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .flower-loader {
          position: relative;
          display: block;
          width: 16px;
          height: 16px;
          background: #ee9966;
          border-radius: 100%;
          box-shadow:
            white 0 0 15px 0,
            #448855 -12px -12px 0 4px,
            #448855 12px -12px 0 4px,
            #448855 12px 12px 0 4px,
            #448855 -12px 12px 0 4px;
          animation: flower-loader 5s infinite ease-in-out;
          transform-origin: 50% 50%;
          margin: 0 auto;
        }

        @keyframes flower-loader {
          0% {
            transform: rotate(0deg);
            box-shadow:
              white 0 0 15px 0,
              #448855 -12px -12px 0 4px,
              #448855 12px -12px 0 4px,
              #448855 12px 12px 0 4px,
              #448855 -12px 12px 0 4px;
          }
          50% {
            transform: rotate(1080deg);
            box-shadow:
              white 0 0 15px 0,
              #448855 12px 12px 0 4px,
              #448855 -12px 12px 0 4px,
              #448855 -12px -12px 0 4px,
              #448855 12px -12px 0 4px;
          }
          100% {
            transform: rotate(0deg);
            box-shadow:
              white 0 0 15px 0,
              #448855 -12px -12px 0 4px,
              #448855 12px -12px 0 4px,
              #448855 12px 12px 0 4px,
              #448855 -12px 12px 0 4px;
          }
        }
      `}</style>
    </div>
  );
}
