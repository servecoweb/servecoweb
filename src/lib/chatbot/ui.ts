/**
 * Lo que VE el visitante del asistente (va al navegador).
 * El prompt y la ficha (prompt.ts) se quedan en el servidor.
 * PROVISIONAL: nombre y avatar los acuerda Serveco (H5.3).
 */
import { ES, EN } from '../rutas';

export const ASSISTANT_NAME = 'Asistente de Serveco';
export const ASSISTANT_SUBTITLE = { es: 'Asesoría de empresas desde 1977', en: 'Business advisers since 1977' };

export const SALUDO = {
  es: `Hola, soy el asistente virtual de Serveco Asesores. Puedo orientarle sobre nuestras áreas, despachos y trámites. Si ya lo tiene claro: [haga una consulta](${ES.contacto}).`,
  en: `Hello, I am Serveco's virtual assistant. I can help with our services, offices and paperwork in Spain. If you already know what you need: [contact us](${EN.contact}).`,
};
