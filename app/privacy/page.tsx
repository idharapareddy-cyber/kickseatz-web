import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="page narrow">
      <div className="page-head">
        <div>
          <div className="eyebrow">KICKSEATZ</div>
          <h1>Privacy Policy</h1>
          <p>How KickSeatz handles information on this demo site.</p>
        </div>
      </div>

      <section className="card form-card">
        <div className="form-section">
          <h2>About KickSeatz</h2>
          <p>
            KickSeatz is a student-built NFL ticket discovery project.
            This version is a demo marketplace using synthetic ticket
            inventory for product testing.
          </p>
        </div>

        <div className="form-section">
          <h2>Information we use</h2>
          <p>
            KickSeatz may use information you enter into the site, such as
            ticket preferences or profile settings, to provide the site&apos;s
            features.
          </p>
          <p>
            Saved tickets and price-watch preferences may be stored locally
            in your browser.
          </p>
        </div>

        <div className="form-section">
          <h2>Demo inventory</h2>
          <p>
            Ticket listings shown in this demo are synthetic inventory and do
            not represent live ticket availability.
          </p>
        </div>

        <div className="form-section">
          <h2>Third-party services</h2>
          <p>
            KickSeatz may connect to third-party services as the project
            develops. Information handled by those services is subject to
            their own privacy policies.
          </p>
        </div>

        <div>
          <h2>Questions</h2>
          <p>
            If you have a question about KickSeatz or this policy, use the
            contact page.
          </p>

          <Link
            href="/contact"
            className="primary-button"
            style={{ marginTop: 12 }}
          >
            Contact KickSeatz
          </Link>
        </div>
      </section>
    </div>
  );
}