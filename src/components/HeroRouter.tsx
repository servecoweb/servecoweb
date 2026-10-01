'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ES } from '@/lib/rutas';

type Perfil = 'empresa' | 'autonomo' | 'particular' | 'noresidente';
type Tema = 'impuestos' | 'personal' | 'contabilidad' | 'legal' | 'ayudas' | 'crear';
type Destino = { area: string; link: string; texto: string };

const PERFILES: { v: Perfil; t: string }[] = [
  { v: 'empresa', t: 'Empresa' },
  { v: 'autonomo', t: 'Autónomo' },
  { v: 'particular', t: 'Particular' },
  { v: 'noresidente', t: 'No residente' },
];

const TEMAS: { v: Tema; t: string }[] = [
  { v: 'impuestos', t: 'Impuestos' },
  { v: 'personal', t: 'Contratar o despedir' },
  { v: 'contabilidad', t: 'Llevar la contabilidad' },
  { v: 'legal', t: 'Un asunto legal' },
  { v: 'ayudas', t: 'Ayudas o financiación' },
  { v: 'crear', t: 'Crear una empresa' },
];

const BASE: Record<Tema, Destino> = {
  impuestos: { area: 'Área fiscal', link: ES.area('fiscal'), texto: 'Impuesto de sociedades, IVA, planificación fiscal y operaciones societarias.' },
  personal: { area: 'Área laboral', link: ES.area('laboral'), texto: 'Contratos, nóminas, despidos e inspecciones de trabajo.' },
  contabilidad: { area: 'Área contable', link: ES.area('contable'), texto: 'Contabilidad al día, cuentas anuales y libros oficiales.' },
  legal: { area: 'Área jurídica', link: ES.area('juridico'), texto: 'Contratos, reclamaciones, sociedades y procedimientos judiciales.' },
  ayudas: { area: 'Subvenciones y ayudas', link: ES.subvenciones, texto: 'Buscador de ayudas, financiación y planes de viabilidad.' },
  crear: { area: 'Punto PAE', link: ES.pae, texto: 'Constitución de su sociedad o alta de autónomo.' },
};

const AJUSTES: Partial<Record<Perfil, Partial<Record<Tema, Destino>>>> = {
  particular: {
    impuestos: { area: 'Área fiscal', link: ES.area('fiscal'), texto: 'Declaración de la renta, herencias, donaciones y compraventa de vivienda.' },
  },
  noresidente: {
    impuestos: { area: 'Internacional', link: ES.internacional, texto: 'IRNR, NIE, testamentos y compraventa de inmuebles, en español o inglés.' },
    legal: { area: 'Internacional', link: ES.internacional, texto: 'Testamentos, sucesiones y compraventa de inmuebles para no residentes.' },
  },
  autonomo: {
    crear: { area: 'Punto PAE', link: ES.pae, texto: 'Alta como autónomo o paso a sociedad.' },
  },
};

export default function HeroRouter() {
  const [perfil, setPerfil] = useState<Perfil>('empresa');
  const [tema, setTema] = useState<Tema>('impuestos');
  const d = AJUSTES[perfil]?.[tema] ?? BASE[tema];

  return (
    <div className="router">
      <h2>Qué podemos resolver por usted</h2>
      <p>Elija dos opciones y le indicamos el área que le atiende.</p>
      <fieldset>
        <legend>Soy</legend>
        <div className="chips">
          {PERFILES.map((p) => (
            <label key={p.v}>
              <input type="radio" name="perfil" value={p.v} checked={perfil === p.v} onChange={() => setPerfil(p.v)} />
              <span>{p.t}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Necesito</legend>
        <div className="chips">
          {TEMAS.map((t) => (
            <label key={t.v}>
              <input type="radio" name="tema" value={t.v} checked={tema === t.v} onChange={() => setTema(t.v)} />
              <span>{t.t}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="resultado" aria-live="polite">
        <strong>{d.area}</strong>
        <p>{d.texto}</p>
        <Link className="enlace" href={d.link}>Ver {d.area.toLowerCase()}</Link>
      </div>
    </div>
  );
}
