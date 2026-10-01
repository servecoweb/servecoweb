import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import BotonCookies from '@/components/BotonCookies';

export const metadata: Metadata = { title: 'Cookie policy', robots: { index: false } };

/** DRAFT cookie policy (EN): same table as /es/cookies, based on what the site actually uses (checked 25 sep 2026). */
const ROWS: { name: string; type: string; purpose: string; duration: string; owner: string }[] = [
  { name: 'serveco_cookie_consent_v1', type: 'Necessary · local storage', purpose: 'Remember your cookie choice', duration: 'Until you change it or clear your browser data', owner: 'Serveco' },
  { name: 'Assistant conversation', type: 'Necessary · session storage', purpose: 'Keep your conversation with the assistant while you browse', duration: 'Deleted when you close the tab', owner: 'Serveco' },
  { name: 'serveco_visita_v1', type: 'Analytics · session storage', purpose: 'Know which page you arrived on and which website or campaign you came from, to handle your enquiry better', duration: 'Deleted when you close the tab', owner: 'Serveco' },
  { name: '_ga, _ga_*', type: 'Analytics · cookie', purpose: 'Google Analytics: count visits and see how the website is used, in aggregate', duration: 'Up to 2 years (Google setting)', owner: 'Google' },
];

export default function CookiesEn() {
  return (
    <LegalPage titulo="Cookie policy" lang="en">
      <h2>What they are</h2>
      <p>
        Cookies and similar technologies (such as your browser’s local storage) save small pieces of data on your device. Some are
        necessary for the website to work; the rest are only used if you accept them.
      </p>

      <h2>The ones we use</h2>
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Duration</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name}>
                <td><code>{r.name}</code></td>
                <td>{r.type}</td>
                <td>{r.purpose}</td>
                <td>{r.duration}</td>
                <td>{r.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>We do not currently use advertising or personalisation cookies. If we ever do, they will be listed here and only switched on if you accept them.</p>

      <h2>Third-party services that only load if you ask</h2>
      <ul>
        <li><strong>Grants search tool (Fandit):</strong> on the grants page, only when you press “Open the search tool”. It may use its own cookies.</li>
        <li><strong>Maps:</strong> the “How to get there” button on each office page opens Google Maps in a new tab; no map is loaded on our website.</li>
      </ul>

      <h2>Your choice</h2>
      <p>
        When you arrive you can accept, reject or configure cookies with the same effort. No optional cookie is switched on by default.
        If you withdraw your consent, we delete any analytics cookies already set. You can change your mind at any time:
      </p>
      <p className="aviso" style={{ display: 'inline-block' }}>
        <BotonCookies texto="Open cookie settings" className="font-semibold text-marca-texto underline" />
      </p>
      <p>You can also block or delete cookies in your browser settings. If you block the necessary ones, parts of the website may not work properly.</p>
      <p style={{ fontSize: 14, color: 'var(--tinta-2)' }}>This is a translation. In case of discrepancy, the Spanish version prevails.</p>
    </LegalPage>
  );
}
