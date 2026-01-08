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
          Completing{" "}
          <a
            href="#USC_LINK_HERE"
            target="_blank"
            rel="noopener noreferrer"
          >
            CS degree at USC
          </a>
        </span>
        <span className="description-line left-flush">
          Landing soon at{" "}
          <a
            href="#PERSONA_LINK_HERE"
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
          See my{" "}
          <a
            href="#OLD_PORTFOLIO_LINK_HERE"
            target="_blank"
            rel="noopener noreferrer"
          >
            old portfolio
          </a>{" "}
          for past work
        </span>
        <span className="description-line right-flush">
          Let&apos;s be friends!{" "}
          <a
            href="#X_LINK_HERE"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>{" "}
          /{" "}
          <a
            href="#LINKEDIN_LINK_HERE"
            target="_blank"
            rel="noopener noreferrer"
          >
            in
          </a>{" "}
          /{" "}
          <a href="mailto:#EMAIL_HERE">Email</a>
        </span>
      </p>
    </section>
  );
}
