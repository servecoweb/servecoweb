import type { Metadata } from 'next';
import Link from 'next/link';
import LegalPage from '@/components/LegalPage';
import { EMPRESA, SITE_URL } from '@/data/site';
import { EN } from '@/lib/rutas';

export const metadata: Metadata = { title: 'Legal notice', robots: { index: false } };

/** DRAFT legal notice (EN), same content as /es/aviso-legal. Items in brackets pending from Serveco. */
export default function LegalNotice() {
  return (
    <LegalPage titulo="Legal notice" lang="en">
      <h2>Website owner</h2>
      <p>In accordance with Spanish Law 34/2002 on information society services and e-commerce, this website ({SITE_URL}) belongs to:</p>
      <ul>
        <li><strong>Owner:</strong> {EMPRESA.razonSocial} [full company name pending]</li>
        <li><strong>Tax ID (NIF):</strong> [pending]</li>
        <li><strong>Registered address:</strong> [pending]</li>
        <li><strong>Registry details:</strong> [Companies Register entry: pending]</li>
        <li><strong>Contact:</strong> {EMPRESA.email} · +34 {EMPRESA.tel}</li>
      </ul>

      <h2>Use of the website</h2>
      <p>Access to this website is free. By using it, you agree to do so lawfully and not to damage its operation or content.</p>

      <h2>Our content is not advice</h2>
      <p>
        The texts on this website, the blog articles and the virtual assistant’s answers are for general information only. They are
        not tax, employment, legal or any other kind of advice, and they do not replace a professional review of your case. Rules
        change often: please contact us before making a decision.
      </p>
      <p>Using the contact form or the virtual assistant does not in itself create a professional relationship with {EMPRESA.razonSocial}.</p>

      <h2>Intellectual property</h2>
      <p>
        The texts, design, logos and other elements of this website belong to {EMPRESA.razonSocial} or are used with permission. They may
        not be reproduced, distributed or transformed without permission, except for personal and private use. Illustrative images are
        labelled as such.
      </p>

      <h2>Links</h2>
      <p>
        This website may link to third-party pages, such as official bodies. We are not responsible for their content or availability.
        Some third-party services, such as the grants search tool, only load if you ask for them.
      </p>

      <h2>Liability</h2>
      <p>
        We try to keep the information accurate and up to date, but we cannot guarantee it is error-free or that the website is always
        available. We are not liable for damage arising from using the information on this website without proper professional advice.
      </p>

      <h2>Data protection and cookies</h2>
      <p>
        See our <Link className="enlace" href={EN.privacy}>privacy policy</Link> and{' '}
        <Link className="enlace" href={EN.cookies}>cookie policy</Link>.
      </p>

      <h2>Governing law</h2>
      <p>This notice is governed by Spanish law. [Competent courts: pending from Serveco.]</p>
      <p style={{ fontSize: 14, color: 'var(--tinta-2)' }}>This is a translation. In case of discrepancy, the Spanish version prevails.</p>
    </LegalPage>
  );
}
