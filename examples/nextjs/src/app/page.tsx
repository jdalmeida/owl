// @author João Gabriel de Almeida

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <h1>Owl Feedback Example</h1>
      <p>
        Click the feedback button (bottom-right) and then click on any element
        to add a comment.
      </p>
      <section style={{ marginTop: 24 }}>
        <h2>Sample content</h2>
        <p data-testid="sample-paragraph">
          This paragraph has a <code>data-testid</code> attribute for easier
          selection.
        </p>
        <button type="button" data-owl-selectable="cta-button">
          Call to action
        </button>
      </section>
      <p>
        <a href="/api/owl/admin">View feedback admin</a>
      </p>
    </main>
  );
}
