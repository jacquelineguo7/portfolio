// Loading component - displays a centered "Loading..." message
// Uses the same styling as your main name heading (red cursive font)

export default function Loading() {
  return (
    // Container: Full viewport height and width with flexbox centering
    <div className="flex items-center justify-center h-screen w-screen">
      {/*
        Loading text using your .name-heading style:
        - font-monsieur: Your cursive font (Monsieur La Doulaise)
        - text-[var(--ketchup-red)]: Your ketchup red color
        - text-6xl: Large text size (equivalent to 4rem in your CSS)
      */}
      <h1 className="font-monsieur text-[var(--ketchup-red)] text-6xl">
        Loading...
      </h1>
    </div>
  );
}
