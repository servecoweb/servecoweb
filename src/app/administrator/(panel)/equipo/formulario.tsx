import { DEPARTAMENTOS, type Miembro } from '@/lib/equipo';
import { SEDES } from '@/data/offices';
import BotonEnviar from '@/components/admin/BotonEnviar';

const campo = 'w-full rounded-lg border border-linea px-3 py-2.5 text-base outline-none focus:border-marca';

/** Alta y edición de una persona. El valor que se guarda es el del formulario, no el del código. */
export function FormularioEquipo({
  miembro,
  action,
}: {
  miembro: Miembro | null;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="space-y-4 rounded-xl border border-linea bg-papel p-6">
      {miembro && <input type="hidden" name="id" value={miembro.id} />}
      <input type="hidden" name="foto_actual" value={miembro?.foto ?? ''} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="nombre" className="mb-1 block text-sm font-semibold">Nombre</label>
          <input id="nombre" name="nombre" required minLength={3} defaultValue={miembro?.nombre ?? ''} className={campo} />
        </div>
        <div>
          <label htmlFor="cargo" className="mb-1 block text-sm font-semibold">Cargo</label>
          <input id="cargo" name="cargo" required defaultValue={miembro?.cargo ?? ''} className={campo} />
        </div>
        <div>
          <label htmlFor="cargo_en" className="mb-1 block text-sm font-semibold">Cargo en inglés</label>
          <input id="cargo_en" name="cargo_en" defaultValue={miembro?.cargoEn ?? ''} className={campo} />
        </div>
        <div>
          <label htmlFor="departamento" className="mb-1 block text-sm font-semibold">Departamento</label>
          <select id="departamento" name="departamento" defaultValue={miembro?.departamento ?? 'fiscal'} className={campo}>
            {DEPARTAMENTOS.map((d) => <option key={d.id} value={d.id}>{d.es}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sede" className="mb-1 block text-sm font-semibold">Despacho</label>
          <select id="sede" name="sede" defaultValue={miembro?.sedeSlug ?? ''} className={campo}>
            <option value="">Sin despacho publicado</option>
            {SEDES.map((s) => <option key={s.slug} value={s.slug}>{s.ciudad}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="orden" className="mb-1 block text-sm font-semibold">Orden en el departamento</label>
          <input id="orden" name="orden" type="number" min={1} defaultValue={miembro?.orden ?? 1} className={campo} />
        </div>
        <div>
          <label htmlFor="foto" className="mb-1 block text-sm font-semibold">Foto</label>
          <input id="foto" name="foto" type="file" accept="image/jpeg,image/png,image/webp" className={campo} />
          {miembro?.foto && <img src={miembro.foto} alt="" className="mt-3 h-24 w-24 rounded-lg object-cover" />}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="destacado" defaultChecked={miembro?.destacado ?? false} />
        Sale en la portada (socios)
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="publicado" defaultChecked={miembro ? miembro.publicado : true} />
        Visible en la web
      </label>
      <BotonEnviar texto={miembro ? 'Guardar' : 'Añadir al equipo'} trabajando="Guardando…" />
    </form>
  );
}
