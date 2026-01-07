import Image from "next/image";

export default function Home() {
  return (
    <div className="grid-div">
      <div className="content-wrapper">
        <div className="business-card">
          <div className="binder-clip-container">
            <Image
              src="/assets/gold-binder-clip.png"
              alt="Binder clip"
              width={60}
              height={60}
              className="binder-clip-image"
              priority
            />
          </div>

          <div className="card">
            <div className="paper-texture yellow-paper yellow-section">
              <h1 className="name-heading">Jacqueline Guo</h1>
              <p className="subtitle">★ PRODUCT DESIGNER</p>
            </div>

            <div className="paper-texture kraft-paper kraft-section">
              <p className="description">
                <span className="description-line left-flush">Completing CS degree @USC</span>
                <span className="description-line left-flush">Prev: @Apple, landing soon @Persona</span>
              </p>
              <p className="description">
                <span className="description-line right-flush">New website soon. Old portfolio ↗</span>
                <span className="description-line right-flush">Let&apos;s be friends! X / LinkedIn / Email</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
