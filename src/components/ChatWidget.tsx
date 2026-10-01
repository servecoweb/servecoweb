'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { aHtml } from '@/lib/chatbot/markdown';
import { ASSISTANT_NAME, ASSISTANT_SUBTITLE, SALUDO } from '@/lib/chatbot/ui';
import { EMPRESA, telHref } from '@/data/site';

/**
 * Widget del chatbot (H5.1). Molde Andrea / Nora:
 *  · Arranca CERRADO. Temas + preguntas sugeridas.
 *  · «Empezar de nuevo» abre hilo nuevo en pantalla; el histórico queda en la BD.
 *  · Hilo en sessionStorage + BD.
 *  · iPhone: input text-base (sin zoom), sin autofocus en móvil, no baja al fondo solo con el saludo.
 *  · Móvil: pulsar un enlace interno minimiza el panel.
 */
type Turno = { role: 'user' | 'assistant'; content: string };
type Tema = { id: string; label: string; opciones: { label: string; prompt: string }[] };

const TEMAS: Record<'es' | 'en', Tema[]> = {
  es: [
    {
      id: 'empresa', label: 'Mi empresa',
      opciones: [
        { label: 'Llevar la contabilidad', prompt: '¿Pueden llevar la contabilidad y los impuestos de mi empresa?' },
        { label: 'Contratar a alguien', prompt: 'Voy a contratar a un trabajador. ¿Cómo me ayudan?' },
        { label: 'Deducción I+D+i', prompt: '¿Qué es la deducción por I+D+i y cómo sé si puedo aplicarla?' },
        { label: 'Sistemas A.D.', prompt: '¿Qué son los sistemas A.D.I, A.D.P y A.D.A?' },
      ],
    },
    {
      id: 'empezar', label: 'Empezar un negocio',
      opciones: [
        { label: 'Crear una sociedad', prompt: 'Quiero crear una sociedad. ¿Qué es el Punto PAE?' },
        { label: 'Hacerme autónomo', prompt: 'Quiero darme de alta como autónomo. ¿Me pueden ayudar?' },
        { label: 'Buscar ayudas', prompt: '¿Cómo encuentro subvenciones para mi negocio?' },
      ],
    },
    {
      id: 'internacional', label: 'Extranjeros y no residentes',
      opciones: [
        { label: 'Sacar el NIE', prompt: '¿Me ayudan a obtener el NIE?' },
        { label: 'Impuesto de no residentes', prompt: 'Tengo una vivienda en España y no vivo aquí. ¿Qué impuestos pago?' },
        { label: '¿En qué despacho?', prompt: 'Soy extranjero. ¿En qué despachos me pueden atender?' },
      ],
    },
    {
      id: 'contacto', label: 'Despachos y contacto',
      opciones: [
        { label: '¿Dónde están?', prompt: '¿Dónde tienen despachos?' },
        { label: 'Pedir cita', prompt: 'Quiero pedir una cita. ¿Cómo lo hago?' },
      ],
    },
  ],
  en: [
    {
      id: 'intl', label: 'Non-residents',
      opciones: [
        { label: 'Getting my NIE', prompt: 'Can you help me get my NIE number?' },
        { label: 'Non-resident tax', prompt: 'I own a property in Spain but do not live here. What taxes do I pay?' },
        { label: 'Nearest office', prompt: 'Which of your offices can help me as a foreigner?' },
      ],
    },
    {
      id: 'business', label: 'My business',
      opciones: [
        { label: 'Accounting and tax', prompt: 'Can you handle the accounting and taxes of my company?' },
        { label: 'Setting up a company', prompt: 'I want to set up a company in Spain. How can you help?' },
      ],
    },
    {
      id: 'contact', label: 'Offices and contact',
      opciones: [
        { label: 'Where are you?', prompt: 'Where are your offices?' },
        { label: 'Book a meeting', prompt: 'I would like to book a meeting. How do I do it?' },
      ],
    },
  ],
};

const T = {
  es: { abrir: 'Abrir el asistente', cerrar: 'Cerrar el asistente', nuevo: 'Empezar una conversación nueva', nuevoCorto: 'Nueva', elige: 'Elija un tema:', volver: '← Volver a los temas', escribe: 'Escriba su pregunta…', enviar: 'Enviar', escribiendo: 'Escribiendo…', ayuda: '¿Le ayudamos?' },
  en: { abrir: 'Open the assistant', cerrar: 'Close the assistant', nuevo: 'Start a new conversation', nuevoCorto: 'New', elige: 'Choose a topic:', volver: '← Back to topics', escribe: 'Type your question…', enviar: 'Send', escribiendo: 'Typing…', ayuda: 'Can we help?' },
};

export default function ChatWidget({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  const t = T[lang];
  const temas = TEMAS[lang];
  const K = `serveco_chat_${lang}`;

  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Turno[]>([]);
  const [entrada, setEntrada] = useState('');
  const [cargando, setCargando] = useState(false);
  const [temaId, setTemaId] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  const sesionRef = useRef('');
  const hiloRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Recuperar sesión e hilo (solo en el navegador).
  useEffect(() => {
    try {
      let s = sessionStorage.getItem(`${K}_sesion`);
      if (!s) {
        s = crypto.randomUUID();
        sessionStorage.setItem(`${K}_sesion`, s);
      }
      sesionRef.current = s;
      hiloRef.current = sessionStorage.getItem(`${K}_hilo`);
      const guardados = sessionStorage.getItem(`${K}_mensajes`);
      // Tras el montaje: el primer render va vacío para no desajustar el HTML del servidor.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (guardados) setMensajes(JSON.parse(guardados) as Turno[]);
    } catch {
      sesionRef.current = crypto.randomUUID();
    }
    setListo(true);
  }, [K]);

  useEffect(() => {
    if (!listo) return;
    try {
      if (mensajes.length === 0) sessionStorage.removeItem(`${K}_mensajes`);
      else sessionStorage.setItem(`${K}_mensajes`, JSON.stringify(mensajes.slice(-30)));
    } catch {
      // sessionStorage lleno o bloqueado
    }
  }, [mensajes, listo, K]);

  // Scroll: arriba si solo hay saludo; abajo si hay conversación.
  useEffect(() => {
    if (!abierto || !scrollRef.current) return;
    const caja = scrollRef.current;
    caja.scrollTop = mensajes.length === 0 ? 0 : caja.scrollHeight;
  }, [mensajes, abierto, temaId]);

  // Autofocus solo en escritorio.
  useEffect(() => {
    if (abierto && window.matchMedia('(min-width: 640px)').matches) inputRef.current?.focus();
  }, [abierto]);

  // Escape cierra; en móvil, un enlace interno minimiza.
  useEffect(() => {
    if (!abierto) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    const clic = (e: MouseEvent) => {
      if (window.innerWidth >= 640) return;
      const a = (e.target as HTMLElement | null)?.closest('a');
      const href = a?.getAttribute('href') ?? '';
      if (a && href.startsWith('/') && a.getAttribute('target') !== '_blank') setAbierto(false);
    };
    window.addEventListener('keydown', tecla);
    document.addEventListener('click', clic);
    return () => {
      window.removeEventListener('keydown', tecla);
      document.removeEventListener('click', clic);
    };
  }, [abierto]);

  const enviar = useCallback(
    async (texto: string) => {
      const pregunta = texto.trim();
      if (!pregunta || cargando) return;
      const previos = mensajes;
      setEntrada('');
      setMensajes([...previos, { role: 'user', content: pregunta }, { role: 'assistant', content: '' }]);
      setCargando(true);

      const escribir = (trozo: string) =>
        setMensajes((act) => {
          const copia = [...act];
          const ultimo = copia[copia.length - 1];
          if (ultimo?.role === 'assistant') copia[copia.length - 1] = { role: 'assistant', content: ultimo.content + trozo };
          return copia;
        });

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // El historial NO se envía: el servidor lo lee de la BD (más seguro).
            message: pregunta,
            sessionId: sesionRef.current,
            threadId: hiloRef.current,
            lang,
          }),
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const lector = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        for (;;) {
          const { done, value } = await lector.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const bloques = buffer.split('\n\n');
          buffer = bloques.pop() ?? '';
          for (const bloque of bloques) {
            let evento = 'message';
            let datos = '';
            for (const linea of bloque.split('\n')) {
              if (linea.startsWith('event:')) evento = linea.slice(6).trim();
              else if (linea.startsWith('data:')) datos += linea.slice(5).trim();
            }
            if (!datos) continue;
            try {
              const json = JSON.parse(datos) as { text?: string; threadId?: string | null };
              if (evento === 'delta' && json.text) escribir(json.text);
              if ((evento === 'thread' || evento === 'done') && json.threadId) {
                hiloRef.current = json.threadId;
                try {
                  sessionStorage.setItem(`${K}_hilo`, json.threadId);
                } catch {
                  // sin sessionStorage el hilo se recrea
                }
              }
            } catch {
              // bloque incompleto
            }
          }
        }
      } catch (error) {
        console.error('[chat] widget:', error);
        escribir(
          lang === 'en'
            ? `Connection lost. Call us on +34 ${EMPRESA.tel} or write to ${EMPRESA.email}.`
            : `Se ha perdido la conexión. Llámenos al ${EMPRESA.tel} o escriba a ${EMPRESA.email}.`,
        );
      } finally {
        setCargando(false);
      }
    },
    [cargando, mensajes, lang, K],
  );

  const empezarDeNuevo = () => {
    if (cargando) return;
    setMensajes([]);
    setTemaId(null);
    setEntrada('');
    hiloRef.current = null;
    try {
      sessionStorage.removeItem(`${K}_hilo`);
      sessionStorage.removeItem(`${K}_mensajes`);
    } catch {
      // ignore
    }
  };

  if (!listo) return null;
  const tema = temas.find((x) => x.id === temaId) ?? null;
  const vacio = mensajes.length === 0;

  const chip =
    'rounded-full border border-linea bg-papel px-3 py-1.5 text-left text-[0.8rem] text-tinta transition-colors hover:border-tinta hover:bg-tinta hover:text-white';

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label={abierto ? t.cerrar : t.abrir}
        className="fixed bottom-5 right-5 z-[120] flex items-center gap-2.5 rounded-full bg-tinta py-3 pl-3 pr-5 text-[15px] font-semibold text-white shadow-2xl max-sm:pr-3"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <span aria-hidden className="grid h-7 w-7 place-items-center rounded-full bg-marca font-extrabold text-tinta">
          {abierto ? '×' : 'S'}
        </span>
        <span className="max-sm:hidden">{abierto ? t.cerrar : t.ayuda}</span>
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label={ASSISTANT_NAME}
          className="fixed bottom-24 right-5 z-[120] flex max-h-[calc(100dvh-8rem)] w-[380px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-linea bg-papel shadow-2xl max-sm:inset-x-3 max-sm:bottom-20 max-sm:w-auto max-sm:max-w-none"
        >
          <header className="flex shrink-0 items-center gap-3 bg-tinta px-4 py-3 text-white">
            <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-marca text-lg font-extrabold text-tinta">
              S
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold leading-tight">{ASSISTANT_NAME}</p>
              <p className="truncate text-[12px] text-white/70">{ASSISTANT_SUBTITLE[lang]}</p>
            </div>
            <button
              type="button"
              onClick={empezarDeNuevo}
              disabled={cargando}
              title={t.nuevo}
              className="shrink-0 whitespace-nowrap rounded-full bg-white/10 px-3 py-1.5 text-[12px] hover:bg-white/20 disabled:opacity-40"
            >
              ↺ {t.nuevoCorto}
            </button>
          </header>

          <div ref={scrollRef} className="min-h-[200px] flex-1 space-y-2.5 overflow-y-auto overscroll-contain bg-niebla px-3 py-3 sm:max-h-[440px]">
            <div className="rounded-xl rounded-tl-sm bg-papel px-3 py-2.5 text-[0.85rem] shadow-sm">
              <div className="chat-markdown" dangerouslySetInnerHTML={{ __html: aHtml(SALUDO[lang]) }} />
            </div>

            {vacio && !tema && (
              <div className="space-y-1.5">
                <p className="px-0.5 text-[0.75rem] text-tinta-2">{t.elige}</p>
                {temas.map((x) => (
                  <button key={x.id} type="button" onClick={() => setTemaId(x.id)} className={`${chip} block w-full rounded-lg`}>
                    {x.label}
                  </button>
                ))}
              </div>
            )}

            {vacio && tema && (
              <div className="space-y-1.5">
                <button type="button" onClick={() => setTemaId(null)} className="px-0.5 text-[0.75rem] text-marca-texto hover:underline">
                  {t.volver}
                </button>
                {tema.opciones.map((o) => (
                  <button key={o.label} type="button" onClick={() => void enviar(o.prompt)} className={`${chip} block w-full rounded-lg`}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}

            {mensajes.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[80%] rounded-2xl rounded-tr-sm bg-tinta px-3 py-2 text-[0.85rem] text-white'
                      : 'max-w-[88%] rounded-2xl rounded-tl-sm bg-papel px-3 py-2 text-[0.85rem] text-tinta shadow-sm'
                  }
                >
                  {m.role === 'assistant' ? (
                    m.content ? (
                      <div className="chat-markdown" dangerouslySetInnerHTML={{ __html: aHtml(m.content) }} />
                    ) : (
                      <span className="text-tinta-2">{t.escribiendo}</span>
                    )
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}

            {!vacio && !cargando && (
              <div className="flex flex-wrap gap-2 pt-1">
                {(tema ? tema.opciones.map((o) => ({ k: o.label, f: () => void enviar(o.prompt) })) : temas.map((x) => ({ k: x.label, f: () => setTemaId(x.id) }))).map(
                  (b) => (
                    <button key={b.k} type="button" onClick={b.f} className={`${chip} text-xs`}>
                      {b.k}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void enviar(entrada);
            }}
            className="flex shrink-0 items-end gap-2 border-t border-linea bg-papel px-3 py-2.5"
          >
            <label htmlFor={`chat-entrada-${lang}`} className="sr-only">{t.escribe}</label>
            <textarea
              id={`chat-entrada-${lang}`}
              ref={inputRef}
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void enviar(entrada);
                }
              }}
              rows={1}
              maxLength={2000}
              enterKeyHint="send"
              placeholder={t.escribe}
              className="min-w-0 flex-1 resize-none rounded-full border border-linea px-4 py-2 text-base outline-none focus:border-marca focus:ring-2 focus:ring-marca/40"
            />
            <button
              type="submit"
              disabled={cargando || !entrada.trim()}
              className="rounded-full bg-marca px-4 py-2 text-sm font-semibold text-tinta disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.enviar}
            </button>
          </form>
          <p className="shrink-0 bg-papel px-3 pb-2 text-center text-[11px] text-tinta-2">
            <a href={telHref(EMPRESA.tel)} className="underline">{EMPRESA.tel}</a> · {EMPRESA.email}
          </p>
        </div>
      )}
    </>
  );
}
