'use client';

import { useState } from 'react';

/**
 * Buscador de subvenciones de un tercero (Fandit) que SOLO se carga cuando el visitante lo pide.
 * Un iframe de terceros cargado al abrir la página puede instalar cookies sin consentimiento (criterio AEPD
 * del taller). Mismo motivo por el que las fichas de despacho no incrustan Google Maps.
 */
export default function BuscadorExterno({ url, titulo }: { url: string; titulo: string }) {
  const [cargado, setCargado] = useState(false);

  if (cargado) {
    return (
      <div style={{ border: '1px solid var(--linea)', borderRadius: 'var(--radio)', overflow: 'hidden' }}>
        <iframe src={url} title={titulo} style={{ width: '100%', height: 720, border: 0, display: 'block' }} />
      </div>
    );
  }

  return (
    <div className="caja" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <h3 style={{ marginBottom: 10 }}>Buscador de subvenciones</h3>
      <p style={{ maxWidth: 520, margin: '0 auto 20px', color: 'var(--tinta-2)' }}>
        Consulte las convocatorias abiertas. El buscador lo presta un proveedor externo (Fandit), que puede usar sus propias cookies:
        solo se carga si usted lo abre.
      </p>
      <p style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button type="button" className="btn btn-marca" onClick={() => setCargado(true)}>
          Abrir el buscador aquí
        </button>
        <a className="btn btn-linea" href={url} target="_blank" rel="noopener noreferrer">
          Abrirlo en otra pestaña
        </a>
      </p>
    </div>
  );
}
