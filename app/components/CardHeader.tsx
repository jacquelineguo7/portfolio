import Image from "next/image";

/**
 * CardHeader Component
 * Yellow paper section displaying name and title with decorative icons
 */
export default function CardHeader() {
  return (
    <header className="paper-texture yellow-paper yellow-section">
      {/* Name row with copyright icon */}
      <div className="heading-row">
        <Image
          src="/assets/copyright.svg"
          alt="Red star"
          width={12}
          height={12}
          className="asterisk"
          priority
        />
        <h1 className="name-heading">Jacqueline Guo</h1>
      </div>

      {/* Subtitle row with star icon */}
      <div className="subtitle-row">
        <Image
          src="/assets/star.svg"
          alt="Red star"
          width={12}
          height={12}
          className="asterisk"
          priority
        />
        <p className="subtitle">PRODUCT DESIGNER</p>
      </div>
    </header>
  );
}
