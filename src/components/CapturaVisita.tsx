'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { EVENTO_CONSENTIMIENTO, leerConsentimiento } from '@/lib/consentimiento';

/**
 * Origen de la visita para el mini-CRM: página de entrada, web de procedencia y campaña (utm_*).
 * Se guarda en sessionStorage SOLO si el visitante aceptó las cookies analíticas (LSSI: almacenar datos
 * en su navegador para medir no es «estrictamente necesario»). Sin consentimiento, el formulario envía
 * solo los utm de la página actual, sin guardar nada.
 * Montado en los layouts /es y /en. Lo lee ContactForm con leerVisita().
 */
const CLAVE = 'serveco_visita_v1';

export type Visita = {
  entrada: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export function leerVisita(): Visita | null {
  try {
    const raw = window.sessionStorage.getItem(CLAVE);
    return raw ? (JSON.parse(raw) as Visita) : null;
  } catch {
    return null;
  }
}

function capturar(ruta: string) {
  if (!leerConsentimiento()?.analiticas) return;
  try {
    if (window.sessionStorage.getItem(CLAVE)) return; // ya se guardó la primera página de esta visita
    const q = new URLSearchParams(window.location.search);
    let referrer: string | undefined;
    try {
      const r = document.referrer ? new URL(document.referrer) : null;
      if (r && r.host !== window.location.host) referrer = r.host; // solo webs externas, sin la ruta
    } catch {
      /* referrer ilegible */
    }
    const v: Visita = {
      entrada: ruta,
      referrer,
      utm_source: q.get('utm_source') ?? undefined,
      utm_medium: q.get('utm_medium') ?? undefined,
      utm_campaign: q.get('utm_campaign') ?? undefined,
    };
    window.sessionStorage.setItem(CLAVE, JSON.stringify(v));
  } catch {
    /* navegación privada o almacenamiento bloqueado */
  }
}

export default function CapturaVisita() {
  const ruta = usePathname();

  useEffect(() => {
    capturar(ruta);
    const alAceptar = () => capturar(ruta);
    window.addEventListener(EVENTO_CONSENTIMIENTO, alAceptar);
    return () => window.removeEventListener(EVENTO_CONSENTIMIENTO, alAceptar);
    // Solo al montar: la primera página de la visita es la de entrada.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
