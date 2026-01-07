export default function TestPage() {
  return (
    <div className="page-container">
      {/* Grid background div - this is what we're testing */}
      <div className="grid-div"></div>

      {/* Simple content to show on top of the grid */}
      <div className="content-wrapper">
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Grid Background Test</h1>
          <p>This page displays the grid background from your main page.</p>
          <p style={{ marginTop: '1rem' }}>
            <a href="/" style={{ color: '#932823', textDecoration: 'underline' }}>
              ← Back to home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
