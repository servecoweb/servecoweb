/** Markdown ligero para las burbujas del chat. Molde Nora / Laura (Neotérmica). */

export function renderChatMarkdown(text: string): string {
  const lines = escapeHtml(text.replace(/\r\n/g, '\n')).split('\n');
  const out: string[] = [];
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${paragraph.join('<br/>')}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      out.push(`<${list.type} class="chat-list">${list.items.join('')}</${list.type}>`);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    const boldHeading = /^\*\*([^*]+)\*\*:?\s*$/.exec(line);
    const ulItem = /^[-*•●–—]\s+(.*)$/.exec(line);
    const olItem = /^(\d+)[.)]\s+(.*)$/.exec(line);

    if (heading) {
      flushParagraph();
      flushList();
      out.push(`<h3 class="chat-heading">${renderInline(heading[2] ?? '')}</h3>`);
    } else if (boldHeading) {
      flushParagraph();
      flushList();
      out.push(`<h3 class="chat-heading">${boldHeading[1] ?? ''}</h3>`);
    } else if (ulItem) {
      flushParagraph();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(`<li>${renderInline(ulItem[1] ?? '')}</li>`);
    } else if (olItem) {
      flushParagraph();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(`<li value="${olItem[1]}">${renderInline(olItem[2] ?? '')}</li>`);
    } else if (!line) {
      flushParagraph();
      flushList();
    } else {
      flushList();
      paragraph.push(renderInline(line));
    }
  }
  flushParagraph();
  flushList();
  return out.join('');
}

export const aHtml = renderChatMarkdown;

// Rutas internas sueltas (/es/…, /en/…) → enlace con etiqueta legible.
const RUTA_INTERNA = /(?<![">\w/])(\/(?:es|en)(?:\/[a-z0-9-]+)*(?:#[a-z0-9-]+)?)(?=[\s.,;:!?)<]|$)/gi;

function etiquetaRuta(href: string): string {
  const path = href.split('#')[0] ?? href;
  if (/\/(contacto|contact)$/.test(path)) return path.startsWith('/en') ? 'Contact us' : 'Hacer una consulta';
  const ultimo = path.split('/').filter(Boolean).pop() ?? href;
  return ultimo.replace(/-/g, ' ');
}

function renderInline(s: string): string {
  const conMarkdown = s
    .replace(/\[([^\]]+)\]\s*\(\s*(https?:\/\/[^)\s]+|\/[^)\s]+)\s*\)/g, '<a href="$2" class="chat-link">$1</a>')
    .replace(
      /(?<![">])(https?:\/\/[^\s<)]+)(?![^<]*<\/a>)/g,
      '<a href="$1" class="chat-link" target="_blank" rel="noopener noreferrer">$1</a>',
    );
  const conRutas = conMarkdown.replace(RUTA_INTERNA, (href) => `<a href="${href}" class="chat-link">${etiquetaRuta(href)}</a>`);
  return conRutas.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
