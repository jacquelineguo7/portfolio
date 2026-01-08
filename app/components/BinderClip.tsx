import Image from "next/image";

/**
 * BinderClip Component
 * Decorative gold binder clip that sits at the top of the business card
 */
export default function BinderClip() {
  return (
    <div className="binder-clip-container">
      <Image
        src="/assets/gold-binder-clip.png"
        alt="Binder clip"
        width={172}
        height={198}
        className="binder-clip-image"
        priority
      />
    </div>
  );
}
