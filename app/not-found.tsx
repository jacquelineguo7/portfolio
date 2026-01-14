/**
 * Custom 404 Not Found Page
 * Displays a crumpled paper note with a friendly message when users land on a page that doesn't exist
 *
 * REUSED CLASSES:
 * - grid-div: The main grid background (from homepage)
 * - font-monsieur: Cursive font for the "404" heading (same as your name)
 * - font-hershey: Serif font for body text (same as card description)
 * - <a> tags: Automatically get the wavy underline animation from global styles
 */
export default function NotFound() {
  return (
    // Main container - REUSES grid-div class for the grid background
    // Added "not-found-page" class to enable the exclusion blend mode
    <main className="grid-div not-found-page">
      {/* Container for the crumpled paper note */}
      <div className="not-found-container">
        {/* The crumpled paper background image */}
        <div className="crumpled-paper">
          {/* Content overlaid on the paper */}
          <div className="not-found-content">
            {/* Large "404" heading - REUSES font-hershey class with italic */}
            <h1 className="font-hershey not-found-title">404</h1>

            {/* First line of message - REUSES font-hershey class */}
            <p className="font-hershey not-found-message">
              Uh oh... I think you've landed in a dark
            </p>
            <p className="font-hershey not-found-message">
              mysterious place that no longer has any content.
            </p>

            {/* Second paragraph - mention of old portfolio */}
            <p className="font-hershey not-found-message" style={{ marginTop: '1rem' }}>
              If you're searching for my old portfolio, you can
            </p>
            <p className="font-hershey not-found-message">
              {/* Link automatically gets wavy underline from global <a> styles */}
              find an archived version <a href="jacquelineguo.framer.website">here</a>. Tread carefully!
            </p>

            {/* Final line - link back home */}
            <p className="font-hershey not-found-message" style={{ marginTop: '1rem' }}>
              {/* Link automatically gets wavy underline from global <a> styles */}
              Otherwise, here's a way back <a href="/">home</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
