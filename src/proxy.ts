import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * URLs del hackeo al WordPress antiguo: devuelven 410 Gone sin pasar por React ni consumir CPU,
 * para que Google las saque del índice antes que con un 404 (nunca bloquearlas en robots.txt).
 */
const HACKEO_RE = new RegExp(
  [
    '[\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u3040-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]',
    'casino|kasino|kazino|cassino|igraln|slots?\\b|sloty|bukmeker|besplatn|crowngreen|melbet|parimatch|1win|1xbet|1khbet|1xpartners|mostbet|pin-?up|vulkan|jackpot|roulette|ruleta|poker|apuestas?|trueluck|gambling|highroller|wazamba|kolikkopelit|vedonlyoenti',
    'avtorizats|lichn|ofitsialn|prilozh|skachat|zagruzit|zerkalo|igry|igrat|igrok|stavk|rossii|luchshikh|predstavlen|sposoby|sravnenie|raznovidnost|registrats|promokod|fribety|depozit|bonus[yi]|no-deposit-bonus|welcome-bonus|hos-geldin-bonusu|golden-crown|acceptance-bonus',
    'forex|crypto|bitcoin|free-spins|goldbet|avabet|boostwin|\\bbet(?:ting)?\\b|5588bet|alev-bet',
    'salle-de-jeu|jeux-en-ligne|gioco-legali|rolino|anbieter-im-vergleich|plateformes-les-plus|legal-grass|youtube-help|video-ad-formats',
    'viagra|cialis|porn|escort|wp-login\\.php|xmlrpc\\.php',
  ].join('|'),
  'i',
);

function esUrlHackeo(pathname: string): boolean {
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    /* URL mal formada */
  }
  return HACKEO_RE.test(decoded);
}

/**
 * Next 16: proxy.ts sustituye a middleware.ts (propuesta técnica, H1.1).
 * 1) Fuera de /es, /en y /administrator: corta las URLs del hackeo con 410 Gone.
 * 2) En /administrator: refresca la sesión de Supabase Auth y reescribe las cookies.
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/' || pathname.startsWith('/es/') || pathname.startsWith('/en/') || pathname === '/es' || pathname === '/en') {
    return NextResponse.next();
  }

  if (!pathname.startsWith('/administrator')) {
    if (esUrlHackeo(pathname)) {
      return new NextResponse('410 Gone', {
        status: 410,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Robots-Tag': 'noindex',
          'Cache-Control': 'public, max-age=86400',
        },
      });
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(lista) {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    '/administrator',
    '/administrator/:path*',
    '/((?!_next/|images/|escenas/|documentos/|es(?:/|$)|en(?:/|$)|api/|robots\\.txt$|sitemap\\.xml$|llms\\.txt$|favicon\\.ico$|hero-sala\\.|google[a-z0-9]+\\.html$).*)',
  ],
};
