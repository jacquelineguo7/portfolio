/**
 * CardDescription Component
 * Kraft paper section containing bio text and social/external links
 */
export default function CardDescription() {
  return (
    <section className="paper-texture kraft-paper kraft-section">
      {/* Bio section - education and current role */}
      <p className="description bottom-padding">
        <span className="description-line left-flush">
          Completing CS degree at USC
        </span>
        <span className="description-line left-flush">
          Landing soon at{" "}
          <a
            href="https://withpersona.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Persona
          </a>{" "}
          ☺︎
        </span>
      </p>

      {/* Portfolio and social links section */}
      <p className="description">
        <span className="description-line right-flush">
          <a
            href="https://jacquelineguo.framer.website"
            target="_blank"
            rel="noopener noreferrer"
          >
            See past work
          </a>{" or "}
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            read writing
          </a>{" "}
        </span>
        <span className="description-line right-flush">
          Let&apos;s be friends: {" "}
          <a
            href="https://x.com/jacqfolio"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>{" "}
          /{" "}
          <a
            href="https://www.linkedin.com/in/jacquelineguo7/"
            target="_blank"
            rel="noopener noreferrer"
          >
            in
          </a>{" "}
          /{" "}
          <a href="mailto:jacquelineguo7@gmail.com">Email</a>
        </span>
      </p>
    </section>
  );
}
