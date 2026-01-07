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
            <h1 className="font-monsieur text-4xl sm:text-6xl text-ketchup-red mb-2">
              Jacqueline Guo
            </h1>
            <p className="font-hershey italic text-ketchup-red text-xs sm:text-sm font-bold tracking-wider">
              ★ PRODUCT DESIGNER
            </p>
          </div>

          {/* Kraft paper section - responsive padding */}
          <div className="relative kraft-paper px-6 sm:px-8 py-5 sm:py-6 text-center">
            <p className="font-hershey text-dark-brown text-xs sm:text-sm mb-3 leading-relaxed">
              <span className="block">Completing CS degree @USC</span>
              <span className="block">Prev: @Apple, landing soon @Persona</span>
            </p>
            <p className="font-hershey text-dark-brown text-[10px] sm:text-xs leading-relaxed">
              New website soon. Old portfolio ↗
              <br />
              Let&apos;s be friends! X / LinkedIn / Email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
