import type { Metadata } from 'next';

/** El panel no se indexa. Cubre el login y todas las rutas de /administrator. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: 'Panel',
};

export default function AdministratorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
