"use client";

/** Last resort when the root layout itself fails. It brings its own document, so it styles inline. */
export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <div role="alert">
          <h1 style={{ fontSize: "1.5rem" }}>Something went wrong on our side.</h1>
          <p style={{ color: "#6b7280" }}>Your session is safe. Try again, or reload the page.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ padding: "0.5rem 1rem", borderRadius: 8, border: "1px solid #9ca3af" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
