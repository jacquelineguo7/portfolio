import Image from "next/image";

export default function Home() {
  return (
    <div className="grid-div">
      <div className="business-card">
        <div className="binder-clip-container">
          <Image
            src="/assets/gold-binder-clip.png"
            alt="Binder clip"
            width={172} // Use the original image width
            height={198} // Use the original image height
            className="binder-clip-image"
            priority
          />
        </div>

        <div className="card">
          <div className="paper-texture yellow-paper yellow-section">
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
          </div>

          <div className="paper-texture kraft-paper kraft-section">
            <p className="description bottom-padding">
              <span className="description-line left-flush">Completing CS degree at USC</span>
              <span className="description-line left-flush">Landing soon at Persona ☺︎</span>
            </p>
            <p className="description">
              <span className="description-line right-flush">See my old portfolio for past work.</span>
              <span className="description-line right-flush">Let&apos;s be friends!  X / in / Email</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
