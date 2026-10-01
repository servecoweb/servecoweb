import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import BotonCookies from '@/components/BotonCookies';
import { EMPRESA } from '@/data/site';
import { EN } from '@/lib/rutas';

export const metadata: Metadata = { title: 'Privacy policy', robots: { index: false } };

/**
 * DRAFT privacy policy (EN), same content as /es/privacidad. Written by Eskala (25 sep 2026).
 * Items in brackets are pending from Serveco. In case of doubt, the Spanish version prevails.
 */
export default function Privacy() {
  return (
    <LegalPage titulo="Privacy policy" lang="en">
      <h2>Data controller</h2>
      <p>
        {EMPRESA.razonSocial}. Contact: {EMPRESA.email} · +34 {EMPRESA.tel}. [Tax ID and registered address pending.]
      </p>

      <h2>Contact form</h2>
      <p>
        <strong>What data we process:</strong> what you give us in the form (name, email, phone, company, type of client, company size
        and sector, service and office, urgency, how you heard about us and your message) and the page you wrote from. If you have
        accepted analytics cookies, also the first page of your visit and the website or campaign you came from.
      </p>
      <p>
        <strong>Why:</strong> to answer your enquiry, pass it to the right team and office, follow it up (contact you again about it,
        arrange a meeting) and understand which channels bring us enquiries. We do not use it to send you advertising and we do not
        share it with third parties, except where required by law or with providers who process it on our behalf (web hosting, database
        and email), with the safeguards required by law.
      </p>
      <p>
        <strong>Legal basis:</strong> your consent, given when you send the form, and, if you become a client, the pre-contractual steps
        you request.
      </p>
      <p>
        <strong>How long:</strong> while your enquiry is handled and, afterwards, for as long as needed to deal with any possible
        liabilities. [Specific period pending from Serveco.] If you become a client, the retention periods of the professional
        relationship apply.
      </p>

      <h2>Virtual assistant</h2>
      <p>
        Conversations with the website’s virtual assistant are stored to improve its answers and check their quality. Please do not
        type personal details or details of your case that you do not want to share; for your specific case, use the contact form.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask for access, rectification, erasure, objection, restriction and portability of your data, and withdraw your consent
        at any time, by writing to {EMPRESA.email}. If you feel we have not handled your request properly, you can complain to the
        Spanish Data Protection Agency (aepd.es).
      </p>

      <h2>Cookies</h2>
      <p>
        See our <Link className="enlace" href={EN.cookies}>cookie policy</Link>.{' '}
        <BotonCookies texto="Change my cookie settings" className="font-semibold text-marca-texto underline" />
      </p>
      <p style={{ fontSize: 14, color: 'var(--tinta-2)' }}>This is a translation. In case of discrepancy, the Spanish version prevails.</p>
    </LegalPage>
  );
}
