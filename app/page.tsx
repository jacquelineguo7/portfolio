import Image from "next/image";

export default function Home() {
  return (
    // Main container with beige/tan color and grid background
    <div className="min-h-screen bg-[#E5DDD5] grid-background flex items-center justify-center p-4 sm:p-8">
      {/* Business card container */}
      <div className="relative max-w-[500px] w-full">

        {/* Binder clip - positioned at the top center, smaller on mobile */}
        <div className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 z-10">
          <Image
            src="/assets/gold-binder-clip.png"
            alt="Binder clip"
            width={60}
            height={60}
            className="sm:w-20 sm:h-20"
            priority
          />
        </div>

        {/* Card with yellow and kraft paper sections */}
        <div className="overflow-hidden rounded-sm shadow-lg">

          {/* Yellow paper section - responsive padding and text size */}
          <div className="relative yellow-paper p-8 sm:p-12 text-center">
            <h1 className="font-[var(--font-monsieur)] text-4xl sm:text-6xl text-[#8B4513] mb-2">
              Jacqueline Guo
            </h1>
            <p className="text-[#8B4513] text-xs sm:text-sm font-medium tracking-wider">
              ★ PRODUCT DESIGNER
            </p>
          </div>

          {/* Kraft paper section - responsive padding */}
          <div className="relative kraft-paper px-6 sm:px-8 py-5 sm:py-6 text-center">
            <p className="text-[#5C4033] text-xs sm:text-sm mb-3 leading-relaxed">
              <span className="block">Completing CS degree @USC</span>
              <span className="block">Prev: @Apple, heading soon @Veronica</span>
            </p>
            <p className="text-[#5C4033] text-[10px] sm:text-xs leading-relaxed">
              New website soon. Old portfolio ↗
              <br />
              Let&apos;s be friends! ✕ / LinkedIn / Email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
