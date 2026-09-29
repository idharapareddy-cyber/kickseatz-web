import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="page narrow">
      <div className="page-head">
        <div>
          <div className="eyebrow">KICKSEATZ</div>
          <h1>Contact</h1>
          <p>Have a question about the KickSeatz project?</p>
        </div>
      </div>

      <section className="card form-card">
        <div className="form-section">
          <h2>Get in touch</h2>
          <p>
            KickSeatz is a student-built NFL ticket discovery project. For
            questions, feedback, or information about the project, use the
            contact information below.
          </p>
        </div>

        <div className="form-section">
          <h2>Email</h2>
          <p>
            <a
              href="mailto:kickseatz.contact@gmail.com"
              style={{ color: "#b8aaff", fontWeight: 800 }}
            >
              kickseatz.contact@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h2>About this demo</h2>
          <p>
            The current site uses synthetic ticket inventory for product
            testing. It is not a live ticket marketplace.
          </p>

          <Link
            href="/privacy"
            className="secondary-button"
            style={{ marginTop: 12 }}
          >
            View Privacy Policy
          </Link>
        </div>
      </section>
    </div>
  );
}